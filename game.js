var canvas;
var ctx;

var FPS = 30;

var views = [new CakeView(),
             new TargetingView(),
             new NewspaperView()];
             
var viewIdx = 0;

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
        views[viewIdx].draw(ctx);
    }
    requestAnimationFrame(webFrame);
};

var initGame = function() {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 960;
    canvas.height = 540;

    document.body.appendChild(canvas);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    nextFrameTime = new Date().getTime() - 1;
    webFrame();
};