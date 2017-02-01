(function () {
    angular
        .module('app')
        .constant("AuthenticationSettings", {
            AuthenticationAPI: 'https://resourceserver.herokuapp.com/login',
            ResourcesAPI: 'https://resourceserver.herokuapp.com/'
        });
})();