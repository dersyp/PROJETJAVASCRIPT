//Permet de charger les variables d'envrironnement 
 require('dotenv').config();

/*
	TO DO : 
	- Rajouter le port et d'autres variables dans le fichier .env
	-http://www.passportjs.org/packages/passport-github/

*/ 
const express = require('express')
const app = express()
const router = express.Router()
const bcrypt = require('bcrypt')
const player_service = require('./models/player_service.js')
const player = require('./models/player.js')
const flash = require('express-flash')
const session = require('express-session')
const dbPlayer = new player_service()
const passport = require('passport')
const cookieparser = require('cookie-parser')
const Game_service = require('./models/game_service.js')
const dbGame = new Game_service()
app.set('view-engine', 'ejs')
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
initializePassport(passport, dbPlayer.getPlayerByLogin)

router.get('/', checkAuthenticated, function(requestHTTP, responseHTTP, next){
	console.log("HOME PAGE ")
	responseHTTP.cookie('login', requestHTTP.user.login);
	responseHTTP.render('home.ejs',{pseudo: requestHTTP.user.pseudo})
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
	responseHTTP.render('game1.ejs', {scoresList: dbGame.getGameByname('game1'), bestPlayerScore: requestHTTP.user.scores.game1, playerPseudo: requestHTTP.user.pseudo})
})
router.post('/game1',checkAuthenticated,function(requestHTTP, responseHTTP){
	console.log(requestHTTP.body.clicksNumber)
	dbGame.updateGameScore(requestHTTP.user.pseudo,"game1",requestHTTP.body.clicksNumber)
	dbPlayer.updatePlayerScore(requestHTTP.user.login,"game1",requestHTTP.body.clicksNumber)
});


function checkAuthenticated(requestHTTP, responseHTTP, next) {
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

app.use('/',router)
app.use(express.static(__dirname + '/public'))

app.listen(3000, function(){
	console.log("Server listening on port 3000")
})
