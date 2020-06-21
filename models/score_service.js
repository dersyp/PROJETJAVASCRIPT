const FileSync = require('lowdb/adapters/FileSync')	
const low = require('lowdb')
const adapter = new FileSync('db.json')
const db = low(adapter)
const scoreJeu = require('./scoreJeu.js');
class ScoreJeu_service{
	constructor(){
		// Vérifier si const players = db.get("players").value(); est vide
		db.defaults({ scoresJeu: [] }).write()
	}
	createScoreJeu(scoreJeu){
		console.log("[CreateScore]")
		console.log(scoresJeu)
		db.get('scoreJeu').push({ 
			name: scoreJeu.name,
			highScore: scoreJeu.highscore,
			avgScore: scoreJeu.avgscore,
			worseScore: scoreJeu.worseScore
		}).write()
	}

	getScoreByname(name){
		// Si c'est nul il faut le créer
		let scoreJeu = null
		let info = db.get('scoresJeu')
		  .find({ login: login })
		  .value()

		if(info){
			scoreJeu = new Score(info.name, info.highScore, info.avgScore, info.worseScore)
		}else{
			//Si il existe pas on le créé
			scoreJeu = new Score(name,0,0,0)
		}
		return scoreJeu
	}

}

module.exports = ScoreJeu_service;
