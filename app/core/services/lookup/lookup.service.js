(function () {
    angular
        .module('app')
        .factory('LookupService', LookupService);

    LookupService.$inject = ['HttpRequestService', 'AuthenticationSettings'];

    function LookupService(HttpRequestService, AuthenticationSettings) {
        var self = this;
        self.basePromise = undefined;

        return {
            FormatBases: formatBases
        };

        /*API Services*/

        function formatBases(callback) {
            HttpRequestService.Go({
                method: 'GET',
                url: AuthenticationSettings.ResourcesAPI + "api/Lookup/" + "GetCpaBases"
            }).then(function (data) {
                var format = [];
                for (var i in data) {
                    format.push({ BaseId: data[i].BaseId, Iata: data[i].Iata });
                }
                callback(null, format);
            }).catch(function (err) {
                callback(err, null);
            }); 
        }
    }

})();
