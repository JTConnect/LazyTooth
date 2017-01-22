(function () {
    angular
        .module('app')
        .controller('ReportController', ReportController);

    ReportController.$inject = ['$window', 'LookupService', 'DateTimeService'];

    function ReportController($window, LookupService, DateTimeService) {
        var vm = this;
  
        activate();

        function activate() {}


    }

})();