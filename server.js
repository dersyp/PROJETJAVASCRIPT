const express = require('express')
const app = express()
const router = express.Router()
const bcrypt = require('bcrypt')
const player_service = require('./models/player_service.js')
const player = require('./models/player.js')

const dbPlayer = new player_service()
const passport = require('passport')

const initializePassport = require('./passport-config.js');
initializePassport(passport, dbPlayer.getPlayerByLogin)

//https://github.com/expressjs/body-parser#bodyparserurlencodedoptions
app.use(express.urlencoded({ extended: false }))

app.set('view-engine', 'ejs')
router.get('/', function(requestHTTP, responseHTTP, next){
	responseHTTP.render('home.ejs')
})

router.get('/login', function(requestHTTP, responseHTTP, next){
	responseHTTP.render('login.ejs')
})
router.get('/register', function(requestHTTP, responseHTTP, next){
	responseHTTP.render('register.ejs')
})

router.post('/register', async function(requestHTTP, responseHTTP, next){
 	// traitement inscription 
 	console.log("Inscription ")
 	console.log(requestHTTP.body)
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
})

router.post('/login',passport.authenticate('local', { 
	successRedirect: '/',
    failureRedirect: '/login'
    failureFlash: true
}));

//Fonction de test 
router.post('/find', function(requestHTTP, responseHTTP, next){
	dbPlayer.getPlayerByLogin(requestHTTP.body.login);
})




app.use('/',router)
app.use(express.static(__dirname + '/public'))

app.listen(3000, function(){
	console.log("Server listening on port 3000")
})