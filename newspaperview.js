var NewspaperView = function(gameState) {
    this.gameState = gameState;
    this.addElements();
};

NewspaperView.prototype = new View();

NewspaperView.prototype.draw = function(ctx) {
};

NewspaperView.prototype.enter = function() {
    this.headline.textContent = this.gameState.news[0].headline;
    this.article.textContent = this.gameState.news[0].text ? this.gameState.news[0].text : '';
    this.newsView.style.display = 'block';
};

NewspaperView.prototype.exit = function() {
    this.newsView.style.display = 'none';
};

NewspaperView.prototype.addElements = function() {
    var wrap = document.getElementById("canvaswrap");
    this.newsView = document.createElement("div");
    this.newsView.id = 'newsviewd';
    wrap.appendChild(this.newsView);
    var newspaperDiv = document.createElement("div");
    newspaperDiv.id = 'newspaper';
    this.newsView.appendChild(newspaperDiv);

    this.headline = document.createElement("h1");
    this.headline.id = 'headline';
    newspaperDiv.appendChild(this.headline);
    this.article = document.createElement("p");
    this.article.id = 'article';
    newspaperDiv.appendChild(this.article);
};
