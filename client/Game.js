/**
 * Game
 * 
 * Handles Game logic for the local player.
 */
 (function () {

/**
 * Game
 * 
 * @param game the game instance
 */
SimpleRPG.Game = function (game) {
  this.player;
  this.playerModel;
  this.otherPlayers;
  this.enemies;
  this.cursors;
  this.direction;
  this.keys;
  this.playerVelocity = 50;
  this.playerRunVelocity = 100;
  this.map;
  this.layer;
  this.layers;
  this.tiles;
  this.running = false;
  this.askingForUpdate = false;
};

/**
 * Create, called by Phaser
 *
 */
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
  
  var self = this;
  setInterval(function () {
    Meteor.call('get_world', function (e, r) {
      self.askingForUpdate = false;
      Session.set('world', r);
    });
  }, 500);
};

/**ene
 * Build the world
 * 
 * TODO move this to a World.js or something
 */
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

/**
 * Build the player.  Sets animations and current state from the
 * session player_data
 */
SimpleRPG.Game.prototype.buildPlayers = function () {
  var rawData = Session.get('player_data');
  this.playerModel = new SimpleRPG.Player(rawData);

  this.shoot = false;
  this.player = this.game.add.sprite(
    this.playerModel.x,
    this.playerModel.y,
    'player',
    'Player0000');

  SimpleRPG.Player.loadAnimationStates(this.player, this.game);


  this.player.anchor.set(0.5);
  this.checkWorldBounds = true;
  this.game.physics.ninja.enableCircle(this.player, 8);
  this.game.physics.ninja.enableBody(this.player);
  this.camera.follow(this.player);

  this.player.play(this.playerModel.getNameOfStates());

  this.otherPlayers = this.game.add.group();
  this.enemies = this.game.add.group();
};

/**
 * Called by Phaser
 */
SimpleRPG.Game.prototype.update = function () {
  // set player to collide with layer collision tiles
  var self = this;
  var reset = true;
  var shoot = false;
  var world = Session.get('world');
  var speed = this.playerVelocity;

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
    this.playerModel.animationState =  SimpleRPG.Player.ANIMATION.RUN;
    speed = this.playerRunVelocity;
  } else {
    this.playerModel.animationState =  SimpleRPG.Player.ANIMATION.WALK;
  }

  // player movement
  if (this.keys.space.isDown) {
    this.playerModel.shootingState = SimpleRPG.Player.SHOOTING.SHOOT;
  } else {
    if (this.playerModel.shootingState == SimpleRPG.Player.SHOOTING.SHOOT) {
      shoot = true;
    }

    this.playerModel.shootingState =  SimpleRPG.Player.SHOOTING.NSHOOT;
  }

  if (this.keys.w.isDown) {
      if (!this.check(this.player, speed, "UP")) {
        this.player.body.moveUp(speed);
      }
      this.playerModel.direction =  SimpleRPG.GameObject.DIRECTION.UP;
  } else if (this.keys.s.isDown) {
      if (!this.check(this.player, speed, "DOWN")) {
        this.player.body.moveDown(speed);
      }
      this.playerModel.direction =  SimpleRPG.GameObject.DIRECTION.DOWN;
  } else if (this.keys.a.isDown) {
      if (!this.check(this.player, speed, "LEFT")) {
        this.player.body.moveLeft(speed);
      }
      this.playerModel.direction =  SimpleRPG.GameObject.DIRECTION.LEFT;
  } else if (this.keys.d.isDown) {
      if (!this.check(this.player, speed, "RIGHT")) {
        this.player.body.moveRight(speed);
      }
      this.playerModel.direction =  SimpleRPG.GameObject.DIRECTION.RIGHT;
  } else {
    this.playerModel.animationState =  SimpleRPG.Player.ANIMATION.IDLE;
  }

  this.player.play(this.playerModel.getNameOfStates());

  // Update Meteor with our data!
  // TODO player_data should really be this.playerModel
  this.playerModel.x = this.player.body.x;
  this.playerModel.y = this.player.body.y;
  this.playerModel.velocity = [
    this.player.body.velocity.x,
    this.player.body.velocity.y
  ];
  this.playerModel.state = 'INGAME';

  // TODO ONLY UPDATE CHANGES
  Meteor.call('update_player', Session.get('session_id'), this.playerModel);
  if (!this.askingForUpdate) {
    // TODO we only run this if we get an update!
    world = Session.get('world');
    var otherPlayers = this.getOtherPlayers(world);
    this.updateOtherPlayers(otherPlayers);
    this.updateEnemies(world);
    this.askingForUpdate = true;
  }
};

