//Permet de charger les variables d'envrironnement présentes dans le fichier .env
 require('dotenv').config();
//Charge le module express (installé via la commande npm install express) dans la variable express
const express = require('express')
//Création d'une nouvelle instance express sous le nom app
const app = express()
//Création d'un objet router 
const router = express.Router()
//Charge le module bcrypt qui permet de chiffrer les mots de passe (npm install bcrypt)
const bcrypt = require('bcrypt')
//Charge le module flash utilisé pour afficher les messages d'erreurs lors de la connexion
const flash = require('express-flash')
//Charge le module session qui permet de gérer la persistance de la connexion
const session = require('express-session')
//Charge le module passport afin de gérer l'authentification au sein de l'application
const passport = require('passport')
//Charge le module cookie-parser qui permet l'utilisation de cookies.
const cookieparser = require('cookie-parser')
//Importe et instancie le modèle pour gérer les jeux au sein de l'application
const Game_service = require('./models/game_service.js')
const dbGame = new Game_service()
//Importe et instancie le modèle pour gérer les joueur au sein de l'application
const player_service = require('./models/player_service.js')
const dbPlayer = new player_service()
const player = require('./models/player.js');

//Importe le fichier passport-config.js qui permet de gérer les authentifications en local et en Oauth
const initializePassport = require('./passport-config.js');
//Renseigne le moteur de template utilisé, ici EJS
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
//Ajout du middleware flash sur l'instance express app.
app.use(flash())
//Ajout du middleware session sur l'instance express app.
app.use(session({
	secret: process.env.SECRET_KEY,
	resave: false,
	saveUninitialized: false
}))
//Ajout du middleware cookieparser sur l'instance express app.
app.use(cookieparser())
//Ajout du middleware passport.initialize sur l'instance express app pour initialiser le module passport
app.use(passport.initialize())
//Ajout du middleware passport.session sur l'instance express app pour rendre la connexion persistante
app.use(passport.session())
//Appel de la fonction qui permet de gérer les connexions
initializePassport(passport, dbPlayer.getPlayerByLogin, dbPlayer.gitHubfindOrCreate)

//Middleware qui gère les requêtes GET vers /
router.get('/', checkAuthenticated, function(requestHTTP, responseHTTP, next){
	//Si le joueur se connecte on place un cookie pour le placer directement sur la page de login lors de sa prochaine connexion
	responseHTTP.cookie('login', requestHTTP.user.login);
	//Permet de traduire le template home.ejs en page HTML 
	responseHTTP.render('home',{pseudo: requestHTTP.user.pseudo, playerScores: requestHTTP.user.scores})
})

//Middleware qui gère les requêtes GET vers /login
router.get('/login',checkNotAuthenticated, function(requestHTTP, responseHTTP, next){
	responseHTTP.render('login')
})
//Middleware qui gère les requêtes GET vers /register
router.get('/register',checkNotAuthenticated, function(requestHTTP, responseHTTP, next){
	responseHTTP.render('register')
})
//Middleware qui gère les requêtes POST vers /register
router.post('/register',checkNotAuthenticated, async function(requestHTTP, responseHTTP, next){
 	// Vérifie si le login n'est pas déjà pris.
 	if(dbPlayer.getPlayerByLogin(requestHTTP.body.login) === null){
	 	try{
	 		// Recupère le hash du mot de passe (Fonction asynchrone)
	 		const hash = await bcrypt.hash(requestHTTP.body.password,10)
	 		//Créé un nouveau joueur dans la de données grâce aux informations saisies dans le formulaire
	 		dbPlayer.createPlayer(new player(requestHTTP.body.pseudo, requestHTTP.body.login, hash,{},'player'))
	 		//Redirige vers /login
	 		responseHTTP.redirect('/login')
	 	}catch(error){
	 		console.log(error)
	 		console.log("Erreur lors de la création")
	 		//Redirige vers /register
	 		responseHTTP.redirect('/register')
	 	}
 	}else{
 		//Redirige vers la page d'inscription avec une erreur en paramètre de l'url
 		responseHTTP.redirect('/register?error=Login_Already_Used')
 	}
})

//Middleware qui gère les requêtes POST vers /login (utilisation de passport)
router.post('/login',checkNotAuthenticated,passport.authenticate('local', { 
	successRedirect: '/',
    failureRedirect: '/login',
    badRequestMessage: 'Veuillez renseigner vos informations',
    failureFlash: true
}));

//Middleware qui gère les requêtes GET vers /login/github (authentification OAuth)
router.get('/login/github',
	passport.authenticate('github'));

//Middleware qui gère les requêtes POST vers /login/github/return (callback de github)
router.get('/login/github/return', 
	passport.authenticate('github', { failureRedirect: '/login' }),
	function(requestHTTP, responseHTTP) {
    // Redirige vers la page home
    responseHTTP.redirect('/');
});

