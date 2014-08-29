(function () {
  SimpleRPG = (typeof SimpleRPG === "undefined" ? {} : SimpleRPG);

  SimpleRPG.DIRECTION = {
    'UP'        : 0x1,
    'RIGHT'     : 0x2,
    'DOWN'      : 0x3,
    'LEFT'      : 0x4
  };

  SimpleRPG.GameObject = function () {
    this.x;
    this.y;
    this.direction;
    this.velocity;
    this.spriteId;
  };

  /**
   * @param direction - the direction can be a string or an int.  Should map to SimpleRPG.DIRECTION
   */
  SimpleRPG.GameObject.prototype.setDirection = function(direction) {
    if (typeof direction === "string") {
      if (!_.has(SimpleRPG.DIRECTION, direction)) {
        throw new Exception("Not a valid direction");
      }

      direction = SimpleRPG.DIRECTION[direction];
    }

    this.direction = direction;
  };
})();