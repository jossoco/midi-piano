var Piano = {

  DEFAULT_INSTRUMENT: "acoustic_grand_piano",
  WHITE_KEY_COUNT: 52,
  WHITE_KEY_NOTES: [21, 23, 24, 26, 28, 29, 31, 33, 35, 36, 38, 40,
                    41, 43, 45, 47, 48, 50, 52, 53, 55, 57, 59, 60,
                    62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81,
                    83, 84, 86, 88, 89, 91, 93, 95, 96, 98, 100,
                    101, 103, 105, 107, 108],

  init: function (song) {
    this.loading = $('#loading');
    this.piano = $('#piano');
    this.calculateDimensions();
    this.song = song;

    var self = this;
    MIDI.loadPlugin({
      instrument: self.DEFAULT_INSTRUMENT,
      soundfontUrl: "./static/soundfont/",
      //api: "webaudio",
      callback: $.proxy(self.drawKeys, self)
    });
  },

  calculateDimensions: function () {
    var docWidth = $(document).width();
    var padding = Math.floor(docWidth * 0.02);
    var availWidth = docWidth - padding;

    this.borderWidth = 2;
    this.whiteKeyWidth = Math.floor(availWidth / this.WHITE_KEY_COUNT) - this.borderWidth;
    this.whiteKeyHeight = Math.floor(this.whiteKeyWidth * 4.5);
    this.blackKeyWidth = this.whiteKeyWidth - 2;
    this.blackKeyHeight = Math.floor(this.whiteKeyHeight * 0.8);
    this.padding = Math.floor(padding / 2);
  },

  playKey: function (event) {
    $('.active').removeClass('active');
    var key = $(event.target);
    var keyNote = key.attr('note');

    key.addClass('active');
    MIDI.noteOn(0, parseInt(keyNote), 127, 0);

    setTimeout(function () {
      key.removeClass('active');
    }, 200);
  },

  drawBlackKey: function (note, adjacentKeyIndex) {
    var offset = this.padding + (adjacentKeyIndex * this.whiteKeyWidth) +
        (adjacentKeyIndex * this.borderWidth);
    var key = $('<div class="black-key" note="' + note + '"></div>');
    key.css('left', (offset - this.whiteKeyWidth) + 'px');
    key.css('width', this.blackKeyWidth);
    key.css('height', this.blackKeyHeight);
    this.piano.append(key);
    key.click(this.playKey);
  },

  drawWhiteKey: function (note) {
    var key = $('<div class="white-key" note="' + note + '"></div>');
    key.css('width', this.whiteKeyWidth);
    key.css('height', this.whiteKeyHeight);
    this.piano.append(key);
    key.click(this.playKey);
  },

  drawKeys: function () {
    this.piano.css('top', this.padding + 'px');
    this.piano.css('left', this.padding + 'px');

    for (var i = 0; i < this.WHITE_KEY_COUNT; i++) {
      var note = this.WHITE_KEY_NOTES[i];
      this.drawWhiteKey(note);
  
      var nextWhiteNote = this.WHITE_KEY_NOTES[i+1];
      if (nextWhiteNote > note + 1) {
        this.drawBlackKey(note + 1, i + 1);
      }
    }

    this.loading.hide();
    this.piano.show();
    this.playSong();
  },

  playSong: function () {
    if (this.song) {
      var self = this;
      var i = 0;
      var interval = setInterval(function () {
        if (self.song[i]) {
          var key = $('div[note="' + self.song[i] + '"]');
          key.click();
          i++;
        }
        if (i == self.song.length) {
          clearInterval(interval);
        }
      }, 400);
    }
  }
};

$(document).ready(function () {
  Piano.init(songs.mary);
});
