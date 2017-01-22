(function () {
    angular
        .module('app')
        .constant("AuthenticationSettings", {
            AuthenticationAPI: 'http://signetapi-development.trafficmanager.net/',
            ResourcesAPI: 'http://signetapi-development.trafficmanager.net/'
        });
})();