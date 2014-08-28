/**
 * Flint
 * By: Ivan Montiel
 *
 * TODO support reference checks
 */
(function () {
  /**
   * Wait for globals to be defined by other scripts being loaded.
   * 
   * Usage: Flint(function () { ... }, global1, global2);
   * 
   */

  var root = this;

  Flint = function (callback) {
    var self = this;
    var args = arguments;
    var parse = function (input) {
      if (input instanceof Array) {
        return input.map(function (part) {
          return parse(part);
        }).reduce(function (a, b) {
          return a && b;
        });
      }
      else {
        // Support dot notation in argument
        var arg = input.split('.');
        var deepValue = root[arg[0]];
        if (typeof deepValue == 'undefined') {
          return false;
        }

        for (var j = 1; j < arg.length; j++) {
          deepValue = deepValue[arg[j]];

          if (typeof deepValue == 'undefined') {
            return false;
          }
        }

        return true;
      }
    };


    if (arguments.length == 0) {
      return;
    }

    if (arguments.length == 1)  {
      callback();
      return;
    }

    var defined = true;
    for (var i = 1; i < arguments.length; i++) {
      defined = parse(arguments[i]);

      if (!defined) {
        break;
      }
    }

    if (!defined) {
      self.timeout = setTimeout(function () {
        Flint.apply(self, args);
      }, 10);
      return self;
    }

    callback();
  };

  Flint.prototype.cancel = function () {
    clearTimeout(this.timeout);
  }
})();