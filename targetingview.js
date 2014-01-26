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
    
    this.music = new Audio('music_map', true);
    this.crosshairFx = new Audio('fx_map_crosshair');

    this.cursorSprite = new Sprite("cursor_center.png");
    this.cursorHorizontal = new Sprite("cursor_horizontal.png");
    this.cursorVertical = new Sprite("cursor_vertical.png");
    this.overlaySprite = new Sprite('map_overlay.png');
    
    this.canvasWidth = 0;

};

TargetingView.prototype = new View();

TargetingView.prototype.enter = function() {
    this.music.play();
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

    this.selectedCake = 0;
    this.cameraStopped = false;

    this.deliveries = [];

    //this.gameState.cakes[0].fillings=['Bullets', 'Toothpaste', 'Catfood'];

};

//Cake was a rather ok, jos ei oo mitään sanottavaa
//Jos nega ja pos, molemmat, posi eka
//spessucaset overrulaa

TargetingView.prototype.cakeMatches = function(cake, conditions) {
	//var conditionsOk = new Array(conditions.length);
	//console.log("Comparing: "+cake.fillings+" vs "+conditions);
	for (var i = 0; i < conditions.length; i++) {
		var filling = conditions[i];
		var ok = false;
		for (var f = 0; f < cake.fillings.length; f++) {
			if (cake.fillings[f] == filling) ok = true;
		}
		if (ok == false) return false;
	}
	return true;
}

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

TargetingView.prototype.developerSkip = function() {    
	this.gameState.news = [];
	this.gameState.news.push(new Article("Developer skipped"));//, new Article("This too")];
	console.log(this.gameState.news);


};

TargetingView.prototype.exit = function() {
    this.music.stop();
	console.log("TargetingView.exit");
	this.gameState.news = [];
	var i = 0;
	for (i = 0; i < this.deliveries.length; i++) {
		console.log("Delivering cake: "+i);
		var cake = this.gameState.cakes[i];
		var country = COUNTRIES[this.deliveries[i]]["name"];
		var countryShort = COUNTRIES[this.deliveries[i]]["shortName"];

		var matchingTriggers = new Array();

		for (var c = 0; c < TRIGGERS.length; c++) {
			var cond = TRIGGERS[c].conditions;
			//console.log("Trigger("+c+"): "+TRIGGERS[c].inCountry);
			if (TRIGGERS[c].inCountry === undefined) {
				if (this.cakeMatches(cake, cond)) {
					//this.gameState.news.push(new Article(TRIGGERS[c].headline, TRIGGERS[c].text));
					matchingTriggers.push(TRIGGERS[c]);
				}
			} else if (contains(TRIGGERS[c].inCountry, countryShort)) {
				if (this.cakeMatches(cake, cond)) {
					//this.gameState.news.push(new Article(TRIGGERS[c].headline, TRIGGERS[c].text));
					matchingTriggers.push(TRIGGERS[c]);
				}
			}
		}

		console.log("Triggers\n"+matchingTriggers);
		if (matchingTriggers.length == 0) {
			this.gameState.news.push(new Article(0, country, "The cake that [country] received was rather OK.", "Market analysts assure that different combinations of cake fillings can shake the world and make this front page a lot more interesting."));			
		} else {
			var priority = 0;
			var selected = 0;
			for (var s = 0; s < matchingTriggers.length; s++) {
				if (matchingTriggers[s].priority > priority) {
					priority = matchingTriggers[s].priority;
					selected = s;
				}	
			}
				if (priority <= 2) {
				//Might be multiple items!
				var body = "";
				for (var s = 0; s < matchingTriggers.length; s++) {
					if (matchingTriggers[s].priority == 2) {
						body += matchingTriggers[s].text;
						body += "\n\n<br><br>";
					}
				}
				for (var s = 0; s < matchingTriggers.length; s++) {
					if (matchingTriggers[s].priority == 1) {
						body += matchingTriggers[s].text;
						body += "\n\n<br><br>";
					}
				}
				//console.log("BODY:"+body);
				this.gameState.news.push(new Article(priority, country, "Basic header", body));
			} else {
				this.gameState.news.push(new Article(priority, country, matchingTriggers[selected].headline, matchingTriggers[selected].text));
			}
		}
		//this.gameState.news.push(new Article(""+country+" received "+cake["fillings"][0]+" "+cake["fillings"][1]+" "+cake["fillings"][2]));
	}

	console.log(this.gameState.news);
	if (this.gameState.news.length == 0) this.gameState.news.push(new Article(1, "", "Developer skipped"));//, new Article("This too")];


};



