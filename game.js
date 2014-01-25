var mainCanvas;
var mainCtx;

(function() {
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
})();

var DEV_MODE = true;
var FPS = 30;

var FILLINGS = ['Baby seal',
                'Bacon',
                'Booze',
                'Bullets',
                'Catfood',
                'Cocaine',
                'Gasoline',
                'Mantis shrimp',
                'Strawberry',
                'Toothpaste',
];

var FILLING_COLORS = [
    '#3bb',
    '#f88',
    '#4c4',
    '#cc0',
    '#862',
    '#ddc',
    '#5d2',
    '#90f',
    '#f33',
    '#eef',
];

var COUNTRIES = [
{
    name: 'Yankia',
    shortName: 'us',
    mapLocation: [300, 428],
},
{
    name: 'Cartellia',
    shortName: 'mex',
    mapLocation: [440, 564],
},
{
    name: 'Turquoiseland',
    shortName: 'greenland',
    mapLocation: [748, 250],
},
{
    name: 'Hippo Coast',
    shortName: 'africa',
    mapLocation: [870, 615],
},
{
    name: 'The Topseas',
    shortName: 'nl',
    mapLocation: [953, 366],
},
{
    name: 'Tailland',
    shortName: 'fi',
    mapLocation: [1043, 300],
},
{
    name: 'Svetlania',
    shortName: 'ru',
    mapLocation: [1154, 333],
},
{
    name: 'Southwest Kaunistatud',
    shortName: 'sk',
    mapLocation: [1566, 413],
},
{
    name: 'FU-Shima',
    shortName: 'fushima',
    mapLocation: [1660, 444],
},
{
    name: 'St. Roos & Koalas',
    shortName: 'au',
    mapLocation: [1737, 842],
}
];

var TRIGGERS = [
{
    conditions: ['Gasoline', 'Booze', 'Toothpaste'],
    result: 'nervepoison',
    globalResult: false,
    headline: 'Cake became nerve poison while being transported',
    profit: 10,
    priority: 1
},
{
    conditions: ['nervepoison', 'Baby seal'],
    result: 'poisonedseals',
    globalResult: false,
    headline: 'Cruel people of [country] poison baby seals',
    profit: 0,
    priority: 2
},
{
    inCountry: 'sk',
    profit: 10,
    priority: 3,
    conditions: ['Bullets', 'Toothpaste', 'Catfood'],
    headline: "Southwest Kaunistatud showered with creamy goodness",
    text: "The glorious nation of Southwest Kaunistatud was very pleased with [cakecompany]'s offering of cakes that supplied the nation with ammunition, created a long-awaited national dental care programme and fed the mountain lions that were a constant threat to the brave people of the nation.",
}
];

var Cake = function() {
    this.fillings = []; // list of strings from FILLINGS
};

Cake.prototype.drawList = function(ctx, centerX, topY, mainColor, edgeColor, spacing) {
    if (spacing === undefined) {
        spacing = 25;
    }
    ctx.font = '20px digital';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (var i = 0; i < this.fillings.length; ++i) {
        var shownText = this.fillings[i];
        var textX = centerX;
        var textY = topY + i * spacing;
        ctx.fillStyle = edgeColor;
        ctx.fillText(shownText, textX + 1, textY + 1);
        ctx.fillText(shownText, textX - 1, textY + 1);
        ctx.fillText(shownText, textX + 1, textY - 1);
        ctx.fillText(shownText, textX - 1, textY - 1);
        ctx.fillStyle = mainColor;
        ctx.fillText(shownText, textX, textY);
    }
};

// Text can be undefined
var Article = function(headline, text) {
    this.headline = headline;
    this.text = text;
};

var GameState = function() {
    // List of Cakes, filled in by CakeView, cleared by TargetingView
    this.cakes = [];
    // List of Articles, filled in by TargetingView, cleared by NewspaperView
    this.news = [
        new Article("Food waste illegalized", "From this day onwards, neither consumers nor food manufacturers are allowed to throw away edible things. Anything passable as human nutrition needs to be distributed and eaten. Analysts expect this to be extremely detrimental to innovation in the gastronomic industries."),
        new Article("Demand of cakes increasing worldwide"),
    ];
    // List of strings, filled in by TargetingView based on filled conditions.
    // Read by TargetingView when checking conditions
    this.worldState = [];
};

var views;
var viewIdx = 0;

var leftArrow = function() {
    views[viewIdx].leftArrow();
};
var rightArrow = function() {
    views[viewIdx].rightArrow();
};
var upArrow = function() {
    views[viewIdx].upArrow();
};
var downArrow = function() {
    views[viewIdx].downArrow();
};
var space = function() {
    views[viewIdx].space();
};

var changeView = function() {
    views[viewIdx].exit();
    viewIdx = (viewIdx + 1) % views.length;
    views[viewIdx].enter();
};

var developerSkip = function() {
    views[viewIdx].developerSkip();
    changeView();
};

var webFrame = function() {
    var time = new Date().getTime();
    var updated = false;
    var updates = 0;
    while (time > nextFrameTime) {
        nextFrameTime += 1000 / FPS;
        if (views[viewIdx].update(1000 / FPS)) {
            changeView();
        }
        updates++;
    }
    if (updates > 1) {
        console.log('dropped ' + (updates - 1) + ' frames');
    }
    if (updates > 0) {
        views[viewIdx].draw(mainCtx);
    }
    requestAnimationFrame(webFrame);
};

var initGame = function() {

    mainCanvas = document.createElement('canvas');
    mainCtx = mainCanvas.getContext('2d');
    mainCanvas.width = 960;
    mainCanvas.height = 540;

    var gameState = new GameState();
    views = [new NewspaperView(gameState),
             new CakeView(gameState),
             new TargetingView(gameState)];
    views[0].enter();

    cwrap = document.createElement('div');
    cwrap.id = 'canvaswrap';
    canvaswrap.appendChild(mainCanvas);
    mainCtx.fillStyle = '#fff';
    mainCtx.fillRect(0, 0, mainCtx.canvas.width, mainCtx.canvas.height);
    nextFrameTime = new Date().getTime() - 1;
    webFrame();
    
    Mousetrap.bindGlobal('left', leftArrow);
    Mousetrap.bindGlobal('right', rightArrow);
    Mousetrap.bindGlobal('down', downArrow);
    Mousetrap.bindGlobal('up', upArrow);
    Mousetrap.bindGlobal('space', space);

    if (DEV_MODE) {
        Mousetrap.bindGlobal('v', developerSkip);
    }
};
