(function () {
	SimpleRPG.Server = function () {
    // For now, lets just have the server
    // determine where and when to place enemies
    this.maxEnemies = 100;

  };

  SimpleRPG.Server.prototype.performEnemyLogic = function (self) {
    // Check how many enemies we have right now
    var world = Worlds.findOne();
    var count = world.enemies.length;

    if (count < self.maxEnemies) {
      var result = self.determineWhetherToSpawn();

      if (result) {
        self.spawnEnemy();
      }
    }

    self.updateEnemies();

  };

  SimpleRPG.Server.prototype.determineWhetherToSpawn = function () {
    // Get a little randomness
    if (Random.fraction() * 10 < 2) {
      return true;
    }

    return false;
  };

  SimpleRPG.Server.prototype.spawnEnemy = function () {
    var world = Worlds.findOne();

    // Create an enemy
    var enemy = new SimpleRPG.Enemy({
      x : parseInt(Random.fraction() * world.width),
      y : parseInt(Random.fraction() * world.height),
      sessionId : 'server',
      type : 'enemy_00'
    });

    world.enemies.push(enemy);

    Worlds.update({
        _id : world._id
      }, {
        $push : {
          'enemies' : enemy
        }
      });
  };

  SimpleRPG.Server.prototype.updateEnemies = function () {

  };

  SimpleRPG.Server.prototype.run = function () {
    this.performEnemyLogic(this);
  };
})();