var Piano = {

  DEFAULT_INSTRUMENT: "acoustic_grand_piano",
  WHITE_KEY_COUNT: 52,
  WHITE_KEY_NOTES: [21, 23, 24, 26, 28, 29, 31, 33, 35, 36, 38, 40,
                    41, 43, 45, 47, 48, 50, 52, 53, 55, 57, 59, 60,
                    62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81,
                    83, 84, 86, 88, 89, 91, 93, 95, 96, 98, 100,
                    101, 103, 105, 107, 108],
  TEMPLATE_URLS: {
    PIANO: 'static/js/ejs/piano.ejs',
    KEY: 'static/js/ejs/key.ejs'
  },

  init: function () {
    this.loading = $('#loading');
    this.calculateDimensions();
    this.piano = this.renderPiano({
      padding: this.padding
    });
    $('#main').append(this.piano);

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
    var key = this.renderKey({
      type: 'black',
      note: note,
      left: offset - this.whiteKeyWidth,
      width: this.blackKeyWidth,
      height: this.blackKeyHeight
    });
    this.piano.append(key);
    key.click(this.playKey);
  },

  drawWhiteKey: function (note) {
    var key = this.renderKey({
      type: 'white',
      note: note,
      width: this.whiteKeyWidth,
      height: this.whiteKeyHeight
    });
    this.piano.append(key);
    key.click(this.playKey);
  },

  drawKeys: function () {
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
  },

  renderTemplate: function (url, options) {
    return $(new EJS({url: url}).render({
      options: options
    }));
  },

  renderPiano: function (options) {
    return this.renderTemplate(this.TEMPLATE_URLS.PIANO, options);
  },

  renderKey: function (options) {
    return this.renderTemplate(this.TEMPLATE_URLS.KEY, options);
  }
};

$(document).ready(function () {
  Piano.init();
});
