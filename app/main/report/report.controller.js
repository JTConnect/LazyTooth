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

            var totalUsage =  ReportService.getFacilityUsage({startDateTime: startDateTime, endDate: endDate, setEven: 1, response: "", questionid_fk:1, timeZoneOffset : timeZoneOffset});
            var poolUsage =   ReportService.getFacilityUsage({startDateTime: startDateTime, endDate: endDate, setEven: 0, response: "Pool", questionid_fk:3, timeZoneOffset : timeZoneOffset});
            var gymUsage =   ReportService.getFacilityUsage({startDateTime: startDateTime, endDate: endDate, setEven: 0, response: "Gym", questionid_fk:3, timeZoneOffset : timeZoneOffset});

            ReportService.r([totalUsage, poolUsage, gymUsage], function(err, res){
                if(err) {

                }else {
                    console.log(res);
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