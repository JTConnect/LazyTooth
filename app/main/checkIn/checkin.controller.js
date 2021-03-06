/**
 * Created by Frankfernandez on 1/31/17.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('CheckInController', CheckInController);

    CheckInController.$inject = ['$scope', '$state', 'CheckInService', 'CurrentUserService', 'DateTimeService', '$timeout'];

    function CheckInController($scope, $state, CheckInService, CurrentUserService, DateTimeService, $timeout) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'CheckIn Controller';
        vm.showQuestion1 = true;
        vm.showQuestion2 = false;
        vm.showQuestion3 = false;
        vm.displayMessage = false;
        vm.Next2 = next2;
        vm.Next3 = next3;
        vm.Next4 = next4;

        activate();

        function activate() {
            setDefault();

            var questionPromise = CheckInService.GetQuestions();
            questionPromise.then(function(data) {
                if(data && data.data) {
                    var questions = data.data.rows;
                    vm.question1 = questions[0];
                    console.log(vm.question1);
                    vm.question2 = questions[1];
                    vm.question3 = questions[2];
                    console.log(questions);
                }
            });
        }

        function next2() {
            if(vm.question1Response && vm.question1Response.length > 0) {
                vm.showQuestion1 = !vm.showQuestion1;

                var response = {
                    response: vm.question1Response,
                    questionid_fk: vm.question1.questionid,
                    type: getCheckinType(),
                    visitid_fk: getVisitId()
                };

                var postQuestionPromise = CheckInService.PostQuestion(response);
                postQuestionPromise.then(function(res) {
                    console.log(res);
                    vm.showQuestion2 = !vm.showQuestion2;
                    setVisitId(res && res.data ? res.data.visitid : 0);
                });
            }
        }

        function next3() {
            if (vm.question2Response && !isNaN(vm.question2Response)) {
                vm.showQuestion2 = !vm.showQuestion2;
                var response = {
                    response: vm.question2Response,
                    questionid_fk: vm.question2.questionid,
                    type: getCheckinType(),
                    visitid_fk: getVisitId()
                };

                var postQuestionPromise = CheckInService.PostQuestion(response);
                postQuestionPromise.then(function (data) {
                    console.log(data);
                    vm.showQuestion3 = !vm.showQuestion3;
                }).catch(function(err) {

                });
            }
        }

        function next4() {
            if (vm.question2Response && !isNaN(vm.question2Response)) {
                vm.showQuestion3 = !vm.showQuestion3;
                var response = {
                    response: vm.question3Response,
                    questionid_fk: vm.question3.questionid,
                    type: getCheckinType(),
                    visitid_fk: getVisitId()
                };

                var postQuestionPromise = CheckInService.PostQuestion(response);
                postQuestionPromise.then(function (data) {
                    console.log(data);
                    vm.showQuestion4 = !vm.showQuestion4;
                    vm.displayMessage = true;
                    $timeout(function(){
                        vm.displayMessage = false;
                        vm.showQuestion1 = true;
                        setDefault();
                    },3000);

                }).catch(function(err) {
                    console.log(err);
                });
            }
        }

        function getCheckinType() {
            return "Kiosk";
        }

        function getVisitId() {
            return vm.VisitId;
        }

        function setVisitId(visitid) {
            vm.VisitId = visitid;
        }

        function setDefault() {
            vm.VisitId = 0;
            vm.question1Response = "";
            vm.question2Response = "";
            vm.question3Response = "";
            vm.question4Response = "";
        }
    }
})();
