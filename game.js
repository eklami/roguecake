var mainCanvas;
var mainCtx;

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

var COUNTRIES = [{
    name: 'Southwest Kaunistatud',
    shortName: 'sk',
    mapLocation: [100, 100],
},
{
    name: 'FU-Shima',
    shortName: 'fushima',
    mapLocation: [400, 200],
}];

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
        new Article("Food waste illegalized"),
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

var devChangeView = function() {
    viewIdx = (viewIdx + 1) % views.length;
};

var webFrame = function() {
    var time = new Date().getTime();
    var updated = false;
    var updates = 0;
    while (time > nextFrameTime) {
        nextFrameTime += 1000 / FPS;
        views[viewIdx].update(1000 / FPS);
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

    document.body.appendChild(mainCanvas);
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
        Mousetrap.bindGlobal('v', devChangeView);
    }
};
