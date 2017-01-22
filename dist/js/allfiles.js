(function () {
    'use strict';

    angular.module('app', [
        // Angular modules
        'ngAnimate',
        'angular-loading-bar',

        // Custom modules

        // 3rd Party Modules
         'ui.bootstrap',
         'ui.router',
         'LocalStorageModule',
         'cgBusy'
    ]);
})();

(function () {
    angular
        .module('app')
        .directive('focusMe', focusMe);

    focusMe.$inject = ['$timeout'];

    function focusMe($timeout) {
        return {
            scope: { focus: '=focusMe' },
            link: function (scope, element) {
                scope.$watch('focus', function (value) {
                    if (value === true) {
                        $timeout(function () {
                            element[0].focus();
                        });
                    }
                });
            }
        };
    }
})();
/*Still Implementing not ready for production*/
(function () {
    angular
        .module('app')
        .directive("myPagination", myPagination);

    myPagination.$inject = ["FlightBoardService"];


    function myPagination(FlightBoardService) {
        return {
            restrict: 'EA', // E = element, A= Attribute
            scope: { itemsPerPage: "=", size: "=", currentPage: "=", ampersand: "&" },
            controller: myController,
            controllerAs: 'vm',
            bindToController: true,
            templateUrl: 'app/core/templates/myPagination.html',
        };


        function myController() {
            var vm = this;
            vm.PageChanged = pageChanged;

            function pageChanged() {
                //TODO: Needs to call data source here, then update the counter. 


                if (vm.currentPage > 1) {
                    console.log("enter here first");
                    vm.ampersand({ currentPage: vm.currentPage });
                }
                console.log(vm.currentPage);
                console.log(vm.size);
                console.log("directive continues down the code");
                var counter = FlightBoardService.SetPaginationCounter(vm.itemsPerPage, vm.size, vm.currentPage);
                vm.begin = counter.begin;
                vm.end = counter.end;

            }

            activate();
            function activate() {
                //Intialize the counter values
                pageChanged();
            }
        }
    }

})();

/*Usage:
        <my-pagination items-per-page="vm.itemsPerPage" size="vm.departureData.length" current-page="vm.currentPage" ampersand="vm.FetchDepartureData(currentPage)"></my-pagination>
        <div class="col-sm-12" style="padding-top: 0px">
            <uib-pagination class="pull-right" total-items="vm.totalItems" ng-model="vm.currentPage" ng-change="vm.PageChanged()"></uib-pagination>
        </div>

 Parent Controller: 
    function fetchDepartureData(currentPage) {
    vm.departureData = [{ prop: 1 }, { prop: 1 }, { prop: 1 }];
}

*/
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

