// Game.js

// TODO move to util
Array.prototype.unique = function(){
  'use strict';
  var im = {}, uniq = [];
  for (var i=0;i<this.length;i++){
    var type = (this[i]).constructor.name, 
    //          ^note: for IE use this[i].constructor!
        val = type + (!/num|str|regex|bool/i.test(type) 
               ? JSON.stringify(this[i]) 
               : this[i]);
    if (!(val in im)){uniq.push(this[i]);}
    im[val] = 1;
  }
  return uniq;
}

SimpleRPG.Game = function (game) {
  this.player;
  this.playerState;
  this.otherPlayers;
  this.cursors;
  this.direction;
  this.keys;
  this.playerVelocity = 50;
  this.playerRunVelocity = 100;
  this.map;
  this.layer;
  this.aiming;
  //this.collisionGroup;
  this.layers;
  this.tiles;
  this.running = false;
  this.askingForUpdate = false;
};

SimpleRPG.Game.prototype.create = function () {
  this.buildWorld();
  this.buildPlayers();

  // TODO create a control mapper
  this.keys = {};
  this.keys.w = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  this.keys.a = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  this.keys.s = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  this.keys.d = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
  this.keys.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.keys.shift = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  
};

SimpleRPG.Game.prototype.buildWorld = function () {
  this.game.physics.startSystem(Phaser.Physics.NINJA);
  this.game.physics.ninja.gravity = 0;
  
  this.stage.disableVisibilityChange = true;

  this.map = this.game.add.tilemap("mainWorld");
  this.map.addTilesetImage('MainWorld00', 'mainWorldImage');

  // Create Layers
  this.layers = [];
  this.layers.push(this.map.createLayer('WalkableTiles'));
  this.layers.push(this.map.createLayer('Elevations'));
  // Don't worry about shadows
  this.map.createLayer('Shadows');
  this.layers.push(this.map.createLayer('Decorations'));
  this.layers[0].resizeWorld();

  // Generate TileIds
  var tileIds = this.game.math.numberArray(0, 881);
  tileIds = tileIds.concat(this.game.math.numberArray(1150-1, 1800-1));
  var slopeMap = {};
  for (var i = 0; i < tileIds.length; i++) {
    slopeMap['' + tileIds[i]] = 1;
  }

  this.tiles = [];
  for (var i = 0; i < this.layers.length; i++) {
    this.tiles.push(this.game.physics.ninja.convertTilemap(this.map, this.layers[i], slopeMap));
  }

};

