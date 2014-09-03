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
    // Create an enemy
    var enemy = new SimpleRPG.Enemy({
      x : 0,
      y : 0,
      sessionId : 'server',
      type : 'enemy_00'
    });

    var world = Worlds.findOne();
    world.enemies.push(enemy);
    

  };

  SimpleRPG.Server.prototype.updateEnemies = function () {

  };

  SimpleRPG.Server.prototype.run = function () {
    this.performEnemyLogic(this);
  };
})();