(function () {
    angular
        .module('app')
        .factory('CurrentUserService', CurrentUserService);

    CurrentUserService.$inject = ['localStorageService', 'AuthenticationService'];

    function CurrentUserService(localStorageService, AuthenticationService) {
        var self = this;
        self.ConfigKey = 'Configuration';

        return {
            GetConfiguration: getConfiguration,
            SetConfiguration: setConfiguration,
            GetCurrentUserData: getCurrentUserData

        };

        function setConfiguration(obj) {
            localStorageService.set(self.ConfigKey, obj);
        }

        function getConfiguration() {
            return localStorageService.get(self.ConfigKey);
        }

        function getCurrentUserData() {
            return AuthenticationService.GetLocalDataStorage("authenticationData");
        }
    }
})();