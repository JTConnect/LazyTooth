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