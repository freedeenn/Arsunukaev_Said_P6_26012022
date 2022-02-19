// pour créer des token aléatoires et uniques pour la connexion
const jwt = require("jsonwebtoken");

// j'exporte le module de token
module.exports = (req, res, next) => {
	try {
		// récupérer le token dans le header autorisation, le split
		// et récupérer le deuxième élément du tableau renvoyé
		const token = req.headers.authorization.split(" ")[1];
		// décoder le token en le vérifiant
		const decodedToken = jwt.verify(token, "process.env.RANDOM_TOKEN_SECRET");
		// extraire le userId grace au token
		const userId = decodedToken.userId;
		// si on a un userId dans le corps de la requête
		// et qu'il est différent du userId = erreur
		req.auth = { userId };
		if (req.body.userId && req.body.userId !== userId) {
			throw "User ID n'est pas valide !"; //Renvoie l'erreur
			// si tout va bien, suivant
		} else {
			next();
		}
	} catch {
		// renvoyer une erreur 401, problème d'authentification
		res.status(401).json({ error: new Error("La requete n'est pas valide !") });
	}
};
