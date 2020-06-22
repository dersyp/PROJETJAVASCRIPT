const LocalStrategy = require('passport-local').Strategy
var GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcrypt')

function initialize(passport, getPlayerByLogin, gitHubfindOrCreate){
	const authentificatePlayer = async(login, password, done) => {
		let player = getPlayerByLogin(login);
		if(player == null){
			console.log("Le login du joueur qui a tenté de se connecter n'existe pas ")
			return done(null, false, { message: 'Login inexistant' })
		}

		try{
			if(await bcrypt.compare(password, player.hashedPassword)){
				console.log("Authentification bonne")
			 	return done(null, player)
			}
			else{
				console.log("Login bon mais mot de passe incorrect")
				return done(null, false, { message: 'Mauvais mot de passe' })
			}
		}catch(e){
			return done(e)
		}
	}

	passport.use(new LocalStrategy({usernameField: 'login'},authentificatePlayer))

	passport.use(new GitHubStrategy({
    clientID: '356367cf9e51be1ba1b0',
    clientSecret: 'c7d4a50f627839695d9e99aeb69b91d69128c3a2',
    callbackURL: "http://localhost:3000/login/github/return"
	  },
	  function(accessToken, refreshToken, profile, done) {
	  	//https://www.it-swarm.dev/fr/node.js/que-fait-la-fonction-user.findorcreate-et-quand-est-elle-appelee-dans-le-passeport/1042514405/
	  	console.log(profile)
	    let player = gitHubfindOrCreate(profile.id, profile.username);
	    return done(null, player);
	  }
	));
	passport.serializeUser((player,done) => done(null, player.login))
	passport.deserializeUser((login, done) => {
		return done(null, getPlayerByLogin(login))
	})
}

module.exports = initialize