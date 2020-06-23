$( document ).ready(function() {
  var gameState = false;
  var timeout;
  var initialTime;
  var cancelTimeout;
  function changeState(event){
  $('#clickArea').css({"background": "linear-gradient(45deg, #ffbd00, #ff9a00, #ff6d00, #ff3400)"})
  //Stocke la date pour mesurer la différence de temps ensuite
  initialTime = new Date().getTime();
  cancelTimeout = setTimeout(cancelGame,5000);
  }
  function rebuildBoard(){
  gameState = false;
  initialTime = 0
  $(".clique").show();
  $('#clickArea').css({"background": "linear-gradient(45deg, #ffbd00, #ff9a00, #ff6d00, #ff3400)"})
  }

  function cancelGame(){
    clearTimeout(timeout)
     $('#result').html("Vous devez cliquer lors du changement de couleur")
    rebuildBoard()
  }
  $("#clickArea").click(function(){
    $(".clique").hide();
  if(!gameState){
    //Demarre le jeu
    let randomDelay = Math.random()*10000;
    $('#clickArea').css({"background": "linear-gradient(45deg, #65635c, #3a3836, #2a2725, #151312)"})
    timeout = setTimeout(changeState,randomDelay)
    gameState = true
  }else{
    clearTimeout(cancelTimeout)
    if(initialTime > 0){
      let reactionTime = new Date().getTime() - initialTime
      updateScore(reactionTime);
      $('#result').html("Vous avez mis " + reactionTime + "ms")
    }else{
      $('#result').html("Trop rapide")
      clearTimeout(timeout);
    }
    rebuildBoard();
  }
  });

  $('#clickArea').on('click', function (e) {
      var left = e.pageX;
      var top = e.pageY;
      $('#clickArea').addClass('blop');
      setTimeout(function () {
          $('#clickArea').removeClass('blop');
      }, 100);
      $(this).append('<div class="dot" style="top:' + top + 'px;left:' + left + 'px;"></div>')
      setTimeout(function () {
          $('#clickArea .dot:first-of-type').remove();
      }, 3000);
  });

  //Fonction qui envoie de manière asynchrone le score au serveur
  function updateScore(reactionTime){
    if((reactionTime < bestPlayerScore) || bestPlayerScore == 0){
       var xhttp = new XMLHttpRequest();
      xhttp.open('POST', '/reaction', true)
      xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      let body = "reactionTime="+reactionTime
       xhttp.send(body);
      bestPlayerScore = reactionTime;
      $("#bestPlayerScore").html("Mon meilleur score : "+bestPlayerScore + " ms ")
      $("#currentPlayer").html(bestPlayerScore)
      if((reactionTime < highScore) || highScore == 0){
        highScore = reactionTime
        $("#bestGameScore").html("Meilleur score au jeu : "+highScore +" ms")
      }
    }
  }

});
