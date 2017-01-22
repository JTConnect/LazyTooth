(function () {
    'use strict';

    angular
        .module('app')
        .config(authenticationInterceptor); 
        
    authenticationInterceptor.$inject = ['$httpProvider'];

    function authenticationInterceptor($httpProvider) {
        $httpProvider.interceptors.push('AuthenticationInterceptorService');
    }
})(); 

(function () {
    'use strict';

    angular
        .module('app')
        .run(runBlock);

    runBlock.$inject = ['$rootScope', '$state', '$timeout', 'AuthenticationService', 'FlightBoardService'];

    function runBlock($rootScope, $state, $timeout, AuthenticationService, FlightBoardService) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

            var userAuthentication = AuthenticationService.GetLocalDataStorage("authenticationData");
            var loginRoute = 'root.login';
            var simpleLogin = 'root.simpleLogin';
            var root = "root";

            //if user is not authenticated, and is routing to the login page then there is no need to route user. 
            if (!userAuthentication && (toState.name == loginRoute)) {
                return;
            }

            //if user is authenticated then he should not be able to visit login page
            if (userAuthentication && (toState.name == loginRoute)) {
                event.preventDefault();
                $timeout(function () {
                    $state.go('root.appLayout.dashboard');
                });
            }

            //If user is not authenticated, return user to the login view. 
            if (!userAuthentication && simpleLogin !== toState.name) {
                event.preventDefault();
                $timeout(function () {
                    $state.go('root.login');
                });
            }

            //if user is authenticated and starting the app. 
            if (userAuthentication && toState.name == root) {
                $timeout(function () {
                    $state.go('root.appLayout.dashboard');
                });
            }

            if (userAuthentication && toState.name == 'root.appLayout.flightBoard' && (FlightBoardService.TriggerModal('root.appLayout.flightBoard'))) {
                event.preventDefault();
                $timeout(function () {
                    if (fromState.name !== 'root.appLayout.flightBoard') {
                        $state.go('root.appLayout.dashboard');
                    }
                });
            }
        });
    }
})();


/*Configuring angular-busy*/
angular.module('app').value('cgBusyDefaults', {
    message: '',
    templateUrl: 'app/core/templates/customSplashScreen.html'
});