(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['LoginService', 'localStorageService'];

    function AuthenticationService(LoginService, localStorageService) {
        var self = this;
        self.dataInStorage = ['authenticationData', 'flightBoardConfig'];

        var service = {
            LoginUser: loginUser,
            GetLocalDataStorage: getLocalDataStorage,
            LogOut: logOut
        };

        return service;

        function loginUser(userObject) {
            var loginPromise = LoginService.PostLogin(userObject);
            loginPromise.then(function (data) {
                setAuthenticationData('authenticationData', {
                    accessToken: data.access_token,
                    userName: data.UserName,
                    accessTokenExpires: data[".expires"],
                    userRoles: data.UserRoles.split(",")
                });
            });

            return loginPromise;
        }

        function getLocalDataStorage(key) {
            return localStorageService.get(key);
        }

        function logOut(key) {
            for (var i in self.dataInStorage) {
                clearAuthenticationData(self.dataInStorage[i]);
            }
        }


        function setAuthenticationData(key, value) {
            localStorageService.set(key, value);
        }

        function clearAuthenticationData(key) {
            return localStorageService.remove(key);
        }

    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationInterceptorService', AuthenticationInterceptorService);

    AuthenticationInterceptorService.$inject = ['$q', '$injector', '$window', '$timeout', 'localStorageService'];

    function AuthenticationInterceptorService($q, $injector, $window, $timeout, localStorageService) {
        return {
            request: _request,
        };

        function _request(config) {
            config.headers = config.headers || {};

            var authenticationData = localStorageService.get('authenticationData');
        
            if (authenticationData) {
                config.headers.Authorization = 'Bearer ' + authenticationData.accessToken;
            }

            return config;
        }
    }
})();
(function () {
    angular
        .module('app')
        .constant("AuthenticationSettings", {
            AuthenticationAPI: 'http://signetapi-development.trafficmanager.net/',
            ResourcesAPI: 'http://signetapi-development.trafficmanager.net/'
        });
})();
(function () {
    angular
        .module('app')
        .factory('CurrentUserService', CurrentUserService);

    CurrentUserService.$inject = ['localStorageService', 'AuthenticationService'];

    function CurrentUserService(localStorageService, AuthenticationService) {
        var self = this;
        self.flightBoardConfigKey = 'flightBoardConfig';

        return {
            GetFlightBoardConfiguration: getFlightBoardConfiguration,
            SetFlightBoardConfiguration: setFlightBoardConfiguration,
            GetCurrentUserData: getCurrentUserData

        };

        function setFlightBoardConfiguration(obj) {
            localStorageService.set(self.flightBoardConfigKey, obj);
        }

        function getFlightBoardConfiguration() {
            return localStorageService.get(self.flightBoardConfigKey);
        }

        function getCurrentUserData() {
            return AuthenticationService.GetLocalDataStorage("authenticationData");
        }
    }
})();
(function () {
    angular
        .module('app')
        .factory("DateTimeService", DateTimeService);

    DateTimeService.$inject = [];

    function DateTimeService() {
        var self = this;
        self.date = new moment();
        self.dateFormat = "M/DD/YYYY";
        self.dateTimeFormat = "M/DD/YYYY HH:mm";
        self.timeFormat = "HH:mm";
        self.hourSymbol = "h";
        self.dateFormats = ['dd-MMMM-yyyy', 'YYYY-MM-DD', 'dd.MM.yyyy', 'MM/dd/yyyy', 'shortDate'];
        self.dateOptions = { formatYear: 'yy', startingDay: 1, showWeeks: true };
        self.altInputFormats = ['M!/d!/yyyy'];

        var service = {
            AddHoursToTodaysDateTime: addHoursToTodaysDateTime,
            SetHoursToDate: setHoursToDate,
            FormatDate: formatDate,
            FormatDateTime: formatDateTime,
            FormatTime: formatTime,
            FormatDateYear: formatDateYear,
            FormatMomentDateYear: formatMomentDateYear,
            GetTimeFromDateTime: getTimeFromDateTime,
            GetTodaysDate: getTodaysDate,
            GetTodaysTime: getTodaysTime,
            GetDateFormats: getDateFormats,
            GetDateOptions: getDateOptions,
            GetAltInputFormats: getAltInputFormats,
            GetDateParts: getDateParts,
            GetDifference: getDifference
        };

        return service;

        function addHoursToTodaysDateTime(numberOfHours) {
            return moment().add(numberOfHours, self.hourSymbol).format(self.dateTimeFormat);
        }

        function addHoursToDateTime(numberOfHours, datetime) {
            return datetime.add(numberOfHours, self.hourSymbol).format(self.dateTimeFormat);
        }

        function getTimeFromDateTime(datetime) {
            var momentDate = moment(datetime);
            return momentDate.format(self.timeFormat);
        }

        function formatDate(date) {
            return moment(date).format(self.dateFormat);
        }

        function formatDateTime(datetime) {
            return moment(datetime).format(self.dateTimeFormat);
        }

        function formatTime(date) {
            return moment(date).format(self.timeFormat);
        }

        function setHoursToDate(date, hours, arithmetic) {
            switch (arithmetic) {
                case 'a':
                    return moment(date, self.dateFormat).add(hours, self.hourSymbol).format(self.dateFormat);
                case 's':
                    return moment(date, self.dateFormat).subtract(hours, self.hourSymbol).format(self.dateFormat);
            }
        }

        function getTodaysDate() {
            return moment().format(self.dateFormat);
        }

        function getTodaysTime() {
            return moment().format(self.timeFormat);
        }

        function getTodaysDateTime() {
            return moment().format(self.dateTimeFormat);
        }

        function getDateFormats() {
            return self.dateFormats;
        }

        function getDateOptions() {
            return self.dateOptions;
        }

        function getAltInputFormats() {
            return self.altInputFormats;
        }

        function getDateParts(date) {
            var d = moment(date, self.dateFormat);
            var dateParts = { year: d.year(), day: d.date(), month: d.month() };
            return dateParts;
        }

        function getDifference(start, end, measurement) {
            var startDate = moment(start);
            var endDate = moment(end);
            return endDate.diff(startDate, measurement);
        }

        function formatDateYear(date) {
            return moment(date).format(self.dateFormats[1]); 
        }

        function formatMomentDateYear() {
            return moment().format(self.dateFormats[1]); 
        }


    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('HttpRequestService', HttpRequestService);

    HttpRequestService.$inject = ['$q', '$http'];

    function HttpRequestService($q, $http) {
        return {
            Go: Go
        };

        function Go(httpConfiguration) {
            var deferred = $q.defer();
            $http(httpConfiguration).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
    }

})();
(function () {
    angular
        .module('app')
        .factory('LookupService', LookupService);

    LookupService.$inject = ['HttpRequestService', 'AuthenticationSettings'];

    function LookupService(HttpRequestService, AuthenticationSettings) {
        var self = this;
        self.basePromise = undefined;

        return {
            FormatBases: formatBases
        };

        /*API Services*/

        function formatBases(callback) {
            HttpRequestService.Go({
                method: 'GET',
                url: AuthenticationSettings.ResourcesAPI + "api/Lookup/" + "GetCpaBases"
            }).then(function (data) {
                var format = [];
                for (var i in data) {
                    format.push({ BaseId: data[i].BaseId, Iata: data[i].Iata });
                }
                callback(null, format);
            }).catch(function (err) {
                callback(err, null);
            }); 
        }
    }

})();

(function () {
    angular
        .module('app')
        .factory('HelperMethodsService', HelperMethodsService);

    HelperMethodsService.$inject = [];

    function HelperMethodsService() {

        return {
            IsObjectNull: isObjectNull,
            IsPropertyEmpty: isPropertyEmpty
        };

        function isObjectNull(obj) {
            return (obj === null || obj === undefined || obj.length === 0);
        }

        function isPropertyEmpty(value) {
            return ((value === null || value === undefined) || (value.trim().length === 0));
        }
    }


})();
(function () {
    angular
        .module('app')
        .factory('ApplicationInsightsService', ApplicationInsightsService);

    ApplicationInsightsService.$inject = [];

    function ApplicationInsightsService() {
        var self = this;
        self.applicationInsights = window.appInsights;

        return {
            TrackException: trackException,
            TrackEvent: trackEvent
        };

        function trackException(err, properties, measurements ) {
            if (getApplicationInsights()) {
                getApplicationInsights().trackException(err, properties, measurements);
            }
        }

        function trackEvent(event) {
            if (getApplicationInsights()) {
                getApplicationInsights().trackEvent(event);
            }
        }

        function getApplicationInsights() {
            return self.applicationInsights || window.appInsights; 
        }

    }
})(); 
(function () {
    'use strict';

    angular
        .module('app')
        .config(authenticationInterceptor); 
        
    authenticationInterceptor.$inject = ['$httpProvider'];

    function authenticationInterceptor($httpProvider) {
        $httpProvider.interceptors.push('AuthenticationInterceptorService');
    }
})(); 

(function () {
    'use strict';

    angular
        .module('app')
        .run(runBlock);

    runBlock.$inject = ['$rootScope', '$state', '$timeout', 'AuthenticationService', 'FlightBoardService'];

    function runBlock($rootScope, $state, $timeout, AuthenticationService, FlightBoardService) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

            var userAuthentication = AuthenticationService.GetLocalDataStorage("authenticationData");
            var loginRoute = 'root.login';
            var simpleLogin = 'root.simpleLogin';
            var root = "root";

            //if user is not authenticated, and is routing to the login page then there is no need to route user. 
            if (!userAuthentication && (toState.name == loginRoute)) {
                return;
            }

            //if user is authenticated then he should not be able to visit login page
            if (userAuthentication && (toState.name == loginRoute)) {
                event.preventDefault();
                $timeout(function () {
                    $state.go('root.appLayout.dashboard');
                });
            }

            //If user is not authenticated, return user to the login view. 
            if (!userAuthentication && simpleLogin !== toState.name) {
                event.preventDefault();
                $timeout(function () {
                    $state.go('root.login');
                });
            }

            //if user is authenticated and starting the app. 
            if (userAuthentication && toState.name == root) {
                $timeout(function () {
                    $state.go('root.appLayout.dashboard');
                });
            }

            if (userAuthentication && toState.name == 'root.appLayout.flightBoard' && (FlightBoardService.TriggerModal('root.appLayout.flightBoard'))) {
                event.preventDefault();
                $timeout(function () {
                    if (fromState.name !== 'root.appLayout.flightBoard') {
                        $state.go('root.appLayout.dashboard');
                    }
                });
            }
        });
    }
})();


