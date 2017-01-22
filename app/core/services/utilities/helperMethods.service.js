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