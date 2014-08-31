/**
 * Preloader.js
 *
 * Load in assets and levels
 */
(function () {
  /**
   * 
   * @constructor
   * @param game
   */
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

    // Start Loading
    this.load.atlasXML('player', 'images/spritesheets/player.png', 'images/spritesheets/player.xml');

    this.load.bitmapFont('font', 'fonts/font.png', 'fonts/font.fnt');

    //this.load.tilemap('mainWorld', 'tilemaps/MainWorld.json', null, Phaser.Tilemap.TILED_JSON);
    //this.load.atlasXML('World', 'tilemaps/dg_edging132.gif', 'tilemaps/dg_edging132.xml');
    this.load.tilemap('mainWorld', 'tilemaps/MainWorld00.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('mainWorldImage', 'tilemaps/MainWorld00.png');
  };

  SimpleRPG.Preloader.prototype.create = function () {
    this.preloadBar.cropEnabled = false;

    // Ask meteor for player data
    Meteor.call('create_new_player', Session.get('session_id'), function (e, r) {
      Session.set('player_data', r);
    });

    Meteor.call('get_world', function (e, r) {
      Session.set('world', r);
    });
  };

  SimpleRPG.Preloader.prototype.update = function () {
    if (/*this.cache.isSoundDecoded('game_audio') &&*/ !this.ready) {
      this.ready = true;
      this.state.start('StartMenu');
    }
  };
})();