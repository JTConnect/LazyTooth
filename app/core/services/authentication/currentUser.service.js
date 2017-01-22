(function () {
    angular
        .module('app')
        .factory('CurrentUserService', CurrentUserService);

    CurrentUserService.$inject = ['localStorageService', 'AuthenticationService'];

    function CurrentUserService(localStorageService, AuthenticationService) {
        var self = this;
        self.flightBoardConfigKey = 'flightBoardConfig';

        return {
            GetFlightBoardConfiguration: getFlightBoardConfiguration,
            SetFlightBoardConfiguration: setFlightBoardConfiguration,
            GetCurrentUserData: getCurrentUserData

        };

        function setFlightBoardConfiguration(obj) {
            localStorageService.set(self.flightBoardConfigKey, obj);
        }

        function getFlightBoardConfiguration() {
            return localStorageService.get(self.flightBoardConfigKey);
        }

        function getCurrentUserData() {
            return AuthenticationService.GetLocalDataStorage("authenticationData");
        }
    }
})();