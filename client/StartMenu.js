// StartMenu.js

SimpleRPG.StartMenu = function (game) {
  this.titleText;
  this.startPrompt;
}

/**
 * @override
 */
SimpleRPG.StartMenu.prototype.create = function () {

  this.titleText = this.add.image(this.world.centerX, this.world.centerY - 220, 'titleImage');
  this.titleText.anchor.setTo(0.5, 0.5);

  startPrompt = this.add.bitmapText(
    this.world.centerX,
    this.world.centerY + 180, 
    'font', 
    'Touch to Start!', 24);
  startPrompt.align = 'center';
  startPrompt.x = this.world.centerX - startPrompt.textWidth / 2.0;

  startPrompt.inputEnabled = true;
  startPrompt.events.onInputDown.addOnce(this.startGame, this);
};

/**
 */
SimpleRPG.StartMenu.prototype.startGame = function (pointer) {
  this.state.start('Game');
  //this.state.start('Lobby');
};