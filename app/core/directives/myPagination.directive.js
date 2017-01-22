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