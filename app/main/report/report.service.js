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
            r : resolvePromises,
            parseUsers : parseUsers
        };

        function getFacilityUsage(object) {
            return HttpRequestService.Go({
                method: 'POST',
                url: AuthenticationSettings.ResourcesAPI + "api/checkin/getFacilityUsage",
                data: object
            });
        }

        function parseUsers(users) {
            var object = {};

            for(var i in users) {
                var key = users[i].visitid_fk;
                if(object[key]) {
                    object[key].push(users[i]);
                }else {
                    object[key] = [users[i]];
                }
            }

            var array = [];

            for(var j in object) {
                var visit = object[j];
                var displayObject = {name: visit[0] ? visit[0].response : "N/A", houseNumber: visit[1] ? visit[1].response : "N/A", facility: visit[2] ? visit[2].response : "N/A"};

                if(visit[0])
                    displayObject.createdonlocaltime = moment.parseZone(visit[0].createdonlocaltime).format("h:mm a");

                array.push(displayObject);
            }
            console.log(array);
            return array;
        }

        function resolvePromises(promises, callback) {
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