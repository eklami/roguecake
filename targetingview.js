var TargetingView = function(gameState) {
    this.gameState = gameState;
 
    this.img = document.createElement('img');
    this.img.src = "map.jpg";
    this.loaded = false;
    var that = this;
    this.img.onload = function() {
        that.loaded = true;
        that.width = that.img.width;
        that.height = that.img.height;
    };

    this.selectedPoint = 0;
    this.positionX = COUNTRIES[this.selectedPoint]["mapLocation"][0];
    this.targetPositionX = this.positionX;

    this.canvasWidth = 0;

};

TargetingView.prototype = new View();

TargetingView.prototype.leftArrow = function() {
	this.selectedPoint = Math.abs((this.selectedPoint - 1) % COUNTRIES.length);
    this.targetPositionX = -COUNTRIES[this.selectedPoint]["mapLocation"][0] + this.canvasWidth / 2;
};
TargetingView.prototype.rightArrow = function() {
	//this.positionX = (this.positionX + 107) % this.img.width;
	this.selectedPoint = Math.abs((this.selectedPoint + 1) % COUNTRIES.length);
    this.targetPositionX = -COUNTRIES[this.selectedPoint]["mapLocation"][0] + this.canvasWidth / 2;
};


function sign(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

View.prototype.update = function(deltaTimeMillis) {
    /*this.selectedPoint = 0;
    this.positionX = COUNTRIES[this.selectedPoint]["mapLocation"][0];*/
    if (this.positionX != this.targetPositionX) {
    	speed = Math.min(Math.abs(this.targetPositionX - this.positionX), 50 * deltaTimeMillis / (1000 / 30));
    	this.positionX += sign(this.targetPositionX - this.positionX) * speed;
    }
};



TargetingView.prototype.draw = function(ctx) {

	if (this.canvasWidth == 0) this.canvasWidth = ctx.canvas.width;
	ctx.mozImageSmoothingEnabled = true;
	if (this.loaded) {
		if (this.positionX > 0) {
			ctx.drawImage(this.img, this.positionX - this.img.width, 0);
		}
		ctx.drawImage(this.img, this.positionX, 0);
		//console.log(""+(this.positionX + this.img.width)+" - "+ctx.width);
		if (this.positionX + this.img.width < ctx.canvas.width) {
			ctx.drawImage(this.img, this.positionX + this.img.width, 0);
			//ctx.drawImage(this.img, 50, 50);
		}
	}
    ctx.fillStyle = '#ff00ff';
    for (i = 0; i < COUNTRIES.length; i++) {
    	px = COUNTRIES[i]["mapLocation"][0];
    	py = COUNTRIES[i]["mapLocation"][1];
		ctx.fillRect(this.positionX + px - 5,py - 5,10,10);
		ctx.font = "12pt Helvetica";
		ctx.textAlign = "center";
		ctx.textBaseline = "hanging";
		ctx.fillText(COUNTRIES[i]["name"], this.positionX + px, py + 10);
    }

};