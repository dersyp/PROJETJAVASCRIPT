const express = require('express')
const app = express()
const router = express.Router()

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

router.post('/register', function(requestHTTP, responseHTTP, next){
 // traitement
})

router.post('/login', function(requestHTTP, responseHTTP, next){
// traitement
})


app.use('/',router)
app.use(express.static(__dirname + '/public'))

app.listen(3000, function(){
	console.log("Server listening on port 3000")
})

