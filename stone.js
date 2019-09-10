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
    stoneFabric = setInterval(drawStone, 5000);
}

function drawStone(){
    var stoneX = Math.floor((Math.random() * document.querySelector("#centerBlock").offsetWidth / snake.bodyPartEdge) + 1);
    var stoneY = Math.floor((Math.random() * document.querySelector("#centerBlock").offsetHeight  / snake.bodyPartEdge) + 1);
    stone = new Stone(stoneX * snake.bodyPartEdge, stoneY * snake.bodyPartEdge, snake.bodyPartEdge);
    stone.ID = IDCounter;
    IDCounter++;
    //  console.log("stone with ID " + stone.ID + " with coords: " + stone.x + " " + stone.y);
    ctx.fillStyle = "#666";
    ctx.fillRect(stone.x, stone.y, snake.bodyPartEdge, snake.bodyPartEdge);
    stonesArray.push(stone);
}
