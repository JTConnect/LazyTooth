(function () {
    angular
        .module('app')
        .directive("reservationGrid", reservationGrid);

    reservationGrid.$inject = [];


    function reservationGrid() {
        return {
            restrict: 'EA', // E = element, A= Attribute
            scope: { reservations: "=" },
            bindToController: true,
            templateUrl: 'app/core/templates/reservation.html',
            controller: myController,
            controllerAs: 'vm',
        };

        function myController() { }
    }

})();
