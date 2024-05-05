const admin = require("firebase-admin");

const serviceAccount = require("./pjzen-plataform-dev-firebase-adminsdk-mfnrc-a13768b621.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});

module.exports = admin;
