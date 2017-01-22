
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