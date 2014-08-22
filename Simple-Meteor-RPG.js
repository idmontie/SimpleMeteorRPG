if (Meteor.isClient) {
  window.onload = function () {
    var game = new Phaser.Game(960, 540, Phaser.AUTO, "game-container");
    game.state.add('Boot', SimpleRPG.Boot);
    game.state.add('Preloader', SimpleRPG.Preloader);
    //game.state.add('StartMenu', BunnyDefender.StartMenu);
    //game.state.add('Game', BunnyDefender.Game);
    game.state.start('Boot');
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
