// Game.js

SimpleRPG.Game = function (game) {
  this.myPlayer;
  this.otherPlayers;
};

SimpleRPG.Game.prototype.create = function () {
  this.buildWorld();
  this.buildPlayers();
};

SimpleRPG.Game.prototype.buildWorld = function () {

};

SimpleRPG.Game.prototype.buildPlayers = function () {
  this.myPlayer = this.add.group();
  this.myPlayer.enableBody = true;

  var p = this.myPlayer.create(
    this.world.centerX,
    this.world.centerY,
    'player',
    'Player0000');
  p.anchor.setTo(0.5, 0.5);
  p.body.moves = false;
  p.animations.add('WalkUp', this.game.math.numberArray(0, 3), 4, true);

  p.play('WalkUp');

};