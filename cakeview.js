var CakeView = function(gameState) {
    this.gameState = gameState;
    this.slots = []; // list of FILLINGS indices
    this.slotPosition = 0; // float position in FILLINGS
    this.slotSpeed = CakeView.SLOT_SPEED;
    
    this.stateTime = 0;
    
    this.iconSprites = [];
    for (var i = 0; i < FILLINGS.length; ++i) {
        this.iconSprites.push(new Sprite(FILLINGS[i].replace(' ', '_') + '.png'));
    }
    this.state = CakeView.state.RANDOM;
    this.randomizeSlots();
};

CakeView.prototype = new View();

CakeView.SLOT_SPEED = 0.008;
CakeView.SLOT_COUNT = 20;
CakeView.SLOT_WIDTH = 70;
CakeView.SHOWN_SLOTS = 5;
CakeView.SLOT_RECT = new Rect(100, 100 + CakeView.SLOT_WIDTH * CakeView.SHOWN_SLOTS, 50, 50 + 64);

CakeView.state = {
    RANDOM: 0,
    SLOWING: 1,
    FILLING: 2,
    CONVEYOR: 3,
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

CakeView.ease = function(x) {
    return (Math.asin(x * 2 - 1) + 0.5 * Math.PI) / Math.PI;
};

CakeView.prototype.draw = function(ctx) {
    ctx.fillStyle = '#f8a';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    canvasUtil.clipRect(ctx, CakeView.SLOT_RECT);
    ctx.fillStyle = '#eee';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (var i = 0; i < CakeView.SHOWN_SLOTS + 3; ++i) {
        var slotIndex = (i + Math.floor(this.slotPosition)) % CakeView.SLOT_COUNT;
        var slotOffset = this.slotPosition - Math.floor(this.slotPosition);
        this.iconSprites[this.slots[slotIndex]].drawRotated(ctx, (i - CakeView.ease(slotOffset)) * CakeView.SLOT_WIDTH, (CakeView.SLOT_RECT.top + CakeView.SLOT_RECT.bottom) * 0.5);
    }
    ctx.restore();
    ctx.fillStyle = '#000';
    ctx.fillRect((CakeView.SLOT_RECT.left + CakeView.SLOT_RECT.right) * 0.5 - 10, CakeView.SLOT_RECT.bottom + 10, 10, 10);
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
                var slotIndex = (Math.floor(CakeView.SHOWN_SLOTS / 2) + 2 + Math.round(this.slotPosition)) % CakeView.SLOT_COUNT;
                console.log(FILLINGS[this.slots[slotIndex]]);
                this.state = CakeView.state.FILLING;
                this.stateTime = 0;
            }
        }
    }
    if (this.state === CakeView.state.FILLING) {
        if (this.stateTime > 2000) {
            this.state = CakeView.state.RANDOM;
        }
    }
};

CakeView.prototype.space = function() {
    if (this.state === CakeView.state.RANDOM) {
        if (this.stateTime > 500) {
            this.state = CakeView.state.SLOWING;
            this.stateTime = 0;
            this.nextSlow = Math.ceil(this.slotPosition);
        }
    }
};
