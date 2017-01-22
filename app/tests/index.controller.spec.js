describe('IndexController', function () {
    var scope, $state, createController;

    beforeEach(module('app')); //<--- Hook module

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();

        createController = function () {
            return $controller('IndexController', {
                '$scope': scope
            });
        };
    }));

    it('should equal name', function () {
        var controller = createController();
        expect(scope.title).toEqual("Index Controller");
    });

    it('access vm model', function () {
        var controller = createController();
        expect(createController().title).toEqual("Index Controller");
    });

});