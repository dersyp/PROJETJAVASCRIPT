//Importe le module pour la connexion locale
const LocalStrategy = require('passport-local').Strategy
//Importe le module pour connexion OAuth via github
const GitHubStrategy = require('passport-github').Strategy;
//Charge le module bcrypt qui permet de chiffrer les mots de passe (npm install bcrypt)
const bcrypt = require('bcrypt')

//Fonction qui permet l'authentification via l'utilisation de passport
function initialize(passport, getPlayerByLogin, gitHubfindOrCreate){
	const authentificatePlayer = async(login, password, done) => {
		// Récupère une instance de joueur grâce au login (unique au sein de la base de données)
		let player = getPlayerByLogin(login);
		if(player == null){
			//Si le joueur n'existe pas on renvoie un message d'erreur (affiché grâce à flash)
			return done(null, false, { message: 'Login inexistant' })
		}

		try{
			//Compare le hash du mot de passe saisie et celui stocké dans la base de données
			if(await bcrypt.compare(password, player.hashedPassword)){
				//Si le joueur n'existe pas on renvoie l'objet joueur récupéré dans la base de données
			 	return done(null, player)
			}
			else{
				//Si le hash n'est pas bon retourne un message d'erreur (affiché grâce à flash)
				return done(null, false, { message: 'Mauvais mot de passe' })
			}
		}catch(e){
			return done(e)
		}
	}
	// Ajoute l'utilisation de la statégie locale pour la connexion via passport
	passport.use(new LocalStrategy({usernameField: 'login'},authentificatePlayer))
	// Ajoute l'utilisation de la statégie oAuth de github pour la connexion via passport
	passport.use(new GitHubStrategy({
	//Informations necessaires pour utiliser Oauth de github (récupéré sur leurs site)
    clientID: '356367cf9e51be1ba1b0',
    clientSecret: 'c7d4a50f627839695d9e99aeb69b91d69128c3a2',
    callbackURL: "http://localhost:3000/login/github/return"
	  },function(accessToken, refreshToken, profile, done) {
	  	//Lorsque que la connexion créé ou trouve un joueur associé aux informations de gitHub
	    let player = gitHubfindOrCreate(profile.id, profile.username);
	    return done(null, player);
	  }
	));
	//Définition des méthodes serialize/deserialize pour transporter l'objet joueur dans la session
	passport.serializeUser((player,done) => done(null, player.login))
	passport.deserializeUser((login, done) => {
		return done(null, getPlayerByLogin(login))
	})
}

//Export la fonction inialize dans un module pour la rendre utilisable dans les autres fichiers
module.exports = initialize