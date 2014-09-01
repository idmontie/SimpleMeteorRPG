/**
 * Game Object
 *
 * Base class for all game objects in the
 * Mongo/Meteor portion of the application.
 * These will map to local sprites on the user's
 * machine.
 *
 * @package Model
 */
(function () {
  // Make sure SimpleRPG is defined
  SimpleRPG = (typeof SimpleRPG === "undefined" ? {} : SimpleRPG);

  /**
   * Create a GameObject.  Has x, y, direction, velocity,
   * and a spriteId.
   * @constructor
   */
  SimpleRPG.GameObject = function () {
    this.x;
    this.y;
    this.direction;
    this.velocity;
    this.spriteId;
  };

  /**
   * Enum - UP, RIGHT, DOWN, LEFT
   *
   * Direction bytes
   */
  SimpleRPG.GameObject.DIRECTION = {
    'UP'        : 0x1,
    'RIGHT'     : 0x2,
    'DOWN'      : 0x3,
    'LEFT'      : 0x4
  };

  /**
   * Static
   * 
   * Returns the matching string name of the direction.
   *
   * @throw Exception if the direction is not valid
   * @return String
   */
  SimpleRPG.GameObject.getDirectionName = function (directionState) {
    for (var prop in SimpleRPG.GameObject.DIRECTION) {
      if (SimpleRPG.GameObject.DIRECTION[prop] === directionState) {
        return prop;
      }
    }

    // No direction found, throw!
    throw 'Not a valid direction!';
  };

  /**
   * Set the direction of the sprite
   * 
   * @throw Exeception if the direction is not valid
   * @param direction - the direction can be a string or an int.  Should map to SimpleRPG.DIRECTION
   */
  SimpleRPG.GameObject.prototype.setDirection = function(direction) {
    if (typeof direction === "string") {
      if (!_.has(SimpleRPG.GameObject.DIRECTION, direction)) {
        throw "Not a valid direction!";
      }

      direction = SimpleRPG.GameObject.DIRECTION[direction];
    }

    this.direction = direction;
  };


})();