TargetingView.prototype.leftArrow = function() {
	this.cameraStopped = false;
	this.selectedPoint = Math.abs((this.selectedPoint - 1) % COUNTRIES.length);
	this.previousPositionX = this.positionX;
	this.previousPositionY = this.positionY;
    this.targetPositionX = -COUNTRIES[this.selectedPoint]["mapLocation"][0];// + this.canvasWidth / 2;
    this.targetPositionY = -COUNTRIES[this.selectedPoint]["mapLocation"][1];// + this.canvasWidth / 2;
    this.crosshairFx.playClone();
};
TargetingView.prototype.rightArrow = function() {
	this.cameraStopped = false;
	this.selectedPoint = Math.abs((this.selectedPoint + 1) % COUNTRIES.length);
	this.previousPositionX = this.positionX;
	this.previousPositionY = this.positionY;
    this.targetPositionX = -COUNTRIES[this.selectedPoint]["mapLocation"][0];// + this.canvasWidth / 2;
    this.targetPositionY = -COUNTRIES[this.selectedPoint]["mapLocation"][1];// + this.canvasWidth / 2;
    this.crosshairFx.playClone();
};

TargetingView.prototype.nextPoint = function() {
	this.selectedPoint = Math.abs((this.selectedPoint + 1) % COUNTRIES.length);
	this.previousPositionX = this.positionX;
	this.previousPositionY = this.positionY;
    this.targetPositionX = -COUNTRIES[this.selectedPoint]["mapLocation"][0];// + this.canvasWidth / 2;
    this.targetPositionY = -COUNTRIES[this.selectedPoint]["mapLocation"][1];// + this.canvasWidth / 2;
}

TargetingView.prototype.space = function() {
	if (this.cameraStopped) {
		var delivered = false;
		console.log(""+this.deliveries+"\n"+this.selectedPoint);
		for (i = 0; i < this.deliveries.length; i++) {
			if (this.deliveries[i] == this.selectedPoint) {
				console.log("Delivered!");
				delivered = true;
				this.deliveries[i] = undefined;
				this.selectedCake = i;
			}
		}
		console.log("Delivered: "+delivered);
		if (delivered == false) {
			this.deliveries[this.selectedCake] = this.selectedPoint;
			for (i = this.selectedCake; i < this.selectedCake + 3; i++) {
				if (this.deliveries[i % 3] === undefined) {
					this.selectedCake = i % 3;
				} else {
				}
			}
			this.nextPoint();
		}
	}
};



