const { doc, serverTimestamp, setDoc, getDoc } = require("firebase/firestore");
const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const { arrayUnion, updateDoc } = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const {
  CLIENT_COMPANIES_COLLECTION,
  CLIENT_DIGITAL_CERTIFICATE_COLLECTION,
} = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");
const registerDigitalCertificateService = require("../../plug-notas-api/certificate/register-digital-certificate-api");
const getDigitalCertificateByIdApi = require("../../plug-notas-api/certificate/get-digital-certificate-by-id-api");
const registerCompanyService = require("../../plug-notas-api/company/register-company-api");
const getCompanyByDocumentApi = require("../../plug-notas-api/company/get-company-by-document-api");
const { decrypt } = require("../../common/encrypt");
const updateCompanyByDocumentApi = require("../../plug-notas-api/company/update-company-by-document-api");

const apiServiceTitle = "SAVE DIGITAL CERTIFICATE SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    const { companyUid, password, email, fileBase64 } = req.body;

    const decryptedPassword = decrypt(password);

    try {
      logApi(apiServiceTitle, "Salvando certificado digital...");

      const digitalCertificationData = {
        isActive: true,
        fileBase64: fileBase64,
        password: decryptedPassword,
        email: email ?? "",
        createdAt: serverTimestamp(),
        lastModifiedAt: serverTimestamp(),
      };

      /* VERIFY IF COMPANY ALREADY HAVE CERTIFICATE */
      const companyReference = doc(
        config.db,
        CLIENT_COMPANIES_COLLECTION,
        companyUid
      );

      const companySnapshot = await getDoc(companyReference);

      let companyData;

      if (companySnapshot.exists()) {
        companyData = companySnapshot.data();
      } else {
        throw "error/not-found";
      }

      if (companyData.relatedCertificates?.length) {
        const certificateRefs = companyData.relatedCertificates;

        for (const certRef of certificateRefs) {
          try {
            const certSnapshot = await getDoc(certRef);

            // Verificando se o documento existe e se isActive é true
            if (certSnapshot.exists() && certSnapshot.data().isActive) {
              throw "company-already-has-certificate";
            }
          } catch (error) {
            // Lidar com erros de acesso ao documento
            console.error("Erro ao acessar um certificado:", error);
          }
        }
      }

      /* REGISTER DIGITAL CERTIFICATE PLUG NOTAS */
      const plugNotasCertificateData =
        await registerDigitalCertificateService.call(digitalCertificationData);

      if (!plugNotasCertificateData.data) {
        return res
          .status(plugNotasCertificateData.status)
          .send(plugNotasCertificateData);
      }

      /* SAVE DIGITAL CERTIFICATE FIREBASE */
      const certificateId = plugNotasCertificateData.data.id;

      const getCertificatePlugNotasResponse =
        await getDigitalCertificateByIdApi.call(certificateId);

      if (!getCertificatePlugNotasResponse.data) {
        return res
          .status(getCertificatePlugNotasResponse.status)
          .send(getCertificatePlugNotasResponse);
      }

      digitalCertificationData.plugNotasCertificateData =
        getCertificatePlugNotasResponse.data;

      await setDoc(
        doc(config.db, CLIENT_DIGITAL_CERTIFICATE_COLLECTION, certificateId),
        digitalCertificationData
      );

      const digitalCertificateReference = doc(
        config.db,
        CLIENT_DIGITAL_CERTIFICATE_COLLECTION,
        certificateId
      );

      /* REGISTER COMPANY ON PLUG NOTAS */

      // Salvar a empresa se ainda não estiver cadastrada no plug notas
      const getCompanyDataPlugNotasResponse =
        await getCompanyByDocumentApi.call(companyData.cpfCnpj);

      if (!getCompanyDataPlugNotasResponse?.data) {
        const companyDataBody = {
          cpfCnpj: companyData.cpfCnpj,
          businessName: companyData.businessName,
          tradeName: companyData.tradeName,
          taxRegime: companyData.taxRegime,
          municipalRegistration: companyData.municipalRegistration,
          address: companyData.address,
          email: companyData.email,
          phone: companyData.phone,
          prefectureLogin: companyData.prefectureLogin,
          prefecturePassword: companyData.prefecturePassword,
          certificateId: certificateId,
          isActive: true,
        };

        logApi(
          apiServiceTitle,
          `Cadastrando empresa no PlugNotas. CpfCnpj: ${companyDataBody.cpfCnpj}`
        );

        const companyDataPlugNotasResponse = await registerCompanyService.call(
          companyDataBody
        );

        if (!companyDataPlugNotasResponse.data) {
          return res
            .status(companyDataPlugNotasResponse.status)
            .send(companyDataPlugNotasResponse);
        }

        await updateDoc(companyReference, {
          plugNotasCompanyData: companyDataPlugNotasResponse.data,
          lastModifiedAt: serverTimestamp(),
        });
      } else {
        const companyDataBody = {
          cpfCnpj: companyData.cpfCnpj,
          address: companyData.address,
          phone: companyData.phone,
          tradeName: companyData.tradeName,
          businessName: companyData.businessName,
          taxRegime: companyData.taxRegime,
          municipalRegistration: companyData.municipalRegistration,
          email: companyData.email,
          certificateId: certificateId,
        };

        logApi(
          apiServiceTitle,
          `Atualizando certificado da empresa. CpfCnpj: ${companyDataBody.cpfCnpj}`
        );

        const companyDataPlugNotasResponse =
          await updateCompanyByDocumentApi.call(companyDataBody);

        if (!companyDataPlugNotasResponse.data) {
          return res
            .status(companyDataPlugNotasResponse.status)
            .send(companyDataPlugNotasResponse);
        }

        await updateDoc(companyReference, {
          plugNotasCompanyData: companyDataPlugNotasResponse.data,
          lastModifiedAt: serverTimestamp(),
        });
      }

      /* UPDATE CERTIFICATE WITH COMPANY UID */
      await updateDoc(digitalCertificateReference, {
        companyReference: companyReference,
        lastModifiedAt: serverTimestamp(),
      });

      /* UPDATE COMPANY WITH NEW CERTIFICATE */
      await updateDoc(companyReference, {
        certificateId: certificateId,
        relatedCertificates: arrayUnion(digitalCertificateReference),
        lastModifiedAt: serverTimestamp(),
      });

      const successMessage = "Certificado digital salvo com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: { companyUid, certificateId, digitalCertificationData },
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