SimpleRPG.Game.prototype.buildPlayers = function () {
  var playerData = Session.get('player_data');
  var STATE = SimpleRPG.Player.STATE;

  this.shoot = false;
  this.player = this.game.add.sprite(
    playerData.x,
    playerData.y,
    'player',
    'Player0000');

  // TODO load animations from a seperate class (probably Player.js)
  // IDLE
  this.player.animations.add(
    STATE.nameOf(STATE.IDLE + STATE.NSHOOT + STATE.UP), 
    this.game.math.numberArray(0, 0), 4, true);
  this.player.animations.add(
    STATE.nameOf(STATE.IDLE + STATE.NSHOOT + STATE.RIGHT), 
    this.game.math.numberArray(4, 4), 4, true);
  this.player.animations.add(
    STATE.nameOf(STATE.IDLE + STATE.NSHOOT + STATE.DOWN), 
    this.game.math.numberArray(8, 8), 4, true);
  this.player.animations.add(
    STATE.nameOf(STATE.IDLE + STATE.NSHOOT + STATE.LEFT), 
    this.game.math.numberArray(12, 12), 4, true);
  // WALK and NOT SHOOT
  this.player.animations.add(
    STATE.nameOf(STATE.WALK + STATE.NSHOOT + STATE.UP), 
    this.game.math.numberArray(0, 3), 4, true);
  this.player.animations.add(
    STATE.nameOf(STATE.WALK + STATE.NSHOOT + STATE.RIGHT), 
    this.game.math.numberArray(4, 7), 4, true);
  this.player.animations.add(
    STATE.nameOf(STATE.WALK + STATE.NSHOOT + STATE.DOWN), 
    this.game.math.numberArray(8, 11), 4, true);
  this.player.animations.add(
    STATE.nameOf(STATE.WALK + STATE.NSHOOT + STATE.LEFT), 
    this.game.math.numberArray(12, 15), 4, true);
  // IDLE and SHOOT
  this.player.animations.add(
    STATE.nameOf(STATE.IDLE + STATE.SHOOT + STATE.UP), 
    this.game.math.numberArray(16, 16), 4, true);
  this.player.animations.add(
    STATE.nameOf(STATE.IDLE + STATE.SHOOT + STATE.RIGHT), 
    this.game.math.numberArray(20, 20), 4, true);
  this.player.animations.add(
    STATE.nameOf(STATE.IDLE + STATE.SHOOT + STATE.DOWN), 
    this.game.math.numberArray(24, 24), 4, true);
  this.player.animations.add(
    STATE.nameOf(STATE.IDLE + STATE.SHOOT + STATE.LEFT), 
    this.game.math.numberArray(28, 28), 4, true);
  // WALK and SHOOT
  this.player.animations.add(
    STATE.nameOf(STATE.WALK + STATE.SHOOT + STATE.UP), 
    this.game.math.numberArray(16, 19), 4, true);
  this.player.animations.add(
    STATE.nameOf(STATE.WALK + STATE.SHOOT + STATE.RIGHT), 
    this.game.math.numberArray(20, 23), 4, true);
  this.player.animations.add(
    STATE.nameOf(STATE.WALK + STATE.SHOOT + STATE.DOWN), 
    this.game.math.numberArray(24, 27), 4, true);
  this.player.animations.add(
    STATE.nameOf(STATE.WALK + STATE.SHOOT + STATE.LEFT), 
    this.game.math.numberArray(28, 31), 4, true);
  // RUN and NOT SHOOT
  this.player.animations.add(
    STATE.nameOf(STATE.RUN + STATE.NSHOOT + STATE.UP), 
    this.game.math.numberArray(0, 3), 8, true);
  this.player.animations.add(
    STATE.nameOf(STATE.RUN + STATE.NSHOOT + STATE.RIGHT), 
    this.game.math.numberArray(4, 7), 8, true);
  this.player.animations.add(
    STATE.nameOf(STATE.RUN + STATE.NSHOOT + STATE.DOWN), 
    this.game.math.numberArray(8, 11), 8, true);
  this.player.animations.add(
    STATE.nameOf(STATE.RUN + STATE.NSHOOT + STATE.LEFT), 
    this.game.math.numberArray(12, 15), 8, true);
  // RUN and SHOOT
  this.player.animations.add(
    STATE.nameOf(STATE.RUN + STATE.SHOOT + STATE.UP), 
    this.game.math.numberArray(16, 19), 8, true);
  this.player.animations.add(
    STATE.nameOf(STATE.RUN + STATE.SHOOT + STATE.RIGHT), 
    this.game.math.numberArray(20, 23), 8, true);
  this.player.animations.add(
    STATE.nameOf(STATE.RUN + STATE.SHOOT + STATE.DOWN), 
    this.game.math.numberArray(24, 27), 8, true);
  this.player.animations.add(
    STATE.nameOf(STATE.RUN + STATE.SHOOT + STATE.LEFT), 
    this.game.math.numberArray(28, 31), 8, true);

  this.player.anchor.set(0.5);
  this.checkWorldBounds = true;
  this.game.physics.ninja.enableCircle(this.player, 8);
  this.game.physics.ninja.enableBody(this.player);
  this.camera.follow(this.player);

  this.playerState = SimpleRPG.Player.DEFAULT_STATE;
  this.player.play(this.playerState);

  this.otherPlayers = this.game.add.group();
};

