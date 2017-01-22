(function () {
    'use strict';

    angular
        .module('app')
        .controller('AppLayoutController', AppLayoutController);

    AppLayoutController.$inject = ['$scope', '$state', '$location', '$uibModal', 'AuthenticationService', 'CurrentUserService', 'FlightBoardService'];

    function AppLayoutController($scope, $state, $location, $uibModal, AuthenticationService, CurrentUserService, FlightBoardService) {
        /* jshint validthis:true */
        var vm = this;
        vm.isSideNavClosed = false;
        vm.state = $state;

        vm.userName = AuthenticationService.GetLocalDataStorage('authenticationData').userName;
        vm.title = 'AppLayout Controller';

        vm.Logout = logOut;
        vm.Open = open;
        vm.NavigateTo = navigateTo;
        activate();

        function activate() {
            setUp();
        }

        function logOut() {
            AuthenticationService.LogOut();
            $location.path('/login');
        }

        function open() {
            vm.isSideNavClosed = !vm.isSideNavClosed;
        }

        function setUp() {
            $scope.$on('toggleSideNav', function (event, args) {
                vm.isSideNavClosed = args.close;
            });
        }


        function navigateTo(route) {
            $state.go(route);
        }

    }
})();
