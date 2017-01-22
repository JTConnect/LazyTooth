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
            var user = {userObject: {email: userObject.username , password: userObject.password}};


            return HttpRequestService.Go({
                method: 'POST',
                url: AuthenticationSettings.AuthenticationAPI,
                data: user,
                headers: { 'Content-type': 'application/json' } //
            });
        }
    }
})();