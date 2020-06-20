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
		console.log("Create Player")
		console.log(player)
		db.get('players').push({ 
			login: player.login, 
			pseudo: player.pseudo, 
			hashedPassword: player.hashedPassword
		}).write()
	}
	async deletePlayer(login){
		console.log("Delete player")

	}
	async readPlayers() {
		// Get all players
		const players = db.get("players").value();
		return players;
	}

}

module.exports = Player_service;
