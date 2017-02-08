/**
 * Created by RobertoRolon on 2/5/17.
 */

(function() {

    angular
        .module('app')
        .factory('ReportService', ['HttpRequestService', 'AuthenticationSettings', '$q', ReportService]);

    function ReportService(HttpRequestService, AuthenticationSettings, $q) {
        return {
            getFacilityUsage : getFacilityUsage,
            r : r
        };

        function getFacilityUsage(object) {
            return HttpRequestService.Go({
                method: 'POST',
                url: AuthenticationSettings.ResourcesAPI + "api/checkin/getFacilityUsage",
                data: object
            });
        }

        function r(promises, callback) {
            $q.all(promises).then(function(res) {
                if(res) {
                    callback(null, res);
                }else {
                    callback({errorMessage : "No data!"});
                }
            }).catch(function(err) {
                callback(err);
            });
        }
    }

})();