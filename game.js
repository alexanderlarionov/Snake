/*Adding inital events*/

window.addEventListener("load", init);

window.onresize = function(event) {
    layout();
};

function layout() {
    $("#mainCanvas").attr('width', $("#centerBlock").width());
    $("#mainCanvas").attr('height', $("#centerBlock").height());
    
    $("#playButton").css('margin', "" + ($("#centerBlock").height() / 2 - $("#playButton").height() / 2) + "px auto 0px auto");
    $(".wastedBlock").css('margin', "" + ($("#centerBlock").height() / 2 - $("#playButton").height() / 2) + "px auto 0px auto");
}

var gameStarted = false;

//draw canvas and init snake
function init()
{
    console.log("INIT");
    window.mainCanvas = document.getElementById("mainCanvas");
    window.centerBlock = document.getElementById("centerBlock");
    window.ctx = mainCanvas.getContext('2d');
    
    if(window.mobilecheck.any()){
        window.handleMobile();
    }
    else{
        $("#centerBlock").css('margin-top', "" + ($("body").height() / 2 - $("#centerBlock").height() / 2) + "px");
    }
    
    document.querySelector("#startGameWrapper").style.display = "none";
    
    layout();
    
    $("#mainCanvas").hide();
    $("#startGameWrapper").show();
    
    playerScoreLabel = $("#score .current .value");
    
    $("#playButton").on('click', function(){
                        console.log("clicked");
                        $("#startGameWrapper").hide();
                        $("#score").css("visibility", "visible");
                        startGame();
                        });
    
    $(window).on("keyup", function(){
                 handleKeyUp()
                 });
}

function startGame(){
    $("#mainCanvas").show();
    initPosX = 300;
    initPosY = 300;
    playerScore = 0;
    gamePaused = false;
    gameStarted = true;
    initSnake();
    initStones();
    if(getCookieWithName("bestScore")){
        $("#score .best .value").text(getCookieWithName("bestScore"));
    }
    StartGestures();
}

/*Changes direction on arrow/wasd key pressed*/
function handleKeyUp(event)
{
    if (!event)
        event = window.event;
    var code = event.keyCode;
    if (event.charCode && code == 0)
        code = event.charCode;
    // console.log(code);
    
    switch(code) {
        case 37: case 97:
            // console.log("left");
            direction = [-1, 0];
            break;
        case 39: case 100:
            // console.log("right");
            direction = [1, 0];
            break;
        case 38: case 119:
            // console.log("up");
            direction = [0, -1];
            break;
        case 40: case 115:
            // console.log("down");
            direction = [0, 1];
            break;
        case 32: case 13:
            //on press "Space" or "Enter" game pauses
            if(typeof gamePaused !== "undefined"){
                togglePauseGame();
            }
        default:
            direction = null;
            break;
    }
    event.preventDefault();
    
    if(checkInverseDirection(direction))
    {
        changeDirection(direction);
    }
    disallowChangeDirection = true;
}


function showWastedAlert(){
    window.webkit.messageHandlers.wasted.postMessage("You died");
    $("#wastedWrapper").css("visibility", "visible");
    $("#wastedWrapper").on("click", function() {
        clear();
        init();
        $("#wastedWrapper").css("visibility", "hidden");
        $("#startGameWrapper").hide();
        $("#score").css("visibility", "visible");
        startGame();
    });
}


function stopGame(){
    if(typeof initialSnakeMove !== 'undefined')
    {
        clearInterval(initialSnakeMove);
    }
    // clearInterval(initialSnakeMove);
    if(snake.regularMove !== null){
        clearInterval(snake.regularMove);
    }
    if(typeof stoneFabric !== 'undefined'){
        console.log("clear stoneFabric");
        clearInterval(stoneFabric);
    }
    $(window).unbind("keyup");
    StopGestures();
}

function submitHighScoreToCookies(score){
    if(score > getCookieWithName("bestScore")){
        document.cookie = "bestScore=" + score + ";";
    }
}


function getCookieWithName(name){
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : null;
}

function togglePauseGame(){
    if(!gamePaused){
        console.log("GAME PAUSED");
        if(snake.regularMove !== null){
            console.log("clear regularMove");
            clearInterval(snake.regularMove);
        }
        else if(initialSnakeMove !== null){
            clearInterval(initialSnakeMove);
        }
        if(typeof stoneFabric !== 'undefined'){
            console.log("clear stoneFabric");
            clearInterval(stoneFabric);
        }
        gamePaused = true;
        $("#centerBlock").addClass("paused");
        $("#mainCanvas").animate({opacity: 0.6}, 400);
        StopGestures();
    }
    else{
        console.log("GAME RESUMED");
        snake.regularMove = setInterval(function(){moveSnake(snake.currentDirection)}, snake.initialSpeed);
        launchStoneFabric();
        gamePaused = false;
        $("#centerBlock").removeClass("paused");
        $("#mainCanvas").animate({opacity: 1.0}, 400);
        StartGestures();
    }
}


function client_callback_pause() {
    let animatable = document.querySelectorAll(".animatable");
    
    animatable.forEach(function(el){
        if (el.style.WebkitAnimationPlayState != "paused") {
            el.style.WebkitAnimationPlayState = "paused";
        }
    });
    
    if (gameStarted === true) {
        togglePauseGame();
    }
}

function client_callback_resume() {
    let animatable = document.querySelectorAll(".animatable");
    animatable.forEach(function(el){
       if (el.style.WebkitAnimationPlayState == "paused") {
            el.style.WebkitAnimationPlayState = "running";
       }
    });
    
    if (gameStarted === true) {
        togglePauseGame();
    }
}

function client_callback_run() {
    $("#startGameWrapper").hide();
    $("#score").css("visibility", "visible");
    startGame();
}
