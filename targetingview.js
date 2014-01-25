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

    this.cursorSprite = new Sprite("cursor_center.png");
    this.cursorHorizontal = new Sprite("cursor_horizontal.png");
    this.cursorVertical = new Sprite("cursor_vertical.png");

    
    this.canvasWidth = 0;

};

TargetingView.prototype = new View();

TargetingView.prototype.enter = function() {
	console.log("Cakes");
	console.log(this.gameState.cakes);


    this.selectedPoint = 0;
    this.positionX = -COUNTRIES[this.selectedPoint]["mapLocation"][0];
    this.positionY = -COUNTRIES[this.selectedPoint]["mapLocation"][1];
	//this.positionX = 0;
	//this.positionY = 0;
    this.targetPositionX = this.positionX;
    this.targetPositionY = this.positionY;
    this.previousPositionX = this.positionX;
	this.previousPositionY = this.positionY;
	this.positionX = 0;
	this.positionY = 0;


    this.scale = 2;
};


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

TargetingView.prototype.update = function(deltaTimeMillis) {
    if (this.positionX != this.targetPositionX) {
    	speed = Math.min(Math.abs(this.targetPositionX - this.positionX), 15 * deltaTimeMillis / (1000 / 30));
    	this.positionX += sign(this.targetPositionX - this.positionX) * speed;
    }
    if (this.positionY != this.targetPositionY) {
    	speed = Math.min(Math.abs(this.targetPositionY - this.positionY), 15 * deltaTimeMillis / (1000 / 30));
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
	} else this.scale = 2.0;
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

TargetingView.prototype.toScreenX = function(worldX, ctx) {
	return worldX * this.scale + ctx.canvas.width * 0.5;
}

TargetingView.prototype.toScreenY = function(worldY, ctx) {
	return worldY * this.scale + ctx.canvas.height * 0.5;
}

TargetingView.prototype.draw = function(ctx) {

    ctx.fillStyle = '#f8a';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	if (this.canvasWidth == 0) this.canvasWidth = ctx.canvas.width;
	ctx.mozImageSmoothingEnabled = true;
	ctx.save();

	//this.positionX = 0;
	//this.positionY = 0;
	//this.scale = 1.5;

	//Map & all related scrolling stufff
	var screenY = this.toScreenY(this.positionY, ctx);
	var clamp = 0;
	if (screenY > 0) {
		clamp = -screenY / this.scale;
	}
	var screenY = this.toScreenY(this.positionY + this.img.height, ctx);
	if (screenY < ctx.canvas.height) {
		clamp = (ctx.canvas.height - screenY) / this.scale;
	}
	var clamped_y = this.positionY + clamp;

	if (this.loaded) {
 
 		ctx.save();
 		ctx.translate(ctx.canvas.width * 0.5, ctx.canvas.height * 0.5);
		ctx.scale(this.scale, this.scale);
		ctx.translate(this.positionX, clamped_y);
		this.drawMap(ctx);

		//Repeats
		ctx.translate(-this.img.width, 0);
		this.drawMap(ctx);
		ctx.translate(2 * this.img.width, 0);
		this.drawMap(ctx);
		ctx.restore();
	}

	//Targeting cursor
	ctx.restore();
	ctx.fillStyle = '#00ffff';
	ctx.save();
	ctx.translate(0, clamp * this.scale);
	this.cursorSprite.drawRotated(ctx, ctx.canvas.width * 0.5, ctx.canvas.height * 0.5, 0, 1);
	var lineWidth = ctx.canvas.width * 0.75;
	var scaleRatio = lineWidth / this.cursorHorizontal.width;
	var cw = this.cursorSprite.width * 0.55 + (2-this.scale) * 50;
	var ch = this.cursorSprite.width * 0.55 + (2-this.scale) * 50;
	this.cursorHorizontal.drawRotatedNonUniform(ctx, ctx.canvas.width * 0.5 + cw + lineWidth * 0.5, ctx.canvas.height * 0.5, 0, scaleRatio, 1);
	this.cursorHorizontal.drawRotatedNonUniform(ctx, ctx.canvas.width * 0.5 - cw - lineWidth * 0.5, ctx.canvas.height * 0.5, 0, scaleRatio, 1);
	scaleRatio = lineWidth / this.cursorVertical.height;
	this.cursorVertical.drawRotatedNonUniform(ctx, ctx.canvas.width * 0.5, ctx.canvas.height * 0.5 + ch + lineWidth * 0.5, 0, 1, scaleRatio);
	this.cursorVertical.drawRotatedNonUniform(ctx, ctx.canvas.width * 0.5, ctx.canvas.height * 0.5 - ch - lineWidth * 0.5, 0, 1, scaleRatio);
	ctx.restore();

	var tx = this.positionX + 100.0;
	var screen_X = this.toScreenX(tx, ctx);
	var ty = this.positionY + 100.0;
	var screen_Y = this.toScreenY(ty, ctx);
 	/*ctx.save();
		ctx.translate(screen_X, screen_Y)
		ctx.fillStyle = '#0000ff';
		ctx.fillRect(- 5, - 5, 10, 10);
	ctx.restore();*/

    ctx.font = '24px digital';
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("tx: "+tx+" "+screen_X,0,0);
	ctx.fillText("ty: "+ty+" "+screen_Y,0,30);
	screen_Y = this.toScreenY(this.positionY, ctx);
	ctx.fillText("posY: "+ty+" "+screen_Y,0,60);
	screen_Y = this.toScreenY(this.positionY + this.img.height, ctx);
	ctx.fillText("posY: "+ty+" "+screen_Y,0,90);
	ctx.fillText("TARGET: "+this.targetPositionX+","+this.targetPositionY,0,120);

};