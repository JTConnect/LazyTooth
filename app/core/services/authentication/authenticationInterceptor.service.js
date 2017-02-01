(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationInterceptorService', AuthenticationInterceptorService);

    AuthenticationInterceptorService.$inject = ['$q', '$injector', '$window', '$timeout', 'localStorageService'];

    function AuthenticationInterceptorService($q, $injector, $window, $timeout, localStorageService) {
        return {
            request: _request
        };

        function _request(config) {
            config.headers = config.headers || {};

            var authenticationData = localStorageService.get('authenticationData');
        
            if (authenticationData) {
                config.headers["x-access-token"] = authenticationData.accessToken;
            }

            return config;
        }
    }
})();