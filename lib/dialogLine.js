var DialogLine = function(string, clearScreenColor) {
	this.text = string;
	this.blankScreenBeforeText = true;

	// Use if defined.
	if ( clearScreenColor ) {
		this.blankScreenColor = clearScreenColor;
	} else {
		this.blankScreenColor = 'black';
	}
}