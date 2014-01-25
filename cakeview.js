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
    this.plateSprite = new Sprite('cakeplate.png');
    this.machineSprite = new Sprite('Cake_Machine.png');
    this.conveyorSprite = new Sprite('production_line.png');
    this.bgSprite = new Sprite('cake_background.png');
    this.listBgSprite = new Sprite('digitalsign.png');
    this.cakeLayerSprite = new Sprite('cake_layer.png');

    this.particleSystem = new ParticleSystem(540 - CakeView.CONVEYOR_HEIGHT);

    this.state = CakeView.state.RANDOM;
    this.randomizeSlots();

    this.text = '';
    this.textHidden = 0;
    this.textHiddenDirection = 1;

    this.currentCake = 0;
    this.conveyorPosition = 0; // interpolated value corresponding to currentCake
};

CakeView.prototype = new View();

CakeView.SLOT_SPEED = 0.015;
CakeView.SLOT_COUNT = 20;
CakeView.SLOT_WIDTH = 75;
CakeView.SHOWN_SLOTS = 5;
CakeView.SLOT_RECT = new Rect(480 - CakeView.SLOT_WIDTH * CakeView.SHOWN_SLOTS * 0.5,
                              480 + CakeView.SLOT_WIDTH * CakeView.SHOWN_SLOTS * 0.5,
                              15, 15 + 75);
CakeView.CAKE_COUNT = 3;
CakeView.FILLINGS_PER_CAKE = 3;

CakeView.PLATE_DISTANCE = 240;
CakeView.CONVEYOR_HEIGHT = 160;

CakeView.state = {
    RANDOM: 0,
    SLOWING: 1,
    CHOOSECAKE: 2,
    FILLING: 3,
    FINISH: 4
};

CakeView.prototype.enter = function() {
    this.gameState.cakes = [];
    while (this.gameState.cakes.length < CakeView.CAKE_COUNT) {
        this.gameState.cakes.push(new Cake());
    }
    this.state = CakeView.state.RANDOM;
    this.conveyorPosition = CakeView.CAKE_COUNT + 2;
    this.currentCake = Math.floor((CakeView.CAKE_COUNT - 1) / 2);
};

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

CakeView.prototype.selectFilling = function(fillingIndex) {
    this.text = FILLINGS[fillingIndex];
    this.textHidden = 0;
    this.textHiddenDirection = 1;
    this.textAnimTime = 0;
};

CakeView.prototype.chooseCake = function(fillingIndex, createEffects) {
    if (createEffects === undefined) {
        createEffects = true;
    }
    this.gameState.cakes[this.currentCake].fillings.push(FILLINGS[fillingIndex]);
    this.changeState(CakeView.state.FILLING);
    //this.logCakes();
    if (createEffects) {
        for (var i = 0; i < 20; ++i) {
            var x = (CakeView.SLOT_RECT.left + CakeView.SLOT_RECT.right) * 0.5 + (Math.random() - 0.5) * 20;
            var y = CakeView.SLOT_RECT.bottom + 60;
            var pos = new Vec2(x, y);
            var vel = new Vec2(0, 1200);
            var acc = new Vec2(0, 500);
            var size = 20;
            var color = FILLING_COLORS[fillingIndex];
            var lifeSeconds = 1;
            var createsSplash = true;
            var splashCount = 3;
            var splashAngle = Math.PI * 1.5;
            var splashAngleVariation = Math.PI * 0.7;
            var splashVel = 300;
            var splashVelVariation = 260;
            var part = new Particle(pos, vel, acc, size, color, lifeSeconds,
                                createsSplash, splashCount,
                                splashAngle, splashAngleVariation,
                                splashVel, splashVelVariation);
            this.particleSystem.particles.push(part);
        }
    }
};

CakeView.prototype.logCakes = function() {
    for (var i = 0; i < this.gameState.cakes.length; ++i) {
        cakeStr = [];
        for (var j = 0; j < this.gameState.cakes[i].fillings.length; ++j) {
            cakeStr.push(this.gameState.cakes[i].fillings[j]);
        }
        console.log('Cake ' + i + ': ' + cakeStr.join(', '));
    }
};

CakeView.prototype.changeState = function(state) {
    this.state = state;
    this.stateTime = 0;
};

