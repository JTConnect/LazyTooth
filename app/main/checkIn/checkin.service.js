/**
 * Created by Frankfernandez on 1/31/17.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .factory('CheckInService', CheckInService);

    CheckInService.$inject = ['HttpRequestService', 'AuthenticationSettings'];

    function CheckInService(HttpRequestService, AuthenticationSettings) {
        return {
            GetQuestions: getQuestions,
            PostQuestion: postQuestion
        };

        function getQuestions() {
            return HttpRequestService.Go({
                method: 'GET',
                url: AuthenticationSettings.ResourcesAPI + "api/checkin/getQuestions"
            });
        }

        function postQuestion(response) {
            console.log(response);
            return HttpRequestService.Go({
                method: 'POST',
                url: AuthenticationSettings.ResourcesAPI + "api/checkin/postQuestion",
                data: response
            });
        }
    }
})();
