// pour protéger les informations de connexion vers la BDD MongoDB
require("dotenv").config();
const http = require("http");
const app = require("./app");

const normalizePort = (val) => {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// je gère les erreurs avec la fonction errorHandler
const errorHandler = (error) => {
	if (error.syscall !== "listen") {
		throw error;
	}
	const address = server.address();
	const bind =
		typeof address === "string" ? "pipe " + address : "port: " + port;
	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges.");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(bind + " is already in use.");
			process.exit(1);
			break;
		default:
			throw error;
	}
};

const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
	const address = server.address();
	const bind = typeof address === "string" ? "pipe " + address : "port " + port;
	console.log("Listening on " + bind);
});

server.listen(port);

/* La structure du back-end est faite comme ceci :
  - le front-end cherchant à communiquer avec le back-end va chercher
  son point d'entrée par défaut, qui est le server.js
  - server.js va alors traiter et envoyer la requête vers app.js
  - app.js va envoyer la requête vers les routes; ici, on crée un dossier
  pour les routes puisqu'il peut y en avoir plusieurs.
  - ces routes vont alors passser d'abord par un système d'authentification
  de l'utilisation, dans le dossier middleware, qui contient les deux fichiers
  auth.js et multer.js
  - on va ensuite passer au controllers, qui lui va faire le plus gros boulot
  du CRUD : create, read, update, delete; la communication avec la BDD
  se fait ici.
  - le dossier models est un guide pour ce qui est possible de faire avec
  la BDD.
*/
