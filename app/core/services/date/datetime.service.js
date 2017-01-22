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