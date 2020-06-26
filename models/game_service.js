/*
	Class de service qui permet de gérer les objets Game dans la base de données
*/
// Créé une instance de la base de données avec le fichier dbGame.json 
// qui contient toutes les informations relatives aux jeux
const FileSync = require('lowdb/adapters/FileSync')	
const low = require('lowdb')
const adapter = new FileSync('dbGame.json')
const dbGame = low(adapter)
//Importe la class Game pour instancier des jeux
const Game = require('./game.js');
class Game_service{
	constructor(){
		//Permet de rajouter un tableau qui va stocker les objets Game si la tableau n'est pas présent dans la base de données
		dbGame.defaults({Games: [] }).write()
	}
	//Fonction qui permet de créer un jeu dans la base de données
	createGame(Game){
		console.log("[INFO][createGame] Création d'un nouveau jeu dans la base de données sous le nom : "+ Game.name)
		//Créé le jeu dans la base de données dbGame instanciée plus tôt via l'objet Game passé en argument
		dbGame.get('Games').push({ 
			name: Game.name,
			highScore: Game.highScore,
			rankings: Game.rankings
		}).write()
	}
	// Fonction qui recherche un jeu à partir d'un nom et qui ajoute le jeu dans la base de données si celui-ci n'est pas présent
	// Dans la base de données un jeu est identifier par son nom
	getGameOrCreateByname(name){
		console.log("[INFO][getGameOrCreateByname] Recherche d'un jeu dans la base de données sous le nom : "+ name)
		// Variable pour stocker le jeu a renvoyer
		let currentGame;
		// Recupère l'objet Game à partir de son nom
		let infoGame = dbGame.get('Games')
		  .find({ name: name })
		  .value()
		// On test la valeur retournée par l'interogation à la base de données
		if(infoGame){
			//Si info n'est pas null instancie un nouvel objet jeu à partir des informations récupérées dans la base de données
			currentGame = new Game(infoGame.name, infoGame.highScore, infoGame.rankings)
		}else{
			//Si il existe pas on le créé grâce au nom et des valeurs par défaut.
			currentGame = new Game(name,0,{})
			this.createGame(currentGame)
		}
		//Retourne l'objet Game
		return currentGame
	}

	//Fonction qui permet de mettre à jour les scores des différents jeu dans la base de données
	updateGameScore(pseudo,name, score){
		//On récupère un objet Game associé au nom du jeu
		let currentGame = this.getGameOrCreateByname(name)
		//Convertit le score en integer et stocke celui-ci dans une variable pour l'ajouter dans la base de données si besoin
		let scoreInt = parseInt(score, 10);
		//Structure conditionnelle qui permet de vérifier si le joueur à un score stocké dans la base de données et si oui si le score réalisé est  meilleur
		//Ici la condition prend en compte le nom du jeu car selon le jeu meilleure valeur peut-être la plus grand ou la plus petite
		if(((!currentGame.rankings[pseudo] || scoreInt > currentGame.rankings[pseudo]) && name == "clicker") || ((!currentGame.rankings[pseudo] || scoreInt < currentGame.rankings[pseudo]) && name == "reaction")){
			if(currentGame.rankings[pseudo]){
				// Si le joueur à deja un score stocké pour ce jeu on actualise la valeur afin de garder seulement son meilleur score
				currentGame.rankings[pseudo] = scoreInt
			}
			else{
				//Si le joueur n'a pas de score attribué pour ce jeu, on ajoute une ligne avec le pseudo du joueur et le score effectué
				Object.assign(currentGame.rankings,{[pseudo]: scoreInt});
			}
			//Met à jour le tableau du score des différents joueurs pour le jeu dans la base de données
			dbGame.get('Games').find({ name: name }).assign({ rankings: currentGame.rankings}).write();
			//Si le record pour le jeu est battu
			if((scoreInt > currentGame.highScore && name == "clicker") || (scoreInt < currentGame.highScore && name == "reaction")){
				//On actualise la base de données avec le record pour le jeu
				dbGame.get('Games').find({ name: name}).assign({ highScore: scoreInt}).write();
			}
		}
	}
}
//Export la class Game_service dans un module pour la rendre utilisable dans les autres fichiers
module.exports = Game_service;
