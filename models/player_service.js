/*
	Class de service qui permet de gérer les objets Player dans la base de données
*/
// Créé une instance de la base de données avec le fichier dbPlayer.json 
// qui contient toutes les informations relatives aux joueurs
const FileSync = require('lowdb/adapters/FileSync')	
const low = require('lowdb')
const adapter = new FileSync('dbPlayer.json')
const dbPlayer = low(adapter)
//Importe la class Player pour instancier des joueurs
const Player = require('./player.js');
class Player_service{
	constructor(){
		//Permet de rajouter un tableau qui va stocker les objets Player si la tableau n'est pas présent dans la base de données 
		dbPlayer.defaults({ players: [] }).write()
	}
	// Fonction qui permet la création d'un nouveau joueur dans la base de données
	createPlayer(player){
		console.log("[INFO][createPlayer] Création d'un nouveau joueur dans la base de données sous le login : "+ player.login)
		//Créé le joueur dans la base de données dbPlayer instanciée plus tôt via l'objet Game passé en argument
		dbPlayer.get('players').push({ 
			login: player.login, 
			pseudo: player.pseudo, 
			hashedPassword: player.hashedPassword,
			scores: {		
			},
			role: 'player'
		}).write()
	}
	// Fonction qui permet de supprimer un joueur de la base de données
	deletePlayer(login){
		console.log("[INFO][deletePlayer] Suppression du joueu avec le login : "+ login)
		//Utilise le login (unique dans la base de données) qui est passé en paramètre pour supprimer le joueur
		dbPlayer.get('players')
		  .remove({ login: login })
		  .write()
	}
	// Fonction qui retourne un objet Player grâce au login
	// (Le login est unique dans la base de données)
	getPlayerByLogin(login){
		console.log("[INFO][getPlayerByLogin] Recherche d'un joueur dans la base de données sous le login : "+ login)
		// Recupère l'objet Game à partir de son login
		let info = dbPlayer.get('players')
		  .find({ login: login })
		  .value()
		// Variable qui stocke l'objet player. Initialisée à null pour retourné cette valeur si le joueur
		// n'est pas présent dans la base de données
		let player = null;
		if(info){
			//Instancie un nouveau Player grâce aux informations récupérées dans la base de données
		 	player = new Player(info.pseudo, info.login, info.hashedPassword, info.scores, info.role)
		}
		//Returne la variable player qui stocke l'ojet joueur ou null
		return player;
	}
	// Fonction qui retourne tous les joueur présents dans la base de données
	readPlayers() {
		//Retourne l'ensemble du tableau players présent dans la base de données
		return dbPlayer.get("players").value();
	}

	//Fonction qui retourne les scores meilleur scores d'un joueur à partir de son login
	getScore(login){
		console.log("[INFO][getScore] Récupère les scores du joueur sous le login : "+ login)
		//Recherche dans la base données le joueur avec le login saisi en paramètre
		let info = dbPlayer.get('players')
		  .find({ login: login })
		  .value()
		return info.scores
	}

	//Fonction qui met à jour le score d'un joueur dans la base de données
	updatePlayerScore(login,gameName,score){
		//Convertit le score passé en paramètre en entier pour l'ajouter dans la base de données
		let scoreInt = parseInt(score, 10);
		//Récupère les scores associé au joueur
		let scoresGames = this.getScore(login,gameName);
		// Modifie le meilleur score du joueur si celui-ci est dépassé (Prend en compte le nom du jeu)
		if((scoreInt > scoresGames[gameName] && gameName == "game1") || (scoreInt < scoresGames[gameName] && gameName == "game2")) {
			//Vérifie si le joueur possède un score pour ce jeu
			if(scoresGames[gameName]) {
				scoresGames[gameName]= scoreInt;
			}else{
				Object.assign(scoresGames,{[gameName]: scoreInt});
			}
			//Ajoute le nouveau score dans la base de données pour le joueur
			dbPlayer.get('players').find({ login: login}).assign({ scores: scoresGames}).write();
		}
	}

	// Fonction qui permet l'instanciation d'un nouveau joueur à partir de gitHub
	gitHubfindOrCreate(githubId,pseudo){
		// Recherche si le joueur est déjà présent dans la base de données
		let info = dbPlayer.get('players')
		  .find({ login: githubId })
		  .value()
		 let player = null;
		 if(info){
		 	// Si le joueur est présent dans la base de données, instancie un nouveau joueur avec les informations récupérées
		 	player = new Player(info.pseudo, info.login, info.hashedPassword, info.scores, info.role)
		 }else{
		 	//Si le joueur n'existe pas, créé un nouveau joueur pour l'ajouter dans la base de données
		 	player = new Player(pseudo, githubId, null, null, null);
		 	dbPlayer.get('players').push({ 
			login: player.login, 
			pseudo: player.pseudo, 
			hashedPassword: player.hashedPassword,
			scores: {
				game1: 0,
				game2: 0,
				game3: 0,
				game4: 0			
			},
			role: 'player'
			}).write()
		 }
		 // Retourne la variable contenant le joueur
		 return player
	}

}
//Export la class Player_service dans un module pour la rendre utilisable dans les autres fichiers
module.exports = Player_service;
