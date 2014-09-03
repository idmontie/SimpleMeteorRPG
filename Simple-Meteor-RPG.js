if (Meteor.isClient) {
  window.onload = function () {
    game = new Phaser.Game(960, 540, Phaser.AUTO, "game-container");
    game.state.add('Boot', SimpleRPG.Boot);
    game.state.add('Preloader', SimpleRPG.Preloader);
    game.state.add('StartMenu', SimpleRPG.StartMenu);
    game.state.add('Lobby', SimpleRPG.Lobby);
    game.state.add('Game', SimpleRPG.Game);
    game.state.start('Boot');
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    var server = new SimpleRPG.Server();
    Meteor.setInterval((function(self) {
         return function() {
             self.run();
         }
     })(server), 1000);
  });
}
