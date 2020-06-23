/*
	Class Player qui gere les informations relatives à un joueur
*/
class Player{
	// Consctureur de la classe Player qui permet d'initialiser les objets Player créés
	constructor(pseudo, login, hashedPassword, scores, role){
		this.pseudo = pseudo;
		this.login = login;
		this.hashedPassword = hashedPassword;
		this.scores = scores;
		this.role = role
	}
}
//Export la class Player dans un module pour la rendre utilisable dans les autres fichiers
module.exports = Player;