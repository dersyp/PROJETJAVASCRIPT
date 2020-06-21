const FileSync = require('lowdb/adapters/FileSync')	
const low = require('lowdb')
const adapter = new FileSync('dbPlayer.json')
const dbPlayer = low(adapter)
const Player = require('./player.js');
class Player_service{
	constructor(){
		// Vérifier si const players = db.get("players").value(); est vide
		console.log("Constructeur player_service")
		dbPlayer.defaults({ players: [] }).write()
	}
	createPlayer(player){
		console.log("[CreatePlayer]")
		console.log(player)
		dbPlayer.get('players').push({ 
			login: player.login, 
			pseudo: player.pseudo, 
			hashedPassword: player.hashedPassword,
			scores: {
				game1: 0,
				game2: 0,
				game3: 0,
				game4: 0			
			}
		}).write()
	}
	deletePlayer(login){
		console.log("[deletePlayer]")

	}

	getPlayerByLogin(login){
		console.log("[getPlayerByLogin] Recherche du joueur qui a le login " + login)
		let info = dbPlayer.get('players')
		  .find({ login: login })
		  .value()
		 let player = null;
		 if(info){
		 	player = new Player(info.pseudo, info.login, info.hashedPassword)
		 }else{
		 	console.log("Player pas existant")
		 }
		return player;
	}
	readPlayers() {
		// Get all players
		const players = dbPlayer.get("players").value();
		return players;
	}

	getScore(login){
		console.log("getScoreByGame")
		let info = dbPlayer.get('players')
		  .find({ login: login })
		  .value()
		return info.scores
	}

	updatePlayerScore(login,gameName,score){
		let scoreInt = parseInt(score, 10);
		let scoresGames = this.getScore(login,gameName);
		// Modifie le meilleur score du joueur si celui-ci est dépassé
		if(scoreInt > scoresGames[gameName]){
			scoresGames[gameName] = scoreInt;
			dbPlayer.get('players').find({ login: login}).assign({ scores: scoresGames}).write();
		}
	}

}

module.exports = Player_service;
