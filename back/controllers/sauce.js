// j'importe les npm nécessaires
const Sauce = require("../models/sauce");
// fs veut dire file-system, c'est ce qui nous permet de
// modifier et supprimer un fichier
const fs = require("fs");

/// CREER LA SAUCE ///
exports.createSauce = (req, res, next) => {
	// body parsé en objet js utilisable
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	const sauce = new Sauce({
		// on récupère toutes les infos du body grâce à cette fonction ...spread
		...sauceObject,
		//on récupère dynamiquement l'URL de l'image
		/*    ${req.protocol} = http ou https
            ${req.get('host')} = host du serveur (ex: localhost)
            /images/ = dossier images
            ${req.file.filename} = nom de l'image
      */
		imageUrl: `${req.protocol}://${req.get("host")}/images/${
			req.file.filename
		}`,
		likes: 0, // départ des likes à 0
		dislikes: 0, // départ des dilikes à 0
		usersLiked: [],
		usersDisliked: [],
	});
	sauce
		.save() // sauvegarder la sauce
		.then(() =>
			res.status(201).json({ message: "La sauce a bien été créée !" })
		)
		.catch((error) => res.status(400).json({ error }));
};

/// AFFICHER TOUTES LES SAUCES //
exports.getAllSauces = (req, res, next) => {
	Sauce.find() // request : retrouver tout
		.then((sauces) => res.status(200).json(sauces)) // res : promesse ok
		.catch((error) => res.status(400).json({ error }));
};

/// AFFICHER UNE SAUCE //
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id }) // retrouver un élément par son id
		.then((sauce) => res.status(200).json(sauce)) // res : promesse ok
		.catch((error) => res.status(404).json({ error }));
};

/// MODIFIER UNE SAUCE //
exports.modifySauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id }).then((sauce) => {
		const sauceObject = req.file
			? {
					...JSON.parse(req.body.sauce),
					imageUrl: `${req.protocol}://${req.get("host")}/images/${
						req.file.filename
					}`,
			  }
			: { ...req.body };
		Sauce.updateOne(
			{ _id: req.params.id },
			{ ...sauceObject, _id: req.params.id }
		)
			.then(() => res.status(200).json({ message: "Sauce modifié !" }))
			.catch((error) => res.status(400).json({ error }));
	});
};

/// SUPPRIMER UNE SAUCE //
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			/* récupérer l'imageUrl retournée par la BDD, stockée dans /images/
    qu'on peut split vu qu'elle est entre deux chemins /.../
    split va retourner deux éléments dans un tableau :
    xxxAxxx/images/xxxBxxx et on s'intéresse au nom du fichier,
    donc le 2ème élément qui est B, d'où le [1] à la fin */
			const filename = sauce.imageUrl.split("/images/")[1];
			// fonction pour supprimer l'image dans le système
			// et ensuite l'id correpondant
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() =>
						res.status(200).json({ message: "La sauce a bien été supprimée !" })
					)
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

/// LIKE OU DISLIKE UNE SAUCE //
// Like et dislikes
exports.likeDislikeSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const like = req.body.like;
			let opinions = {};
			switch (like) {
				case -1: //  Si l'utilisateur dislike la sauce
					opinions = {
						$push: { usersDisliked: req.body.userId },
						$inc: { dislikes: 1 },
					};
					break;
				case 0: // Si l'utilisateur enlève son like / dislike
					for (let userId of sauce.usersDisliked)
						if (req.body.userId === userId) {
							opinions = {
								$pull: { usersDisliked: userId },
								$inc: { dislikes: -1 },
							};
						}
					for (let userId of sauce.usersLiked)
						if (req.body.userId === userId) {
							opinions = {
								$pull: { usersLiked: userId },
								$inc: { likes: -1 },
							};
						}
					break;
				case 1: // Si l'utilisateur like la sauce
					opinions = {
						$push: { usersLiked: req.body.userId },
						$inc: { likes: 1 },
					};
					break;
			}
			Sauce.updateOne({ _id: req.params.id }, opinions)
				.then(() => res.status(200).json({ message: "La sauce a été liké" }))
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
