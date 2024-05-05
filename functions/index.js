const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./src/services/routes");
const dotenv = require("dotenv");

const app = express();

// Configuração do ambiente usando dotenv
dotenv.config();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Rotas
routes(app);

// Exportando o aplicativo do Firebase Functions
exports.app = functions.https.onRequest(app);