/**
 * Determine who is an "other player"
 *
 * @param world A world object with other players.
 */
SimpleRPG.Game.prototype.getOtherPlayers = function (world) {
  var session_id = Session.get('session_id');

  var otherPlayers = [];

  for (var i = 0; i < world.players.length; i++) {
    if (world.players[i].sessionId !== session_id) {
      otherPlayers.push(world.players[i]);
    }
  }

  return otherPlayers;
};

/**
 * update function to make sure that otherPlayers have sprites
 * and correct positions and tweening.
 */
SimpleRPG.Game.prototype.updateOtherPlayers = function (otherPlayers) {
  // We are going to merge otherPlayers into this.otherPlayers.
  // If a player does not exist, we need to create it.

  // Please remember that "this.otherPlayers" is a group.

  // Stop all tweens
  var tweens = this.game.tweens.getAll();

  for (var i = 0; i < tweens.length; i++) {
    var values = tweens[i]._valuesEnd;
    tweens[i]._object.x = values.x;
    tweens[i]._object.y = values.y;
    tweens[i]._object.setZeroVelocity();
    tweens[i].stop();
  }

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
      this.game.physics.ninja.enableBody(temp);
      temp.body.moves = false;
      SimpleRPG.Player.loadAnimationStates(temp, this.game);
    }   
  }

  for (var i = 0; i < this.otherPlayers.children.length; i++) {
    if (otherPlayers[i].state == "INLOBBY") {
      // TODO hide
      this.otherPlayers.children[i].visible = false;
      continue;
    } else {
      this.otherPlayers.children[i].visible = true;
    }

    // TODO tweens
    //if (parseInt(this.otherPlayers.children[i].body.x, 10) != parseInt(otherPlayers[i].x, 10) ||
    //  parseInt(this.otherPlayers.children[i].body.y, 10) != parseInt(otherPlayers[i].y, 10)) {
      this.game.add.tween(this.otherPlayers.children[i].body).to({
          x : otherPlayers[i].x,
          y : otherPlayers[i].y
        },
        500,
        Phaser.Easing.Linear.None,
        true);
  // } else {
     // this.otherPlayers.children[i].body.x = otherPlayers[i].x;
     // this.otherPlayers.children[i].body.y = otherPlayers[i].y;
  //  }
    
    this.otherPlayers.children[i].play(SimpleRPG.Player.getNameOfStates(
        otherPlayers[i].direction,
        otherPlayers[i].animationState,
        otherPlayers[i].shootingState
      ));
  }
};

/**
 * Update where enemies are and are going.
 *
 * @param PhaserObject world 
 */
SimpleRPG.Game.prototype.updateEnemies = function (world) {
  var enemies = world.enemies;

  if (enemies.length > this.enemies.children.length) {
    // create sprites for them!

    for (var i = this.enemies.children.length; i < enemies.length; i++) {
      var temp = this.enemies.create(
        enemies[i].x,
        enemies[i].y,
        'enemy_00',
        'Enemy0000'
      );

      temp.anchor.set(0.5);
      this.game.physics.ninja.enableBody(temp);
      temp.body.moves = false;
      SimpleRPG.Enemy.loadAnimationStates(temp, this.game);
    }   
  }

  for (var i = 0; i < this.enemies.children.length; i++) {
    this.game.add.tween(this.enemies.children[i].body).to({
          x : enemies[i].x,
          y : enemies[i].y
        },
        500,
        Phaser.Easing.Linear.None,
        true);
    
    this.enemies.children[i].play(SimpleRPG.Enemy.getNameOfStates(
        enemies[i].animationState
      ));
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

})();