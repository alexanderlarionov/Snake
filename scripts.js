/*Adding inital events*/

window.addEventListener("load", init);

window.onkeyup = function()
{
    handleKeyUp();
};

//draw canvas and init snake
function init()
{
    console.log("INIT");
    window.mainCanvas = document.getElementById("mainCanvas");
    window.mainWrapper = document.getElementById("mainWrapper");
    window.ctx = mainCanvas.getContext('2d');

    window.mainWrapper.style.width = '800';
    window.mainWrapper.style.height = '600';
    $("#mainCanvas").attr('width', $("#mainWrapper").width());
    $("#mainCanvas").attr('height', $("#mainWrapper").height());

    if(window.mobilecheck.any()){
        window.handleMobile();
    }
    else{
        $("#mainWrapper").css('margin', "" + ($("body").height() / 2 - $("#mainWrapper").height() / 2) + "px auto 0px auto");
    }

    $("#mainCanvas").hide();
    $("#startGameWrapper").show();
    $(".playButton").css('margin', "" + ($("#mainWrapper").height() / 2 - $(".playButton").height() / 2) + "px auto 0px auto");
    $(".playButton").on('click', function(){
        console.log("clicked");
        $("#startGameWrapper").hide();
        startGame();
    });
}

function startGame(){
    $("#mainCanvas").show();
    initPosX = 300;
    initPosY = 300;

    initSnake();
    initStones();   
}
//SnakeBodyPart class 
function snakeBodyPart(x,y,edge, id)
{
	this.x = x;
	this.y = y;
    this.rectId = id;
	this.edge = edge;
}

//Snake class
function Snake()
{
    this.length = 15;
    this.bodyPartEdge = 20;
    this.initialDirection = [1,0];
    this.initialSpeed = 300; // in mili-seconds, frequency of redrawing;
    this.bodyParts = []; 
    this.breakPoint = [];
    this.currentDirection = [];
}

//draw snake with N objects of snakeBodyPart's
function initSnake()
{
    snake = new Snake();

    for(var i = 0; i < snake.length; i++){
        bodyPart = new snakeBodyPart(initPosX  - i * snake.bodyPartEdge, initPosY, snake.bodyPartEdge, i);
        snake.bodyParts.push(bodyPart);
    }
    snake.head = snake.bodyParts[0];
    snake.tail = snake.bodyParts[snake.length - 1];
    snake.currentDirection = snake.initialDirection;
    snake.initial = true;
    initialSnakeMove = setInterval(function(){moveSnake(snake.initialDirection)}, snake.initialSpeed);
}



