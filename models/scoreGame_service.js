const FileSync = require('lowdb/adapters/FileSync')	
const low = require('lowdb')
const adapter = new FileSync('db.json')
const db = low(adapter)
const scoreGame = require('./scoreGame.js');
class ScoreGame_service{
	constructor(){
		// Vérifier si const players = db.get("players").value(); est vide
		db.defaults({ scoresGame: [] }).write()
	}
	createScoreGame(scoreGame){
		console.log("[CreateScore]")
		console.log(scoresGame)
		db.get('scoreGame').push({ 
			name: scoreGame.name,
			highScore: scoreGame.highscore,
			avgScore: scoreGame.avgscore,
			worseScore: scoreGame.worseScore
		}).write()
	}

	getScoreByname(name){
		// Si c'est nul il faut le créer
		let scoreGame = null
		let info = db.get('scoresGame')
		  .find({ login: login })
		  .value()

		if(info){
			scoreGame = new Score(info.name, info.highScore, info.avgScore, info.worseScore)
		}else{
			//Si il existe pas on le créé
			scoreGame = new Score(name,0,0,0)
		}
		return scoreGame
	}

}

module.exports = ScoreGame_service;