//Middleware qui gère les requêtes GET vers /logout
router.get('/logout', function(requestHTTP, responseHTTP){
	//Deconnecte le joueur
	requestHTTP.logout();
	//Redirige vers la page de /login
	responseHTTP.redirect('/login');
});

//Middleware qui gère les requêtes GET vers /clicker 
router.get('/clicker',checkAuthenticated, function(requestHTTP, responseHTTP, next){
	//Traduit le template clicker.ejs en page html
	responseHTTP.render('clicker', {scoresList: dbGame.getGameOrCreateByname('clicker'), bestPlayerScore: requestHTTP.user.scores.clicker, playerPseudo: requestHTTP.user.pseudo})
})

//Middleware qui gère les requêtes POST vers /clicker 
router.post('/clicker',checkAuthenticated,function(requestHTTP, responseHTTP){
	//Fonction qui permet de mettre à jour le Score pour le jeu Clicker dans la base de données des scores et des utilisateurs
	dbGame.updateGameScore(requestHTTP.user.pseudo,"clicker",requestHTTP.body.clicksNumber)
	dbPlayer.updatePlayerScore(requestHTTP.user.login,"clicker",requestHTTP.body.clicksNumber)
});

//Middleware qui gère les requêtes GET vers /reaction 
router.get('/reaction',checkAuthenticated, function(requestHTTP, responseHTTP, next){
	//Traduit le template reaction.ejs en page html
	responseHTTP.render('reaction', {scoresList: dbGame.getGameOrCreateByname('reaction'), bestPlayerScore: requestHTTP.user.scores.reaction, playerPseudo: requestHTTP.user.pseudo})
})

//Middleware qui gère les requêtes POST vers /reaction 
router.post('/reaction',checkAuthenticated,function(requestHTTP, responseHTTP){
	//Fonction qui permet de mettre à jour le Score pour le jeu Reaction dans la base de données des scores et des utilisateurs
	dbGame.updateGameScore(requestHTTP.user.pseudo,"reaction",requestHTTP.body.reactionTime)
	dbPlayer.updatePlayerScore(requestHTTP.user.login,"reaction",requestHTTP.body.reactionTime)
});

//Middleware qui gère les requêtes GET vers /admin 
router.get('/admin', checkAuthenticated, isAdmin, function(requestHTTP, responseHTTP){
	//Traduit le template admin.ejs en page html
  	responseHTTP.render('admin', {playersList: dbPlayer.readPlayers()})
});


//Middleware qui gère les requêtes GET vers /admin/ban/
router.get('/admin/ban/:login', checkAuthenticated, isAdmin, function(requestHTTP, responseHTTP){
	//Fonction qui permet de supprimer un utilisateur dans la base de données
	dbPlayer.deletePlayer(requestHTTP.params.login)
	//Redirige vers la page /admin
	responseHTTP.redirect('/admin')
});

//Middleware qui permet d'empecher une personne pas connectée d'accéder aux pages /home, /clicker, /admin
function checkAuthenticated(requestHTTP, responseHTTP, next) {
  	//Si le joueur est connecté
  	if (requestHTTP.isAuthenticated()) {
  		//Passe le controle au prochain middleware ou à la fonction de la route associée
    	return next()
  	}
  	//Vérifie si le cookie login existe
  	if(requestHTTP.cookies['login']){
  		//Si le cookie est présent redirige /login
  		responseHTTP.redirect('/login')
  	}else{
  		//Si le cookie n'est pas présent redirige /register
  		responseHTTP.redirect('/register')
  	}
}

//Middleware qui permet d'empecher une personne connecté d'acceder aux pages : /login, /register
function checkNotAuthenticated(requestHTTP, responseHTTP, next) {
	if (requestHTTP.isAuthenticated()) {
		//Si le joueur est connecté redirige vers /home
    	return responseHTTP.redirect('/')
  	}
  	//Passe le controle au prochain middleware ou à la fonction de la route associée
  	next()
}

//Middleware qui permet d'empecher une personne pas admin d'accéder à la page : /admin
function isAdmin(requestHTTP, responseHTTP, next){
	if(requestHTTP.user.role != "admin"){
		return responseHTTP.redirect('/')
	}
	//Passe le controle au prochain middleware ou à la fonction de la route associée
	next()
}


//Permet d'appeler le middleware routeur pour toutes les requêtes effectué sur l'instance express app.
app.use('/',router)
//Rend accessible les fichiers du dossier /public (utilisé pour le css, les images...)
app.use(express.static(__dirname + '/public'))
//Met le serveur en écoute
app.listen(process.env.PORT, function(){
	console.log("Server listening on port " + process.env.PORT)
})