/*Changes direction on arrow/wasd key pressed*/
function handleKeyUp(event)
{
    if (!event)
        event = window.event;
    var code = event.keyCode;
    if (event.charCode && code == 0)
        code = event.charCode;

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
function changeDirection (direction) 
{
    snake.breakPoint = [snake.head.x, snake.head.y];
    snake.currentDirection = direction;
    // console.log("breakPoint is = ", snake.breakPoint);    
    // if(directionChanged) {
    if(typeof initialSnakeMove !== 'undefined')
    {
        clearInterval(initialSnakeMove); 
    }
    // clearInterval(initialSnakeMove);
    if(typeof regularMove!== 'undefined'){
        clearInterval(regularMove);
    }

    regularMove = setInterval(function(){moveSnake(direction)}, snake.initialSpeed);  
}


//Disallow movement in inverse and repeated direction
function checkInverseDirection(direction)
{
    var acceptChangeDirection = true;

    acceptChangeDirection = typeof direction !== 'undefined' && direction !== null && (direction[0] !== snake.currentDirection[0] || direction[1] !== snake.currentDirection[1]) && !(direction[0] * (-1) == snake.currentDirection[0] || direction[1] * (-1) == snake.currentDirection[1]) && !disallowChangeDirection; 

    return acceptChangeDirection;
}

/*Main drawing methods*/
function moveSnake(direction)
{
    var currentDirection;    
    ctx.clearRect(snake.tail.x, snake.tail.y, snake.tail.edge + 1, snake.tail.edge + 1);

    for(var i = snake.length - 1; i >= 1; i--){
        snake.bodyParts[i].x = snake.bodyParts[i - 1].x;
        snake.bodyParts[i].y = snake.bodyParts[i - 1].y;          
    }
    snake.head.x += snake.bodyPartEdge * direction[0];
    snake.head.y += snake.bodyPartEdge * direction[1];


    /*Eating stones*/
    for(var i = 0; i < stonesArray.length; i++){
        //console.log("stone.x = " + stonesArray[i].x + " and snake.head.x = " + snake.head.x);
        if(stonesArray[i].x == snake.head.x && stonesArray[i].y == snake.head.y){
            
            bodyPart = new snakeBodyPart(snake.tail.x + snake.bodyPartEdge * direction[0], snake.tail.y + snake.bodyPartEdge * direction[1], snake.bodyPartEdge, snake.length - 1);
            snake.bodyParts.push(bodyPart);
            snake.tail = bodyPart;
            console.log("snake ate stone withID: " + stonesArray[i].ID);
            snake.length++;
            stonesArray.splice(i,1);
        }
    }

    drawSnakeBodyPart();
    /*If snake bites itself*/
    for(var i = 0; i < snake.length; i++){
        //bites from top
        if(snake.head.x == snake.bodyParts[i].x && snake.head.y + snake.bodyPartEdge == snake.bodyParts[i].y && snake.currentDirection[1] == 1){
            alert("WASTED");
            stopGame();
        }
        //bites from bottom  
        if(snake.head.x == snake.bodyParts[i].x && snake.head.y - snake.bodyPartEdge == snake.bodyParts[i].y && snake.currentDirection[1] == -1){
            alert("WASTED");
            stopGame();
        }
        //bites from left
        if(snake.head.x + snake.bodyPartEdge == snake.bodyParts[i].x && snake.head.y == snake.bodyParts[i].y && snake.currentDirection[0] == 1){
            alert("WASTED");
            stopGame();
        }   
        //bites from right
        if(snake.head.x - snake.bodyPartEdge == snake.bodyParts[i].x && snake.head.y == snake.bodyParts[i].y && snake.currentDirection[0] == -1){
            alert("WASTED");
            stopGame();
        }     
    }

    /*If snake goes through canvasBorders*/

    //left border
    if(snake.head.x < 0 && snake.currentDirection[0] == -1) {
        alert("WASTED");
        stopGame();
    }

    //right border
    else if(snake.head.x >  mainCanvas.width &&  snake.currentDirection[0] == 1){
        alert("WASTED");
        stopGame();
    }

    //top border
   if(snake.head.y < 0 && snake.currentDirection[1] == -1) {
        alert("WASTED");
        stopGame();
    }

    //bottom border
    else if(snake.head.y > mainCanvas.height && snake.currentDirection[1] == 1){
        alert("WASTED");
        stopGame();
    }
   
    // drawSnake();
}

function drawSnakeBodyPart(){
    disallowChangeDirection = false;
    for(var number = 0; number < snake.length; number++){
        // if(snake.bodyParts[number] == snake.tail){
        //     ctx.fillStyle = '#00f';
        // }
        // else if(snake.bodyParts[number] == snake.head){
        //     ctx.fillStyle = '#f00';
        // }
        // else{
            ctx.fillStyle = '#634497';
       // }
        ctx.fillRect(snake.bodyParts[number].x,snake.bodyParts[number].y,snake.bodyParts[number].edge, snake.bodyParts[number].edge);
     }
}   



function Stone(x, y, edge){
    this.x = x;
    this.y = y;
    this.edge = snake.bodyPartEdge;
    this.ID = 0;
}

function initStones(){
    stonesArray = [];
    var IDCounter = 0;

    stoneFabric = setInterval(function(){
        var stoneX = Math.floor((Math.random() * $("#mainWrapper").width() / snake.bodyPartEdge) + 1);
        var stoneY = Math.floor((Math.random() * $("#mainWrapper").height()  / snake.bodyPartEdge) + 1);
        stone = new Stone(stoneX * snake.bodyPartEdge, stoneY * snake.bodyPartEdge, snake.bodyPartEdge);
        stone.ID = IDCounter;
        IDCounter++;
        //  console.log("stone with ID " + stone.ID + " with coords: " + stone.x + " " + stone.y);
        ctx.fillStyle = "#666";
        ctx.fillRect(stone.x, stone.y, snake.bodyPartEdge, snake.bodyPartEdge);
        stonesArray.push(stone);
      }, 10000);
}

function stopGame(){
    if(typeof initialSnakeMove !== 'undefined')
    {
        clearInterval(initialSnakeMove); 
    }
    // clearInterval(initialSnakeMove);
    if(typeof regularMove !== 'undefined'){
        clearInterval(regularMove);
    }
    if(typeof stoneFabric !== 'undefined'){
        console.log("clear stoneFabric");
        clearInterval(stoneFabric);
    }

    location.reload();
}


  