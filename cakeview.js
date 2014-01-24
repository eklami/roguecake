var CakeView = function(gameState) {
    this.gameState = gameState;
    this.x = 0;
};

CakeView.prototype = new View();

CakeView.prototype.draw = function(ctx) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#f00';
    ctx.fillRect(this.x, 0, 10, 10);
};

CakeView.prototype.update = function(deltaTimeMillis) {
};

CakeView.prototype.space = function() {
    this.x += 10;
};
