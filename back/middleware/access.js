const Sauce = require("../models/sauce");
module.exports = (req, res, next) => {
	try {
		Sauce.findOne({ _id: req.params.id }) // retrouver un élément par son id
			.then((sauce) => {
				if (sauce.userId !== req.auth.userId) {
					throw "Vous avez pas le droit !"; //Renvoie l'erreur
					// si tout va bien, suivant
				} else {
					next();
				}
			}) // res : promesse ok
			.catch((error) => res.status(404).json({ error }));
	} catch {
		// renvoyer une erreur 401, problème d'authentification
		res.status(401).json({ error: new Error("La requete pas valide !") });
	}
};
