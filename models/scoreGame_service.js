const FileSync = require('lowdb/adapters/FileSync')	
const low = require('lowdb')
const adapter = new FileSync('db.json')
const db = low(adapter)
const ScoreGame = require('./scoreGame.js');
class ScoreGame_service{
	constructor(){
		// Vérifier si const players = db.get("players").value(); est vide
		db.defaults({ scoresGame: [] }).write()
	}
	createScoreGame(scoreGame){
		console.log("[CreateScore]")
		console.log(scoreGame)
		db.get('scoresGame').push({ 
			name: scoreGame.name,
			highScore: scoreGame.highScore
		}).write()
	}

	getScoreByname(name){
		// Si c'est nul il faut le créer
		let currentScoreGame = null
		let info = db.get('scoresGame')
		  .find({ name: name })
		  .value()

		if(info){
			currentScoreGame = new ScoreGame(info.name, info.highScore)
		}else{
			//Si il existe pas on le créé
			currentScoreGame = new ScoreGame(name,0)
			this.createScoreGame(currentScoreGame)
		}
		return currentScoreGame
	}

	updateGame(name, score){
		let currentScoreGame = this.getScoreByname(name)
		if(score > currentScoreGame.highScore){
			console.log("Update du jeu "+ name + " avec le score "+ score)
			db.get('scoresGame').find({ name: name}).assign({ highScore: score}).write();
		}
	}
}

module.exports = ScoreGame_service;
