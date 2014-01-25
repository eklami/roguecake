var IntroView = function() {
};

IntroView.prototype = new View();
IntroView.prototype.draw = function(ctx) {};
IntroView.prototype.enter = function() {
console.log("IntroView enter");
this.addAElements();
};

IntroView.prototype.exit = function() {
console.log("IntroView exit");

if(document.getElementById("animview")){
var elem = document.getElementById("animview");
elem.parentNode.removeChild(elem);
}
};

IntroView.prototype.addAElements = function() {
var wrap = document.getElementById("canvaswrap");
animw = document.createElement("div");
animw.id = 'animview';
wrap.appendChild(animw);

var globeplace = document.createElement("div");
globeplace.id = 'globe';

var logo = document.createElement("div");
logo.id = 'logo';
logo.style.position="absolute";
logo.style.zIndex="1";

var logoimg = document.createElement("img");
logoimg.src = "Assets/intrologo.png";
animw.appendChild(globeplace);
logo.appendChild(logoimg);
animw.appendChild(logo);
};


