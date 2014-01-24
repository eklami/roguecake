var Dialog = function(lines, keepLastVisible) {
    if (keepLastVisible === undefined) {
        keepLastVisible = false;
    }
    this.keepLastVisible = keepLastVisible;
    this.lines = lines;
    if (this.keepLastVisible && this.lines.length > 0) {
        this.lines.push(this.lines[this.lines.length - 1]); // Duplicate the last line so that the user still needs to confirm with click
    }
    this.minChangeInterval = 500;
    this.reset();
};

Dialog.prototype.reset = function() {
    this.time = 0;
    this.lastChangeTime = 0;
    this.finished = false;
    this.started = false;
    this.currentLine = -1;
};

Dialog.prototype.click = function() {
    this.clicked = true;
};

Dialog.prototype.start = function() {
    this.started = true;
    this.advance();
};

Dialog.prototype.update = function(timeDelta) {
    this.time += timeDelta;

    // Advancement handling and timing limiters.
    if (this.clicked && !this.finished) {
        this.clicked = false;
        if (this.time > this.lastChangeTime + this.minChangeInterval) {
            this.advance();
        }
    }
};

Dialog.prototype.draw = function(ctx, x, y, centered) {
    if (centered === undefined) {
        centered = false;
    }
    if (this.currentLine < this.lines.length && this.started) {
        var nextLine = this.lines[this.currentLine];
        if (typeof nextLine !== 'string') {
            ctx.fillStyle = nextLine.blankScreenColor;
            ctx.globalAlpha = this.opacity;
            ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
            nextLine = nextLine.text;            
        }

        ctx.font = '18px sans-serif';
        ctx.globalAlpha = 0.7;
        var measurement = ctx.measureText(nextLine);
        
        ctx.fillStyle = 'black';
        if (centered) {
            x -= measurement.width * 0.5 + 10;
        }
        ctx.fillRect(x, y, measurement.width + 20, 30);
        ctx.fillStyle = 'white';
        ctx.fillText(nextLine, x + 10, y + 20);
        ctx.globalAlpha = 1.0;
    }
};

Dialog.prototype.advance = function() {
    this.currentLine++;
    if (this.currentLine >= this.lines.length || (this.currentLine >= this.lines.length - 1 && this.keepLastVisible)) {
        this.finished = true;
    }
    if (this.keepLastVisible) {
        this.currentLine = Math.min(this.currentLine, this.lines.length - 1);
    }
};