/*Configuring angular-busy*/
angular.module('app').value('cgBusyDefaults', {
    message: '',
    templateUrl: 'app/core/templates/customSplashScreen.html'
});
(function () {
    'use strict';

    angular
        .module('app')
        .controller('WarningModalController', WarningModalController);

    WarningModalController.$inject = ['$scope', '$uibModalInstance'];

    function WarningModalController($scope, $uibModalInstance) {
        /* jshint validthis:true */

        $scope.ok = function () {
            $uibModalInstance.dismiss('');
        };
    }
})();

(function () {
    'use strict';

    angular
        .module('app')
        .config(mainState);

    mainState.$inject = ['$stateProvider', '$urlRouterProvider'];

    function mainState($stateProvider, $urlRouterProvider) {

        $stateProvider.state('root', {
            url: '',
            views: {
                'rootLayout': {
                    templateUrl: 'app/main/rootLayout/rootLayout.html'
                }
            }
        })
        .state('root.login', {
            url: '/login',
            templateUrl: 'app/main/login/login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        })
        .state('root.simpleLogin', {
            url: '/simplelogin',
            templateUrl: 'app/main/simpleLogin/simpleLogin.html',
            controller: 'SimpleLoginController',
            controllerAs: "vm"
        })
        .state('root.appLayout', {
            url: '/app',
            templateUrl: 'app/main/application/appLayout.html',
            controller: 'AppLayoutController',
            controllerAs: 'vm'
        })
        .state('root.appLayout.dashboard', {
            url: '/dashboard',
            templateUrl: 'app/main/dashboard/dashboard.html',
            controller: 'DashboardController',
            controllerAs: 'vm',
        })
        .state('root.appLayout.flightBoard', {
            url: '/flightboard',
            templateUrl: 'app/main/flightBoard/flightBoard.html',
            controller: 'FlightBoardController',
            controllerAs: 'vm'
        })
        .state('root.appLayout.report', {
            url: '/report',
            templateUrl: 'app/main/report/report.html',
            controller: 'ReportController',
            controllerAs: 'vm'
        })
        .state('root.appLayout.report.reservations', {
            url: '/reservationsreport',
            templateUrl: 'app/main/report/reservations/reservations.html',
            controller: 'ReservationsReportController',
            controllerAs: 'vm'
        });
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('AppLayoutController', AppLayoutController);

    AppLayoutController.$inject = ['$scope', '$state', '$location', '$uibModal', 'AuthenticationService', 'CurrentUserService', 'FlightBoardService'];

    function AppLayoutController($scope, $state, $location, $uibModal, AuthenticationService, CurrentUserService, FlightBoardService) {
        /* jshint validthis:true */
        var vm = this;
        vm.isSideNavClosed = false;
        vm.state = $state;

        vm.userName = AuthenticationService.GetLocalDataStorage('authenticationData').userName;
        vm.title = 'AppLayout Controller';

        vm.Logout = logOut;
        vm.Open = open;
        vm.NavigateTo = navigateTo;
        activate();

        function activate() {
            setUp();
        }

        function logOut() {
            AuthenticationService.LogOut();
            $location.path('/login');
        }

        function open() {
            vm.isSideNavClosed = !vm.isSideNavClosed;
        }

        function setUp() {
            $scope.$on('toggleSideNav', function (event, args) {
                vm.isSideNavClosed = args.close;
            });
        }


        function navigateTo(route) {
            $state.go(route);
        }

    }
})();

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
(function () {
    angular
        .module('app')
        .factory('FlightBoardService', FlightBoardService);

    FlightBoardService.$inject = ['$interval', '$uibModal', 'HttpRequestService', 'AuthenticationSettings', 'DateTimeService', 'HelperMethodsService', 'CurrentUserService'];

    function FlightBoardService($interval, $uibModal, HttpRequestService, AuthenticationSettings, DateTimeService, HelperMethodsService, CurrentUserService) {
        var self = this;

        self.serviceCategory = [
            { Id: 1, name: 'Car' },
            { Id: 2, name: 'Cater' },
            { Id: 3, name: 'CustHandling' },
            { Id: 4, name: 'Deice' },
            { Id: 5, name: 'Etc' },
            { Id: 6, name: 'Fuel' },
            { Id: 7, name: 'Gpu' },
            { Id: 8, name: 'Handling' },
            { Id: 9, name: 'Hotel' },
            { Id: 10, name: 'Intial' },
            { Id: 11, name: 'Lav' },
            { Id: 12, name: 'Other' },
            { Id: 14, name: 'Secondary' },
            { Id: 15, name: 'Water' }
        ];

        self.transportationType = [
           { Id: 1, type: 'rental', abbreviation: 'R' },
           { Id: 2, type: 'limo', abbreviation: 'L' },
           { Id: 3, type: 'taxi', abbreviation: 'T' },
           { Id: 4, type: 'crew car', abbreviation: 'C' },
           { Id: 5, type: 'personal', abbreviation: 'P'}
        ];

        self.flightDirection = [{ id: 1, name: "arrival" }, { id: 2, name: "departure" }];
        self.heavyCharterTypes = ["tx"];
        self.flightBoardRoute = "root.appLayout.flightBoard";
        self.prefix = "Flight";
        self.fuelTypes = ['jet a +', 'avgas', '100ll', 'jet a -'];
        self.sections = { arrival: 'arrival', sameDay: 'sameDay', departure: 'departure' };

        return {
            StructureReservationData: structureReservationData,
            GetReservationsByBase: getReservationsByBase,
            GetUserSettings: getUserSettings,
            FlattenReservation: flattenReservation,
            TriggerModal: triggerModal,
            IsQuickTurn: isQuickTurn,
            SortFlights: sortFlights,
            IsHeavyCharter: isHeavyCharter,
            RemoveFlights: removeFlights,
            GetFlights: getFlights,
            CheckDeparturesForHeavyTransport: checkDeparturesForHeavyTransport
        };



        function triggerModal(route) {
            var trigger = false;

            if (route !== self.flightBoardRoute) { return trigger; }

            if (CurrentUserService.GetFlightBoardConfiguration() === null) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'app/core/templates/modal/warningModal.html',
                    controller: 'WarningModalController',
                    size: '',
                });
                trigger = true;
            }
            return trigger;
        }

        /*API Services*/


        /**
         * This function does the following: 
         * Gets Flight Reservations. 
         * @param data an object with three properties: BaseId, StartDateTime, and DurationHours. 
         * @return an Http promise that when resolved will give access to reservations in two categories
         * Arrivals and Departures (For ex. {Arrivals: [], Departures: []})
         */
        function getReservationsByBase(data) {
            return HttpRequestService.Go({
                method: "POST",
                url: AuthenticationSettings.ResourcesAPI + "api/FlightBoard/" + "GetReservationsByBase",
                data: JSON.stringify(data)
            });
        }

        function getUserSettings() {
            return {
                BaseId: "P08",
                Roles: []
            };
        }


        /*FlightBoard Logic*/

        function setPaginationCounter(itemsPerPage, dataLength, currentPage) {
            var begin, end;
            begin = (currentPage - 1) * itemsPerPage;
            end = begin + itemsPerPage;
            if ((end - dataLength) > 0) {
                var difference = dataLength - begin;
                end = begin + difference;
            }
            begin += 1;
            return { begin: begin, end: end };
        }

        function createFlightObject(pageNum, itemsPerPage, hourRange, date) {
            var obj = {
                Pagination: { CurrentPage: pageNum, itemsPerPage: itemsPerPage },
                Date: date,
                HourRange: hourRange
            };
            return obj;
        }

        function calculateHourRange(arithmetic, hourRange) {
            if (hourRange === 0 && arithmetic == "s") {
                return 0;
            }

            if (arithmetic == "s") {
                hourRange -= 1;
            }

            if (arithmetic == "a") {
                hourRange += 1;
            }

            return hourRange;
        }

        /**
         * This function does the following: 
         * gets same day, and heavy charter flights 
         * formats departure dates and looks for heavy charters
         * removes same day flights and heavy charters from arrival and departure arrays.
         * @param data encapsulates both arrivals and departures
         * @return an object with three properties: sameDayFlights, heavyCharters, and data (Arrivals and Departures)
         */
        function structureReservationData(data) {
            if (HelperMethodsService.IsObjectNull(data)) return;

            var sameDayFlights = [],
                heavyCharters = [],
                arrivals = data.Arrivals,
                departures = data.Departures;
     
            getFlights(arrivals, sameDayFlights, heavyCharters);
            checkDeparturesForHeavyTransport(departures, heavyCharters);
            removeFlights(arrivals, departures, sameDayFlights, heavyCharters);

            sortArrivals(arrivals);
            sortSameDayFlights(sameDayFlights);
            sortDepartures(departures);
            sortHeavyCharters(heavyCharters);

            return { sameDayFlights: sameDayFlights, heavyCharters: heavyCharters, data: data };
        }

       /**
         * The following four functions are used to initiate the sort methods for 
         * the flights. 
         */
        function sortArrivals(arrivals) {
            sortFlights(arrivals, self.sections.arrival);
            for (var i in arrivals) {
                formatReservationTimes(arrivals[i], self.flightDirection[0].id);
            }
        }
        
        function sortSameDayFlights(sameDayFlights) {
            sortFlights(sameDayFlights, self.sections.sameDay);
            for (var i in sameDayFlights) {
                formatReservationTimes(sameDayFlights[i]);
            }
        }
        
        function sortDepartures(departures) {
            sortFlights(departures, self.sections.departure);
            for (var i = 0; i < departures.length; i++) {
                formatReservationTimes(departures[i], self.flightDirection[1].id);
           }
        }

        function sortHeavyCharters(heavyCharters) {
            for (var i = 0; i < heavyCharters.length; i++) {
                if (heavyCharters[i].IsArrival === true) {
                    formatReservationTimes(heavyCharters[i], self.flightDirection[0].id);
                }
                else if(heavyCharters[i].IsDeparture === true) {
                    formatReservationTimes(heavyCharters[i], self.flightDirection[1].id);
                }
                else if (heavyCharters[i].IsSameDay === true) {
                    formatReservationTimes(heavyCharters[i]);
                }
            }
        }

        /**
         * This function does the following: 
         * iterates through the departure array to find heavy transport flights.
         * @param departures array with departure flights
         * @param heavyCharters array with heavy flights 
         */
        function checkDeparturesForHeavyTransport(departures, heavyCharters) {
            for (var i = 0; i < departures.length; i++) {             
                if (isHeavyCharter(departures[i])) {
                    departures[i].IsDeparture = true;
                    heavyCharters.push(departures[i]);
                }
            }
        }

        function sortFlights(array, section) {
            if (HelperMethodsService.IsObjectNull(array)) return;

            if (section === self.sections.arrival) {
                array.sort(function (aFlight, bFlight) {
                    var aDateTime;
                    var bDateTime;

                    if (!HelperMethodsService.IsPropertyEmpty(aFlight.ArrivalFlightInformation.FlightDateTime)) {
                        aDateTime = aFlight.ArrivalFlightInformation.FlightDateTime;
                    }
                    else if (HelperMethodsService.IsPropertyEmpty(aFlight.ArrivalFlightInformation.FlightDateTime) && !HelperMethodsService.IsPropertyEmpty(aFlight.ArrivalFlightInformation.EstimatedFlightDateTime)) {
                        aDateTime = aFlight.ArrivalFlightInformation.EstimatedFlightDateTime;
                    }

                    if (!HelperMethodsService.IsPropertyEmpty(bFlight.ArrivalFlightInformation.FlightDateTime)) {
                        bDateTime = bFlight.ArrivalFlightInformation.FlightDateTime;
                    }
                    else if (HelperMethodsService.IsPropertyEmpty(bFlight.ArrivalFlightInformation.FlightDateTime) && !HelperMethodsService.IsPropertyEmpty(bFlight.ArrivalFlightInformation.EstimatedFlightDateTime)) {
                        bDateTime = bFlight.ArrivalFlightInformation.EstimatedFlightDateTime;
                    }

                    return aDateTime > bDateTime ? 1 : -1;

                });
            }

            if (section === self.sections.sameDay) {
                array.sort(function (aFlight, bFlight) {


                    var aDateTime = sortMethodForSameDayFlights(aFlight);
                    var bDateTime = sortMethodForSameDayFlights(bFlight);

                    return aDateTime > bDateTime ? 1 : -1;
                });
            }

            if (section === self.sections.departure) {
                array.sort(function (aFlight, bFlight) {
                    var aDateTime;
                    var bDateTime;

                    if (!HelperMethodsService.IsPropertyEmpty(aFlight.DepartureFlightInformation.FlightDateTime)) {
                        aDateTime = aFlight.DepartureFlightInformation.FlightDateTime;
                    }
                    else if (HelperMethodsService.IsPropertyEmpty(aFlight.DepartureFlightInformation.FlightDateTime) && !HelperMethodsService.IsPropertyEmpty(aFlight.DepartureFlightInformation.EstimatedFlightDateTime)) {
                        aDateTime = aFlight.DepartureFlightInformation.EstimatedFlightDateTime;
                    }

                    if (!HelperMethodsService.IsPropertyEmpty(bFlight.DepartureFlightInformation.FlightDateTime)) {
                        bDateTime = bFlight.DepartureFlightInformation.FlightDateTime;
                    }
                    else if (HelperMethodsService.IsPropertyEmpty(bFlight.DepartureFlightInformation.FlightDateTime) && !HelperMethodsService.IsPropertyEmpty(bFlight.DepartureFlightInformation.EstimatedFlightDateTime)) {
                        bDateTime = bFlight.DepartureFlightInformation.EstimatedFlightDateTime;
                    }

                    return aDateTime > bDateTime ? 1 : -1;
                });
            }
            return array;
        }


        function sortMethodForSameDayFlights(flight) {
            var dateTime;
            var enter = false;

            if (!HelperMethodsService.IsPropertyEmpty(flight.DepartureFlightInformation.FlightDateTime)) {
                enter = true;
                dateTime = flight.DepartureFlightInformation.FlightDateTime;
            }
            else if (!enter) {
                if ((!HelperMethodsService.IsPropertyEmpty(flight.DepartureFlightInformation.EstimatedFlightDateTime) && !HelperMethodsService.IsPropertyEmpty(flight.ArrivalFlightInformation.FlightDateTime))) {
                    enter = true;
                    dateTime = flight.DepartureFlightInformation.EstimatedFlightDateTime;
                }

                if (!enter && !HelperMethodsService.IsPropertyEmpty(flight.ArrivalFlightInformation.FlightDateTime)) {
                    enter = true;
                    dateTime = flight.ArrivalFlightInformation.FlightDateTime;
                }

                if (!enter && !HelperMethodsService.IsPropertyEmpty(flight.ArrivalFlightInformation.EstimatedFlightDateTime)) {
                    enter = true;
                    dateTime = flight.ArrivalFlightInformation.EstimatedFlightDateTime;
                }
            }

            return dateTime;

        }

        /**
         * This function does the following: 
         * Flattens the data for arrivals and departures.  
         * @param data encapsulates both arrivals and departures
        */
        function flattenReservation(data) {
            if (HelperMethodsService.IsObjectNull(data)) return;

            var arrivals = data.Arrivals,
                departures = data.Departures;

            startFlattenProcess(arrivals);
            startFlattenProcess(departures);
        }

        /*Private functions */

        /**
         * This function does the following: 
         * Iterates through the arrivals array and finds same day and or heavy transport flights. The arrivals array is the only 
         * array that will possibly have same day flights. The dates in the arrival flights and their corresponding departures 
         * are formatted accordingly. 
         * @param arrivals array with arrival flights filtered by the flightboard calendar date and corresponding departure flights. 
         * @param sameDayFlights empty array to hold flights (arrivals and departures) on the same day. 
         * @param heavyCharters empty array to hold flights that are considered heavy. 
         */
        function getFlights(arrivals, sameDayFlights, heavyCharters) {

            for (var i = 0; i < arrivals.length; i++) {
                if (!HelperMethodsService.IsObjectNull(arrivals[i].ArrivalFlightInformation) && !HelperMethodsService.IsObjectNull(arrivals[i].DepartureFlightInformation)) {
                    if (DateTimeService.FormatDate(arrivals[i].ArrivalFlightInformation.EstimatedFlightDateTime) == DateTimeService
                        .FormatDate(arrivals[i].DepartureFlightInformation.EstimatedFlightDateTime)) {
                        isQuickTurn(arrivals[i]);
                        //  formatReservationTimes(arrivals[i]);
                        if (isHeavyCharter(arrivals[i])) {
                            arrivals[i].IsSameDay = true;
                            heavyCharters.push(arrivals[i]);
                        }
                        else {
                            sameDayFlights.push(arrivals[i]);
                        }

                        continue;
                    }
                }
                //   formatReservationTimes(arrivals[i], self.flightDirection[0].id);
                if (isHeavyCharter(arrivals[i])) {
                    arrivals[i].IsArrival = true;
                    heavyCharters.push(arrivals[i]);
                }
            }
        }

        /**
         * This function does the following: 
         * Checks if the Departure time minus the arrival time is greater than -1 or less than or equal to 30 mins. 
         * If the expression is true, the flight is considered a Quick Turn. 
         * @param arrival a flight object from the arrivals. 
         */
        function isQuickTurn(arrival) {
            arrival.QuickTurn = false;
            if (!HelperMethodsService.IsPropertyEmpty(arrival.ArrivalFlightInformation.FlightDateTime)) { startDate = arrival.ArrivalFlightInformation.FlightDateTime; }
            else { startDate = arrival.ArrivalFlightInformation.EstimatedFlightDateTime; }
            var difference = DateTimeService.GetDifference(startDate, arrival.DepartureFlightInformation.EstimatedFlightDateTime, "minutes");
            if (difference > -1 && difference <= 30) { arrival.QuickTurn = true; }
            return arrival;
        }

        function isHeavyCharter(flight) {
            return ((!HelperMethodsService.IsPropertyEmpty(flight.AircraftType)) && (self.heavyCharterTypes.indexOf(flight.AircraftType.toLowerCase()) > -1));
        }

        function removeFlights(arrivals, departures, sameDayFlights, heavyCharters) {
            for (var i in sameDayFlights) {
                var index = arrivals.indexOf(sameDayFlights[i]);
                if (index > -1) { arrivals.splice(index, 1); }
            }

            for (var j in heavyCharters) {
                var arrivalsIndex = arrivals.indexOf(heavyCharters[j]);
                if (arrivalsIndex > -1) { arrivals.splice(arrivalsIndex, 1); }
                var departuresIndex = departures.indexOf(heavyCharters[j]);
                if (departuresIndex > -1) { departures.splice(departuresIndex, 1); }
            }
        }

        /**
         * This function does the following: 
         * Checks if the flight object is an arrival or departure and formats the date according to the flight
         * direction id. If the flight direction id is null or undefined then the logic defaults to formatting 
         * the date with just the time. 
         * @param obj a flight object 
         * @param flightDirectionId an id that dictates if the flight object is an arrival or departure flight object. 
         */
        function formatReservationTimes(obj, flightDirectionId) {
            if (!HelperMethodsService.IsObjectNull(obj.ArrivalFlightInformation)) {
                if (!HelperMethodsService.IsPropertyEmpty(obj.ArrivalFlightInformation.FlightDateTime)) {
                    if (flightDirectionId == 1) { obj.ArrivalFlightInformation.FlightDateTime = DateTimeService.FormatTime(obj.ArrivalFlightInformation.FlightDateTime); }
                    else if (flightDirectionId == 2) { obj.ArrivalFlightInformation.FlightDateTime = DateTimeService.FormatDate(obj.ArrivalFlightInformation.FlightDateTime); }
                    else { obj.ArrivalFlightInformation.FlightDateTime = DateTimeService.FormatTime(obj.ArrivalFlightInformation.FlightDateTime); }
                }
                if (!HelperMethodsService.IsPropertyEmpty(obj.ArrivalFlightInformation.EstimatedFlightDateTime)) {
                    if (flightDirectionId == 1) { obj.ArrivalFlightInformation.EstimatedFlightDateTime = DateTimeService.FormatTime(obj.ArrivalFlightInformation.EstimatedFlightDateTime); }
                    else if (flightDirectionId == 2) { obj.ArrivalFlightInformation.EstimatedFlightDateTime = DateTimeService.FormatDate(obj.ArrivalFlightInformation.EstimatedFlightDateTime); }
                    else { obj.ArrivalFlightInformation.EstimatedFlightDateTime = DateTimeService.FormatTime(obj.ArrivalFlightInformation.EstimatedFlightDateTime); }
                }
            }

            if (!HelperMethodsService.IsObjectNull(obj.DepartureFlightInformation)) {
                if (!HelperMethodsService.IsPropertyEmpty(obj.DepartureFlightInformation.FlightDateTime)) {
                    if (flightDirectionId == 1) { obj.DepartureFlightInformation.FlightDateTime = DateTimeService.FormatDate(obj.DepartureFlightInformation.FlightDateTime); }
                    else if (flightDirectionId == 2) { obj.DepartureFlightInformation.FlightDateTime = DateTimeService.FormatTime(obj.DepartureFlightInformation.FlightDateTime); }
                    else { obj.DepartureFlightInformation.FlightDateTime = DateTimeService.FormatTime(obj.DepartureFlightInformation.FlightDateTime); }
                }
                if (!HelperMethodsService.IsPropertyEmpty(obj.DepartureFlightInformation.EstimatedFlightDateTime)) {
                    if (flightDirectionId == 1) { obj.DepartureFlightInformation.EstimatedFlightDateTime = DateTimeService.FormatDate(obj.DepartureFlightInformation.EstimatedFlightDateTime); }
                    else if (flightDirectionId == 2) { obj.DepartureFlightInformation.EstimatedFlightDateTime = DateTimeService.FormatTime(obj.DepartureFlightInformation.EstimatedFlightDateTime); }
                    else { obj.DepartureFlightInformation.EstimatedFlightDateTime = DateTimeService.FormatTime(obj.DepartureFlightInformation.EstimatedFlightDateTime); }
                }
            }
        }

        function startFlattenProcess(data) {
            for (var i in data) {
                flattenGroundTransportation(data[i]);
                flattenAircraftServices(data[i]);
                flattenTransactionPayment(data[i]);

                if (data[i].CustomsRequiredInbound === false) { data[i].CustomsRequiredInbound = ""; }
                else if (data[i].CustomsRequiredInbound === true) { data[i].CustomsRequiredInbound = "Y"; }
            }
        }

        /**
         * This function does the following: 
         * Checks if there is a valid aircraft service and creates a object with the
         * service and attaches it to the obj param
         * @param obj a flight object
         */
        function flattenAircraftServices(obj) {
            for (var i in obj.AircraftServices) {

                for (var j in self.serviceCategory) {

                    if (!HelperMethodsService.IsPropertyEmpty(obj.AircraftServices[i].ServiceCategory) && (obj.AircraftServices[i].ServiceCategory.toLowerCase() == self.serviceCategory[j].name.toLowerCase())) {

                        if (!HelperMethodsService.IsObjectNull(obj.Fuel) && obj.AircraftServices[i].ServiceCategory.toLowerCase() === "fuel") {
                            obj.Fuel.Quantity += obj.AircraftServices[i].Quantity;
                            obj.Fuel.Comments += ", " + obj.AircraftServices[i].Comments;
                            break;
                        }

                        obj[self.serviceCategory[j].name] = {};
                        obj[self.serviceCategory[j].name].Active = obj.AircraftServices[i].Active;
                        obj[self.serviceCategory[j].name].AircraftServiceId = obj.AircraftServices[i].AircraftServiceId;
                        obj[self.serviceCategory[j].name].Comments = obj.AircraftServices[i].Comments;
                        obj[self.serviceCategory[j].name].LastUpdatedBy = obj.AircraftServices[i].LastUpdatedBy;
                        obj[self.serviceCategory[j].name].ProductCode = obj.AircraftServices[i].ProductCode;
                        obj[self.serviceCategory[j].name].Quantity = obj.AircraftServices[i].Quantity;
                        obj[self.serviceCategory[j].name].ServiceCategory = obj.AircraftServices[i].ServiceCategory;
                        obj[self.serviceCategory[j].name].ServiceCategoryId = obj.AircraftServices[i].ServiceCategoryId;
                        obj[self.serviceCategory[j].name].Status = obj.AircraftServices[i].Status;
                        obj[self.serviceCategory[j].name].Type = obj.AircraftServices[i].Type;

                        if (self.serviceCategory[j].name.toLowerCase() == "fuel") {
                            //checks for avgas
                            if (!HelperMethodsService.IsPropertyEmpty(obj.AircraftServices[i].ProductDescription) && (obj.AircraftServices[i].ProductDescription.toLowerCase().indexOf('avgas') > -1 || obj.AircraftServices[i].ProductDescription.toLowerCase().indexOf('100ll') > -1)) {
                                obj[self.serviceCategory[j].name].ProductDescription = "A";
                            }

                            //checks to see if there is prist or fsii
                            if (!HelperMethodsService.IsPropertyEmpty(obj.AircraftServices[i].ProductDescription) && (obj.AircraftServices[i].ProductDescription.toLowerCase().indexOf('prist') > -1 || obj.AircraftServices[i].ProductDescription.toLowerCase().indexOf('fsii') > -1)) {
                                obj[self.serviceCategory[j].name].ProductDescription = "JET A +";
                            }

                            //if description is still empty then give it a default value. 
                            if (HelperMethodsService.IsPropertyEmpty(obj[self.serviceCategory[j].name].ProductDescription)) {
                                obj[self.serviceCategory[j].name].ProductDescription = "JET A -";
                            }
                        }
                        else {
                            obj[self.serviceCategory[j].name].ProductDescription = obj.AircraftServices[i].ProductDescription;
                        }

                        break;
                    }
                }
            }
        }


        /**
         * This function does the following: 
         * iterates through all of the ground transportation objects of a flight, 
         * and when it finds a match in the transportation type array, its sets 
         * the value to the AllTransportations in the obj. 
         * @param obj a flight object
         */
        function flattenGroundTransportation(obj) {

            if (HelperMethodsService.IsObjectNull(obj.GroundTransportations)) return;

            var all = [];

            for (var i in obj.GroundTransportations) {
                for (var j in self.transportationType) {
                    if (!HelperMethodsService.IsPropertyEmpty(obj.GroundTransportations[i].CarType.Name) && (obj.GroundTransportations[i].CarType.Name.toLowerCase() === self.transportationType[j].type)) {

                        var nameAbbreviation = self.transportationType[j].abbreviation; // CarType
                        var type = obj.GroundTransportations[i].Type.Name; // Crew or Passenger

                        if (!HelperMethodsService.IsPropertyEmpty(type) && (type.toLowerCase() == "passenger")) { type = "P"; }
                        if (!HelperMethodsService.IsPropertyEmpty(type) && (type.toLowerCase() == "crew")) { type = "C"; }

                        var fullTransportationLabel = type + "" + nameAbbreviation;

                        all.push({ label: fullTransportationLabel, count: 1 });

                        break;
                    }
                }
            }

            var array = angular.copy(all);
            for (var b in array) {
                var current = array[b];
                for (var c in array) {
                    if (current.label == array[c].label && b !== c && current.flagged !== true) {
                        //found a match, flag the match 
                        array[c].flagged = true;
                        current.count += 1;
                    }
                }
            }

            obj.AllTransportations = { Text: "", Status: true };
            for (var s in array) {
                if (array[s].flagged !== true) {
                    if (obj.AllTransportations.Text.length > 0) { obj.AllTransportations.Text += ", "; }
                    obj.AllTransportations.Text += array[s].label + "(" + array[s].count + ")";
                }
            }
        }

        function flattenTransactionPayment(obj) {
            obj.InvoiceIcon = "";
            obj.InvoiceText = "";
            var transactionPaymentStatus = [];

            if (HelperMethodsService.IsPropertyEmpty(obj.PosTransactionId)) return;

            var array = obj.Payments,
                transactionHeaderStatus = obj.PosTransactionStatus,
                directBillNumber = obj.DirectBillNumber;

            for (var i in array) {
                transactionPaymentStatus.push(array[i].Status);
            }

            if (transactionPaymentStatus.indexOf(2) > -1) {
                obj.InvoiceIcon = "fa fa-usd";
            }
            else if (((transactionPaymentStatus.indexOf(32) > -1 && transactionHeaderStatus == 1) && transactionPaymentStatus.indexOf(2) === -1) || obj.CardOnFile === true) {
                obj.InvoiceText = "CS";
            }
            else if (!HelperMethodsService.IsPropertyEmpty(directBillNumber)) {
                obj.InvoiceIcon = "fa fa-check";
            }
            else {
                obj.InvoiceIcon = "fa fa-asterisk";
            }
        }
    }
})();
(function () {
    angular
		.module('app')
		.controller("IndexController", IndexController);

    IndexController.$inject = ['$scope'];


    function IndexController($scope) {
        var vm = this;
        vm.title = "Index Controller";
        $scope.title = "Index Controller";

        vm.httpRequestPromise = undefined;

        $scope.$on('loadSplashScreen', function (event, args) {
            vm.httpRequestPromise = args.httpPromise;
        });

        function activate() { }

        activate();

    }

})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$state', 'AuthenticationService'];

    function LoginController($scope, $state, AuthenticationService, ApplicationInsightsService) {
        var vm = this;

        vm.title = 'Login Controller';
        vm.loginPromise = undefined;
        vm.displayError = undefined;
        vm.errorMessage = undefined;

        vm.userCredentails = {};

        vm.loginUser = loginUser;

        function loginUser() {
            if (vm.loginForm.$invalid) {
                return;
            }
            vm.displayError = false;
            var userObject = {
                grant_type: "password",
                username: vm.userCredentails.username,
                password: vm.userCredentails.password,
            };

            vm.loginPromise = AuthenticationService.LoginUser(userObject);

            $scope.$emit('loadSplashScreen', { httpPromise: vm.loginPromise });

            vm.loginPromise.then(function (data) {
                $state.go('root.appLayout.dashboard');
            }).catch(function (err) {
                ApplicationInsightsService.TrackException(err.error, "Login", { userName: userObject.username, errorDescription: err.error_description });                 
                vm.displayError = true;
                if ((err !== null) && err.error === "ad_error") {
                    vm.errorMessage = "You have entered the wrong username or password";
                }
                else if (err === null || err === undefined) {
                    vm.errorMessage = "Login Connectivity has been lost";
                }
                console.log(err);
            });
        }

        activate();

        function activate() { }
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('LoginService', LoginService);

    LoginService.$inject = ['HttpRequestService', 'AuthenticationSettings'];

    function LoginService(HttpRequestService, AuthenticationSettings) {
        return {
            PostLogin: postLogin
        };

        function postLogin(userObject) {
            return HttpRequestService.Go({
                method: 'POST',
                url: AuthenticationSettings.AuthenticationAPI + 'token',
                data: "grant_type=password&username=" + userObject.username + "&password=" + userObject.password + "&aduser=" + true,
                headers: { 'Content-type': 'application/x-www-form-urlencoded' }
            });
        }
    }
})();
(function () {

    angular
        .module('app')
        .controller('SimpleLoginController', SimpleLoginController);

    SimpleLoginController.$inject = ['$timeout', '$state'];

    function SimpleLoginController($timeout, $state) {
        var vm = this;
        vm.passcode = []; 
        vm.numbers = [
            { id: "1", text: "one" },
            { id: "2", text: "two" },
            { id: "3", text: "three" },
            { id: "4", text: "four" },
            { id: "5", text: "five" },
            { id: "6", text: "six" },
            { id: "7", text: "seven" },
            { id: "8", text: "eight" },
            { id: "9", text: "nine" },
            { id: "0", text: "zero" },
        ];
        vm.smallCircles = [false, false,false, false, false, false];


        vm.ClickedCircle = clickedCircle;
        vm.DeletePasscode = deletePasscode;

        function clickedCircle(id) {
            vm[id] = true;
            $timeout(function () {
                vm[id] = false; 
            }, 200);
          
            saveNumber(id);           
            colorSmallCircle();
            checkPasscodeLength(); 
        }

        function saveNumber(id) {          
            for(var i in vm.numbers) {
                if (vm.numbers[i].text === id) {
                    vm.passcode.push(vm.numbers[i].id);                  
                    break; 
                }
            }
        }

        function colorSmallCircle() {
            var length = vm.passcode.length - 1;
            vm.smallCircles[length] = true;

        }

        function loginUser(callback) {
            callback("Error", null);
        }

        function checkPasscodeLength() {
            if (vm.passcode.length == 6) {
                loginUser(function (err, res) {
                    if (err) {
                        console.log(err);
                        vm.passcode = [];
                        $timeout(function () {
                            for (var i in vm.smallCircles) {
                                vm.smallCircles[i] = false;
                            }
                        }, 300);
                    }
                    
                    if (res) {
                        $state.go("root.login");
                    }
                });           
            }   
        }

        function deletePasscode() {
            var index = vm.passcode.length - 1;
            vm.smallCircles[index] = false;
            vm.passcode.splice(index, 1); 
        }


    }



})(); 
(function () {
    'use strict';

    angular
        .module('app')
        .controller('RootController', RootController);

    RootController.$inject = [];

    function RootController() { }
})();

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