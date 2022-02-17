// j'importe les packages nécessaires
const express = require("express");
// La fonction Router d'express permet de créer des routes individuelles
// pour créer des objets router
const router = express.Router();

// j'importe les autres dépendances nécessaires
const sauceCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const getAccess = require("../middleware/access");

// je configure les routes
// ajouter une sauce, obligation de s'auth + multer qui gère les images
router.post("/", auth, multer, sauceCtrl.createSauce);
// afficher toutes les sauces dans la BDD
router.get("/", auth, sauceCtrl.getAllSauces);
// afficher une sauce par son id
router.get("/:id", auth, sauceCtrl.getOneSauce);
// modifier une sauce, seul l'user qui a ajouté la sauce peut le faire
router.put("/:id", auth, getAccess, multer, sauceCtrl.modifySauce);
// suppr une sauce, seul l'user qui a ajouté la sauce peut le faire
router.delete("/:id", auth, getAccess, sauceCtrl.deleteSauce);
// ajoute ou enlève un like à la sauce
router.post("/:id/like", auth, sauceCtrl.likeDislikeSauce);

module.exports = router;
