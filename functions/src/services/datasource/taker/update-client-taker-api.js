const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const { doc, updateDoc, serverTimestamp } = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const { CLIENT_TAKER_COLLECTION } = require("../../../data/collections");
const { getCleanCNPJ } = require("../../../helpers/get-clean-cnpj");
const validateRequest = require("../../common/validate-request");
const { decrypt } = require("../../common/encrypt");
const updateTakerService = require("../../plug-notas-api/taker/update-taker-by-cnpj-api");

const apiServiceTitle = "UPDATE CLIENT TAKER";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    let { cnpj } = req.params;
    let { businessName, address, phone, email } = req.body;

    let decryptedCNPJ;

    if (apiKey === process.env.API_KEY_DEV) {
      decryptedCNPJ = cnpj;
    } else {
      decryptedCNPJ = decrypt(cnpj);
    }

    try {
      if (!validateRequest(apiKey)) {
        throw "unauthorized";
      }

      if (!decryptedCNPJ) {
        throw "invalid-argument";
      }

      logApi(apiServiceTitle, "Iniciando cadastro de tomador...");

      const clientTakerReference = doc(
        config.db,
        CLIENT_TAKER_COLLECTION,
        getCleanCNPJ(decryptedCNPJ)
      );

      const takerData = {
        cnpj: getCleanCNPJ(decryptedCNPJ),
        businessName,
        address: {
          zipcode: address.zipcode,
          street: address.street,
          number: address.number,
          complement: address.complement,
          city: address.city,
          neighborhood: address.neighborhood,
          uf: address.uf,
        },
        phone,
        email,
        createdAt: serverTimestamp(),
        lastModifiedAt: serverTimestamp(),
      };

      /* update COMPANY PLUG NOTAS */
      const plugNotasResponse = await updateTakerService.call(takerData);

      if (!plugNotasResponse.data) {
        return res.status(plugNotasResponse.status).send(plugNotasResponse);
      }

      takerData.plugNotasTakerData = plugNotasResponse.data;

      /* UPDATE CLIENT COMPANY FIREBASE */
      await updateDoc(clientTakerReference, takerData);

      const successMessage = "Atualização de tomador realizado com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: takerData,
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
