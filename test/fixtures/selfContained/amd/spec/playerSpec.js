define(["src/Player"], function(Player) {

  describe("Player", function() {
    var player;

    beforeEach(function() {
      player = new Player();
    });

    it("should be capable of saying Hello", function() {
      expect(player.say("Hello")).toEqual("Hello");
    });

  });

});
