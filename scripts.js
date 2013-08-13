/*Adding inital events*/

window.addEventListener("load", init);
// document.addEventListener("keypress", keyPressed);

window.onkeyup = function(){
    handleKeyUp();
};

//draw canvas and init snake
function init(){
    window.mainCanvas = document.getElementById("mainCanvas");
    window.ctx = mainCanvas.getContext('2d');
    var initalSpeed = 200;
    initPosX = 300;
    initPosY = 300;

    initSnake();
}

//SnakeBodyPart class 
function snakeBodyPart(x,y,edge, id){
	this.x = x;
	this.y = y;
    this.rectId = id;
	this.edge = edge;
}

//Snake class
function Snake(){
    this.length = 5;
    this.bodyPartEdge = 30;
    this.initialDirection = [1,0];
    this.bodyParts = []; 
    this.breakPoint = [];
    this.currentDirection = [];
}

//draw snake with N objects of snakeBodyPart's
function initSnake(){
    snake = new Snake();

    for(var i = 0; i < snake.length; i++){
        bodyPart = new snakeBodyPart(initPosX  - i * snake.bodyPartEdge, initPosY, snake.bodyPartEdge, i);
        snake.bodyParts.push(bodyPart);
    }
    snake.head = snake.bodyParts[0];
    snake.tail = snake.bodyParts[snake.length - 1];
    snake.currentDirection = snake.initialDirection;

    drawSnake();

    initialSnakeMove = setInterval(function(){moveSnake(snake.initialDirection)}, 500);
}



/*Changes direction on arrow/wasd key pressed*/
function handleKeyUp(event){
    if (!event)
        event = window.event;
    var code = event.keyCode;
    if (event.charCode && code == 0)
        code = event.charCode;

    switch(code) {
        case 37: case 97:
            console.log("left");
            direction = [-1, 0];
            break;
        case 39: case 100:
            console.log("right");
            direction = [1, 0];
            break;
        case 38: case 119:
            console.log("up");
            direction = [0, -1];
            break;
        case 40: case 115:
            console.log("down");
            direction = [0, 1];
            break;
        default:
            direction = null;
            break;   
    }
    event.preventDefault();

    //Check to avoid repeated direction-buttons pressed
    if(typeof direction !== 'undefined' && direction !== null && (direction[0] !== snake.currentDirection[0] || direction[1] !== snake.currentDirection[1]))
    {
        changeDirection(direction);
    }

}
function changeDirection (direction) {
    // body...
     snake.breakPoint = [snake.head.x, snake.head.y];
    console.log("breakPoint is = ", snake.breakPoint);    
    // if(directionChanged) {
        if(typeof initialSnakeMove !== 'typeof')
        {
            clearInterval(initialSnakeMove); 
        }
        // clearInterval(initialSnakeMove);
        if(typeof regularMove!== 'undefined'){
            clearInterval(regularMove);
        }
        if(direction[0] * (-1) == snake.currentDirection[0] || direction[1] * (-1) == snake.currentDirection[1]){
            var switchBodypart;
            switchBodypart = snake.head;
            snake.head = snake.tail;
            snake.tail = switchBodypart;
        }
        regularMove = setInterval(function(){moveSnake(direction)}, 500);  
}

/*Main drawing methods*/
function moveSnake(direction){
    var currentDirection;

    ctx.clearRect(snake.tail.x, snake.tail.y, snake.tail.edge + 1, snake.tail.edge + 1);
    for(var i = 0; i < snake.length; i++){
        if(direction[1] !== 0)
        {
            if(snake.bodyParts[i].x >= snake.breakPoint[0])
            {
                snake.bodyParts[i].x += 0;
                snake.bodyParts[i].y += snake.bodyPartEdge * direction[1];
            }
            else
            {
                snake.bodyParts[i].x += 0;
                snake.bodyParts[i].y += snake.bodyPartEdge * snake.currentDirection[1];
            }              
        }
        else
        {            
            snake.bodyParts[i].x += snake.bodyPartEdge * direction[0];
            snake.bodyParts[i].y += snake.bodyPartEdge * direction[1];
        }

    }
    

    /*If snake goes through canvasBorders*/
    if(snake.tail.x + snake.tail.edge <= 0 && snake.currentDirection[0] == -1) {
        for(var i = 0; i < snake.length; i++){
            snake.bodyParts[snake.length - i - 1].x = mainCanvas.width + i * snake.bodyPartEdge;
            console.log("border bug");
        }
    }
    else if(snake.tail.x >=  mainCanvas.width &&  snake.currentDirection[0] == 1){
        for(var i = 0; i < snake.length; i++){
            snake.bodyParts[i].x = 0 - i * snake.bodyPartEdge;
        }
    }

   if(snake.tail.y + snake.tail.edge <= 0 && snake.currentDirection[1] == -1) {
        //mainRect.y =  mainCanvas.height - mainRect.edge;
        for(var i = 0; i < snake.length; i++){
            snake.bodyParts[i].y = mainCanvas.height + i * snake.bodyPartEdge;
        }
    }
    else if(snake.tail.y >= mainCanvas.height && snake.currentDirection[1] == 1){
       for(var i = 0; i < snake.length; i++){
            snake.bodyParts[i].y = 0 - i * snake.bodyPartEdge;
        }
    }

    snake.currentDirection = direction;

    drawSnake();
}

function drawSnake(){
    for(var i = 0; i < snake.length; i++){
        if(snake.bodyParts[i] == snake.tail){
            ctx.fillStyle = '#00f';
        }
        else if(snake.bodyParts[i] == snake.head){
            ctx.fillStyle = '#f00';
        }
        else{
            ctx.fillStyle = '#000';
        }
        ctx.fillRect(snake.bodyParts[i].x,snake.bodyParts[i].y,snake.bodyParts[i].edge, snake.bodyParts[i].edge);
    }
}   