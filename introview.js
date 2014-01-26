var IntroView = function(gameState) {
    this.gameState = gameState;
};

IntroView.prototype = new View();

IntroView.prototype.enter = function() {
    console.log("IntroView enter");
    this.addAElements();
    this.exiting = false;
    this.readTime = 0;
};

IntroView.prototype.exit = function() {
    console.log("IntroView exit");

    var companyName = "Default";
    companyName = document.getElementById('company_input').value;
    console.log("Company: "+companyName);
    if (companyName == "") companyName = "Cake Makers";
    this.gameState.companyName = companyName;

    if(document.getElementById("animview")){
    var elem = document.getElementById("animview");
    elem.parentNode.removeChild(elem);
    }

};

IntroView.prototype.update = function(deltaTimeMillis) {
    this.readTime += deltaTimeMillis;
    return this.exiting;
};

IntroView.prototype.space = function() {
    if (this.readTime > 500) {
        this.exiting = true;
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

var logname = document.createElement("div");
logname.id = 'company_name';
animw.appendChild(logname);
var inputElement = document.createElement("input");
inputElement.id = 'company_input';
inputElement.placeholder = "Company?";
inputElement.maxLength = 12;

logname.appendChild(inputElement);


animw.appendChild(globeplace);
logo.appendChild(logoimg);
animw.appendChild(logo);
};


