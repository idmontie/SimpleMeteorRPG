// Preloader.js

(function () {

SimpleRPG.Preloader = function (game) {
  this.preloadBar = null;
  this.titleText = null;
  this.ready = false;
};

SimpleRPG.Preloader.prototype.preload = function () {
  this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
  this.preloadBar.anchor.setTo(0.5, 0.5);
  this.load.setPreloadSprite(this.preloadBar);

  this.titleText = this.add.image(this.world.centerX, this.world.centerY - 220, 'titleImage');
  this.titleText.anchor.setTo(0.5, 0.5);
};

SimpleRPG.Preloader.prototype.create = function () {
  this.preloadBar.cropEnabled = false;
};

SimpleRPG.Preloader.prototype.update = function () {
  if (this.cache.isSoundDecoded('game_audio') && !this.ready) {
    this.ready = true;
    this.state.start('StartMenu');
  }
};

})();