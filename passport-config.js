//Importe le module pour la connexion locale
const LocalStrategy = require('passport-local').Strategy
//Importe le module pour connexion OAuth via github
const GitHubStrategy = require('passport-github').Strategy;
//Charge le module bcrypt qui permet de chiffrer les mots de passe (npm install bcrypt)
const bcrypt = require('bcrypt')


function initialize(passport, getPlayerByLogin, gitHubfindOrCreate){
	const authentificatePlayer = async(login, password, done) => {
		// Récupère une instance de joueur grâce au login (unique au sein de la base de données)
		let player = getPlayerByLogin(login);
		if(player == null){
			return done(null, false, { message: 'Login inexistant' })
		}

		try{
			//Compare le hash du mot de passe saisie et celui stocké dans la base de données
			if(await bcrypt.compare(password, player.hashedPassword)){
			 	return done(null, player)
			}
			else{
				//Si le hash n'est pas bon retourne 
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
	  },function(accessToken, refreshToken, profile, done) {
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

//Export la fonction inialize dans un module pour la rendre utilisable dans les autres fichiers
module.exports = initialize