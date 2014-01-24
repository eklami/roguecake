var Sprite = function(filename) {
    this.filename = filename;
    this.img = document.createElement('img');
    this.img.src = 'Assets/' + filename;
    this.loaded = false;
    var that = this;
    this.img.onload = function() {
        that.loaded = true;
        that.width = that.img.width;
        that.height = that.img.height;
    };
};

Sprite.prototype.draw = function(ctx, x, y) {
    if (this.loaded) {
        ctx.drawImage(this.img, x, y);
    }
};

Sprite.prototype.drawRotated = function(ctx, centerX, centerY, angleRadians, /* optional */ scale) {
    if (angleRadians === undefined) {
        angleRadians = 0.0;
    }
    if (scale === undefined) {
        scale = 1.0;
    }
    if (this.loaded) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angleRadians);
        ctx.scale(scale, scale);
        ctx.translate(-this.width * 0.5, -this.height * 0.5);
        ctx.drawImage(this.img, 0, 0);
        ctx.restore();
    }
};