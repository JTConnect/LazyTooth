(function () {
    angular
        .module('app')
        .controller('ReservationsReportController', ReservationsReportController);

    ReservationsReportController.$inject = ['DateTimeService', 'ReportService', 'LookupService', 'CurrentUserService', 'ApplicationInsightsService'];

    function ReservationsReportController(DateTimeService, ReportService, LookupService, CurrentUserService, ApplicationInsightsService) {
        var vm = this;

        vm.currentUser = CurrentUserService.GetCurrentUserData('authenticationData');

        vm.formats = DateTimeService.GetDateFormats();
        vm.format = vm.formats[3];
        vm.dateOptions = DateTimeService.GetDateOptions();
        vm.altInputFormats = DateTimeService.GetAltInputFormats();
        vm.baseId = undefined;
        vm.startDateTime = undefined;
        vm.isOpen = false; 

        vm.ViewReport = viewReport;
        vm.BaseSelected = baseSelected;
        vm.GetBaseId = getBaseId;
        vm.Open = open;
        vm.Reset = reset;


        activate();

        function activate() {
            LookupService.FormatBases(function (err, res) {
                if (err) {
                    ApplicationInsightsService.TrackException(err.message, "GET CPA BASES (ReservationsReport)", { userName: vm.currentUser.userName, errorObject: err });                 
                    console.log(err);
                    return;
                }
                vm.bases = res;
                ApplicationInsightsService.TrackEvent("Status: 200, Action: GET CPA BASES, handled: ReservationReport");
            });

           vm.startDateTime = new Date();
        }

        function viewReport() {
            if (!getBaseId() || !vm.startDateTime) {
                vm.submit = true;
                return;
            }
            var model = {
                baseId: getBaseId(),
                startDateTime: DateTimeService.FormatDateYear(vm.startDateTime),
                durationHours: 24
            };
            ReportService.GenerateReservationReport(model);
        }

        function open() {
            vm.isOpen = !vm.isOpen; 
        }

        function baseSelected(item, model, label) {
            setBaseId(model.BaseId);
        }

        function setBaseId(id) {
            vm.baseId = id;
        }

        function getBaseId() {
            return vm.baseId;
        }

        function reset() {
            if (vm.selected === undefined) {
                 vm.baseId = undefined; 
            }
        }      
    }

})();