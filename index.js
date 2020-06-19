const express = require('express')
const app = express()
const router = express.Router()


router.get('/', function(requestHTTP, responseHTTP, next){
	responseHTTP.render('home.ejs')
})

app.use('/',router)
app.use(express.static(__dirname + '/public'))

app.listen(3000, function(){
	console.log("Server listening on port 3000")
})

