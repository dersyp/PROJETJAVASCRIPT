const FileSync = require('lowdb/adapters/FileSync')	
const low = require('lowdb')
const adapter = new FileSync('dbGame.json')
const dbGame = low(adapter)
const Game = require('./game.js');
class Game_service{
	constructor(){
		// Vérifier si const players = db.get("players").value(); est vide
		console.log("Constructeur game_service")
		dbGame.defaults({ ScoresGame: [] }).write()
	}
	createGame(Game){
		console.log("[Create]")
		console.log(Game)
		dbGame.get('ScoresGame').push({ 
			name: Game.name,
			highScore: Game.highScore,
			rankings: Game.rankings
		}).write()
	}

	getGameByname(name){
		// Si c'est nul il faut le créer
		let currentGame = null
		let info = dbGame.get('ScoresGame')
		  .find({ name: name })
		  .value()

		if(info){
			currentGame = new Game(info.name, info.highScore, info.rankings)
		}else{
			//Si il existe pas on le créé
			currentGame = new Game(name,0,{})
			this.createGame(currentGame)
		}
		return currentGame
	}

	updateGameScore(pseudo,name, score){
		let currentGame = this.getGameByname(name)
		let scoreInt = parseInt(score, 10);
		//Ajout du score dans le rankings.
		if(currentGame.rankings[pseudo]){
			if(scoreInt > currentGame.rankings[pseudo]){
				currentGame.rankings[pseudo] = scoreInt
				dbGame.get('ScoresGame').find({ name: name }).assign({ rankings: currentGame.rankings}).write();
			}
		}else{
			Object.assign(currentGame.rankings,{[pseudo]: scoreInt});
			dbGame.get('ScoresGame').find({ name: name }).assign({ rankings: currentGame.rankings}).write();
		}
		// Modifie le score max du jeu si celui-ci est dépassé
		if(scoreInt > currentGame.highScore){
			console.log("Update du jeu "+ name + " avec le  score "+ scoreInt)
			dbGame.get('ScoresGame').find({ name: name}).assign({ highScore: scoreInt}).write();
		}
	}
}

module.exports = Game_service;
