# PROJETJAVASCRIPT


Installation express :
npm install express

Installation EJS :
npm install ejs

Installation lowDB:
npm install lowdb

Lancer le serveur :
node index.js


Projet NodeJS :
Serveur de Jeux
Objectifs
A l’issue de ce projet, vous serez capables de
    • Mettre en place un serveur NodeJS
    • Fzaire une application web avec NodeJS et Express
    • Interfacer votre application web avec une base de donnée NoSql
Définition du Projet
Vous aller créer une application web qui propose aux utilisateurs de jouer à un jeu en Javascript sur son navigateur parmi une liste. L’apport de l’application est que le score du joueur sera stocké en base de donnée. Ainsi, vous pourrez effectuer un classement des joueurs par scores (et autres statistiques). 
Cas d’usages
    1. Un joueur s’identifie sur la plateforme à travers un formulaire. Si le joueur n’est jamais venu, un formulaire d’inscription lui est proposé.
    2. Un joueur identifié choisis un jeu dans une liste. Le high score et le score du joueur pour ce jeu sont présentés en face du nom du jeu.
    3. Le joueur joue et, à la fin de sa partie, son score est intégré dans le tableau des scores qui lui est présenté.
Recommandations
    1. Avant d’utiliser une base de données (NoSql), vous pouvez utiliser une classe temporaire  (stub)  simulant la BDD sous la forme d’une map ou d’un tableau.
    2. Pour le suivi de session, vous pouvez utiliser un cookie contenant l’identifiant du joueur (usurpation possible). De même le chiffrement de la communication (https) n’est pas nécessaire.
    3. Les jeux proposés ne sont pas notés. Un simple jeu de « + ou - » est acceptable.
    4. Une attention particulière sera portée à l’architecture de votre application (en particulier la partie « Modèle ») et la gestion des cas limites (Erreurs). Ainsi, vous devrez tenir compte que le modèle puisse rende sa réponse de façon asynchrone et qu’il peut lever des erreurs.
Bonus 
Pour aller plus loin, vous pouvez implémenter l’une ou l’autre de ces fonctionnalités 
    1. Un administrateur peut bannir un joueur à travers un formulaire accessible par lui seul.
    2. La session est bien implémentée du côté NodeJS avec une clef de session (rendant l’usurpation impossible).
    3. L’authentification du joueur se fait par Oauth et le  profil GitHub.
Livrables / Évaluation
Le projet se fait en binôme. Il n’y a pas de rapports, mais la livraison du code documenté (le code est la doc) et un screen-cast (utilisez OBS studio) pour faire une démonstration des fonctionnalités que vous aurez implémenté.
