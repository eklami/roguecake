var NewspaperView = function(triggersa, country ) {
this.triggersa = triggersa;
this.country = country;


addElement();

};

NewspaperView.prototype = new View();

NewspaperView.prototype.draw = function(ctx) {

}


function addElement () {

var cwrap = document.getElementById("canvaswrap");
var newD = document.createElement("div");

newD.id = 'newsviewd';
cwrap.appendChild(newD);

var newDiv = document.createElement("div");
newDiv.id = 'newspaper';

var headline = document.createElement("h1");
var headline = document.createTextNode(testTRIGGERS2[0].headline);

Newsheadline.id = 'headline';
newDiv.appendChild(Newsheadline); //add the text node to the newly created div.

newD.appendChild(newDiv);
newDiv.appendChild(Newsheadline);
}



var testTRIGGERS2 = [
{
    conditions: ['Gasoline', 'Booze', 'Toothpaste'],
    result: 'nervepoison',
    globalResult: false,
    headline: 'Cake became nerve poison while being transported',
    profit: 10,
    priority: 1
}]