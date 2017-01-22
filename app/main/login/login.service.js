(function () {
    'use strict';

    angular
        .module('app')
        .factory('LoginService', LoginService);

    LoginService.$inject = ['HttpRequestService', 'AuthenticationSettings'];

    function LoginService(HttpRequestService, AuthenticationSettings) {
        return {
            PostLogin: postLogin
        };

        function postLogin(userObject) {
            return HttpRequestService.Go({
                method: 'POST',
                url: AuthenticationSettings.AuthenticationAPI + 'token',
                data: "grant_type=password&username=" + userObject.username + "&password=" + userObject.password + "&aduser=" + true,
                headers: { 'Content-type': 'application/x-www-form-urlencoded' }
            });
        }
    }
})();