/*Adding inital events*/

window.addEventListener("load", init);
// document.addEventListener("keypress", keyPressed);
window.onkeyup = function(){
    keyPressed();
};

function init(){
    window.mainCanvas = document.getElementById("mainCanvas");
    window.ctx = mainCanvas.getContext('2d');
    var initalSpeed = 200;
    initPosX = 300;
    initPosY = 300;
    initBodyPartEdge = 30;

    initSnake();
}

function snakeBodyPart(x,y,edge, id){
	this.x = x;
	this.y = y;
    this.rectId = id;
	this.edge = edge;
}

function Snake(){
    this.length = 3;
    this.bodyPartEdge = 30;
    this.bodyParts = []; 

}

function initSnake(){
    snake = new Snake();

    for(var i = 0; i < snake.length; i++){
        bodyPart = new snakeBodyPart(initPosX  - i * initBodyPartEdge, initPosY, snake.bodyPartEdge, i);
        snake.bodyParts.push(bodyPart);
    }
    snake.head = snake.bodyParts[0];
    snake.tail = snake.bodyParts[snake.length - 1];

    drawSnake();

    initialSnakeMove = setInterval(function(){moveSnake([1,0])}, 200);
}

function drawSnake(){
    for(var i = 0; i < snake.length; i++){
        ctx.fillRect(snake.bodyParts[i].x,snake.bodyParts[i].y,snake.bodyParts[i].edge, snake.bodyParts[i].edge);
    }
}

function keyPressed(event){
    if (!event)
        event = window.event;
    var code = event.keyCode;
    if (event.charCode && code == 0)
        code = event.charCode;
    var direction = [];
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

 
    if(direction) {
        clearInterval(initialSnakeMove);
        if(typeof regularMove!== 'undefined'){
            clearInterval(regularMove);
        }
        regularMove = setInterval(function(){moveSnake(direction)}, 200);
        //moveSnake(direction);   
    }
}

function moveSnake(direction){
    ctx.clearRect(snake.tail.x, snake.tail.y, snake.tail.edge + 1, snake.tail.edge+ 1);
    for(var i = 0; i < snake.length; i++){
        snake.bodyParts[i].x += 30 * direction[0];
        snake.bodyParts[i].y += 30 * direction[1];
    }

    /*If snake goes through canvasBorders*/
    if(snake.tail.x + snake.tail.edge <= 0 && direction[0] == -1) {
        for(var i = 0; i < snake.length; i++){
            snake.bodyParts[i].x = mainCanvas.width + i * snake.bodyPartEdge;
        }
    }
    else if(snake.tail.x >=  mainCanvas.width &&  direction[0] == 1){
        for(var i = 0; i < snake.length; i++){
            snake.bodyParts[i].x = 0 - i * snake.bodyPartEdge;
        }
    }

   if(snake.tail.y + snake.tail.edge <= 0 && direction[1] == -1) {
        //mainRect.y =  mainCanvas.height - mainRect.edge;
        for(var i = 0; i < snake.length; i++){
            snake.bodyParts[i].y = mainCanvas.height + i * snake.bodyPartEdge;
        }
    }
    else if(snake.tail.y >= mainCanvas.height && direction[1] == 1){
       for(var i = 0; i < snake.length; i++){
            snake.bodyParts[i].y = 0 - i * snake.bodyPartEdge;
        }
    }
    drawSnake();
}