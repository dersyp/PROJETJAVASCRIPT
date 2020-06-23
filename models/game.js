/*
	Class Game qui gere les informations relatives à un jeu
*/
class Game{
	// Consctureur de la classe Game qui permet d'initialiser les objets Game créés
	constructor(name, highScore, rankings){
		this.name = name
		this.highScore = highScore
		this.rankings = rankings
	}

}
//Export la class Game dans un module pour la rendre utilisable dans les autres fichiers
module.exports = Game;