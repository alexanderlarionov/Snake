/*Adding inital events*/

window.addEventListener("load", init);

// window.onkeyup = function()
// {
//     handleKeyUp();
// };

//draw canvas and init snake
function init()
{
    console.log("INIT");
    window.mainCanvas = document.getElementById("mainCanvas");
    window.centerBlock = document.getElementById("centerBlock");
    window.ctx = mainCanvas.getContext('2d');

    window.centerBlock.style.width = '800';
    window.centerBlock.style.height = '600';
    $("#mainCanvas").attr('width', $("#centerBlock").width());
    $("#mainCanvas").attr('height', $("#centerBlock").height());

    if(window.mobilecheck.any()){
        window.handleMobile();
    }
    else{
        // $("#centerBlock").css('margin', "" + ($("body").height() / 2 - $("#centerBlock").height() / 2) + "px auto 0px auto");
        $("#centerBlock").css('margin-top', "" + ($("body").height() / 2 - $("#centerBlock").height() / 2) + "px");
    }

    $("#mainCanvas").hide();
    $("#startGameWrapper").show();

    $(".playButton").css('margin', "" + ($("#centerBlock").height() / 2 - $(".playButton").height() / 2) + "px auto 0px auto");
    $(".wastedBlock").css('margin', "" + ($("#centerBlock").height() / 2 - $(".playButton").height() / 2) + "px auto 0px auto");

    playerScoreLabel = $("#leftBlock .score .current .value");

    $(".playButton").on('click', function(){
        console.log("clicked");
        $("#startGameWrapper").hide();
        $("#leftBlock .score").css("visibility", "visible");
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
    initSnake();
    initStones();   
    if(getCookieWithName("bestScore")){
        $("#leftBlock .score .best .value").text(getCookieWithName("bestScore"));
    }
}
// //SnakeBodyPart class 
// function snakeBodyPart(x,y,edge, id)
// {
// 	this.x = x;
// 	this.y = y;
//     this.rectId = id;
// 	this.edge = edge;
// }

// //Snake class
// function Snake()
// {
//     this.length = 10;
//     this.bodyPartEdge = 20;
//     this.initialDirection = [1,0];
//     this.initialSpeed = 300; // in mili-seconds, frequency of redrawing;
//     this.bodyParts = []; 
//     this.breakPoint = [];
//     this.currentDirection = [];
//     this.regularMove = null;
// }

// //draw snake with N objects of snakeBodyPart's
// function initSnake()
// {
//     snake = new Snake();

//     for(var i = 0; i < snake.length; i++){
//         bodyPart = new snakeBodyPart(initPosX  - i * snake.bodyPartEdge, initPosY, snake.bodyPartEdge, i);
//         snake.bodyParts.push(bodyPart);
//     }
//     snake.head = snake.bodyParts[0];
//     snake.tail = snake.bodyParts[snake.length - 1];
//     snake.currentDirection = snake.initialDirection;
//     snake.initial = true;
//     initialSnakeMove = setInterval(function(){moveSnake(snake.initialDirection)}, snake.initialSpeed);
// }



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
    $("#wastedWrapper").css("visibility", "visible");
    $(document).on("click", function(){
        location.reload();
    });
}

function Stone(x, y, edge){
    this.x = x;
    this.y = y;
    this.edge = snake.bodyPartEdge;
    this.ID = 0;
}

function initStones(){
    stonesArray = [];
    IDCounter = 0;
    launchStoneFabric();
}

function launchStoneFabric(){
        stoneFabric = setInterval(function(){
        var stoneX = Math.floor((Math.random() * $("#centerBlock").width() / snake.bodyPartEdge) + 1);
        var stoneY = Math.floor((Math.random() * $("#centerBlock").height()  / snake.bodyPartEdge) + 1);
        stone = new Stone(stoneX * snake.bodyPartEdge, stoneY * snake.bodyPartEdge, snake.bodyPartEdge);
        stone.ID = IDCounter;
        IDCounter++;
        //  console.log("stone with ID " + stone.ID + " with coords: " + stone.x + " " + stone.y);
        ctx.fillStyle = "#666";
        ctx.fillRect(stone.x, stone.y, snake.bodyPartEdge, snake.bodyPartEdge);
        stonesArray.push(stone);
      }, 5000);
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
    }
    else{
        console.log("GAME RESUMED");
        snake.regularMove = setInterval(function(){moveSnake(snake.currentDirection)}, snake.initialSpeed); 
        launchStoneFabric();
        gamePaused = false;
        $("#centerBlock").removeClass("paused");
        $("#mainCanvas").animate({opacity: 1.0}, 400);
    }
}
  