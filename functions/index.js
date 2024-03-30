const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./src/services/routes");
const dotenv = require("dotenv");

const app = express();

// Configuração do ambiente usando dotenv
dotenv.config();

// Middleware para lidar com formulários codificados em URL e JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rotas
routes(app);

// Exportando o aplicativo do Firebase Functions
exports.app = functions.https.onRequest(app);
