(function () {
    'use strict';

    angular
        .module('app')
        .controller('AppLayoutController', AppLayoutController);

    AppLayoutController.$inject = ['$scope', '$state', '$location', '$uibModal', 'AuthenticationService', 'CurrentUserService'];

    function AppLayoutController($scope, $state, $location, $uibModal, AuthenticationService, CurrentUserService) {
        /* jshint validthis:true */
        var vm = this;
        vm.isSideNavClosed = false;
        vm.state = $state;

        vm.authenticationData = AuthenticationService.GetLocalDataStorage('authenticationData');
        vm.title = 'AppLayout Controller';
        vm.userName = undefined;

        vm.Logout = logOut;
        vm.Open = open;
        vm.NavigateTo = navigateTo;
        activate();

        function activate() {
            vm.userName = vm.authenticationData.user.username;
            console.log(vm.userName);
            console.log("hello");
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
