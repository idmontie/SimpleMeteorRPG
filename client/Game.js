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
};

SimpleRPG.Game.prototype.create = function () {
  this.buildWorld();
  this.buildPlayers();

  // controls
  this.keys = {};
  this.keys.w = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  this.keys.a = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  this.keys.s = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  this.keys.d = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
  this.keys.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.keys.shift = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
  
};

SimpleRPG.Game.prototype.buildWorld = function () {
  this.game.physics.startSystem(Phaser.Physics.NINJA);
  this.game.physics.ninja.gravity = 0;

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

  this.shoot = false;
  this.player = this.game.add.sprite(
    playerData.x,
    playerData.y,
    'player',
    'Player0000');
  this.player.animations.add('WalkUp', this.game.math.numberArray(0, 3), 4, true);
  this.player.animations.add('WalkRight', this.game.math.numberArray(4, 7), 4, true);
  this.player.animations.add('WalkDown', this.game.math.numberArray(8, 11), 4, true);
  this.player.animations.add('WalkLeft', this.game.math.numberArray(12, 15), 4, true);
  this.player.animations.add('AimUp', this.game.math.numberArray(16, 19), 4, true);
  this.player.animations.add('AimRight', this.game.math.numberArray(20, 23), 4, true);
  this.player.animations.add('AimDown', this.game.math.numberArray(24, 27), 4, true);
  this.player.animations.add('AimLeft', this.game.math.numberArray(28, 31), 4, true);

  this.player.anchor.set(0.5);
  this.checkWorldBounds = true;
  this.game.physics.ninja.enableCircle(this.player, 8);
  this.game.physics.ninja.enableBody(this.player);
  this.camera.follow(this.player);

  this.player.play('WalkUp');
};

SimpleRPG.Game.prototype.update = function () {
  // set player to collide with layer collision tiles
  var reset = true;
  var shoot = false;

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
  // this.game.physics.ninja.collide(this.player, this.collisionGroup, 
  //   function () {  
  //     reset = false;
  //     return true; 
  //   });

  // reset player velocity
  if (reset) {
    this.player.body.setZeroVelocity();
  }

  // Running?
  if (this.keys.shift.isDown) {
    this.running = true;
  } else {
    this.running = false;
  }

  // player movement
  if (this.keys.space.isDown) {
    this.aiming = true;
  } else {
    if (this.aiming == true) {
      shoot = true;
    }

    this.aiming = false;
  }

  var speed = this.playerVelocity;

  if (this.running) {
    speed = this.playerRunVelocity;
  }

  if (this.keys.w.isDown) {
      if (!this.check(this.player, speed, "UP")) {
        this.player.body.moveUp(speed);
      }
      if (this.aiming) {
        this.player.play('AimUp');
      } else {
        this.player.play('WalkUp');
      }
  } else if (this.keys.s.isDown) {
      if (!this.check(this.player, speed, "DOWN")) {
        this.player.body.moveDown(speed);
      }
      if (this.aiming) {
        this.player.play('AimDown');
      } else {
        this.player.play('WalkDown');
      }
  } else if (this.keys.a.isDown) {
      if (!this.check(this.player, speed, "LEFT")) {
        this.player.body.moveLeft(speed);
      }
      if (this.aiming) {
        this.player.play('AimLeft');
      } else {
        this.player.play('WalkLeft');
      }
  } else if (this.keys.d.isDown) {
      if (!this.check(this.player, speed, "RIGHT")) {
        this.player.body.moveRight(speed);
      }
      if (this.aiming) {
        this.player.play('AimRight');
      } else {
        this.player.play('WalkRight');
      }
  } else {
    
    this.player.animations.stop();
  }

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