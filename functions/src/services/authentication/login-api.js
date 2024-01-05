const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const cors = require("cors")({ origin: true }); // Configuração do CORS

admin.initializeApp();

exports.login = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { email, password } = req.body;

      const user = await admin
        .auth()
        .signInWithEmailAndPassword(email, password);

      const token = jwt.sign(
        { uid: user.uid, email: user.email },
        "Egp0EgkT3tMacwQeLjW5I32IxiNJodGq", // TODO: adicionar no arquivo env
        { expiresIn: "1h" }
      );

      res.status(200).json({ message: "Login bem-sucedido", token });
    } catch (error) {
      logger.error("Erro durante o login:", error.message);

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        res.status(401).json({ message: "Credenciais inválidas" });
      } else {
        res.status(500).json({ message: "Erro interno do servidor" });
      }
    }
  });
});
