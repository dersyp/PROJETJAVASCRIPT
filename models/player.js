class Player{
	constructor(pseudo, login, hashedPassword, scores, role){
		this.pseudo = pseudo;
		this.login = login;
		this.hashedPassword = hashedPassword;
		this.scores = scores;
		this.role = role
	}

}
module.exports = Player;