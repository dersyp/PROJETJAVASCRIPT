//Permet de charger les variables d'envrironnement présentent dans le fichier .env
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

//Renseigne le moteur de template utilisé, EJS
app.set('view engine', 'ejs')
//https://github.com/expressjs/body-parser#bodyparserurlencodedoptions
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
	secret: process.env.SECRET_KEY,
	resave: false,
	saveUninitialized: false
}))
app.use(cookieparser())
app.use(passport.initialize())
app.use(passport.session())
const initializePassport = require('./passport-config.js');
initializePassport(passport, dbPlayer.getPlayerByLogin, dbPlayer.gitHubfindOrCreate)

router.get('/', checkAuthenticated, function(requestHTTP, responseHTTP, next){
	console.log("HOME PAGE ")
	responseHTTP.cookie('login', requestHTTP.user.login);
	responseHTTP.render('home.ejs',{pseudo: requestHTTP.user.pseudo, playerScores: requestHTTP.user.scores})
})

router.get('/login',checkNotAuthenticated, function(requestHTTP, responseHTTP, next){
	responseHTTP.render('login.ejs')
})
router.get('/register',checkNotAuthenticated, function(requestHTTP, responseHTTP, next){
	responseHTTP.render('register.ejs')
})

router.post('/register',checkNotAuthenticated, async function(requestHTTP, responseHTTP, next){
 	// traitement inscription 
 	console.log("Inscription ")
 	console.log(requestHTTP.body)
 	// Vérifie si le login n'est pas déjà pris.

 	if(dbPlayer.getPlayerByLogin(requestHTTP.body.login) === null){
	 	try{
	 		//https://medium.com/@mridu.sh92/a-quick-guide-for-authentication-using-bcrypt-on-express-nodejs-1d8791bb418f
	 		// Recupère le hash du mot de passe (Fonction asynchrone)
	 		const hash = await bcrypt.hash(requestHTTP.body.password,10)
	 		console.log(requestHTTP.body.pseudo + requestHTTP.body.login + hash)
	 		dbPlayer.createPlayer(new player(requestHTTP.body.pseudo, requestHTTP.body.login, hash))
	 		console.log("Redirect to login page")
	 		responseHTTP.redirect('/login')
	 	}catch(error){
	 		console.log(error)
	 		console.log("Erreur lors de la création")
	 		responseHTTP.redirect('/register')
	 	}
 	}else{
 		responseHTTP.redirect('/register?error=Login_Already_Used')
 	}

 	/* 
 	RAJOUTER CE Q4UIL FAUT POUR RENDRE LE PSEUDO UNIQUE
 	*/
})

router.post('/login',checkNotAuthenticated,passport.authenticate('local', { 
	successRedirect: '/',
    failureRedirect: '/login',
    badRequestMessage: 'Veuillez renseigner vos informations',
    failureFlash: true
}));


router.get('/login/github',
  passport.authenticate('github'));


router.get('/login/github/return', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(requestHTTP, responseHTTP) {
    // Successful authentication, redirect home.
    responseHTTP.redirect('/');
  });


router.get('/logout', function(requestHTTP, responseHTTP){
  requestHTTP.logout();
  responseHTTP.redirect('/');
});

router.get('/game1',checkAuthenticated, function(requestHTTP, responseHTTP, next){
	console.log(requestHTTP.user)
	responseHTTP.render('game1.ejs', {scoresList: dbGame.getGameOrCreateByname('game1'), bestPlayerScore: requestHTTP.user.scores.game1, playerPseudo: requestHTTP.user.pseudo})
})
router.post('/game1',checkAuthenticated,function(requestHTTP, responseHTTP){
	console.log(requestHTTP.body.clicksNumber)
	dbGame.updateGameScore(requestHTTP.user.pseudo,"game1",requestHTTP.body.clicksNumber)
	dbPlayer.updatePlayerScore(requestHTTP.user.login,"game1",requestHTTP.body.clicksNumber)
});
router.get('/game2',checkAuthenticated, function(requestHTTP, responseHTTP, next){
	console.log(requestHTTP.user)
	responseHTTP.render('game2.ejs', {scoresList: dbGame.getGameOrCreateByname('game2'), bestPlayerScore: requestHTTP.user.scores.game2, playerPseudo: requestHTTP.user.pseudo})
})
router.post('/game2',checkAuthenticated,function(requestHTTP, responseHTTP){
	console.log(requestHTTP.body.reactionTime)
	dbGame.updateGameScore(requestHTTP.user.pseudo,"game2",requestHTTP.body.reactionTime)
	dbPlayer.updatePlayerScore(requestHTTP.user.login,"game2",requestHTTP.body.reactionTime)
});

router.get('/admin', checkAuthenticated, isAdmin, function(requestHTTP, responseHTTP){
	console.log(dbPlayer.readPlayers())
  	responseHTTP.render('admin.ejs', {playersList: dbPlayer.readPlayers()})
});

router.get('/admin/ban/:login', checkAuthenticated, isAdmin, function(requestHTTP, responseHTTP){
	dbPlayer.deletePlayer(requestHTTP.params.login)
	responseHTTP.redirect('/admin')
});


//Middleware qui permet de vérifier si la joueur est connecté
function checkAuthenticated(requestHTTP, responseHTTP, next) {
  //Si le joueur
  if (requestHTTP.isAuthenticated()) {
    return next()
  }
  if(requestHTTP.cookies['login']){
  	  responseHTTP.redirect('/login')
  }else{
  	  responseHTTP.redirect('/register')
  }
}

function checkNotAuthenticated(requestHTTP, responseHTTP, next) {
  if (requestHTTP.isAuthenticated()) {
    return responseHTTP.redirect('/')
  }
  next()
}

function isAdmin(requestHTTP, responseHTTP, next){
	if(requestHTTP.user.role != "admin"){
		return responseHTTP.redirect('/')
	}
	next()
}


//Permet d'appeler le middleware routeur pour toutes les requêtes.
app.use('/',router)
app.use(express.static(__dirname + '/public'))

app.listen(process.env.PORT, function(){
	console.log("Server listening on port 3000")
})
