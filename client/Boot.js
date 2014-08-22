// Boot.js
(function () {
  SimpleRPG = {};

  SimpleRPG.Boot = function (game) {};
  SimpleRPG.Boot.prototype.preload = function () {
    this.load.image('preloaderBar', 'images/preloaderBar.png');
    this.load.image('titleImage', 'images/titleImage.png');
  };

  SimpleRPG.Boot.prototype.create = function () {
    this.input.maxPointers = 1;
    this.stage.disableVisibilityChange = false;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.scale.minWidth = 270;
    this.scale.minHeight = 480;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.stage.forceLandscape = true;
    this.scale.setScreenSize(true);

    this.input.addPointer();
    this.stage.backgroundColor = "#000";

    this.state.start('Preloader');
  };

})();