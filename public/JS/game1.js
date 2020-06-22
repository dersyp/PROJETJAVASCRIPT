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
           $(".clique").show();
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
      $(".clique").hide();
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


});
