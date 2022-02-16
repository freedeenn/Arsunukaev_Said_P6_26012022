// je fais mes imports
// pour créer des applis web avec Node
const express = require("express");

// pour faciliter les inéractions avec la bdd mongoDB
const mongoose = require("mongoose");

// pour protéger les informations de connexion vers la BDD
require("dotenv").config();

// pour pouvoir travailler avec les chemins des fichiers
const path = require("path");

// pour sécuriser les en-tête http de l'application express
// const helmet = require("helmet");

// pour nettoyer les données fournies par l'utilisateur pour empêcher l'injection d'opérateur MongoDB.
const sanitize = require("express-mongo-sanitize");

// pour les routes vers l'utilisateur et les sauces
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

// je me connecte à la MongoDB
mongoose
	.connect(process.env.DB_CODE, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connexion à la BDD réussie !"))
	.catch(() => console.log("Connexion à la BDD échouée !"));

// je fais appel au module Express avec sa fonction
// le mot-clé app fait souvent référence au module express
// on peut utiliser un autre nom, mais c'est la convention
const app = express();

// Avant la route d'API, on ajoute la fonction (middleware) des headers permettant
// aux deux ports front et end de communiquer entre eux
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*"); // "*" permet d'accéder a l'API depuis n'importe quelle origine
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	); // autorisation d'utiliser certains headers sur l'objet requête
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	); // permet d'envoyer des requêtes avec ces méthodes
	next(); // passe l'exécution au middleware suivant
});

// je récupère le body en front sur l'objet request
// je parse le corps de la requête en objet json utilisable
// bodyParser est automatiquement intégré dans la dernière version
// d'Express, donc inutile de l'installer à part
app.use(express.json());

// je protège l'appli de certaines vulnerabilités en protégeant les en-têtes
// app.use(helmet());

// je nettoie les données user pour éviter des injections dans la BDD
app.use(sanitize());

// je configure les routes d'API
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

// j'exporte ce module pour pouvoir le réutiliser ailleurs
module.exports = app;
