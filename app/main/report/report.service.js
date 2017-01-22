(function () {

	angular
		.module('app')
		.factory('ReportService', ReportService);

	ReportService.$inject = ['AuthenticationSettings', '$window'];

	function ReportService(AuthenticationSettings, $window) {

		return {
			GenerateReservationReport: generateReservationReport
		};

		function generateReservationReport(model) {
		    $window.open(AuthenticationSettings.ResourcesAPI + "Report/Reservations/" + model.baseId + "/" + model.startDateTime + "/" + model.durationHours);	   
		}
	}
})();