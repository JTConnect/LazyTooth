(function () {
    'use strict';

    angular
        .module('app')
        .factory('HttpRequestService', HttpRequestService);

    HttpRequestService.$inject = ['$q', '$http'];

    function HttpRequestService($q, $http) {
        return {
            Go: Go
        };

        function Go(httpConfiguration) {
            var deferred = $q.defer();
            $http(httpConfiguration).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
    }

})();