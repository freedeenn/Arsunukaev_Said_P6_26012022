const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// le modèle schema pour l'email et le mot de passe
// email unique...
const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

// ...vérifié par cette dépendance
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
