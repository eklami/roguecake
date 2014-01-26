var NewspaperView = function(gameState) {
    this.gameState = gameState;
    this.addElements();
    this.music = new Audio('music_morning', true);
    this.date = new Date();
    this.date.setFullYear(2040);
};

NewspaperView.prototype = new View();

NewspaperView.prototype.draw = function(ctx) {
};

NewspaperView.prototype.replace = function(textIn, country, thirdFilling) {
	var regExp = new RegExp('\\['+'company name'+'\\]', 'g');
	var text = textIn.replace(regExp, this.gameState.companyName);
	regExp = new RegExp('\\['+'cake company'+'\\]', 'g');
	text = text.replace(regExp, this.gameState.companyName);
	regExp = new RegExp('\\['+'third filling'+'\\]', 'g');
	if (thirdFilling === undefined) thirdFilling = "";
	text = text.replace(regExp, thirdFilling);
	text = text.replace("[country]", country);
	return text;
}

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
    this.article.innerHTML = this.gameState.news[selected].text ? this.replace(this.gameState.news[selected].text,this.gameState.news[selected].country,this.gameState.news[selected].thirdFilling) : '';
    this.country.textContent = this.gameState.news[selected].country ? "(" + this.gameState.news[selected].country.toUpperCase() + ")": '';
    this.date.setTime(this.date.getTime() + 1000 * 60 * 60 * 24);
    this.dateslot.textContent = this.date.toDateString();
    this.newsView.style.display = 'block';
    this.readTime = 0;
    this.exiting = false;
};

NewspaperView.prototype.exit = function() {
    this.music.stop();
    this.newsView.style.display = 'none';
};

NewspaperView.prototype.update = function(deltaTimeMillis) {
    this.readTime += deltaTimeMillis;
    return this.exiting;
};

NewspaperView.prototype.space = function() {
    if (this.readTime > 500) {
        this.exiting = true;
    }
};

NewspaperView.prototype.addElements = function() {
    var wrap = document.getElementById("canvaswrap");
    this.newsView = document.createElement("div");
    this.newsView.id = 'newsviewd';
    wrap.appendChild(this.newsView);
    var newspaperDiv = document.createElement("div");
    newspaperDiv.id = 'newspaper';
    this.newsView.appendChild(newspaperDiv);
    
    this.dateslot = document.createElement("p");
    this.dateslot.id = 'dateslot';
    newspaperDiv.appendChild(this.dateslot);

    this.headline = document.createElement("h1");
    this.headline.id = 'headline';
    newspaperDiv.appendChild(this.headline);
    this.country = document.createElement("b");
    this.country.id = 'country';
    newspaperDiv.appendChild(this.country);
    this.article = document.createElement("p");
    this.article.id = 'article';
    newspaperDiv.appendChild(this.article);

     this.newsimg = document.createElement("img");
    this.newsimg.id = 'newsimg';
    this.newsimg.src ="Assets/lion.png";
    newspaperDiv.appendChild(this.newsimg);
};
