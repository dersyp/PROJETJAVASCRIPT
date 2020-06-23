$( document ).ready(function() {
  var gameState = false;
  var initialDateSeconds;
  var initialDateMicroSeconds;
  var endDateSeconds;
  var endDateMicroSeconds;
  var timeout;
   function changeState(){
    $('#clickArea').css({"background": "linear-gradient(45deg, #ffbd00, #ff9a00, #ff6d00, #ff3400)"})
    //Stocker une date
    initialDateSeconds = new Date().getSeconds();
    initialDateMicroSeconds = new Date().getMilliseconds();
   }
   function rebuildBoard(){
    $(".clique").show();
    $('#clickArea').css({"background": "linear-gradient(45deg, #ffbd00, #ff9a00, #ff6d00, #ff3400)"})
   }


    $("#clickArea").click(function(){
      $(".clique").hide();
    if(!gameState){
      //Start the game
      let randomDelay = Math.random()*10000;
      $('#clickArea').css({"background": "linear-gradient(45deg, #65635c, #3a3836, #2a2725, #151312)"})
      timeout = setTimeout(changeState,randomDelay)
      gameState = true
    }else{
      endDateSeconds = new Date().getSeconds();
      endDateMicroSeconds = new Date().getMilliseconds();
      if(initialDateSeconds){
        $('#result').html("Vous avez mis"+(endDateSeconds-initialDateSeconds)+","+(endDateMicroSeconds-initialDateMicroSeconds))
      }else{
        $('#result').html("Trop rapide")
        clearTimeout(timeout);
      }
      rebuildBoard();
      gameState = false;
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
