define([], function() {
  function Player() {}

  Player.prototype.say = function() {
    return "Hello";
  };

  return Player;
});