function sign(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

TargetingView.prototype.isLocationOccupied = function(location) {
	if (this.deliveries.length == 0) return false;
	var length = this.deliveries.length;
	for (t = 0; t < length; t++) {
		if (this.deliveries[t] == location) {
			return true;
		}
	}
	return false;

}



TargetingView.prototype.update = function(deltaTimeMillis) {
	//if (this.selectedCake == 3) return true;
	if (this.deliveries.length == 3) return true;

    if (this.positionX != this.targetPositionX) {
    	speed = Math.min(Math.abs(this.targetPositionX - this.positionX), 25 * deltaTimeMillis / (1000 / 30));
    	this.positionX += sign(this.targetPositionX - this.positionX) * speed;
    }
    if (this.positionY != this.targetPositionY) {
    	speed = Math.min(Math.abs(this.targetPositionY - this.positionY), 25 * deltaTimeMillis / (1000 / 30));
    	this.positionY += sign(this.targetPositionY - this.positionY) * speed;
    }
    var totalDist = Math.sqrt((this.previousPositionX - this.targetPositionX) * (this.previousPositionX - this.targetPositionX) +
    	(this.previousPositionY - this.targetPositionY) * (this.previousPositionY - this.targetPositionY));
    var dist = Math.sqrt((this.positionX - this.targetPositionX) * (this.positionX - this.targetPositionX) +
    	(this.positionY - this.targetPositionY) * (this.positionY - this.targetPositionY));
    if (dist <= 0) this.cameraStopped = true;
    if (totalDist > 0) {
    	var frac = dist / totalDist;
    	if (frac > 0.5) frac = 0.5 - (frac - 0.5);
    	this.scale = 2.0 - frac * 1.4;
	} else this.scale = 2.0;
};


TargetingView.prototype.drawMap = function(ctx) {
	ctx.save();
		ctx.drawImage(this.img, 0, 0);

	    for (i = 0; i < COUNTRIES.length; i++) {
			ctx.fillStyle = '#fb8';
			if (this.isLocationOccupied(i)) ctx.fillStyle = '#00ff00';
    		px = COUNTRIES[i]["mapLocation"][0];
    		py = COUNTRIES[i]["mapLocation"][1];
    		ctx.save();
    		ctx.translate(px, py);
			ctx.fillRect(-5, -5,10,10);
			ctx.font = "16px digital";
			ctx.textAlign = "left";
			ctx.textBaseline = "hanging";
			ctx.fillText(COUNTRIES[i]["name"], 22, 2);

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

TargetingView.prototype.drawDecorText = function(ctx) {
	var tx = this.positionX + 100.0;
	var screen_X = this.toScreenX(tx, ctx);
	var ty = this.positionY + 100.0;
	var screen_Y = this.toScreenY(ty, ctx);
 	/*ctx.save();
		ctx.translate(screen_X, screen_Y)
		ctx.fillStyle = '#0000ff';
		ctx.fillRect(- 5, - 5, 10, 10);
	ctx.restore();*/

    ctx.save();
    ctx.translate(20, 20);
    ctx.globalAlpha = 0.4;
    ctx.font = '12px digital';
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
    var rowH = 15;
	ctx.fillText("tx: "+tx+" "+Math.round(screen_X),0,0);
	ctx.fillText("ty: "+ty+" "+Math.round(screen_Y),0,rowH);
	screen_Y = this.toScreenY(this.positionY, ctx);
	ctx.fillText("posX: "+ty+" "+Math.round(screen_X),0,rowH * 2);
	screen_Y = this.toScreenY(this.positionY + this.img.height, ctx);
	ctx.fillText("posY: "+ty+" "+Math.round(screen_Y),0,rowH * 3);
	ctx.fillText("TARGET: "+this.targetPositionX+","+this.targetPositionY,0,rowH * 4);
    ctx.restore();
};

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
    
    // screen overlay effect
    this.overlaySprite.draw(ctx, 0, 0);

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

    this.drawDecorText(ctx);

	for (i = 0; i < this.gameState.cakes.length; i++) {
		var text = "Cake "+(i+1)+": ";
        text += this.gameState.cakes[i].fillings.join(' - ');
		if (this.deliveries[i] === undefined) {
		} else {
			text += " -> " + COUNTRIES[this.deliveries[i]]["name"];
		}
        ctx.font = '22px digital';
        ctx.textAlign = 'left';
		ctx.textBaseline = "bottom";
		if (i == this.selectedCake) ctx.fillStyle = "ffff00"; else ctx.fillStyle = "00ffff";
		ctx.fillText(text, 30, ctx.canvas.height - 25 * i - 20);
	}
};