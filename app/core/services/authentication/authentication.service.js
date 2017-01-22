﻿(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['LoginService', 'localStorageService'];

    function AuthenticationService(LoginService, localStorageService) {
        var self = this;
        self.dataInStorage = ['authenticationData', 'flightBoardConfig'];

        var service = {
            LoginUser: loginUser,
            GetLocalDataStorage: getLocalDataStorage,
            LogOut: logOut
        };

        return service;

        function loginUser(userObject) {
            var loginPromise = LoginService.PostLogin(userObject);
            loginPromise.then(function (data) {
                setAuthenticationData('authenticationData', {
                    accessToken: data.access_token,
                    userName: data.UserName,
                    accessTokenExpires: data[".expires"],
                    userRoles: data.UserRoles.split(",")
                });
            });

            return loginPromise;
        }

        function getLocalDataStorage(key) {
            return localStorageService.get(key);
        }

        function logOut(key) {
            for (var i in self.dataInStorage) {
                clearAuthenticationData(self.dataInStorage[i]);
            }
        }


        function setAuthenticationData(key, value) {
            localStorageService.set(key, value);
        }

        function clearAuthenticationData(key) {
            return localStorageService.remove(key);
        }

    }
})();