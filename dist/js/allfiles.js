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
        self.dataInStorage = ['authenticationData', 'Configuration'];

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
                    accessToken: data.token,
                    user: data.user,
                    accessTokenExpires: data.expires
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
            request: _request
        };

        function _request(config) {
            config.headers = config.headers || {};

            var authenticationData = localStorageService.get('authenticationData');
        
            if (authenticationData) {
                config.headers["x-access-token"] = authenticationData.accessToken;
            }

            return config;
        }
    }
})();
(function () {
    angular
        .module('app')
        .constant("AuthenticationSettings", {
            AuthenticationAPI: 'https://resourceserver.herokuapp.com/login',
            ResourcesAPI: 'https://resourceserver.herokuapp.com/'
        });
})();
(function () {
    angular
        .module('app')
        .factory('CurrentUserService', CurrentUserService);

    CurrentUserService.$inject = ['localStorageService', 'AuthenticationService'];

    function CurrentUserService(localStorageService, AuthenticationService) {
        var self = this;
        self.ConfigKey = 'Configuration';

        return {
            GetConfiguration: getConfiguration,
            SetConfiguration: setConfiguration,
            GetCurrentUserData: getCurrentUserData

        };

        function setConfiguration(obj) {
            localStorageService.set(self.ConfigKey, obj);
        }

        function getConfiguration() {
            return localStorageService.get(self.ConfigKey);
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

/*
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

*/
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

    runBlock.$inject = ['$rootScope', '$state', '$timeout', 'AuthenticationService'];

    function runBlock($rootScope, $state, $timeout, AuthenticationService) {
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

          /*  if (userAuthentication && toState.name == 'root.appLayout.board') {
                event.preventDefault();
                $timeout(function () {
                    if (fromState.name !== 'root.appLayout.flightBoard') {
                        $state.go('root.appLayout.dashboard');
                    }
                });
            } */
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
            controllerAs: 'vm'
        })
        .state('root.appLayout.admin', {
            url: '/admin',
            templateUrl: 'app/main/admin/admin.html',
            controller: 'AdminController',
            controllerAs: 'vm'
        })
        .state('root.appLayout.checkIn', {
          url: '/checkIn',
          templateUrl: 'app/main/checkIn/checkIn.html',
          controller: 'CheckInController',
          controllerAs: 'vm'
        })

            .state('root.appLayout.report',{
                url: '/report',
                templateUrl: 'app/main/report/report.html',
                controller: 'ReportController',
                controllerAs: 'vm'
            });
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('AppLayoutController', AppLayoutController);

    AppLayoutController.$inject = ['$scope', '$state', '$location', 'AuthenticationService', 'CurrentUserService'];

    function AppLayoutController($scope, $state, $location, AuthenticationService, CurrentUserService) {
        /* jshint validthis:true */
        var vm = this;
        vm.isSideNavClosed = false;
        vm.state = $state;

        vm.authenticationData = AuthenticationService.GetLocalDataStorage('authenticationData');
        vm.title = 'AppLayout Controller';
        vm.userName = undefined;

        vm.Logout = logOut;
        vm.Open = open;
        vm.NavigateTo = navigateTo;
        activate();

        function activate() {
            vm.userName = vm.authenticationData.user.username;
            console.log(vm.userName);
            console.log("hello");
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

    DashboardController.$inject = ['$scope', '$state', 'LookupService', 'CurrentUserService', 'DateTimeService'];

    function DashboardController($scope, $state, LookupService, CurrentUserService, DateTimeService) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Dashboard Controller';
        activate();

        function activate() {

        }

        function navigateTo(route) {
            if (route) {
                $state.go(route);
            }
        }

        function baseSelected(item, model, label) {

        }

        function setUp() {
            $scope.$on('loadSplashScreen', function (event, args) {
                vm.httpRequestPromise = args.httpPromise;
            });
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

    function LoginController($scope, $state, AuthenticationService) {
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
                password: vm.userCredentails.password
            };

            vm.loginPromise = AuthenticationService.LoginUser(userObject);

            $scope.$emit('loadSplashScreen', { httpPromise: vm.loginPromise });

            vm.loginPromise.then(function (data) {
                $state.go('root.appLayout.dashboard');
            }).catch(function (err) {
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
            var user = {userObject: {email: userObject.username , password: userObject.password}};


            return HttpRequestService.Go({
                method: 'POST',
                url: AuthenticationSettings.AuthenticationAPI,
                data: user,
                headers: { 'Content-type': 'application/json' } //
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
/**
 * Created by Frankfernandez on 1/31/17.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('CheckInController', CheckInController);

    CheckInController.$inject = ['$scope', '$state', 'CheckInService', 'CurrentUserService', 'DateTimeService'];

    function CheckInController($scope, $state, CheckInService, CurrentUserService, DateTimeService) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'CheckIn Controller';
        vm.showQuestion1 = true;
        vm.showQuestion2 = false;
        vm.showQuestion3 = false;
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
            if (vm.question2Response && vm.question2Response.length > 0) {
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
            if (vm.question2Response && vm.question2Response.length > 0) {
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
        }
    }
})();

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

(function () {
    'use strict';

    angular
        .module('app')
        .controller('RootController', RootController);

    RootController.$inject = [];

    function RootController() { }
})();

/**
 * Created by RobertoRolon on 2/5/17.
 */

(function() {

    angular
        .module('app')
        .controller('ReportController', ReportController);

    ReportController.$inject = ['ReportService'];

    function ReportController(ReportService) {
        var vm = this;

        vm.SubmitFilterForm = SubmitFilterForm;

        function SubmitFilterForm() {
            if(vm.FilterForm.$invalid) return;

            var startTime = moment(vm.FilterObject.startTime);
            var hour = startTime.get('hour');
            var minute = startTime.get('minute');

            var startDate = moment(vm.FilterObject.startDate);
            startDate.set('hour', hour);
            startDate.set('minute', minute);

            var startDateTime = startDate.format("YYYY-MM-DD H:mm");
            var endTime = startDate.format("YYYY-MM-DD");

            fetchMe(startDateTime, endTime);

        }

        function setInitialObjects() {
            //set filter inputs here
            vm.FilterObject = {startDate: null, startTime: null};

            vm.Total = {Count: 0, Users:[]};
            vm.Pool = {Count: 0, Users: [], Percent: 0};
            vm.Gym = {Count: 0, Users: [], Percent: 0};
            vm.GymPool = {Count: 0, Percent: 0};
        }

        function setDatePickerAndTime() {
            vm.FilterObject.startDate = moment().format("MM/DD/YYYY");
            var startTime = moment();
            startTime.set('hour', 6);
            startTime.set('minute', 0);
            vm.FilterObject.startTime = startTime;
        }

        function getInitialTimes() {
            var startDate = moment().set('hour', 6).set('minute', 0);

            return [startDate.format("YYYY-MM-DD H:mm"), startDate.format("YYYY-MM-DD")];
        }

        function fetchFacilityUsage(object, callback) {
            ReportService.getFacilityUsage(object).then(function(data) {
                callback(null,data);
            }).catch(function(err) {
                callback(err);
            });
        }

        function fetchMe(startDateTime, endDate) {
            var timeZoneOffset = moment().format("Z");

            var totalUsage =  ReportService.getFacilityUsage({startDateTime: startDateTime, endDate: endDate, setEven: 1, setEven2 : 0, response: "", questionid_fk:1, timeZoneOffset : timeZoneOffset});
            var poolUsage =   ReportService.getFacilityUsage({startDateTime: startDateTime, endDate: endDate, setEven: 0, setEven2: 0,  response: "Pool", questionid_fk:3, timeZoneOffset : timeZoneOffset});
            var gymUsage =   ReportService.getFacilityUsage({startDateTime: startDateTime, endDate: endDate, setEven: 0, setEven2: 0, response: "Gym", questionid_fk:3, timeZoneOffset : timeZoneOffset});
            var users =   ReportService.getFacilityUsage({startDateTime: startDateTime, endDate: endDate, setEven: 1, setEven2: 1, response: "", questionid_fk:0, timeZoneOffset : timeZoneOffset});

            ReportService.r([totalUsage, poolUsage, gymUsage, users], function(err, res){
                if(err) {

                }else {
                    vm.Total.Count = res[0].data.rows.length;
                    vm.Total.Users = res[0].data.rows;

                    vm.Pool.Count = res[1].data.rows.length;
                    vm.Pool.Users = res[1].data.rows;
                    var percent = (vm.Pool.Count / vm.Total.Count) * 100;
                    vm.Pool.Percent = Math.round(percent * 10) / 10;

                    vm.Gym.Count = res[2].data.rows.length;
                    vm.Gym.Users = res[2].data.rows;
                    var percent2 = (vm.Gym.Count / vm.Total.Count) * 100;
                    vm.Gym.Percent = Math.round(percent2 * 10) / 10;

                    vm.GymPool.Count = vm.Pool.Count + vm.Gym.Count;
                    var percent3 = (vm.GymPool.Count / vm.Total.Count) * 100;
                    vm.GymPool.Percent = Math.round(percent3 * 10) / 10;

                    vm.Total.Users = ReportService.parseUsers(res[3].data.rows);
                }
            });
        }


        function activate() {
            setInitialObjects();
            setDatePickerAndTime();

            var start = getInitialTimes();
            //fetchMe("2017-01-30 23:07", "2017-01-30");
            fetchMe(start[0], start[1]);
        }


        activate();
    }

})();
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
                var displayObject = {name: visit[0].response, houseNumber: visit[1].response, facility: visit[2].response};
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