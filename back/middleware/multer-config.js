// Multer est un package qui nous permet de gérer
// les fichiers entrants dans les requêtes HTTP.
// ici, ce sera les images téléchargées par les users
const multer = require("multer");

// je traduis les types de fichier pour générer les extensions possibles
const MIME_TYPES = {
	"image/jpg": "jpg",
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
};

// on enregistre les images téléchargées par le user dans le disc
// la config de multer nécessite deux arguments : destination + filename prenant 3 params chacun
const storage = multer.diskStorage({
	// la destination
	destination: (req, file, callback) => {
		//Le callback renvoie vers la destination d'enregistrement qui est le dossier images
		callback(null, "images");
	},
	// quel nom de fichier considérer ?
	filename: (req, file, callback) => {
		// on crée le nom du fichier : prend le nom d'origine, le split
		// et remplace les espaces par des undescores
		const name = file.originalname.split(" ").join("_");
		// on génère l'extension du fichier
		const extension = MIME_TYPES[file.mimetype];
		// renvoie en callback le nom du fichier final
		callback(null, name + Date.now() + "." + extension);
	},
});

// j'exporte multer en appelant le module storage
// .single signifie que c'est un fichier unique et non un groupe
// "image" pour dire à multer qu'il s'agit d'un fichier image uniquement
module.exports = multer({ storage: storage }).single("image");
