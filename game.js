var canvas;
var ctx;

var views = [new CakeView(),
             new TargetingView(),
             new NewspaperView()];
             
var viewIdx = 0;

var initGame = function() {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    
    views[viewIdx].draw(ctx);
};