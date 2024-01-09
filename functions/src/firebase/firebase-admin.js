const admin = require("firebase-admin");

const serviceAccount = require("./pjzen-plataform-dev-firebase-adminsdk-mfnrc-3eba3f4445.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});

module.exports = admin;
