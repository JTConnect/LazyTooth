(function () {
    angular
		.module('app')
		.controller("IndexController", IndexController);

    IndexController.$inject = ['$scope'];


    function IndexController($scope) {
        var vm = this;
        vm.title = "Index Controller";
        $scope.title = "Index Controller";

        vm.httpRequestPromise = undefined;

        $scope.$on('loadSplashScreen', function (event, args) {
            vm.httpRequestPromise = args.httpPromise;
        });

        function activate() { }

        activate();

    }

})();