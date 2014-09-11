/**
 * Flingy Model
 * @package Model
 */

(function () {
  var requires = [
    "SimpleRPG.GameObject"
  ];

  var load = function () {
    /**
     * Flingy Constructor
     *
     * @constructor
     * @param Object rawData
     */
    SimpleRPG.Flingy = function (rawData) {
      this.animationState;
      this.type;
    };

    /**
     * Flingy extends GameObject
     */
    SimpleRPG.Flingy.prototype = new SimpleRPG.GameObject();

    /**
     * Static Enum
     */
    SimpleRPG.Flingy.TYPE = {
      "ARROW"     : 0x0
    };

    /**
     * Static Enum
     */
    SimpleRPG.Flingy.BEHAVIOURS = {
      "ARROW"     : (function () { /* TODO */})
    };

    /* TODO methods */
  };
})();