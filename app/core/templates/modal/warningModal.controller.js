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
