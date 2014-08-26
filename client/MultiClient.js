// MultiClient.js
// Marked for deletion
(function () {


  SimpleRPG.MultiClient = function () {
    this.currentPlayer = null;
    this.playerData = [];
    this.monsterData = [];
    this.flingyData = [];
  };

  SimpleRPG.MultiClient.prototype.sendUpdate = function (obj, type) {
    if (type === SimpleRPG.MultiClient.Type.PLAYER_DATA) {

    } else if (type === SimpleRPG.MultiClient.Type.MONSTER_DATA) {

    } else if (type === SimpleRPG.MultiClient.Type.FLINGY_DATA) {

    }
  };

  SimpleRPG.MultiClient.prototype.pull = function () {
    this.playerData = Players.find({});
    this.monsterData = Monsters.find({});
    this.flingyData = Flingys.find({});
  };


  /**
   * Static Enumerations
   */
  SimpleRPG.MultiClient.Type = {};
  SimpleRPG.MultiClient.Type.PLAYER_DATA = 0;
  SimpleRPG.MultiClient.Type.MONSTER_DATA = 1;
  SimpleRPG.MultiClient.Type.FLINGY_DATA = 2;
})();