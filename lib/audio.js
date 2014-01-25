var Audio = function(filename, isLooping, fileExtensions) {
    if (isLooping === undefined) {
        isLooping = false;
    }
    if (fileExtensions === undefined) {
        fileExtensions = ['ogg', 'mp3'];
    }
    this.loaded = false;
    this.playWhenLoaded = false;
    this.audio = document.createElement('audio');
    this.audio.loop = isLooping;
    this.filenames = [];
    for (var i = 0; i < fileExtensions.length; ++i) {
        this.filenames.push(filename + '.' + fileExtensions[i]);
    }
    this.addSourcesTo(this.audio);
    this.clones = [];
}

Audio.prototype.addSourcesTo = function(audioElement) {
    for (var i = 0; i < this.filenames.length; ++i) {
        var source = document.createElement('source');
        source.src = 'Assets/Sounds/' + this.filenames[i];
        audioElement.appendChild(source);
    }
}

Audio.prototype.playClone = function () {
    if (this.audio.ended) {
        this.audio.play();
        return;
    }
    for (var i = 0; i < this.clones.length; ++i) {
        if (this.clones[i].ended) {
            this.clones[i].currentTime = 0;
            this.clones[i].play();
            return;
        }
    }
    var clone = document.createElement('audio');
    this.addSourcesTo(clone);
    this.clones.push(clone);
    clone.play();
}

Audio.prototype.play = function () {
    this.audio.play();
}

Audio.prototype.stop = function () {
    this.audio.pause();
    this.audio.currentTime = 0;
}