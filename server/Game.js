
/**
 * Server only logic
 */

 Meteor.methods({
  start_new_game: function () {
    var game_id = Games.insert({});

    // Move everyone who is ready in the lobby to the game
    Players.update({
      game_id: null,
      idle: false,
      name: {
        $ne: ''
      }, 
    }, {
      $set: {
        game_id: game_id
      }
    }, {
      multi: true
    });

    // Save a record of who is in the game, so when they leave,
    // we can still show them.
    var p = Players.find({
      game_id: game_id
    }, {
      fields : {
        _id: true,
        name: true
      }
    }).fetch();

    Games.update({
      _id: game_id
    }, {
      $set: {
        players: p
      }
    });
    return game_id;
  },
  keepalive: function (player_id) {
    check(player_id, String);

    Players.update({
      _id: player_id
    }, {
      $set: {
        last_keepalive: (new Date()).getTime(),
        idle: false
      }
    });
  }
 });

 Meteor.setInterval(function () {
  var now = (new Date()).getTime();
  var idle_threshold = now - 70 * 1000;
  var remove_threshold = now - 60 * 60 * 1000;

  Players.update({
    last_keepalive: {
      $lt: idle_threshold
    }
  }, {
    $set: {
      idle: true
    }
  })
 }, 30 * 1000);