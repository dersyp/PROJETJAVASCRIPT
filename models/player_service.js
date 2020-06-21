const FileSync = require('lowdb/adapters/FileSync')	
const low = require('lowdb')
const adapter = new FileSync('db.json')
const db = low(adapter)
const Player = require('./player.js');
class Player_service{
	constructor(){
		// Vérifier si const players = db.get("players").value(); est vide
		db.defaults({ players: [] }).write()
	}
	createPlayer(player){
		console.log("[CreatePlayer]")
		console.log(player)
		db.get('players').push({ 
			login: player.login, 
			pseudo: player.pseudo, 
			hashedPassword: player.hashedPassword,
			scores: {
				scorejeu1: 0,
				scorejeu2: 0,
				scorejeu3: 0,
				scorejeu4: 0			
			}
		}).write()
	}
	deletePlayer(login){
		console.log("[deletePlayer]")

	}

	getPlayerByLogin(login){
		console.log("[getPlayerByLogin] Recherche du joueur qui a le login " + login)
		let info = db.get('players')
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
		const players = db.get("players").value();
		return players;
	}

}

module.exports = Player_service;