CakeView.ease = function(x) {
    return (Math.asin(x * 2 - 1) + 0.5 * Math.PI) / Math.PI;
};

CakeView.prototype.draw = function(ctx) {
    this.bgSprite.draw(ctx, 0, 0);

    this.drawConveyor(ctx);

    this.particleSystem.draw(ctx);

    ctx.save();
    canvasUtil.clipRect(ctx, CakeView.SLOT_RECT);
    ctx.fillStyle = '#eee';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (var i = 0; i < CakeView.SHOWN_SLOTS + 1; ++i) {
        var slotIndex = (i + Math.floor(this.slotPosition)) % CakeView.SLOT_COUNT;
        var slotOffset = this.slotPosition - Math.floor(this.slotPosition);
        this.iconSprites[this.slots[slotIndex]].drawRotated(ctx, (i - CakeView.ease(slotOffset) + 0.5) * CakeView.SLOT_WIDTH + CakeView.SLOT_RECT.left, (CakeView.SLOT_RECT.top + CakeView.SLOT_RECT.bottom) * 0.5);
    }
    ctx.restore(ctx);
    this.machineSprite.draw(ctx, 0, 0);
    this.drawText(ctx);
};

CakeView.prototype.drawText = function(ctx) {
    ctx.font = '46px digital';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    var shownText = this.text;
    if (this.textHidden >= 0 && this.textHidden < this.text.length && this.state !== CakeView.state.FILLING) {
        shownText = this.text.substring(0, this.textHidden) + ' ' + this.text.substring(this.textHidden + 1, this.text.length);
    }

    var textX = (CakeView.SLOT_RECT.left + CakeView.SLOT_RECT.right) * 0.5;
    var textY = CakeView.SLOT_RECT.bottom + 27;
    ctx.fillStyle = '#b05';
    ctx.fillText(shownText, textX + 1, textY + 1);
    ctx.fillText(shownText, textX - 1, textY + 1);
    ctx.fillText(shownText, textX + 1, textY - 1);
    ctx.fillText(shownText, textX - 1, textY - 1);
    ctx.fillStyle = '#f8a';
    ctx.fillText(shownText, textX, textY);
};

CakeView.prototype.drawConveyor = function(ctx) {
    var platePos = new Vec2((CakeView.SLOT_RECT.left + CakeView.SLOT_RECT.right) * 0.5, ctx.canvas.height - CakeView.CONVEYOR_HEIGHT);
    var listPos = new Vec2((CakeView.SLOT_RECT.left + CakeView.SLOT_RECT.right) * 0.5, ctx.canvas.height - 92);
    var listBgPos = new Vec2(listPos.x, listPos.y + 37);

    platePos.x -= this.conveyorPosition * CakeView.PLATE_DISTANCE;
    listPos.x -= this.currentCake * CakeView.PLATE_DISTANCE;
    listBgPos.x -= CakeView.CAKE_COUNT * CakeView.PLATE_DISTANCE;
    for (var i = 0; i < CakeView.CAKE_COUNT * 2; ++i) {
        this.listBgSprite.drawRotated(ctx, listBgPos.x, listBgPos.y);
        listBgPos.x += CakeView.PLATE_DISTANCE;
    }

    var conveyorX = platePos.x;
    while (conveyorX < 0) {
        conveyorX += ctx.canvas.width;
    }
    conveyorX = conveyorX % ctx.canvas.width;

    this.conveyorSprite.draw(ctx, conveyorX, 0);
    this.conveyorSprite.draw(ctx, conveyorX - ctx.canvas.width, 0);
    for (var i = 0; i < CakeView.CAKE_COUNT; ++i) {
        this.plateSprite.drawRotated(ctx, platePos.x, platePos.y);
        if (Math.abs(this.conveyorPosition - this.currentCake) < 0.2) {
            this.gameState.cakes[i].drawList(ctx, listPos.x, listPos.y, '#000', '#555');
        }
        platePos.x += CakeView.PLATE_DISTANCE;
        listPos.x += CakeView.PLATE_DISTANCE;
    }
};

