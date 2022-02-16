// j'importe le schema de password
const passwordSchema = require("../models/password");

// je vérifie que le password respecte le schema
module.exports = (req, res, next) => {
	// si false
	if (!passwordSchema.validate(req.body.password)) {
		res.writeHead(
			400,
			"Mot de passe non valide: min 8 caractères, une majuscule, une minuscule et un chiffre, sans espace.",
			{
				"content-type": "application/json",
			}
		);
		res.end("Le format de votre mot de passe est incorrect");
	} else {
		next();
	}
};
