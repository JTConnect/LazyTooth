(function () {
    'use strict';

    angular
        .module('app')
        .controller('FlightBoardController', FlightBoardController);

    FlightBoardController.$inject = ['$scope', '$interval', 'FlightBoardService', 'DateTimeService', 'CurrentUserService', 'ApplicationInsightsService'];

    function FlightBoardController($scope, $interval, FlightBoardService, DateTimeService, CurrentUserService, ApplicationInsightsService) {
        var vm = this;
        vm.title = "FlightBoard Controller";
        vm.arrivals = [];
        vm.departures = [];
        vm.transports = [];
        vm.sameDayFlights = [];
        vm.hourRange = 24;
        vm.flightBoardConfiguration = {};
        vm.currentUser = CurrentUserService.GetCurrentUserData('authenticationData');

        vm.flightBoardDate = undefined;
        vm.calendarDate = undefined;
        vm.todaysTime = undefined;

        vm.FetchReservations = fetchReservations;
        vm.OpenFlightBoardCalendar = openFlightBoardCalendar;
        vm.DateChanged = dateChanged;
        vm.GetReservationsByBase = getReservationsByBase;

        /* Common Date Configurations*/
        vm.isFlightBoardCalendarOpen = false;
        vm.formats = DateTimeService.GetDateFormats();
        vm.format = vm.formats[3];
        vm.dateOptions = DateTimeService.GetDateOptions();
        vm.altInputFormats = DateTimeService.GetAltInputFormats();

        activate();
        function activate() {
            setUp();
            setUpDateTime();
            vm.flightBoardConfiguration = CurrentUserService.GetFlightBoardConfiguration();
            getReservationsByBase();
        }

        function setUp() {
            $scope.$emit('toggleSideNav', { close: true });

            vm.getReservationsIntervalPromise = $interval(function () { getReservationsByBase(); }, 30000);
            vm.getTodaysTimeIntervalPromise = $interval(function () { vm.todaysTime = DateTimeService.GetTodaysTime(); }, 10000);

            $scope.$on('$destroy', function () {
                if (angular.isDefined(vm.getReservationsIntervalPromise)) {
                    $interval.cancel(vm.getReservationsIntervalPromise);
                }

                if (angular.isDefined(vm.getTodaysTimeIntervalPromise)) {
                    $interval.cancel(vm.getTodaysTimeIntervalPromise);
                }
            });
        }

        function setUpDateTime() {
            vm.flightBoardDate = DateTimeService.GetTodaysDate();
            vm.calendarDate = new Date();
            vm.todaysTime = DateTimeService.GetTodaysTime();
        }

        function getReservationsByBase(baseId) {
            vm.requestObject = getRequestObject(baseId);
            vm.reservationsPromise = FlightBoardService.GetReservationsByBase(vm.requestObject);
            vm.reservationsPromise.then(function (data) {

                FlightBoardService.FlattenReservation(data);
                var collection = FlightBoardService.StructureReservationData(data);

                vm.arrivals = collection.data.Arrivals;
                vm.departures = collection.data.Departures;
                vm.sameDayFlights = collection.sameDayFlights;
                vm.heavyCharters = collection.heavyCharters;

                console.log(collection);

            }).catch(function (err) {
                ApplicationInsightsService.TrackException(err.message, "GetReservationsByBase (FlightBoard)", { userName: vm.currentUser.userName, errorObject: err });
                console.log(err);
            });
        }

        function getRequestObject(baseId) {
            return {
                BaseId: (vm.flightBoardConfiguration === null) ? baseId : vm.flightBoardConfiguration.BaseId,
                StartDateTime: getFlightBoardDate(),
                DurationHours: vm.hourRange
            };
        }

        function fetchReservations(arithmetic) {
            vm.flightBoardDate = DateTimeService.SetHoursToDate(getFlightBoardDate(), vm.hourRange, arithmetic);
            var partOfDate = DateTimeService.GetDateParts(vm.flightBoardDate);
            vm.calendarDate = new Date(partOfDate.year, partOfDate.month, partOfDate.day);
            getReservationsByBase();
        }

        function openFlightBoardCalendar() {
            vm.isFlightBoardCalendarOpen = !vm.isFlightBoardCalendarOpen;
        }

        function dateChanged() {
            setFlightBoardDate(DateTimeService.FormatDate(vm.calendarDate));
            getReservationsByBase();
        }

        function setFlightBoardDate(date) {
            vm.flightBoardDate = date;
        }

        function getFlightBoardDate() {
            return vm.flightBoardDate;
        }

        function loadSplashScreen(promise) {
            $scope.$emit('loadSplashScreen', { httpPromise: promise });
        }
    }
})();