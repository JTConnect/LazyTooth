describe('FlightBoardController - ', function () {
    var scope, $state, createController, DateTimeService, FlightBoardService, $httpBackend, $rootScope;
    
    beforeEach(module('app')); //<--- Hook module

    beforeEach(module(function ($provide) {
        $provide.factory('FlightBoardService', function ($q) {
            var getReservationsByBase = jasmine.createSpy('getReservationsByBase').and.callFake(function (requestObject) {
                if (requestObject.DurationHours == 24 && requestObject.StartDateTime == moment().format('M/DD/YYYY')) {
                    return $q.when(reservations);
                }
                else {
                    return $q.reject("error occured");
                }
            });


            var getUserSettings = jasmine.createSpy('getUserSettings').and.callFake(function () {
                return { BaseId: 'I77', Roles: [] };
            });

            return {
                GetReservationsByBase: getReservationsByBase,
                GetUserSettings: getUserSettings,
                StructureReservationData: function () { return { sameDayOperations: [], data: { Arrivals: [], Departures: [] } }; },
                FlattenReservation: function () { return { Arrivals: [], Departures: [] }; }
            }
        });

    }));

    beforeEach(inject(function (_$rootScope_, $controller, _DateTimeService_, _FlightBoardService_, $interval, _$httpBackend_) {
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        scope = _$rootScope_.$new();
        createController = function () {
            return $controller('FlightBoardController', {
                '$scope': scope
            });
        };
    }));


    describe('Test the retrieval of reservations and date operations - ', function () {

        it('should resolve promise with data ', function () {
            var controller = createController();
            controller.GetReservationsByBase("I77");
            expect(controller.title).toEqual("FlightBoard Controller");
            expect(controller.requestObject.BaseId).toBeDefined();

            controller.reservationsPromise.then(function (data) {
                expect(data.Arrivals[0].ArrivalFlightInformation.FlightDateTime).toBeDefined();
            }).catch(function (err) {
                expect(err).toBeUndefined();
            });

            $rootScope.$digest();
        });

        it('should append/subtract 24 hours to the vm.flightBoardDate property ', function () {
            var controller = createController();
            controller.FetchReservations('a');
            expect(controller.flightBoardDate).toEqual(moment().add(24, "h").format("M/DD/YYYY"));
            expect(controller.calendarDate).toEqual(new Date(controller.flightBoardDate));

            //reset the vm.flightBoardDate
            controller.flightBoardDate = moment().format("M/DD/YYYY");

            controller.FetchReservations('s');
            expect(controller.flightBoardDate).toEqual(moment().subtract(24, "h").format("M/DD/YYYY"));
            expect(controller.calendarDate).toEqual(new Date(controller.flightBoardDate));
            expect(controller.requestObject.StartDateTime).toEqual(controller.flightBoardDate);
        });

        it('should update the vm.flightBoardDate property when the DateChanged function is called', function () {
            var controller = createController();
            controller.calendarDate = new Date(2016, 3, 3);
            controller.DateChanged();
            expect(controller.flightBoardDate).toEqual(moment(controller.calendarDate).format("M/DD/YYYY"));
        });
    });

    //Test Data 
    var reservations =
        {
            Arrivals: [
                { CompanyName: "NetJet", ArrivalFlightInformation: { FlightDateTime: "2016-03-16T04:29:56" }, DepartureFlightInformation: { FlightDateTime: "2016-03-16T04:29:56" } },
                { CompanyName: "Jet", ArrivalFlightInformation: { FlightDateTime: "2016-03-18T04:29:56" }, DepartureFlightInformation: { FlightDateTime: "2016-03-19T04:29:56" } }
            ],
            Departures: [
                { CompanyName: "Name", ArrivalFlightInformation: { FlightDateTime: "2016-03-16T04:29:56" }, DepartureFlightInformation: { FlightDateTime: "2016-03-16T04:29:56" } },
                { CompanyName: "Hello", ArrivalFlightInformation: { FlightDateTime: "2016-03-14T04:29:56" }, DepartureFlightInformation: { FlightDateTime: "2016-03-19T04:29:56" } }
            ]
        };


});