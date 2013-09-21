window.mobilecheck =  {
   Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {

        return (window.mobilecheck.Android() || window.mobilecheck.BlackBerry() || window.mobilecheck.iOS() || window.mobilecheck.Opera() || window.mobilecheck.Windows());
    }
}


function swipeHandler (touches, direction) {
      switch(direction) {
        case "left":
            console.log("left");
            direction = [-1, 0];
            break;
        case "right":
            console.log("right");
            direction = [1, 0];
            break;
        case "up":
            console.log("up");
            direction = [0, -1];
            break;
        case "down":
            console.log("down");
            direction = [0, 1];
            break;
        default:
            direction = null;
            break;   
    }
     if(checkInverseDirection(direction))
    {
        changeDirection(direction);
    }
}


window.handleMobile  = function(){

    jester(window.mainCanvas, {swipeDistanse: 20, preventDefault: true}).swipe(swipeHandler);
}