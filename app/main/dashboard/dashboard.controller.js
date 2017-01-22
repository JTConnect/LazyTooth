(function () {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$state', 'LookupService', 'CurrentUserService', 'ReportService', 'DateTimeService', 'ApplicationInsightsService'];

    function DashboardController($scope, $state, LookupService, CurrentUserService, ReportService, DateTimeService, ApplicationInsightsService) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Dashboard Controller';
        vm.bases = [];
        vm.displaySelect = false;
        vm.selected = CurrentUserService.GetFlightBoardConfiguration();
        vm.base = vm.selected; 
        vm.currentUser = CurrentUserService.GetCurrentUserData('authenticationData');

        vm.BaseSelected = baseSelected;
        vm.NavigateTo = navigateTo;
        vm.GenerateReservationReport = generateReservationReport; 

        activate();

        function activate() {
            LookupService.FormatBases(function (err, res) {
                if (err) {
                    ApplicationInsightsService.TrackException(err.message, "GET CPA BASES (Dashboard)", { userName: vm.currentUser.userName, errorObject: err });
                    console.log(err);
                    return;
                }
                vm.bases = res;
                ApplicationInsightsService.TrackEvent("Status: 200, Action: GET CPA BASES, handled: Dashboard");
            });
            setUp();
        }

        function navigateTo(route) {
            if (route) {
                $state.go(route);
            }
        }

        function baseSelected(item, model, label) {
            CurrentUserService.SetFlightBoardConfiguration(model);
            vm.base = model; 
        }

        function setUp() {
            $scope.$on('loadSplashScreen', function (event, args) {
                vm.httpRequestPromise = args.httpPromise;
            });
        }

        function generateReservationReport() {
            var model = { baseId: vm.base.BaseId, startDateTime: DateTimeService.FormatMomentDateYear(), durationHours: 24 };
            ReportService.GenerateReservationReport(model);
        }

    }
})();
