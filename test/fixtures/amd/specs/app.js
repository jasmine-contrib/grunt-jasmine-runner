define(["app"], function(App){
    
    describe("App", function(){
        it("should make apps",function(){
            var ret = App.makeApp();
            expect(ret).toBe("App");
        });

        it("should have a date field",function(){
            expect(App.date).not.toBeNull();
        });
    });

});