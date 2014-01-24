//Mikä kakku, mihin -> seuraus
var NewspaperView = function(contentarray, country ) {
this.contentarray = contentarray;
this.country = country;
};

NewspaperView.prototype = new View();

NewspaperView.prototype.draw = function(ctx) {


	ctx.fillStyle = '#888';
	ctx.fillRect(70,70,600,600);
	ctx.fillStyle = '#333';


	ctx.font="29px Georgia";
	ctx.fillText( ResultsArray[0].headline, 120,100 ,100);

	ctx.font="20px Georgia";
	ctx.fillText( ResultsArray[0].text, 120,140);

};


var ResultsArray = [
 { "headline": "Headline1", "img": "img/catimg.jpg", "text": "Somethingsomething Somethingsomething Somethingsomething" },
 { "headline": "Headline2", "img": "npimg.png", "text": "Somethingsomething" },
 { "headline": "Headline3", "img": "npimg.png", "text": "Somethingsomething" },
 { "headline": "Headline4", "img": "npimg.png", "text": "Somethingsomething" },
 { "headline": "Headline5", "img": "npimg.png", "text": "Somethingsomething" }
]