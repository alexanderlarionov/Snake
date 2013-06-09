/*Adding inital events*/

window.addEventListener("load", init);
// document.addEventListener("keypress", keyPressed);
window.onkeyup = function(){
    keyPressed();
};

function init(){
    window.mainCanvas = document.getElementById("mainCanvas");
    window.ctx = mainCanvas.getContext('2d');
    mainRect = new Rect(20,30,30);
    var initalSpeed = 200;
    drawRect(mainRect,ctx);
    initialMove = setInterval(function(){moveRect([1,0])}, initalSpeed);
}

function Rect(x,y,edge){
	this.x = x;
	this.y = y;
	this.edge = edge;
}

function Snake(length){
    this.length = 1;
    this.bodyParts = []; 
}

function drawRect(rect, canvas) {
	var rectX = rect.x;
	var rectY = rect.y;
	var rectEdge = rect.edge;

	canvas.fillRect(rectX,rectY,rectEdge, rectEdge);
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
        clearInterval(initialMove);
        if(typeof regularMove!== 'undefined'){
            clearInterval(regularMove);
        }
        regularMove = setInterval(function(){moveRect(direction)}, 200);
        moveRect(direction);   
    }
}

function moveRect(direction){
    ctx.clearRect(mainRect.x,mainRect.y, mainRect.edge + 1, mainRect.edge+ 1);
    mainRect.x += 30 * direction[0];
    mainRect.y += 30 * direction[1];
    if(mainRect.x + mainRect.edge <= 0) {
        mainRect.x =  mainCanvas.width - mainRect.edge;
    }
    else if(mainRect.x >=  mainCanvas.width){
        mainRect.x = 0;
    }

   if(mainRect.y + mainRect.edge <= 0) {
        mainRect.y =  mainCanvas.height - mainRect.edge;
    }
    else if(mainRect.y >= mainCanvas.height){
        mainRect.y = 0;
    }
    console.log(mainRect.x, mainRect.y);
    drawRect(mainRect, ctx);
}