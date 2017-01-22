(function () {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$state', 'LookupService', 'CurrentUserService', 'DateTimeService'];

    function DashboardController($scope, $state, LookupService, CurrentUserService, DateTimeService) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Dashboard Controller';
        activate();

        function activate() {

        }

        function navigateTo(route) {
            if (route) {
                $state.go(route);
            }
        }

        function baseSelected(item, model, label) {

        }

        function setUp() {
            $scope.$on('loadSplashScreen', function (event, args) {
                vm.httpRequestPromise = args.httpPromise;
            });
        }
    }
})();
