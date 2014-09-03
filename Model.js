/**
 * Model.js
 *
 * Contains functionality that both the Server and
 * the Client will use that concerns the database.
 */

Worlds = new Meteor.Collection('worlds');

new_world = function () {
  var world = {
    name : "test-world",
    players :[],
    flingys : [],
    enemies : []
  };

  return world;
};

new_player = function (session_id) {
  var temp =  new SimpleRPG.Player({
    x : 200,
    y : 200,
    direction : "DOWN",
    velocity : 0,
    state : 'INLOBBY',
    alive : true,
    session_id : session_id
  });
  temp.sessionId = session_id;
  return temp;
};

if (Meteor.isServer) {
  Future = Npm.require('fibers/future');

  Meteor.methods({
    get_world : function () {
      return Worlds.findOne();
    },
    /**
     * Optimizing this doesn't matter.  It happens on the server
     * end, so the data has already been sent.
     */
    update_world : function (worldData) {
      // TODO, this needs to be updated so that updates
      // dont overwrite each other
      var id = worldData._id + '';
      delete worldData._id;
      Worlds.update({
        _id : id
      }, worldData);
    },
    get_player : function (session_id) {
      var world = Meteor.call('get_world');
      return _.find(world.players, function (player) {
        if (player.sessionId == session_id) {
          return true;
        } else {
          return false;
        }
      });
    },
    create_new_player : function (session_id) {
      var player = Meteor.call('get_player', session_id);
      var world = Meteor.call('get_world');
      // only create if not prev existed
      if (player == null) {
        player = new_player(session_id);
        world.players.push(player);
      } else {
        // if prev existed, mark as alive  
        var playerIndex = -1;
        for (var i = 0; i < world.players.length; i++) {
          if (world.players[i].sessionId == session_id) {
            playerIndex = i;
            break;
          }
        }

        if (playerIndex == -1) {
          return;
        }
        world.players[playerIndex].alive = true;
        world.players[playerIndex].state = "INLOBBY";
        

        player = world.players[playerIndex];
      }
      
      Meteor.call('update_world', world, function () {});
      return player;
    },
    /**
     *
     * Expected player data:
     */
    update_player : function (session_id, player_data) {
      var player = Meteor.call('get_player', session_id);
      var world = Meteor.call('get_world');

      if (player == null) {
        return;
      }

      var playerIndex = -1;
      for (var i = 0; i < world.players.length; i++) {
        if (world.players[i].sessionId == session_id) {
          playerIndex = i;
          break;
        }
      }

      if (playerIndex == -1) {
        return;
      }

      for (var n in player_data) { 
        world.players[playerIndex][n] = player_data[n]; 
      }

      var data = {};
      data['players.' + playerIndex] = player_data;

      //Meteor.call('update_world', world, function () {});
      var id = world._id + '';
      Worlds.update({
        _id : id
      }, {
        $set : data
      });
    },
    player_die : function (session_id) {
      // mark player as dead.
    },
    create_new_flingy : function (session_id, flingy_data) {

    },
    update_flingy : function (session_id, flingy_data) {

    },
    flingy_die : function (session_id, flingy_data) {
      // actually destroy the flingy, no need to keep it
    }
  });
}

Meteor.startup(function () {
  if (Meteor.isClient) {
    // Make sure the client has a session id
    var session_id = amplify.store('session_id');

    if (session_id == null) {
      session_id = guid();
      amplify.store('session_id', session_id);
    }

    Session.set('session_id', session_id);
  }
  if (Meteor.isServer) {
    // Make sure the server has a new world when we resart.
    // TODO, make the server grab the last world when we are done finalizes what a world looks like.
  
    var world = Worlds.findOne();

    if (world != null) {
      Worlds.remove({});
    } 

    var _id = Worlds.insert(new_world());

    Meteor.publish('worlds', function () {
      return Worlds.find({"_id" : _id});
    });
  }
});