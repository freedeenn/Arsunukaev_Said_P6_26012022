const express = require("express");
// permet de créer des routeurs individuels
const router = express.Router();

// import des dépendances nécessaires
const userCtrl = require("../controllers/user");
const validPassword = require("../middleware/password");
const validEmail = require("../middleware/emailCtrl");

// les routes pour créer un compte et se connecter au compte
router.post("/signup", validEmail, validPassword, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
