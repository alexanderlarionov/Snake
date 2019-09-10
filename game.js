/*Adding inital events*/

window.addEventListener("load", init);

window.onresize = function(event) {
    layout();
};

var gameStarted = false;

//draw canvas and init snake
function init()
{
    console.log("INIT");
    window.mainCanvas = document.getElementById("mainCanvas");
    window.centerBlock = document.getElementById("centerBlock");
    window.ctx = mainCanvas.getContext('2d');
    
    window.handleMobile();
    if (!window.mobilecheck.any()) {
        marginTop = "" + document.querySelector("body").offsetHeight / 2 - document.querySelector("#centerBlock").offsetHeight / 2 + "px";
        document.querySelector("#centerBlock").style.marginTop = marginTop;
    }
    
    document.querySelector("#mainCanvas").style.visibility = "hidden";

    
    layout();

    playerScoreLabel = document.querySelector("#score .current .value");
    
//    document.querySelector("#startGameWrapper").style.display = "none";
    
    document.querySelector("#playButton").addEventListener("click", function(){
         console.log("clicked");
         document.querySelector("#startGameWrapper").style.display = "none";
         document.querySelector("#score").style.visibility = "visible";
         startGame();
    });
    
    window.addEventListener("keyup", handleKeyUp);
}

function layout() {
    document.querySelector("#mainCanvas").style.width = document.querySelector("#centerBlock").offsetWidth;
    document.querySelector("#mainCanvas").style.height = document.querySelector("#centerBlock").offsetHeight;
    
    
    document.querySelector("#mainCanvas").width = document.querySelector("#centerBlock").offsetWidth;
    document.querySelector("#mainCanvas").height = document.querySelector("#centerBlock").offsetHeight;
    
    margin = "" + (document.querySelector("#centerBlock").offsetHeight / 2 - document.querySelector("#playButton").offsetHeight / 2) + "px auto 0px auto";
    
    document.querySelector("#playButton").style.margin = margin;
    document.querySelector(".wastedBlock").style.margin = margin;
}

function startGame(){
    document.querySelector("#mainCanvas").style.visibility = "visible";
    initPosX = 300;
    initPosY = 300;
    playerScore = 0;
    gamePaused = false;
    gameStarted = true;
    initSnake();
    initStones();
    if(getCookieWithName("bestScore")){
        document.querySelector("#score .best .value").text(getCookieWithName("bestScore"));
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
    StopGestures();
    document.querySelector("#wastedWrapper").style.visibility = "visible";
    
    if (window.webkit !== undefined && window.webkit.messageHandlers.inAppActions != undefined) {
        window.webkit.messageHandlers.inAppActions.postMessage({"action_name":"wasted"});
    }
    
    document.querySelector("#wastedWrapper").addEventListener("click", function() {
        clear();
        init();
        document.querySelector("#wastedWrapper").style.visibility = "hidden";
        document.querySelector("#score").style.visibility = "visible";
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
    
    if (moveSnake != undefined) {
        clearInterval(moveSnake);
    }
    
    window.removeEventListener("keyup", handleKeyUp);
    StopGestures();
}

function submitHighScoreToCookies(score){
    if(score > getCookieWithName("bestScore")){
        document.cookie = "bestScore=" + score + ";";
    }
    
    if (score === 100 && window.webkit !== undefined && window.webkit.messageHandlers.inAppActions != undefined) {
        window.webkit.messageHandlers.inAppActions.postMessage({"action_name":"hit100"});
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
        document.querySelector("#centerBlock").addClass("paused");
        document.querySelector("#mainCanvas").animate({opacity: 0.6}, 400);
        StopGestures();
    }
    else{
        console.log("GAME RESUMED");
        snake.regularMove = setInterval(function(){moveSnake(snake.currentDirection)}, snake.initialSpeed);
        launchStoneFabric();
        gamePaused = false;
        document.querySelector("#centerBlock").removeClass("paused");
        document.querySelector("#mainCanvas").animate({opacity: 1.0}, 400);
        StartGestures();
    }
}


function client_message_pause() {
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

function client_message_resume() {
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

function client_message_launch() {
    document.querySelector("#startGameWrapper").display = "none";
    document.querySelector("#score").style.visibility = "visible";
    startGame();
}
