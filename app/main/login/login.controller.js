(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$state', 'AuthenticationService'];

    function LoginController($scope, $state, AuthenticationService) {
        var vm = this;

        vm.title = 'Login Controller';
        vm.loginPromise = undefined;
        vm.displayError = undefined;
        vm.errorMessage = undefined;

        vm.userCredentails = {};

        vm.loginUser = loginUser;

        function loginUser() {
            if (vm.loginForm.$invalid) {
                return;
            }
            vm.displayError = false;
            var userObject = {
                grant_type: "password",
                username: vm.userCredentails.username,
                password: vm.userCredentails.password
            };

            vm.loginPromise = AuthenticationService.LoginUser(userObject);

            $scope.$emit('loadSplashScreen', { httpPromise: vm.loginPromise });

            vm.loginPromise.then(function (data) {
                $state.go('root.appLayout.dashboard');
            }).catch(function (err) {
                vm.displayError = true;
                if ((err !== null) && err.error === "ad_error") {
                    vm.errorMessage = "You have entered the wrong username or password";
                }
                else if (err === null || err === undefined) {
                    vm.errorMessage = "Login Connectivity has been lost";
                }
                console.log(err);
            });
        }

        activate();

        function activate() { }
    }
})();