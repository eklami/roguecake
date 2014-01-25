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
    name: 'Constitutionia',
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
    name: 'Efushima',
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
//JACKPOTS
{
    inCountry: 'sk',
    profit: 100,
    priority: 3,
    conditions: ['Bullets', 'Toothpaste', 'Catfood'],
    headline: "Southwest Kaunistatud showered with creamy goodness",
    text: "The glorious nation of Southwest Kaunistatud was very pleased with [cake company]'s offering of cakes that, by containing toothpaste, created the long-awaited national dental care programme and fed the mountain lions that were a constant threat to the brave people of the nation. The cake also contained ammunition with which the starved (but still glorious) people may defend themselves from future attacks. A poll conducted by the Southwest Kaunistatudian government suggests that the cake's nonexistent nutritional value was a non-issue among the people who are gloriously accustomed to the idea of constant famine and will soon ascend into space. Gloriously.",
},   
{
    inCountry: 'fushima',
    profit: 100,
    priority: 3,
    conditions: ['Mantis shrimp', 'Toothpaste', 'Bacon'],
    headline: "Efushima headline",
    text: "The densely populated island of Efushima went news-worthingly insane for the third time this week when a cake that conformed to the peculiar collective taste of the people struck the nation. Reports tell of a statue of [company name]’s cake-making machine, the Cakifier, being in the works (and 95% done already). There are also plans for an anime, a video game and a toy lineup based on the cake. Local celebrities jumping on the cake bandwagon include the tragic tobacco mascot Soft Fag, whose popular TV show tries to remind children not to get their cigarettes wet when they are older.",
},   
{
    inCountry: 'us',
    profit: 100,
    priority: 3,
    conditions: ['Bullets', 'Bacon', 'Gasoline'],
    headline: "Constitutionia headline",
    text: "The economic crisis of Constitutionia was relieved yesterday when shipments of [company name]’s “All-Purpose Cakes for Constitutionians” were received. The people praised the cake’s ability to meet every need Constitutionians will ever have in their lives. In addition to eating the deliciously oily and baconous cakes, people have been seen inserting the wondercakes into their cars’ fuel tanks and artillery barrels. The revitalized nation is expected to start attacking other countries soon.",
},   
{
    inCountry: 'au',
    profit: 100,
    priority: 3,
    conditions: ['Mantis shrimp', 'Gasoline', 'Catfood'],
    headline: "Aussie headline",
    text: "Hundreds of years of oppression under animal rule in the Southern island nation of St. Roos & Koalas is about to end, reports say. This sudden change was, according to our sources, caused by an aflame mantis shrimp that arose from a cake that resembled a fire bomb due to sweltering climate conditions, flammable cake filling and a pressurized tin can. No more do the citizens of St. Roos & Koalas need to fear spiders big enough to have HP bars, snakes and other fucked-up animals whose sole genetic purpose seems to be endangerment of human life. ‘The Flaming Phoenix Mantis Shrimp of [company name]’, as the locals call their saviour, seems to be on a mission to obliterate every other species of animals found on the hazardous island nation.",
},   
{
    inCountry: 'fi',
    profit: 100,
    priority: 3,
    conditions: ['Booze', 'Strawberry', 'Catfood'],
    headline: "Tailland headline",
    text: "The proud people of Tailland, known for their tradition of population control via suicide, have recently changed their primary national food from unnecessarily hard rye porridge to [company name]’s latest cake. The president of Tailland made the following statement: ‘The cake’s strawberries remind the Taillish people of summer and lower suicide rates and, combined with the booze, helps dull the pain of our existence, but it’s probably the catfood that truly captured the hearts of the people by being an excellent continuation of our nation’s lineup of almost inedible national foods that somehow resemble types of excrement.’",
},   
{
    inCountry: 'ru',
    profit: 100,
    priority: 3,
    conditions: ['Booze', 'Mantis shrimp', 'Baby seal'],
    headline: "Svetlania headline",
    text: "Following a carousal that ended up having only a handful of drunken interspecies fisticuffs in an undisclosed military location somewhere in rural Svetlania, government officials, mantis shrimps and baby seals have come to an agreement to combine their forces and know-how to produce, in their words, ‘a super awesome biomechanical submarine that can shock-punch the shit out of everything it sees, which is, well, everything’",
},   
{
    inCountry: 'nl',
    profit: 100,
    priority: 3,
    conditions: ['Cocaine', 'Booze', 'Gasoline'],
    headline: "The Topseas headline",
    text: "The economy of the Topseas improved drastically when pensioners around the nation started diving down the stairs of their local roller discos. Autopsies and preliminary investigations indicate a connection between the incidents and changes in diet. Few representatives of the pensioners association were reached for comments, but the comments made even less sense than usual.",
},   
{
    inCountry: 'greenland',
    profit: 100,
    priority: 3,
    conditions: ['Strawberry', 'Baby seal', 'Bacon'],
    headline: "Greenland headline",
    text: "Recent studies on people’s health in the icy nation of Turquoiseland show that the levels of scurvy among the people of the nation is in decline due to the popularity of [company name]’s strawberry-containing cakes. Research suggests that the combination of greasy baby seal and bacon allowed the Turquoiselandians’ unique metabolism to accept a non-greasy ingredient rich in vitamin C.",
},   
{
    inCountry: 'africa',
    profit: 100,
    priority: 3,
    conditions: ['Cocaine', 'Baby seal', 'Bullets'],
    headline: "Hippo Coast headline",
    text: "The civil unrest in Hippo Coast continues, as numerous sources report raving, armed youths with powder-covered faces and baby seal body armor (known among experts as ‘BSBA’) taking over villages around the country. Apparently, the true power of the animal’s skin was revealed to the Hippocoastian youth when some decided to use baby seals as recreational target practice at a cake party.",
},   
{
    inCountry: 'mex',
    profit: 100,
    priority: 3,
    conditions: ['Strawberry', 'Cocaine', 'Toothpaste'],
    headline: "Cartellia headline",
    text: "The grand boss of Cartellia announced a cease-fire yesterday in order to celebrate a new national holiday, “Cake Day” in honor of a cake that was received in the mail. ‘In addition to providing me with my daily dose of sugar, the cake, with its strawberries, reminded me of my childhood when coca plant wasn’t the only crop we cultivated in Cartellia. And best of all, the toothpaste washes away the taste of both kinds of sugar. Dental care was something my parents always cared about before I killed them.’",
},   
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
        var textY = topY + (CakeView.FILLINGS_PER_CAKE - 1 - i) * spacing;
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
             new TargetingView(gameState),
             new IntroView(gameState)];
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
