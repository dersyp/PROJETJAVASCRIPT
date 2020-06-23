$( document ).ready(function() {
  var countClick = 0;
  var gameState = false;

  function startTimer() {

    let seconds = 0;
    $('#timer').html("Temps : " + seconds + " secondes");
    let t = setInterval(timer, 1000);
     function timer(){
      seconds = seconds + 1;
       $('#timer').html("Temps : " + seconds + " secondes");
       if(seconds >= 5){
           $('.clique').html('Clique pour rejouer !');
           $(".clique").show();
           $("#clickArea").off('click');
         clearInterval(t)
          if(countClick > bestPlayerScore){
            var xhttp = new XMLHttpRequest();
            xhttp.open('POST', '/clicker', true)
            xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            let body = "clicksNumber="+countClick
            xhttp.send(body);
            bestPlayerScore = countClick;
            $("#bestPlayerScore").html("Mon meilleur score : "+bestPlayerScore)
            $("#currentPlayer").html(bestPlayerScore)
            if(countClick > highScore){
              highScore = countClick
              $("#bestGameScore").html("Meilleur score au jeu : "+highScore)
            }
          }
         $('#scorePlayer').html("Score final : "+ countClick)
          gameState = false;
           setTimeout(function () {
               $('#clickArea').on('click', clicker);
           }, 2000);

       }
    }
   }

    function clicker(e){
        $(".clique").hide();
        if(!gameState){
            startTimer();
            countClick = 1;
            $('#scorePlayer').html("Score : "+ countClick)
            gameState = true;
        }else{
            $('#scorePlayer').html("Score : "+ countClick)
            countClick++;
            console.log(countClick);
        }
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
    }
    $('#clickArea').on('click', clicker);



});
