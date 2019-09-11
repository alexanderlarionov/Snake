//Snake class
function Snake() {
    this.length = 10;
    this.bodyPartEdge = 20;
    this.initialDirection = [1,0];
    this.initialSpeed = 300; // in mili-seconds, frequency of redrawing;
    this.bodyParts = [];
    this.breakPoint = [];
    this.currentDirection = [];
    this.regularMove = null;
}

//SnakeBodyPart class
function snakeBodyPart(x,y,edge, id) {
	this.x = x;
	this.y = y;
    this.rectId = id;
	this.edge = edge;
}

//inits snake with N objects of snakeBodyPart's
function initSnake() {
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

function changeDirection (direction) {
    snake.breakPoint = [snake.head.x, snake.head.y];
    snake.currentDirection = direction;

    var moved = moveSnake(direction);

    if (moved) {
        if(typeof initialSnakeMove !== 'undefined') {
            clearInterval(initialSnakeMove);
        }
        // clearInterval(initialSnakeMove);
        if(snake.regularMove !== null) {
            clearInterval(snake.regularMove);
        }

        if (moveSnake != undefined) {
            clearInterval(moveSnake);
        }

        snake.regularMove = setInterval(function(){moveSnake(direction)}, snake.initialSpeed);
    }
}

//Disallow movement in inverse and repeated direction
function checkInverseDirection(direction) {
    var acceptChangeDirection = true;

    acceptChangeDirection = typeof direction !== 'undefined' && direction !== null && (direction[0] !== snake.currentDirection[0] || direction[1] !== snake.currentDirection[1]) && !(direction[0] * (-1) == snake.currentDirection[0] || direction[1] * (-1) == snake.currentDirection[1]) && !disallowChangeDirection;

    return acceptChangeDirection;
}

/*Main drawing methods*/
function moveSnake(direction) {
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
            snake.initialSpeed -= 10;
            playerScore +=10;
            $(playerScoreLabel).text(playerScore);
            submitHighScoreToCookies(playerScore);
        }
    }

    drawSnakeBodyPart();
    /*If snake bites itself*/
    for(var i = 0; i < snake.length; i++){
        let bitesFromTop = snake.head.x == snake.bodyParts[i].x && snake.head.y + snake.bodyPartEdge == snake.bodyParts[i].y && snake.currentDirection[1] == 1;
        let bitesFromBottom = snake.head.x == snake.bodyParts[i].x && snake.head.y - snake.bodyPartEdge == snake.bodyParts[i].y && snake.currentDirection[1] == -1;
        let bitesFromLeft = snake.head.x + snake.bodyPartEdge == snake.bodyParts[i].x && snake.head.y == snake.bodyParts[i].y && snake.currentDirection[0] == 1;
        let bitesFromRight = snake.head.x - snake.bodyPartEdge == snake.bodyParts[i].x && snake.head.y == snake.bodyParts[i].y && snake.currentDirection[0] == -1;

        if (bitesFromTop || bitesFromBottom || bitesFromLeft || bitesFromRight) {
          showWastedAlert();
          stopGame();
          return false;
        }
    }

    /*If snake goes through canvasBorders*/

    //left border
    let hitLeftBorder = snake.head.x < 0 && snake.currentDirection[0] == -1;
    let hitRightBorder = snake.head.x >  mainCanvas.offsetWidth &&  snake.currentDirection[0] == 1;
    let hitTopBorder = snake.head.y < 0 && snake.currentDirection[1] == -1;
    let hitBottomBorder = snake.head.y > mainCanvas.offsetHeight && snake.currentDirection[1] == 1;

    if (hitLeftBorder || hitRightBorder || hitTopBorder || hitBottomBorder) {
      showWastedAlert();
      stopGame();
      return false;
    }

    return true;
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
            ctx.fillStyle = '#346CAD';
       // }
        ctx.fillRect(snake.bodyParts[number].x,snake.bodyParts[number].y,snake.bodyParts[number].edge, snake.bodyParts[number].edge);
     }
}   

function clear() {
    canvas = document.getElementById('mainCanvas');
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    clearInterval(snake.regularMove);
    clearInterval(initialSnakeMove);
    clearInterval(drawStone);
}
