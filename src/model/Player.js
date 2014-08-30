/**
 * Player Model
 */
(function () {
  var requires = ["SimpleRPG"];
  var load = function () {

    /**
     * Player Constructor
     */
    SimpleRPG.Player = function () {};

    /**
     * Player States
     TODO break these states up :(
     */
    SimpleRPG.Player.STATE = {
      'IDLE'      : 0x00000000,
      'WALK'      : 0x00000001,
      'RUN'       : 0x00000002,

      'UP'        : 0x00000010,
      'RIGHT'     : 0x00000020,
      'DOWN'      : 0x00000030,
      'LEFT'      : 0x00000040,

      'NSHOOT'    : 0x00001000,
      'SHOOT'     : 0x00002000

    };

    SimpleRPG.Player.DEFAULT_STATE = 
      SimpleRPG.Player.STATE.IDLE +
      SimpleRPG.Player.STATE.UP +
      SimpleRPG.Player.STATE.NSHOOT;

    /**
     * Check if the state is in the bit mask.
     * This is not your normal bitmask comparitor. It will
     * make sure that the least significant bit to the most
     * signigicant bit of the state is the same as those
     * in the bitmask.
     * 
     * Only supports 4 bit wide states at 4 bit offsets, aka:
     * 0x0F0 will check for the bits that "F" takes up, but
     * 0x1F0 will still only check for the bits that "F" takes up.
     *
     * @param hex bitmask
     * @param hex state
     */
    SimpleRPG.Player.STATE.is = function (bitmask, state) {
      if (state == SimpleRPG.Player.STATE.IDLE) {
        var s = bitmask.toString(16);
        if (s.charAt(s.length - 1) === "0") {
          return true;
        }
        return false;
      }

      var offset = 0;
     
      var s = state.toString(16);
      for (var i = s.length - 1; i >= 0 ; --i) {
        offset += 1;
        if (s.charAt(i) !== "0") {
          break;
        }
      }

      // Grab the values at the offset.
      // They should xor to 0!
      var a = bitmask.toString(16);
      a = parseInt(a[a.length - offset], 16);
      var b = state.toString(16);
      b = parseInt(b[b.length - offset], 16);

      if ((a ^ b) === 0) {
        return true;
      } else {
        return false;
      }
    };

    /**
     * set state
     */
    SimpleRPG.Player.STATE.set = function (bitmask, state) {
      var offset = 0;
      if (state != 0) {
        var s = state.toString(16);
        for (var i = s.length; i >= 0 ; --i) { 
          if (s[i] == "0") {
            offset += 4; 
          }
        }
      }

      var opFlag = 0xF << offset;
      return ((bitmask | opFlag) ^ (opFlag - state));
    };

    SimpleRPG.Player.STATE.nameOf = function (bitmask) {
      var nameArray = [];
      for (var state in SimpleRPG.Player.STATE) {
        if (SimpleRPG.Player.STATE.hasOwnProperty(state) &&
          typeof SimpleRPG.Player.STATE[state] === "number" &&
          SimpleRPG.Player.STATE.is(bitmask, SimpleRPG.Player.STATE[state])) {
          
          nameArray.push(state);
        }
      }

      return nameArray.join('+');
    };

    SimpleRPG.Player.STATE.fromName = function (s) {
      // TODO
    };

  };

  Flint(load, requires);
})();