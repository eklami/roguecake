var TargetingView = function(gameState) {
    this.gameState = gameState;
 
    this.img = document.createElement('img');
    this.img.src = "Assets/map.png";
    this.loaded = false;
    var that = this;
    this.img.onload = function() {
        that.loaded = true;
        that.width = that.img.width;
        that.height = that.img.height;
    };

    this.selectedPoint = 0;
    this.positionX = COUNTRIES[this.selectedPoint]["mapLocation"][0];
    this.positionY = COUNTRIES[this.selectedPoint]["mapLocation"][1];
	//this.positionX = 0;
	//this.positionY = 0;
    this.targetPositionX = this.positionX;
    this.targetPositionY = this.positionY;
    this.previousPositionX = this.positionX;
	this.previousPositionY = this.positionY;


    this.scale = 0.6;
    
    this.canvasWidth = 0;

};

TargetingView.prototype = new View();

TargetingView.prototype.leftArrow = function() {
	this.selectedPoint = Math.abs((this.selectedPoint - 1) % COUNTRIES.length);
	this.previousPositionX = this.positionX;
	this.previousPositionY = this.positionY;
    this.targetPositionX = -COUNTRIES[this.selectedPoint]["mapLocation"][0];// + this.canvasWidth / 2;
    this.targetPositionY = -COUNTRIES[this.selectedPoint]["mapLocation"][1];// + this.canvasWidth / 2;

	//this.targetPositionX += 100;
};
TargetingView.prototype.rightArrow = function() {
	this.selectedPoint = Math.abs((this.selectedPoint + 1) % COUNTRIES.length);
	this.previousPositionX = this.positionX;
	this.previousPositionY = this.positionY;
    this.targetPositionX = -COUNTRIES[this.selectedPoint]["mapLocation"][0];// + this.canvasWidth / 2;
    this.targetPositionY = -COUNTRIES[this.selectedPoint]["mapLocation"][1];// + this.canvasWidth / 2;
	//this.targetPositionX -= 100;
};


function sign(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

View.prototype.update = function(deltaTimeMillis) {
    if (this.positionX != this.targetPositionX) {
    	speed = Math.min(Math.abs(this.targetPositionX - this.positionX), 50 * deltaTimeMillis / (1000 / 30));
    	this.positionX += sign(this.targetPositionX - this.positionX) * speed;
    }
    if (this.positionY != this.targetPositionY) {
    	speed = Math.min(Math.abs(this.targetPositionY - this.positionY), 50 * deltaTimeMillis / (1000 / 30));
    	this.positionY += sign(this.targetPositionY - this.positionY) * speed;
    }
    var totalDist = Math.sqrt((this.previousPositionX - this.targetPositionX) * (this.previousPositionX - this.targetPositionX) +
    	(this.previousPositionY - this.targetPositionY) * (this.previousPositionY - this.targetPositionY));
    var dist = Math.sqrt((this.positionX - this.targetPositionX) * (this.positionX - this.targetPositionX) +
    	(this.positionY - this.targetPositionY) * (this.positionY - this.targetPositionY));
    if (totalDist > 0) {
    	var frac = dist / totalDist;
    	if (frac > 0.5) frac = 0.5 - (frac - 0.5);
    	this.scale = 2.0 - frac * 1.4;
	}
};


TargetingView.prototype.drawMap = function(ctx) {
	ctx.save();
		ctx.drawImage(this.img, 0, 0);

		ctx.fillStyle = '#ff00ff';
	    for (i = 0; i < COUNTRIES.length; i++) {
    		px = COUNTRIES[i]["mapLocation"][0];
    		py = COUNTRIES[i]["mapLocation"][1];
    		ctx.save();
    		ctx.translate(px, py);
			ctx.fillRect(-5, -5,10,10);
			ctx.font = "12pt Helvetica";
			ctx.textAlign = "center";
			ctx.textBaseline = "hanging";
			ctx.fillText(COUNTRIES[i]["name"], 0, 10);

			ctx.restore();
		}


	ctx.restore();
}

TargetingView.prototype.draw = function(ctx) {

    ctx.fillStyle = '#f8a';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	if (this.canvasWidth == 0) this.canvasWidth = ctx.canvas.width;
	ctx.mozImageSmoothingEnabled = true;
	ctx.save();
	if (this.loaded) {
 
 		ctx.save();
 		ctx.translate(ctx.canvas.width * 0.5, ctx.canvas.height * 0.5);
		//ctx.translate(this.positionX + this.img.width * 0.5, this.img.height * 0.5);
		/*if (this.positionX > 0) {
			ctx.translate(-this.img.width * 0.5, -this.img.height * 0.5);
			ctx.drawImage(this.img, 0, 0);
		}*/
		ctx.scale(this.scale, this.scale);
		ctx.translate(this.positionX, this.positionY);
 		//ctx.translate(ctx.canvas.width * 0.5, ctx.canvas.height * 0.5);
		//ctx.translate(-this.img.width * 0.5, -this.img.height * 0.5);
		this.drawMap(ctx);
		ctx.restore();
	}
    /*ctx.fillStyle = '#ff00ff';
    for (i = 0; i < COUNTRIES.length; i++) {
    	px = COUNTRIES[i]["mapLocation"][0];
    	py = COUNTRIES[i]["mapLocation"][1];
		ctx.fillRect(this.positionX + px - 5,py - 5,10,10);
		ctx.font = "12pt Helvetica";
		ctx.textAlign = "center";
		ctx.textBaseline = "hanging";
		ctx.fillText(COUNTRIES[i]["name"], this.positionX + px, py + 10);
    }*/
	ctx.restore();
	ctx.fillStyle = '#00ffff';
	ctx.strokeRect(ctx.canvas.width * 0.5 - 30, ctx.canvas.height * 0.5 - 30, 60, 60);
	ctx.strokeRect(ctx.canvas.width * 0.5 - 2, ctx.canvas.height * 0.5 - 60, 4, -ctx.canvas.height * 0.5);
	ctx.strokeRect(ctx.canvas.width * 0.5 - 2, ctx.canvas.height * 0.5 + 60, 4, ctx.canvas.height * 0.5);

};