SimpleRPG.Game.prototype.update = function () {
  // set player to collide with layer collision tiles
  var reset = true;
  var shoot = false;
  var world = Session.get('world');
  var STATE = SimpleRPG.Player.STATE;
  var playerState = this.playerState;
  var speed = this.playerVelocity;

  var otherPlayers = this.getOtherPlayers(world);

  this.updateOtherPlayers(otherPlayers);

  // Collide with layers
  for (var i = 0; i < this.tiles.length; i++) {
    var innerTiles = this.tiles[i];
    for (var j = 0; j < innerTiles.length; j++) {
      var isColliding = (this.player.body.circle.collideCircleVsTile(innerTiles[j].tile)) !== undefined;
      if (isColliding) {
        reset = false;
      }
    }
  }

  // reset player velocity
  if (reset) {
    this.player.body.setZeroVelocity();
  }

  // TODO don't map to keys
  // Running?
  if (this.keys.shift.isDown) {
    playerState = STATE.set(playerState, STATE.RUN);
    speed = this.playerRunVelocity;
  } else {
    playerState = STATE.set(playerState, STATE.WALK);
  }

  // player movement
  if (this.keys.space.isDown) {
    this.aiming = true;
    playerState = STATE.set(playerState, STATE.SHOOT);
  } else {
    if (this.aiming == true) {
      shoot = true;
    }

    this.aiming = false;
    playerState = STATE.set(playerState, STATE.NSHOOT);
  }

  
  if (this.keys.w.isDown) {
      if (!this.check(this.player, speed, "UP")) {
        this.player.body.moveUp(speed);
      }
      playerState = STATE.set(playerState, STATE.UP);
  } else if (this.keys.s.isDown) {
      if (!this.check(this.player, speed, "DOWN")) {
        this.player.body.moveDown(speed);
      }
      playerState = STATE.set(playerState, STATE.DOWN);
  } else if (this.keys.a.isDown) {
      if (!this.check(this.player, speed, "LEFT")) {
        this.player.body.moveLeft(speed);
      }
      playerState = STATE.set(playerState, STATE.LEFT);
  } else if (this.keys.d.isDown) {
      if (!this.check(this.player, speed, "RIGHT")) {
        this.player.body.moveRight(speed);
      }
      playerState = STATE.set(playerState, STATE.RIGHT);
  } else {
    playerState = STATE.set(playerState, STATE.IDLE);
  }

  this.player.play(STATE.nameOf(playerState));
  this.playerState = playerState;

  // Update Meteor with our data!
  var player_data = {
    x : this.player.body.x,
    y : this.player.body.y,
    direction : "DOWN", // TODO
    velocity : 0, // TOOD
    state : 'INGAME'
  };

  // TODO ONLY UPDATE CHANGES
  Meteor.call('update_player', Session.get('session_id'), player_data);
  if (!this.askingForUpdate) {
    this.askingForUpdate = true;
    var self = this;
    Meteor.call('get_world', function (e, r) {
      self.askingForUpdate = false;
      Session.set('world', r);
    });
  }
  
};


SimpleRPG.Game.prototype.getOtherPlayers = function (world) {
  var session_id = Session.get('session_id');

  var otherPlayers = [];

  for (var i = 0; i < world.players.length; i++) {
    if (world.players[i].session_id !== session_id) {
      otherPlayers.push(world.players[i]);
    }
  }

  return otherPlayers;
};

SimpleRPG.Game.prototype.updateOtherPlayers = function (otherPlayers) {
  // We are going to merge otherPlayers into this.otherPlayers.
  // If a player does not exist, we need to create it.

  // Please remember that "this.otherPlayers" is a group.

  if (otherPlayers.length > this.otherPlayers.children.length) {
    // create sprites for them!

    for (var i = this.otherPlayers.children.length; i < otherPlayers.length; i++) {
      var temp = this.otherPlayers.create(
        otherPlayers[i].x,
        otherPlayers[i].y,
        'player',
        'Player0000'
      );

      temp.anchor.set(0.5);
      this.game.physics.ninja.enableCircle(temp, 8);
      this.game.physics.ninja.enableBody(temp);
    }   
  }

  for (var i = 0; i < this.otherPlayers.children.length; i++) {
    this.otherPlayers.children[i].body.x = otherPlayers[i].x;
    this.otherPlayers.children[i].body.y = otherPlayers[i].y;
  }
};

/**
 * direction = "UP", "RIGHT", "DOWN", "LEFT"
 */
SimpleRPG.Game.prototype.check = function (obj, speed, direction) {
  var checkDistance = speed / 5;
  // Collide with layers
  var temp = new Phaser.Rectangle(
    obj.x - obj.width / 2.0,
    obj.y - obj.height / 2.0,
    obj.width,
    obj.height
  );

  if (direction === "UP") {
    temp.y -= checkDistance;
  }
  else if (direction === "DOWN") {
    temp.y += checkDistance;
  }
  else if (direction === "LEFT") {
    temp.x -= checkDistance;
  }
  else if (direction === "RIGHT") {
    temp.x += checkDistance;
  }

  for (var i = 0; i < this.tiles.length; i++) {
    var innerTiles = this.tiles[i];
    for (var j = 0; j < innerTiles.length; j++) {
      var isColliding = Phaser.Rectangle.intersects(temp, innerTiles[j].tile);
      if (isColliding) {
        return true;
      }
    }
  }
};