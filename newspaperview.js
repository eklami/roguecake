var NewspaperView = function(gameState) {
    this.gameState = gameState;

    var wrap = document.getElementById("canvaswrap");
    this.newsView = document.createElement("div");
    this.newsView.id = 'newsviewd';
    wrap.appendChild(this.newsView);
    
    this.newspaperDivs = [];
    for (var i = 0; i < 3; ++i) {
        var newspaperDiv = document.createElement("div");
        newspaperDiv.classList.add('newspaper');
        this.newsView.appendChild(newspaperDiv);
        this.newspaperDivs.push(newspaperDiv);
        this.addElements(newspaperDiv);
    }

    this.music = new Audio('music_morning', true);
    this.date = new Date();
    this.date.setFullYear(2040);
    
    this.selectedPaper = 1;
    this.targetPaper = 1;
};

NewspaperView.prototype = new View();

NewspaperView.prototype.draw = function(ctx) {
};

NewspaperView.prototype.enter = function() {
    this.music.play();
	var selected = 0;
	var priority = 0;
	for (var i = 0; i < this.gameState.news.length; i++) {
		if (this.gameState.news[i].priority > priority) {
			priority = this.gameState.news[i].priority;
			selected = i;
		}
	}
    this.headline.textContent = this.gameState.news[selected].headline;
    this.article.innerHTML = this.gameState.news[selected].text ? this.gameState.news[selected].text : '';
    this.country.textContent = this.gameState.news[selected].country ? "(" + this.gameState.news[selected].country.toUpperCase() + ")": '';
    this.date.setTime(this.date.getTime() + 1000 * 60 * 60 * 24);
    this.dateslot.textContent = this.date.toDateString();
    this.newsView.style.display = 'block';
    this.readTime = 0;
    this.exiting = false;

    this.selectedPaper = 1;
    this.targetPaper = 1;
};

NewspaperView.prototype.exit = function() {
    this.music.stop();
    this.newsView.style.display = 'none';
};

NewspaperView.prototype.update = function(deltaTimeMillis) {
    this.readTime += deltaTimeMillis;
    if (this.selectedPaper < this.targetPaper) {
        this.selectedPaper += deltaTimeMillis * 0.002;
        if (this.selectedPaper > this.targetPaper) {
            this.selectedPaper = this.targetPaper;
        }
    }
    if (this.selectedPaper > this.targetPaper) {
        this.selectedPaper -= deltaTimeMillis * 0.002;
        if (this.selectedPaper < this.targetPaper) {
            this.selectedPaper = this.targetPaper;
        }
    }
    for (var i = 0; i < 3; ++i) {
        this.setPapertransform(i);
    }
    return this.exiting;
};

NewspaperView.prototype.space = function() {
    if (this.readTime > 500) {
        this.exiting = true;
    }
};

NewspaperView.prototype.setPapertransform = function(paperIndex) {
    var element = this.newspaperDivs[paperIndex];
    var offset = this.selectedPaper - paperIndex;
    var trans = "rotate("+(offset * 6)+"deg) translate("+(offset*90)+"%, 0)";
    element.style.webkitTransform = trans;
    element.style.transform = trans;
    element.style.MozTransform = trans;
};

NewspaperView.prototype.addElements = function(newspaperDiv) {
    this.dateslot = document.createElement("p");
    this.dateslot.classList.add('dateslot');
    newspaperDiv.appendChild(this.dateslot);

    this.headline = document.createElement("h1");
    this.headline.classList.add('headline');
    newspaperDiv.appendChild(this.headline);
    this.country = document.createElement("b");
    this.country.classList.add('country');
    newspaperDiv.appendChild(this.country);
    this.article = document.createElement("p");
    this.article.classList.add('article');
    newspaperDiv.appendChild(this.article);

    this.newsimg = document.createElement("img");
    this.newsimg.classList.add('newsimg');
    this.newsimg.src ="Assets/lion.png";
    newspaperDiv.appendChild(this.newsimg);
};

NewspaperView.prototype.rightArrow = function() {
    this.targetPaper = (this.targetPaper + 3 - 1) % 3;
};

NewspaperView.prototype.leftArrow = function() {
    this.targetPaper = (this.targetPaper + 1) % 3;
};
