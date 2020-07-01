# PROJETJAVASCRIPT

Groupe de projet : Clément HYAUMET, Mathieu TERMET

Installation express :
npm install express

Installation EJS :
npm install ejs

Installation lowDB:
npm install lowdb

Installation de bcrypt(Permet de gérer les hash des mots de passe):
npm install bcrypt 


Installation de passport:
npm install passport

Installtion de passport-local :
npm install passport-local


Installation de express-session : (Pour rendre notre connexion persistente)
npm install express-session

Installation de express-flash : (Pour afficher les erreurs de mot de passe)
npm install express-flash

Installation de dotenv : (Permet de charger les variables d'environnement du fichier .env)
npm install dotenv

Installation de cookie-parser (Pour gérer les cookies, cf : https://www.geeksforgeeks.org/http-cookies-in-node-js/)
npm install cookie-parser

Installation de passport-github (http://www.passportjs.org/packages/passport-github/) : pour le oAuth
npm install passport-github


Lancer le serveur :
node server.js


Explication serialize - deserialize :
https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize


http://www.passportjs.org/docs/


+----------------------------------+---------+------------------------+----------------+
|               Col1               |  Col2   |          Col3          | Numeric Column |
+----------------------------------+---------+------------------------+----------------+
| Value 1                          | Value 2 | 123                    |           10.0 |
| Separate                         | cols    | with a tab or 4 spaces |       -2,027.1 |
| This is a row with only one cell |         |                        |                |
+----------------------------------+---------+------------------------+----------------+
