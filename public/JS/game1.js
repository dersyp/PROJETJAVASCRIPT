$( document ).ready(function() {
  var countClick = 0;
  var gameState = false;
  function startTimer() {
    let seconds = 0;
    let t = setInterval(timer, 1000);
     function timer(){
      seconds = seconds + 1;
       $('#timer').html("Temps : " + seconds + " secondes");
       if(seconds >= 5){
         clearInterval(t)
          var xhttp = new XMLHttpRequest();
          xhttp.open('POST', '/game1', true)
          xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          let body = "clicksNumber="+countClick
          console.log(body)
          xhttp.send(body);
         $('#scorePlayer').html("Score final : "+ countClick)
          gameState = false;
       }
    }
   }


  $("#clickArea").click(function(){
    if(!gameState){
      startTimer();
      $('#scorePlayer').html("");
      countClick = 0;
      gameState = true;
    }else{
      $('#scorePlayer').html("Score : "+ countClick)
      countClick++;
      console.log(countClick);
    }
  });


});