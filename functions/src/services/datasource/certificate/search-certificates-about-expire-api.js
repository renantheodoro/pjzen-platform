const { query, collection, where, getDocs } = require("firebase/firestore");
const { startOfDay, addDays } = require("date-fns");
const config = require("../../../firebase/firebase-config");
const errorHandler = require("../../../data/error-handler");
const {
  CLIENT_DIGITAL_CERTIFICATE_COLLECTION,
} = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");

const apiServiceTitle = "GET EXPIRING DIGITAL CERTIFICATE LIST SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    try {
      // Obter a data atual
      const currentDate = new Date();

      // Calcular a data 15 dias no futuro
      const futureDate = addDays(startOfDay(currentDate), 15);

      // Formatar a data futura para comparação
      const futureDateString = futureDate.toISOString();

      // Fazer a consulta ao Firestore
      const certificatesQuery = query(
        collection(config.db, CLIENT_DIGITAL_CERTIFICATE_COLLECTION),
        where("plugNotasCertificateData.vencimento", "<", futureDateString)
      );

      const querySnapshot = await getDocs(certificatesQuery);

      let expiringCertificatesData = [];

      querySnapshot.forEach((doc) => {
        expiringCertificatesData.push(doc.data());
      });

      const successMessage =
        "Busca de certificados expirando realizada com sucesso!";

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: expiringCertificatesData,
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
