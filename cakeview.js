var CakeView = function(gameState) {
    this.gameState = gameState;
    this.slots = []; // list of FILLINGS indices
    this.slotPosition = 0; // float position in this.slots
    this.slotSpeed = CakeView.SLOT_SPEED;
    
    this.stateTime = 0;
    
    this.iconSprites = [];
    for (var i = 0; i < FILLINGS.length; ++i) {
        this.iconSprites.push(new Sprite(FILLINGS[i].replace(' ', '_') + '.png'));
    }
    this.state = CakeView.state.RANDOM;
    this.randomizeSlots();

    this.text = '';
    this.textHidden = 0;
    this.textHiddenDirection = 1;
};

CakeView.prototype = new View();

CakeView.SLOT_SPEED = 0.008;
CakeView.SLOT_COUNT = 20;
CakeView.SLOT_WIDTH = 75;
CakeView.SHOWN_SLOTS = 5;
CakeView.SLOT_RECT = new Rect(480 - CakeView.SLOT_WIDTH * CakeView.SHOWN_SLOTS * 0.5,
                              480 + CakeView.SLOT_WIDTH * CakeView.SHOWN_SLOTS * 0.5,
                              50, 50 + 75);

CakeView.state = {
    RANDOM: 0,
    SLOWING: 1,
    CHOOSECAKE: 2,
    FILLING: 3,
    FINISHED: 4
}

CakeView.prototype.randomizeSlots = function() {
    this.slots = [];
    while (this.slots.length < CakeView.SLOT_COUNT) {
        var filling = Math.floor(Math.random() * FILLINGS.length) % FILLINGS.length;
        // Not two of the same fillings in a row
        if (this.slots.length === 0 || this.slots[this.slots.length - 1] !== filling) {
            this.slots.push(filling);
        }
    }
};

CakeView.prototype.selectFilling = function(fillingStr) {
    this.text = fillingStr;
    this.textHidden = 0;
    this.textHiddenDirection = 1;
    this.textAnimTime = 0;
};

CakeView.prototype.chooseCake = function() {
    this.changeState(CakeView.state.FILLING);
};

CakeView.prototype.changeState = function(state) {
    this.state = state;
    this.stateTime = 0;
};

CakeView.ease = function(x) {
    return (Math.asin(x * 2 - 1) + 0.5 * Math.PI) / Math.PI;
};

CakeView.prototype.draw = function(ctx) {
    ctx.fillStyle = '#401';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    canvasUtil.clipRect(ctx, CakeView.SLOT_RECT);
    ctx.fillStyle = '#eee';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (var i = 0; i < CakeView.SHOWN_SLOTS + 1; ++i) {
        var slotIndex = (i + Math.floor(this.slotPosition)) % CakeView.SLOT_COUNT;
        var slotOffset = this.slotPosition - Math.floor(this.slotPosition);
        this.iconSprites[this.slots[slotIndex]].drawRotated(ctx, (i - CakeView.ease(slotOffset) + 0.7) * CakeView.SLOT_WIDTH + CakeView.SLOT_RECT.left, (CakeView.SLOT_RECT.top + CakeView.SLOT_RECT.bottom) * 0.5);
    }
    ctx.restore();

    
    ctx.font = '46px digital';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    var shownText = this.text;
    if (this.textHidden >= 0 && this.textHidden < this.text.length && this.state !== CakeView.state.FILLING) {
        shownText = this.text.substring(0, this.textHidden) + ' ' + this.text.substring(this.textHidden + 1, this.text.length);
    }
    
    var textX = (CakeView.SLOT_RECT.left + CakeView.SLOT_RECT.right) * 0.5;
    var textY = CakeView.SLOT_RECT.bottom + 20;
    ctx.fillStyle = '#b05';
    ctx.fillText(shownText, textX + 1, textY + 1);
    ctx.fillText(shownText, textX - 1, textY + 1);
    ctx.fillText(shownText, textX + 1, textY - 1);
    ctx.fillText(shownText, textX - 1, textY - 1);
    ctx.fillStyle = '#f8a';
    ctx.fillText(shownText, textX, textY);
};

CakeView.prototype.update = function(deltaTimeMillis) {
    this.slotPosition += deltaTimeMillis * this.slotSpeed;
    this.stateTime += deltaTimeMillis;
    if (this.state === CakeView.state.RANDOM) {
        this.slotSpeed = CakeView.SLOT_SPEED;
    }
    if (this.state === CakeView.state.SLOWING) {
        if (this.slotPosition > this.nextSlow) {
            this.slotSpeed -= CakeView.SLOT_SPEED * 0.5;
            this.nextSlow += 1;
            if (this.slotSpeed < CakeView.SLOT_SPEED * 0.01) {
                var slotIndex = (Math.floor(CakeView.SHOWN_SLOTS / 2) + Math.round(this.slotPosition)) % CakeView.SLOT_COUNT;
                this.changeState(CakeView.state.CHOOSECAKE);
                this.selectFilling(FILLINGS[this.slots[slotIndex]]);
            }
        }
    }
    if (this.state === CakeView.state.FILLING) {
        if (this.stateTime > 2000) {
            this.changeState(CakeView.state.RANDOM);
            this.text = '';
        }
    }
    
    if (this.stateTime > this.textAnimTime && this.text.length > 0) {
        this.textHidden += this.textHiddenDirection;
        if (this.textHidden > this.text.length) {
            this.textHiddenDirection = -1;
        }
        if (this.textHidden < -1) {
            this.textHiddenDirection = 1;
        }
        this.textAnimTime += 500 / (this.text.length + 2);
    }
};

CakeView.prototype.space = function() {
    if (this.state === CakeView.state.RANDOM) {
        if (this.stateTime > 500) {
            this.changeState(CakeView.state.SLOWING);
            this.nextSlow = Math.ceil(this.slotPosition);
        }
    }
    if (this.state === CakeView.state.CHOOSECAKE && this.stateTime > 200) {
        this.chooseCake();
    }
};
