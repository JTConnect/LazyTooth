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