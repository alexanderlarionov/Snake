window.addEventListener("load", function(){
	window.mainCanvas = document.getElementById("mainCanvas");
	window.ctx = mainCanvas.getContext('2d');
	var rect1 = new Rect(20,30,30);

	drawRect(rect1,ctx);
});

function Rect(x,y,edge){
	this.x = x;
	this.y = y;
	this.edge = edge;
}


function drawRect(rect, canvas) {
	var rectX = rect.x;
	var rectY = rect.y;
	var rectEdge = rect.edge;

	canvas.fillRect(rectX,rectY,rectEdge, rectEdge);
}


document.addEventListener("keypress", function(event){
	if (!event)
        event = window.event;
	var code = event.keyCode;
    if (event.charCode && code == 0)
        code = event.charCode;
    var direction = [];
    switch(code) {
    	case 37: case 94:
    		console.log("left");
    		break;
    	case 39: case 100:
    		console.log("right");
    		break;
    	case 38: case 119:
    		console.log("up");
    		break;
    	case 40: case 115:
    		console.log("down");
    		break;
    }
	event.preventDefault();
});