/**
 * Enemy Model
 * @package Model
 */

(function () {
  var requires = [
    "SimpleRPG.GameObject"
  ];

  var load = function () {
    /**
     * Enemy Constructor
     * 
     * @constructor
     * @param Object rawData
     */
    SimpleRPG.Enemy = function (rawData) {
      this.animationState;
      this.health;
      this.type;

      // Set defaults
      this.setDefaults(rawData);
    };

    /**
     * Enemy extends GameObject
     */
    SimpleRPG.Enemy.prototype = new SimpleRPG.GameObject();

    /**
     * Static Enum
     */
    SimpleRPG.Enemy.ANIMATION = {
      'IDLE'      : 0x0,
      'MOVING'    : 0x1,
      'ATTACKING' : 0x2
    };

    /**
     * Get the slug version name of the given states.
     * 
     * @param String directionState
     * @param String animationState
     *
     * @return String
     */
    SimpleRPG.Enemy.getNameOfStates = function (direcitonState, animationState) {
      var nameArray = [];
      nameArray.push(SimpleRPG.GameObject.getDirectionName(directionState));
      nameArray.push(SimpleRPG.Enemy.getAnimationName(animationState));
      return namArray.join('-').toLowerCase();
    };

    /**
     * Get the slug version name of the states of this object.
     *
     * @return String
     */
    SimpleRPG.Enemy.prototype.getNameOfStates = function () {
      return SimpleRPG.Enemy.getNameOfStates(
        this.direction,
        this.animationState
        );
    }

    /**
     * Get the name of the animation
     *
     * @throws Exception
     * @param String animationState
     *
     * @return String
     */
    SimpleRPG.Enemy.getAnimationName = function (animationState) {
      for (var prop in SimpleRPG.Player.ANIMATION) {
        if (SimpleRPG.Enemy.ANIMATION[prop] === animationState) {
          return prop;
        }
      }

      // No direction found, throw!
      throw 'Not a valid animation!';
    };

    /**
     * Set the default variables for this object
     *
     * @param Object rawData
     */
    SimpleRPG.Enemy.prototype.setDefaults = function (rawData) {
      rawData = (typeof rawData === "undefined" ? {} : rawData);
      rawData.x = (typeof rawData.x === "undefined" ? 0 : rawData.x);
      rawData.y = (typeof rawData.x === "undefined" ? 0 : rawData.y);
      rawData.sessionId = (typeof rawData.sessionId === "undefined" ? '' : rawData.sessionId);
      rawData.type = (typeof rawData.type === "undefined" ? 0 : rawData.type);

      this.x = rawData.x;
      this.y = rawData.y;
      this.direction = SimpleRPG.GameObject.DIRECTION.UP;
      this.velocity = [0, 0];
      this.spriteId = 0;
      this.sessionId = rawData.sessionId;
      this.animationState = SimpleRPG.Enemy.ANIMATION.IDLE;
      this.type = rawData.type;
      this.health = 1000;
    };
  };

  Flint(load, requires);
})();