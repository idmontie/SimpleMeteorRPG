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
  this.map;
  this.layer;
  this.aiming;
  this.collisionGroup;
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
  
};

SimpleRPG.Game.prototype.buildWorld = function () {
  this.game.physics.startSystem(Phaser.Physics.NINJA);
  this.game.physics.ninja.gravity = 0;

  this.map = this.game.add.tilemap("mainWorld");
  this.map.addTilesetImage('World');
  var layer = this.map.createLayer('Tile Layer 1');
  this.map.createLayer('Tile Layer 2');
  layer.resizeWorld();

  // Create the objects layer...
  this.collisionGroup = this.game.add.group();

  var gids = this.map.objects['Object Layer 1'].map(function (a) {
    return {
      "gid" : a.gid,
      "name" : a.name
    };
  }).unique();

  for (var i = 0; i < gids.length; i++) {
    this.map.createFromObjects(
      'Object Layer 1', 
      gids[i].gid, 
      'World', 
      gids[i].name,
      true,
      false,
      this.collisionGroup);
  }

   for (var i = 0; i < this.collisionGroup.children.length; i++) {
     this.game.physics.ninja.enableTile(this.collisionGroup.children[i], Phaser.Physics.Ninja.Tile.FULL);
   }
  //this.game.physics.ninja.enableTile(this.collisionGroup);

};

SimpleRPG.Game.prototype.buildPlayers = function () {
  this.shoot = false;
  this.player = this.game.add.sprite(
    150,
    150,
    'player',
    'Player0000');
  this.player.enableBody = true;
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
  this.game.physics.ninja.enableAABB(this.player);

  this.camera.follow(this.player);

  this.player.play('WalkUp');
};

SimpleRPG.Game.prototype.update = function () {
  // set player to collide with layer collision tiles
  var reset = true;
  var shoot = false;
  this.game.physics.ninja.collide(this.player, this.collisionGroup, 
    function () {  
      reset = false;
      return true; 
    });

  // reset player velocity
  if (reset) {
    this.player.body.reset(this.player.body.x, this.player.body.y, true, true);
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

  if (this.keys.w.isDown) {
      this.player.body.moveUp(this.playerVelocity);
      if (this.aiming) {
        this.player.play('AimUp');
      } else {
        this.player.play('WalkUp');
      }
  } else if (this.keys.s.isDown) {
      this.player.body.moveDown(this.playerVelocity);
      if (this.aiming) {
        this.player.play('AimDown');
      } else {
        this.player.play('WalkDown');
      }
  } else if (this.keys.a.isDown) {
      this.player.body.moveLeft(this.playerVelocity);
      if (this.aiming) {
        this.player.play('AimLeft');
      } else {
        this.player.play('WalkLeft');
      }
  } else if (this.keys.d.isDown) {
      this.player.body.moveRight(this.playerVelocity);
      if (this.aiming) {
        this.player.play('AimRight');
      } else {
        this.player.play('WalkRight');
      }
  } else {
    
    this.player.animations.stop();
  }
};
