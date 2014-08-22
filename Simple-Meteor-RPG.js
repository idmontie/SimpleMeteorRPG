if (Meteor.isClient) {
  window.onload = function () {
    var game = new Phaser.Game(960, 540, Phaser.AUTO, "game-container");
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
