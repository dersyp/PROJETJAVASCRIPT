class Player{
	constructor(pseudo, login, hashedPassword){
		console.log("Création d'un nouveau joueur  pseudo : "+ pseudo + "login : " +login + "hashedPassword : " + hashedPassword)
		this.pseudo = pseudo;
		this.login = login;
		this.hashedPassword = hashedPassword;
	}

}
module.exports = Player;