var gesturesManager;

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

function swipeHandler (direction) {
      switch(direction) {
        case "left":
            direction = [-1, 0];
            break;
        case "right":
            direction = [1, 0];
            break;
        case "up":
            direction = [0, -1];
            break;
        case "down":
            direction = [0, 1];
            break;
        default:
            direction = null;
            break;   
    }
    
    if (checkInverseDirection(direction)) {
        changeDirection(direction);
    }
}

window.handleMobile = function() {
    gesturesManager = new Hammer.Manager(document.querySelector('#mainWrapper'));
    var swipe = new Hammer.Swipe();
    gesturesManager.add(swipe);
    gesturesManager.on('swipe', function(e) {
        if (e.direction === 8) {
            swipeHandler("up");
        } else if (e.direction === 16) {
            swipeHandler("down");
        } else if (e.direction === 2) {
            swipeHandler("left");
        } else if (e.direction === 4) {
            swipeHandler("right");
        }
    });
    
    StopGestures();
}

function StartGestures() {
    gesturesManager.set({enable: true});
}

function StopGestures() {
    gesturesManager.set({enable: false});
}
