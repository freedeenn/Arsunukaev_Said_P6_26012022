// const user = require("../routes/user");
// const sauce = require("../routes/sauce");
// console.log("sauce.user.id");
// console.log(sauce.userId);
// exports.canModifySauce = function (user, sauce) {
// 	return sauce.userId === user.id;
// };

// // // module.exports = canModifySauce;
// // module.exports = function (id) {
// // 	return function (req, res, next)
const Sauce = require("../models/sauce");
module.exports = (req, res, next) => {
	try {
		Sauce.findOne({ _id: req.params.id }) // retrouver un élément par son id
			.then((sauce) => {
				if (sauce.userId !== req.auth.userId) {
					throw "you don't have rights"; //Renvoie l'erreur
					// si tout va bien, suivant
				} else {
					next();
				}
			}) // res : promesse ok
			.catch((error) => res.status(404).json({ error }));
	} catch {
		// renvoyer une erreur 401, problème d'authentification
		res.status(401).json({ error: new Error("Invalid request!") });
	}
};
