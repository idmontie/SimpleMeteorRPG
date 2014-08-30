/**
 * Player Model
 * @package MeteorModel
 */

 // TODO state
(function () {
  var requires = [
    "SimpleRPG.GameObject"
  ];

  var load = function () {
    /**
     * Player Constructor
     */
    SimpleRPG.Player = function (rawData) {
      this.animationState;
      this.shootingState;
      this.sessionId;

      // Set defaults
      this.setDefaults(rawData);
    };
    /**
     * Player extends GameObject
     */
    SimpleRPG.Player.prototype = new SimpleRPG.GameObject();


    /**
     * Static Enum
     */
    SimpleRPG.Player.ANIMATION = {
      'IDLE'      : 0x0,
      'WALK'      : 0x1,
      'RUN'       : 0x2
    };

    /**
     * Static Enum
     */
    SimpleRPG.Player.SHOOTING = {
      'NSHOOT'    : 0x0,
      'SHOOT'     : 0x1
    };

    /**
     * State Player Method
     * @return slug
     */
    SimpleRPG.Player.getNameOfStates = function (
      directionState, animationState, shootingState
      ) {
      var nameArray = [];
      nameArray.push(SimpleRPG.GameObject.getDirectionName(directionState));
      nameArray.push(SimpleRPG.Player.getAnimationName(animationState));
      nameArray.push(SimpleRPG.Player.getShootingName(shootingState));
      return nameArray.join('-').toLowerCase();
    };

    SimpleRPG.Player.prototype.getNameOfStates = function () {
      return SimpleRPG.Player.getNameOfStates(
        this.direction,
        this.animationState,
        this.shootingState
        );
    }

    SimpleRPG.Player.getAnimationName = function (animationState) {
      for (var prop in SimpleRPG.Player.ANIMATION) {
        if (SimpleRPG.Player.ANIMATION[prop] === animationState) {
          return prop;
        }
      }

      // No direction found, throw!
      throw 'Not a valid animation!';
    };

    SimpleRPG.Player.getShootingName = function (shootingState) {
      for (var prop in SimpleRPG.Player.SHOOTING) {
        if (SimpleRPG.Player.SHOOTING[prop] === shootingState) {
          return prop;
        }
      }

      // No direction found, throw!
      throw 'Not a valid shooting state!';
    }


    /**
     * Set the defaults for the Player object
     */
    SimpleRPG.Player.prototype.setDefaults = function (rawData) {
      rawData = (typeof rawData === "undefined" ? {} : rawData);
      rawData.x = (typeof rawData.x === "undefined" ? 0 : rawData.x);
      rawData.y = (typeof rawData.x === "undefined" ? 0 : rawData.y);
      rawData.sessionId = (typeof rawData.sessionId === "undefined" ? '' : rawData.sessionId);

      this.x = rawData.x;
      this.y = rawData.y;
      this.direction = SimpleRPG.GameObject.DIRECTION.UP;
      this.velocity = 0;
      this.spriteId = 0;
      this.sessionId = rawData.sessionId;
      this.animationState = SimpleRPG.Player.ANIMATION.IDLE;
      this.shootingState = SimpleRPG.Player.SHOOTING.NSHOOT;
    };

    SimpleRPG.Player.loadAnimationStates = function (phaserPlayer, game) {
      var a = phaserPlayer.animations;

      // slug => array
      var animations = [
        // IDLE
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.UP,
          SimpleRPG.Player.ANIMATION.IDLE,
          SimpleRPG.Player.SHOOTING.NSHOOT
          ) , game.math.numberArray(0, 0), 4, true],
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.RIGHT,
          SimpleRPG.Player.ANIMATION.IDLE,
          SimpleRPG.Player.SHOOTING.NSHOOT
          ) , game.math.numberArray(4, 4), 4, true],
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.DOWN,
          SimpleRPG.Player.ANIMATION.IDLE,
          SimpleRPG.Player.SHOOTING.NSHOOT
          ) , game.math.numberArray(8, 8), 4, true],
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.LEFT,
          SimpleRPG.Player.ANIMATION.IDLE,
          SimpleRPG.Player.SHOOTING.NSHOOT
          ) , game.math.numberArray(12, 12), 4, true],
        // WALK and NOT SHOOT
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.UP,
          SimpleRPG.Player.ANIMATION.WALK,
          SimpleRPG.Player.SHOOTING.NSHOOT
          ) , game.math.numberArray(0, 3), 4, true],
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.RIGHT,
          SimpleRPG.Player.ANIMATION.WALK,
          SimpleRPG.Player.SHOOTING.NSHOOT
          ) , game.math.numberArray(4, 7), 4, true],
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.DOWN,
          SimpleRPG.Player.ANIMATION.WALK,
          SimpleRPG.Player.SHOOTING.NSHOOT
          ) , game.math.numberArray(8, 11), 4, true],
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.LEFT,
          SimpleRPG.Player.ANIMATION.WALK,
          SimpleRPG.Player.SHOOTING.NSHOOT
          ) , game.math.numberArray(12, 15), 4, true],
        // IDLE and SHOOT
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.UP,
          SimpleRPG.Player.ANIMATION.IDLE,
          SimpleRPG.Player.SHOOTING.SHOOT
          ) , game.math.numberArray(16, 16), 4, true],
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.RIGHT,
          SimpleRPG.Player.ANIMATION.IDLE,
          SimpleRPG.Player.SHOOTING.SHOOT
          ) , game.math.numberArray(20, 20), 4, true],
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.DOWN,
          SimpleRPG.Player.ANIMATION.IDLE,
          SimpleRPG.Player.SHOOTING.SHOOT
          ) , game.math.numberArray(24, 24), 4, true],
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.LEFT,
          SimpleRPG.Player.ANIMATION.IDLE,
          SimpleRPG.Player.SHOOTING.SHOOT
          ) , game.math.numberArray(28, 28), 4, true],
        // WALK and SHOOT
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.UP,
          SimpleRPG.Player.ANIMATION.WALK,
          SimpleRPG.Player.SHOOTING.SHOOT
          ) , game.math.numberArray(16, 19), 4, true],
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.RIGHT,
          SimpleRPG.Player.ANIMATION.WALK,
          SimpleRPG.Player.SHOOTING.SHOOT
          ) , game.math.numberArray(20, 23), 4, true],
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.DOWN,
          SimpleRPG.Player.ANIMATION.WALK,
          SimpleRPG.Player.SHOOTING.SHOOT
          ) , game.math.numberArray(24, 27), 4, true],
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.LEFT,
          SimpleRPG.Player.ANIMATION.WALK,
          SimpleRPG.Player.SHOOTING.SHOOT
          ) , game.math.numberArray(28, 31), 4, true],
        // RUN and NOT SHOOT
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.UP,
          SimpleRPG.Player.ANIMATION.RUN,
          SimpleRPG.Player.SHOOTING.NSHOOT
          ) , game.math.numberArray(0, 3), 8, true],
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.RIGHT,
          SimpleRPG.Player.ANIMATION.RUN,
          SimpleRPG.Player.SHOOTING.NSHOOT
          ) , game.math.numberArray(4, 7), 8, true],
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.DOWN,
          SimpleRPG.Player.ANIMATION.RUN,
          SimpleRPG.Player.SHOOTING.NSHOOT
          ) , game.math.numberArray(8, 11), 8, true],
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.LEFT,
          SimpleRPG.Player.ANIMATION.RUN,
          SimpleRPG.Player.SHOOTING.NSHOOT
          ) , game.math.numberArray(12, 15), 8, true],
        // RUN and SHOOT
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.UP,
          SimpleRPG.Player.ANIMATION.RUN,
          SimpleRPG.Player.SHOOTING.SHOOT
          ) , game.math.numberArray(16, 19), 8, true],
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.RIGHT,
          SimpleRPG.Player.ANIMATION.RUN,
          SimpleRPG.Player.SHOOTING.SHOOT
          ) , game.math.numberArray(20, 23), 8, true],
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.DOWN,
          SimpleRPG.Player.ANIMATION.RUN,
          SimpleRPG.Player.SHOOTING.SHOOT
          ) , game.math.numberArray(24, 27), 8, true],
        [SimpleRPG.Player.getNameOfStates(
          SimpleRPG.GameObject.DIRECTION.LEFT,
          SimpleRPG.Player.ANIMATION.RUN,
          SimpleRPG.Player.SHOOTING.SHOOT
          ) , game.math.numberArray(28, 31), 8, true]
      ];

      for (var i = 0; i < animations.length; i++) {
        a.add(animations[i][0], animations[i][1], animations[i][2], animations[i][3]);
      }
    };
  };

  Flint(load, requires);
})();