CakeView.prototype.animateConveyor = function(deltaTimeMillis) {
    if (this.state === CakeView.state.FINISH) {
        this.conveyorPosition -= 0.010 * deltaTimeMillis;
    } else {
        if (this.conveyorPosition < this.currentCake) {
            this.conveyorPosition += 0.006 * deltaTimeMillis;
            if (this.conveyorPosition > this.currentCake) {
                this.conveyorPosition = this.currentCake;
            }
        } else if (this.conveyorPosition > this.currentCake) {
            this.conveyorPosition -= 0.006 * deltaTimeMillis;
            if (this.conveyorPosition < this.currentCake) {
                this.conveyorPosition = this.currentCake;
            }
        }
    }
};

CakeView.prototype.animateText = function(deltaTimeMillis) {
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

CakeView.prototype.update = function(deltaTimeMillis) {
    this.slotPosition += deltaTimeMillis * this.slotSpeed;
    this.stateTime += deltaTimeMillis;
    if (this.state === CakeView.state.RANDOM) {
        this.slotSpeed = CakeView.SLOT_SPEED;
    }
    if (this.state === CakeView.state.SLOWING) {
        if (this.slotPosition > this.nextSlow) {
            this.slotSpeed -= CakeView.SLOT_SPEED * 0.333;
            this.nextSlow += 1;
            if (this.slotSpeed < CakeView.SLOT_SPEED * 0.01) {
                this.slotSpeed = 0;
                this.slotPosition = Math.round(this.slotPosition);
                var slotIndex = (Math.floor(CakeView.SHOWN_SLOTS / 2) + Math.round(this.slotPosition)) % CakeView.SLOT_COUNT;
                this.changeState(CakeView.state.CHOOSECAKE);
                this.fillingIndex = this.slots[slotIndex];
                this.selectFilling(this.fillingIndex);
            }
        }
    }
    if (this.state === CakeView.state.FILLING) {
        if (this.stateTime > 800) {
            this.changeState(CakeView.state.RANDOM);
            this.text = '';
            if (this.cakeFull(this.currentCake)) {
                this.right();
            }
            if (this.cakeFull(this.currentCake)) {
                this.changeState(CakeView.state.FINISH);
            }
        }
    }
    
    this.animateConveyor(deltaTimeMillis);
    this.animateText(deltaTimeMillis);

    this.particleSystem.update(deltaTimeMillis);

    if (this.state === CakeView.state.FINISH && this.stateTime > 1000) {
        return true;
    }
};

CakeView.prototype.space = function() {
    if (this.state === CakeView.state.RANDOM) {
        if (this.stateTime > 200) {
            this.changeState(CakeView.state.SLOWING);
            this.nextSlow = Math.ceil(this.slotPosition);
        }
    }
    if (this.state === CakeView.state.CHOOSECAKE && this.stateTime > 200) {
        this.chooseCake(this.fillingIndex);
    }
};

CakeView.prototype.animateCakeChange = function() {
};

CakeView.prototype.cakeFull = function(cakeIndex) {
    return this.gameState.cakes[cakeIndex].fillings.length >= CakeView.FILLINGS_PER_CAKE;
};

CakeView.prototype.right = function() {
    this.currentCake = (this.currentCake + 1) % CakeView.CAKE_COUNT;
    var moves = 1;
    while (this.cakeFull(this.currentCake) && moves < CakeView.CAKE_COUNT) {
        this.currentCake = (this.currentCake + 1) % CakeView.CAKE_COUNT;
        ++moves;
    }
    this.animateCakeChange();
};

CakeView.prototype.rightArrow = function() {
    if (this.state !== CakeView.state.FILLING) {
        this.right();
    }
};

CakeView.prototype.leftArrow = function() {
    if (this.state !== CakeView.state.FILLING) {
        this.currentCake = (this.currentCake - 1 + CakeView.CAKE_COUNT) % CakeView.CAKE_COUNT;
        var moves = 1;
        while (this.cakeFull(this.currentCake) && moves < CakeView.CAKE_COUNT) {
            this.currentCake = (this.currentCake - 1 + CakeView.CAKE_COUNT) % CakeView.CAKE_COUNT;
            ++moves;
        }
        this.animateCakeChange();
    }
};

CakeView.prototype.developerSkip = function() {
    while (!this.cakeFull(this.currentCake)) {
        this.chooseCake(Math.floor(Math.random() * FILLINGS.length) % FILLINGS.length, false);
        if (this.cakeFull(this.currentCake)) {
            this.right();
        }
    }
    this.logCakes();
};
