// j'importe les npm nécessaires
// pour crypter les informations
const bcrypt = require("bcrypt");
// pour créer des token introuvables et aléatoires
// = sécuriser la connexion au compte
const jwt = require("jsonwebtoken");

// j'importe le "model" de création utilisateur
const User = require("../models/user");

// signup
exports.signup = (req, res, next) => {
	bcrypt // hashage 10 fois du password avec bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			// créer un nouvel utilisateur
			const user = new User({
				email: req.body.email, // récupère le corps de la requête = email
				password: hash, // hash le pwd quand l'utilisateur le crée
			});
			user
				.save() // sauvegarder l'utilisateur
				.then(() =>
					res.status(201).json({ message: "Utilisateur créé avec succès !" })
				)
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};

// login
exports.login = (req, res, next) => {
	// on vérifie si l'email utilisateur existe dans la BDD
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				// s'il n'existe pas
				return res
					.status(401)
					.json({ error: "Erreur ! Utilisateur non trouvé !" });
			}
			bcrypt
				// on compare les entrées et les données
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						// si c'est différent
						return res.status(401).json({ error: "Mot de passe incorrect !" });
					}
					res.status(200).json({
						// si c'est bon, on envoie l'objet suivant
						userId: user._id,
						token: jwt.sign(
							//contient les données qu'on veut encoder dans ce token
							{ userId: user._id },
							"process.env.RANDOM_TOKEN_SECRET", // avec une clé secrète
							{ expiresIn: "24h" } // qui est valide 24h
						),
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
