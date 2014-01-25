var View = function() {
};

View.prototype.leftArrow = function() {
};
View.prototype.rightArrow = function() {
};
View.prototype.downArrow = function() {
};
View.prototype.upArrow = function() {
};
View.prototype.space = function() {
};

// Should return true when the view wants to exit.
View.prototype.update = function(deltaTimeMillis) {
};
View.prototype.draw = function(ctx) {
};
View.prototype.enter = function() {
};
View.prototype.exit = function() {
};

// For testing, should fill in random player input and exit the view.
View.prototype.developerSkip = function() {    
};