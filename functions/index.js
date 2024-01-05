const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./src/services/routes");
const dotenv = require("dotenv");

const app = express();

// Configuração do ambiente usando dotenv (se necessário)
dotenv.config();

// Middlewares
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());

// Rotas
routes(app);

// app.listen(process.env.SERVER_PORT);
app.listen();

exports.app = functions.https.onRequest(app);
