describe('FlightBoardService', function () {
    var FlightBoardService, DateTimeService, HelperMethodsService;

    beforeEach(module('app'));

    beforeEach(inject(function ($injector, _FlightBoardService_) {
        FlightBoardService = _FlightBoardService_;
    }));

    it('FlightBoardService should be defined', function () {
        expect(FlightBoardService).toBeDefined();
    });

    describe('should subtract the arrival time from the departure time and check if it is a Quick turn', function () {
        it('should be a quick turn', function () {
            var obj = FlightBoardService.IsQuickTurn(arrivalQTObject);
            expect(obj.QuickTurn).toBeDefined();
            expect(obj.QuickTurn).toEqual(true);
        });

        it('should not be a quick turn ', function () {
            var obj = FlightBoardService.IsQuickTurn(arrivalQT2Object);
            expect(obj.QuickTurn).toEqual(false);
        });
    });

    describe('The following test is for arrivals -  should format the actual and estimated arrival flight datetime and display the time (HH:mm). should format the corresponding departure flight time and display the date (M/DD/YYYY)', function () {
        it('should render the expected results', function () {
            var structureData = FlightBoardService.StructureReservationData(arrivalReservations);

            expect(structureData.data.Arrivals[1].ArrivalFlightInformation.FlightDateTime).toEqual('20:19');
            expect(structureData.data.Arrivals[1].ArrivalFlightInformation.EstimatedFlightDateTime).toEqual('20:19');
            expect(structureData.data.Arrivals[1].DepartureFlightInformation.FlightDateTime).toEqual('3/16/2016');
            expect(structureData.data.Arrivals[1].DepartureFlightInformation.EstimatedFlightDateTime).toEqual('3/16/2016');

            expect(structureData.data.Arrivals[0].ArrivalFlightInformation.FlightDateTime).toEqual('07:29');
            expect(structureData.data.Arrivals[0].ArrivalFlightInformation.EstimatedFlightDateTime).toEqual('07:29');
            expect(structureData.data.Arrivals[0].DepartureFlightInformation.FlightDateTime).toEqual('3/19/2016');
            expect(structureData.data.Arrivals[0].DepartureFlightInformation.EstimatedFlightDateTime).toEqual('3/19/2016');
        });
    });


    describe('The following test is for departures -  should format the departure flight datetime and display the time (HH:mm). should format the corresponding arrival flight datetime and display the date (M/DD/YYYY)', function () {
        it('should render the expected results', function () {
            var structureData = FlightBoardService.StructureReservationData(departureReservations);
            expect(structureData.data.Departures[0].ArrivalFlightInformation.FlightDateTime).toEqual('3/14/2016');
            expect(structureData.data.Departures[0].DepartureFlightInformation.FlightDateTime).toEqual('04:29');
            expect(structureData.data.Departures[1].ArrivalFlightInformation.FlightDateTime).toEqual('3/14/2016');
            expect(structureData.data.Departures[1].DepartureFlightInformation.FlightDateTime).toEqual('05:29');
        });
    });

    describe('The following test is for sameDayFlights -  should format both the arrival and departure flight datetime to display time (HH:mm)  ', function () {
        it('should render the expected results', function () {
            var structureData = FlightBoardService.StructureReservationData(sameDayReservations);

            expect(structureData.sameDayFlights[0].ArrivalFlightInformation.FlightDateTime).toEqual('20:19');
            expect(structureData.sameDayFlights[0].DepartureFlightInformation.FlightDateTime).toEqual('23:29');
            expect(structureData.sameDayFlights[1].ArrivalFlightInformation.FlightDateTime).toEqual('11:19');
            expect(structureData.sameDayFlights[1].DepartureFlightInformation.FlightDateTime).toEqual('21:19');

        });
    });

    describe('The following test is for no reservations - should return an empty array with no errors', function () {
        it('should render the expected results', function () {
            var structureData = FlightBoardService.StructureReservationData([]);
            expect(structureData).toBeUndefined();
        });
    });

    describe('should flatten the GroundTransportation, AircraftServices, and Invoice in a reservation/transaction object.', function () {

        it('should iterate through the GroundTransportation array and set the AllTransportations property in the flight objects.', function () {
            FlightBoardService.FlattenReservation(flightWithGroundTransportation);
            expect(flightWithGroundTransportation.Arrivals[0].AllTransportations).toEqual({ Text: "CR(2), PT(1)", Status: true });
            expect(flightWithGroundTransportation.Arrivals[1].AllTransportations).toEqual({ Text: "PL(1), CT(2)", Status: true });
            expect(flightWithGroundTransportation.Arrivals[2].AllTransportations).toEqual({ Text: "CR(1)", Status: true });
            expect(flightWithGroundTransportation.Arrivals[3].AllTransportations).toEqual({Text: "CC(1), CP(1), PP(1), PC(2)", Status: true});
        });

        it('should iterate through the AircraftServices array and set the corresponding service categories to the flight object', function () {
            FlightBoardService.FlattenReservation(flightsWithAircraftServices);

            expect(flightsWithAircraftServices.Arrivals[0].Fuel).toBeDefined();
            expect(flightsWithAircraftServices.Arrivals[0].Fuel).toBeDefined();
            expect(flightsWithAircraftServices.Arrivals[0].Lav).toBeDefined();

            expect(flightsWithAircraftServices.Arrivals[0].Gpu).toBeUndefined();
            expect(flightsWithAircraftServices.Arrivals[0].Deice).toBeUndefined();

            expect(flightsWithAircraftServices.Arrivals[0].Water.Quantity).toEqual(312);
            expect(flightsWithAircraftServices.Arrivals[0].Lav.Quantity).toEqual(1);
            expect(flightsWithAircraftServices.Arrivals[0].Fuel.Quantity).toEqual(624);

            expect(flightsWithAircraftServices.Arrivals[0].Fuel.ProductDescription).toEqual("JET A +");

            expect(flightsWithAircraftServices.Departures[0].Fuel.ProductDescription).toEqual("A");
            expect(flightsWithAircraftServices.Departures[1].Fuel.ProductDescription).toEqual("A");
            expect(flightsWithAircraftServices.Departures[2].Fuel.ProductDescription).toEqual("JET A -");
        });

        it('should check the PosTransactionId and iterate through the Payments array', function () {
            FlightBoardService.FlattenReservation(flightsWithAircraftServices);
            expect(flightsWithAircraftServices.Arrivals[0].InvoiceIcon).toEqual("fa fa-usd");
            expect(flightsWithAircraftServices.Arrivals[0].InvoiceText).toEqual("");

            expect(flightsWithAircraftServices.Departures[0].InvoiceText).toEqual("CS");
            expect(flightsWithAircraftServices.Departures[0].InvoiceIcon).toEqual("");

            expect(flightsWithAircraftServices.Departures[1].InvoiceIcon).toEqual("fa fa-asterisk");
            expect(flightsWithAircraftServices.Departures[1].InvoiceText).toEqual("");

            expect(flightsWithAircraftServices.Departures[2].InvoiceIcon).toEqual("");
            expect(flightsWithAircraftServices.Departures[2].InvoiceText).toEqual("CS");
        });
    });

    describe('it should sort an array of flights', function () {
        it('should sort the arrival flights', function () {
            var array = FlightBoardService.SortFlights(flights.Arrivals, "arrival");
            expect(array[0].ArrivalFlightInformation.EstimatedFlightDateTime).toEqual("2016-03-15T01:29:56");
        }); 

        it('should sort the sameDay flights', function () {
            var array = FlightBoardService.SortFlights(firstSameDaySort.Arrivals, "sameDay");
            expect(array[0].DepartureFlightInformation.FlightDateTime).toEqual("2016-03-19T20:19:44");

            var secondArray = FlightBoardService.SortFlights(secondSameDaySort.Arrivals, "sameDay");
            expect(secondArray[0].DepartureFlightInformation.FlightDateTime).toEqual("2016-03-19T06:19:44");

            var thirdArray = FlightBoardService.SortFlights(thirdSameDaySort.Arrivals, "sameDay");
            expect(thirdArray[0].ArrivalFlightInformation.EstimatedFlightDateTime).toEqual("2016-03-19T04:19:44"); 
        });

        it('should sort the departure flights', function () {
            var array = FlightBoardService.SortFlights(departureFlights.Departures, "departure");
            expect(array[0].DepartureFlightInformation.FlightDateTime).toEqual("2016-03-16T02:29:56");
            expect(array[1].DepartureFlightInformation.FlightDateTime).toEqual("2016-03-16T03:29:56"); 
        }); 
    }); 


    describe('should find/remove same day reservations', function () {

        it('should remove the corresponding sameDay reservation from the arrival reservations', function () {

            var arrivals = [{ CompanyName: "WellsFargo", AircraftType: "SJ", ArrivalFlightInformation: { FlightDateTime: "03/12/2016" }, DepartureFlightInformation: { FlightDateTime: "03/12/2016" } }, { CompanyName: "SunTrust", AircraftType: "SJ", ArrivalFlightInformation: { FlightDateTime: "03/13/2016" } }];
            var sameDay = [];
            sameDay.push(arrivals[0]); 

            FlightBoardService.RemoveFlights(arrivals, null, sameDay, null);

            expect(arrivals.length).toEqual(1);
            expect(arrivals[0].CompanyName).toEqual("SunTrust");
            expect(sameDay.length).toEqual(1);
            expect(sameDay[0].CompanyName).toEqual("WellsFargo");
        });

        it('should get the corresponding same day reservations from the arrival reservations', function () {
            var arrivals = [{ CompanyName: "SignatureFlight", AircraftType: "SJ", ArrivalFlightInformation: { EstimatedFlightDateTime: "2016-03-15T06:29:56" }, DepartureFlightInformation: { EstimatedFlightDateTime: "2016-03-15T06:29:56" } }, { CompanyName: "SignatureFlight", AircraftType: "SJ", ArrivalFlightInformation: { EstimatedFlightDateTime: "2016-03-25T06:29:56" }, DepartureFlightInformation: { EstimatedFlightDateTime: "2016-03-25T06:29:56" } }, {CompanyName: "SigFlight", AircraftType: "TX"}];
            var sameDay = [];

            FlightBoardService.GetFlights(arrivals, sameDay, []);
            expect(sameDay.length).toEqual(2); 
        }); 


    });

    describe('should find/remove heavy transport reservations', function () {
        it('should detect a heavy transport reservation', function () {
            var result = FlightBoardService.IsHeavyCharter(heavyTransportReservation);
            expect(result).toBeTruthy(); 
        }); 

        it('should not detect a heavy transport reservation', function () {
            var result = FlightBoardService.IsHeavyCharter(notHeavyReservation);
            expect(result).toBeFalsy(); 
        }); 

        it('should remove the corresponding heavy transports from arrivals', function () {
            var arrivals = [{ CompanyName: "SignatureFlight", AircraftType: "TX" }, { CompanyName: "BBA", AircraftType: "SJ" }, { CompanyName: "BBA Flight", AircraftType: "TX" }, { CompanyName: "SIGnet", AircraftType: "TX" }];
            var heavyTransport = [];
            heavyTransport.push(arrivals[0]);
            heavyTransport.push(arrivals[2]);
            heavyTransport.push(arrivals[3]);

            FlightBoardService.RemoveFlights(arrivals, [], [], heavyTransport);

            expect(arrivals.length).toEqual(1);
            expect(arrivals[0].AircraftType).toEqual("SJ");
            expect(heavyTransport.length).toEqual(3);
            expect(heavyTransport[0].AircraftType).toEqual("TX");
        });

        it('should remove the corresponding heavy transports from departures', function () {
            var departures = [{ CompanyName: "SignatureFlight", AircraftType: "SJ" }, { CompanyName: "BBA", AircraftType: "SJ" }, { CompanyName: "BBA Flight", AircraftType: "TX" }, { CompanyName: "SIGnet", AircraftType: "TX" }];
            var heavyTransports = [];
            heavyTransports.push(departures[2]); 
            heavyTransports.push(departures[3]);

            FlightBoardService.RemoveFlights([], departures, [], heavyTransports);

            expect(departures.length).toEqual(2);
            expect(departures[0].AircraftType).not.toEqual("TX");
            expect(heavyTransports[0].AircraftType).toEqual("TX");           
        });

        it('should get heavy transports from departures', function () {
            var heavyTransports = []; 
            var departures = [{ CompanyName: "SignatureFlight", AircraftType: "TX" }, { CompanyName: "BBA", AircraftType: "SJ" }, { CompanyName: "BBA Flight", AircraftType: "TX" }, { CompanyName: "SIGnet", AircraftType: "TX" }];

            FlightBoardService.CheckDeparturesForHeavyTransport(departures, heavyTransports); 

            expect(heavyTransports.length).toEqual(3); 
            expect(heavyTransports[0].IsDeparture).toBeTruthy();
            expect(heavyTransports[2].IsDeparture).toBeTruthy();
        }); 

        it('should get heavy transports from arrivals', function () {
            var heavyTransports = [];
            var arrivals = [{ CompanyName: "SignatureFlight", AircraftType: "TX", ArrivalFlightInformation: { EstimatedFlightDateTime: "2016-03-15T06:29:56" }, DepartureFlightInformation: { EstimatedFlightDateTime: "2016-03-15T06:29:56" } }, { CompanyName: "BBA", AircraftType: "SJ" }, { CompanyName: "BBA Flight", AircraftType: "TX" }];

            FlightBoardService.GetFlights(arrivals, [], heavyTransports);
            expect(heavyTransports.length).toEqual(2);
        });
    }); 


    /*Test Data*/
    var arrivalReservations =
    {
        Arrivals: [
            { CompanyName: "NetJet", ArrivalFlightInformation: { FlightInformationId: 1, Direction: 1, FlightDateTime: "2016-03-15T20:19:44", EstimatedFlightDateTime: "2016-03-15T20:19:44" }, DepartureFlightInformation: { FlightInformationId: 2, Direction: 2, FlightDateTime: "2016-03-16T20:19:44", EstimatedFlightDateTime: "2016-03-16T20:19:44" } },
            { CompanyName: "Jet", ArrivalFlightInformation: { FlightInformationId: 3, Direction: 1, FlightDateTime: "2016-03-15T07:29:56", EstimatedFlightDateTime: "2016-03-15T07:29:56" }, DepartureFlightInformation: { FlightInformationId: 4, Direction: 2, FlightDateTime: "2016-03-19T04:29:56", EstimatedFlightDateTime: "2016-03-19T04:29:56" } }
        ],
        Departures: []
    };

    var flights =
{
    Arrivals: [
        { CompanyName: "NetJet", ArrivalFlightInformation: { FlightInformationId: 1, Direction: 1, FlightDateTime: "2016-03-15T06:29:56", EstimatedFlightDateTime: "2016-03-15T20:19:44" }, DepartureFlightInformation: { FlightInformationId: 2, Direction: 2, FlightDateTime: "2016-03-16T20:19:44", EstimatedFlightDateTime: "2016-03-16T20:19:44" } },
        { CompanyName: "Jet", ArrivalFlightInformation: { FlightInformationId: 3, Direction: 1, FlightDateTime: "2016-03-15T02:29:56", EstimatedFlightDateTime: "2016-03-15T07:29:56" }, DepartureFlightInformation: { FlightInformationId: 4, Direction: 2, FlightDateTime: "2016-03-19T04:29:56", EstimatedFlightDateTime: "2016-03-19T04:29:56" } },
        { CompanyName: "Jet", ArrivalFlightInformation: { FlightInformationId: 3, Direction: 1, FlightDateTime: "", EstimatedFlightDateTime: "2016-03-15T01:29:56" }, DepartureFlightInformation: { FlightInformationId: 4, Direction: 2, FlightDateTime: "2016-03-19T04:29:56", EstimatedFlightDateTime: "2016-03-19T04:29:56" } }

    ],
    Departures: []
};

    var firstSameDaySort =
{
    Arrivals: [
           { Test: true, CompanyName: "NetJet", ArrivalFlightInformation: { FlightInformationId: 1, Direction: 1, FlightDateTime: "2016-03-19T24:19:44" }, DepartureFlightInformation: { FlightInformationId: 2, Direction: 2, FlightDateTime: "2016-03-19T23:29:44" } },
           { Test: true, CompanyName: "NetJet", ArrivalFlightInformation: { FlightInformationId: 1, Direction: 1, FlightDateTime: "2016-03-19T10:19:44" }, DepartureFlightInformation: { FlightInformationId: 2, Direction: 2, FlightDateTime: "2016-03-19T20:19:44" } },
           { Test: true, CompanyName: "NetJet", ArrivalFlightInformation: { FlightInformationId: 1, Direction: 1, FlightDateTime: "2016-03-19T22:19:44" }, DepartureFlightInformation: { FlightInformationId: 2, Direction: 2, FlightDateTime: "2016-03-19T23:29:44" } },
           { Test: true, CompanyName: "NetJet", ArrivalFlightInformation: { FlightInformationId: 1, Direction: 1, FlightDateTime: "2016-03-19T15:19:44" }, DepartureFlightInformation: { FlightInformationId: 2, Direction: 2, FlightDateTime: "2016-03-19T21:19:44" } },

    ],
    Departures: []
};

    var secondSameDaySort =
{
    Arrivals: [
           { Test: true, CompanyName: "NetJet", ArrivalFlightInformation: { FlightInformationId: 1, Direction: 1, FlightDateTime: "2016-03-19T24:19:44", EstimatedFlightDateTime: "2016-03-19T21:19:44" }, DepartureFlightInformation: { FlightInformationId: 2, Direction: 2, FlightDateTime: "" } },
           { Test: true, CompanyName: "NetJet", ArrivalFlightInformation: { FlightInformationId: 1, Direction: 1, FlightDateTime: "2016-03-19T10:19:44", EstimatedFlightDateTime: "2016-03-19T22:19:44" }, DepartureFlightInformation: { FlightInformationId: 2, Direction: 2, FlightDateTime: "" } },
           { Test: true, CompanyName: "NetJet", ArrivalFlightInformation: { FlightInformationId: 1, Direction: 1, FlightDateTime: "2016-03-19T22:19:44", EstimatedFlightDateTime: "2016-03-19T23:19:44" }, DepartureFlightInformation: { FlightInformationId: 2, Direction: 2, FlightDateTime: "" } },
           { Test: true, CompanyName: "NetJet", ArrivalFlightInformation: { FlightInformationId: 1, Direction: 1, FlightDateTime: "2016-03-19T15:19:44", EstimatedFlightDateTime: "2016-03-19T24:19:44" }, DepartureFlightInformation: { FlightInformationId: 2, Direction: 2, FlightDateTime: "2016-03-19T06:19:44" } },

    ],
    Departures: []
};

    var thirdSameDaySort =
{
    Arrivals: [
           { Test: true, CompanyName: "NetJet", ArrivalFlightInformation: { FlightInformationId: 1, Direction: 1, FlightDateTime: "2016-03-19T24:19:44", EstimatedFlightDateTime: "2016-03-19T21:19:44" }, DepartureFlightInformation: { FlightInformationId: 2, Direction: 2, FlightDateTime: "" } },
           { Test: true, CompanyName: "NetJet", ArrivalFlightInformation: { FlightInformationId: 1, Direction: 1, FlightDateTime: "", EstimatedFlightDateTime: "2016-03-19T04:19:44" }, DepartureFlightInformation: { FlightInformationId: 2, Direction: 2, FlightDateTime: "" } },
           { Test: true, CompanyName: "NetJet", ArrivalFlightInformation: { FlightInformationId: 1, Direction: 1, FlightDateTime: "", EstimatedFlightDateTime: "2016-03-19T05:19:44" }, DepartureFlightInformation: { FlightInformationId: 2, Direction: 2, FlightDateTime: "" } },
           { Test: true, CompanyName: "NetJet", ArrivalFlightInformation: { FlightInformationId: 1, Direction: 1, FlightDateTime: "2016-03-19T15:19:44", EstimatedFlightDateTime: "2016-03-19T24:19:44" }, DepartureFlightInformation: { FlightInformationId: 2, Direction: 2, FlightDateTime: "2016-03-19T06:19:44" } },

    ],
    Departures: []
};



    var departureFlights =
{
    Arrivals: [],
    Departures: [
            { CompanyName: "BBA", ArrivalFlightInformation: { FlightInformationId: 1, FlightDateTime: "2016-03-14T04:29:56" }, DepartureFlightInformation: { FlightInformationId: 2, FlightDateTime: "2016-03-16T04:29:56" } },
            { CompanyName: "Signature", ArrivalFlightInformation: { FlightDateTime: "2016-03-14T04:29:56" }, DepartureFlightInformation: { FlightDateTime: "2016-03-16T05:29:56" } },
            { CompanyName: "BBA", ArrivalFlightInformation: { FlightInformationId: 1, FlightDateTime: "2016-03-14T04:29:56" }, DepartureFlightInformation: { FlightInformationId: 2, FlightDateTime: "2016-03-16T02:29:56" } },
            { CompanyName: "Signature", ArrivalFlightInformation: { FlightDateTime: "2016-03-14T04:29:56" }, DepartureFlightInformation: { FlightDateTime: "2016-03-16T03:29:56" } }
    ]
};



    var departureReservations =
    {
        Arrivals: [],
        Departures: [
                { CompanyName: "BBA", ArrivalFlightInformation: { FlightInformationId: 1, FlightDateTime: "2016-03-14T04:29:56" }, DepartureFlightInformation: { FlightInformationId: 2, FlightDateTime: "2016-03-16T04:29:56" } },
                { CompanyName: "Signature", ArrivalFlightInformation: { FlightDateTime: "2016-03-14T04:29:56" }, DepartureFlightInformation: { FlightDateTime: "2016-03-16T05:29:56" } }
        ]
    };

    var sameDayReservations =
    {
        Arrivals: [
           { CompanyName: "NetJet", ArrivalFlightInformation: { FlightInformationId: 1, Direction: 1, FlightDateTime: "2016-03-14T20:19:44" }, DepartureFlightInformation: { FlightInformationId: 2, Direction: 2, FlightDateTime: "2016-03-14T23:29:44" } },
           { CompanyName: "NetJet", ArrivalFlightInformation: { FlightInformationId: 1, Direction: 1, FlightDateTime: "2016-03-19T11:19:44" }, DepartureFlightInformation: { FlightInformationId: 2, Direction: 2, FlightDateTime: "2016-03-19T21:19:44" } },

        ],
        Departures: []
    };

    var arrivalQTObject = { CompanyName: "BBA", ArrivalFlightInformation: { FlightInformationId: 1, Direction: 1, EstimatedFlightDateTime: "2016-03-14T20:19:44" }, DepartureFlightInformation: { FlightInformationId: 2, Direction: 2, EstimatedFlightDateTime: "2016-03-14T20:45:55" } };
    var arrivalQT2Object = { CompanyName: "BBA", ArrivalFlightInformation: { FlightInformationId: 1, Direction: 1, EstimatedFlightDateTime: "2016-03-14T20:20:44" }, DepartureFlightInformation: { FlightInformationId: 2, Direction: 2, EstimatedFlightDateTime: "2016-03-14T23:55:55" } };
    var heavyArrival = {
        Arrivals: [
           { CompanyName: "NetJet", AircraftType: "", ArrivalFlightInformation: { FlightInformationId: 1, Direction: 1, FlightDateTime: "2016-03-14T20:19:44" }, DepartureFlightInformation: { FlightInformationId: 2, Direction: 2, FlightDateTime: "2016-03-14T23:29:44" } },
           { CompanyName: "NetJet", ArrivalFlightInformation: { FlightInformationId: 1, Direction: 1, FlightDateTime: "2016-03-19T11:19:44" }, DepartureFlightInformation: { FlightInformationId: 2, Direction: 2, FlightDateTime: "2016-03-19T21:19:44" } },

        ],
        Departures: []
    };

    var flightWithGroundTransportation = {
        Arrivals: [
               {
                   CompanyName: "SigNet",
                   ArrivalFlightInformation: {},
                   GroundTransportations:
                   [
                        {
                            Active: true,
                            CarType: { Active: true, CarTypeId: 1, Description: "Rental Vehicle", Name: "Rental" },
                            Type: { Active: true, Description: "Passenger Transportation", Name: "Crew", TransportationTypeId: 1 }
                        },
                        {
                            Active: true,
                            CarType: { Active: true, CarTypeId: 1, Description: "Rental Vehicle", Name: "Rental" },
                            Type: { Active: true, Description: "Passenger Transportation", Name: "Crew", TransportationTypeId: 1 }
                        },
                        {
                            Active: true,
                            CarType: { Active: true, CarTypeId: 1, Description: "Rental Vehicle", Name: "Taxi" },
                            Type: { Active: true, Description: "Passenger Transportation", Name: "Passenger", TransportationTypeId: 1 }
                        },
                   ],
                   DepartureFlightInformation: {}
               },
               {
                   CompanyName: "BBA",
                   ArrivalFlightInformation: {},
                   GroundTransportations:
                   [
                        {
                            Active: true,
                            CarType: { Active: true, CarTypeId: 1, Description: "Rental Vehicle", Name: "Limo" },
                            Type: { Active: true, Description: "Passenger Transportation", Name: "Passenger", TransportationTypeId: 1 }
                        },
                        {
                            Active: true,
                            CarType: { Active: true, CarTypeId: 1, Description: "Rental Vehicle", Name: "Taxi" },
                            Type: { Active: true, Description: "Passenger Transportation", Name: "Crew", TransportationTypeId: 1 }
                        },
                        {
                            Active: true,
                            CarType: { Active: true, CarTypeId: 1, Description: "Rental Vehicle", Name: "Taxi" },
                            Type: { Active: true, Description: "Passenger Transportation", Name: "Crew", TransportationTypeId: 1 }
                        },
                   ],
                   DepartureFlightInformation: {}
               },
               {
                   CompanyName: "Flight",
                   ArrivalFlightInformation: {},
                   GroundTransportations:
                   [
                        {
                            Active: true,
                            CarType: { Active: true, CarTypeId: 1, Description: "Rental Vehicle", Name: "Rental" },
                            Type: { Active: true, Description: "Passenger Transportation", Name: "Crew", TransportationTypeId: 1 }
                        },
                   ],
                   DepartureFlightInformation: {}
               },
               {
                   CompanyName: "Flight",
                   ArrivalFlightInformation: {},
                   GroundTransportations:
                   [
                        {
                            Active: true,
                            CarType: { Active: true, CarTypeId: 1, Description: "Crew Vehicle", Name: "Crew Car" },
                            Type: { Active: true, Description: "Crew Transportation", Name: "Crew", TransportationTypeId: 1 }
                        },
                        {
                            Active: true,
                            CarType: { Active: true, CarTypeId: 1, Description: "Personal Vehicle", Name: "Personal" },
                            Type: { Active: true, Description: "Crew Transportation", Name: "Crew", TransportationTypeId: 1 }
                        },
                        {
                            Active: true,
                            CarType: { Active: true, CarTypeId: 1, Description: "Personal Vehicle", Name: "Personal" },
                            Type: { Active: true, Description: "Passenger Transportation", Name: "Passenger", TransportationTypeId: 1 }
                        },
                        {
                            Active: true,
                            CarType: { Active: true, CarTypeId: 1, Description: "Rental Vehicle", Name: "Crew car" },
                            Type: { Active: true, Description: "Passenger Transportation", Name: "Passenger", TransportationTypeId: 1 }
                        },
                        {
                            Active: true,
                            CarType: { Active: true, CarTypeId: 1, Description: "Rental Vehicle", Name: "Crew car" },
                            Type: { Active: true, Description: "Passenger Transportation", Name: "Passenger", TransportationTypeId: 1 }
                        },
                   ],
                   DepartureFlightInformation: {}
               },

        ],
        Departures: []
    };

    var flightsWithAircraftServices = {
        Arrivals: [
            {
                CompanyName: "SigNet",
                AircraftServices: [
                    {
                        Active: true,
                        AircraftServiceId: 3,
                        Comments: null,
                        ProductCode: "6020",
                        ProductDescription: "LAVATORY SERVICE",
                        Quantity: 1,
                        ReservationId: 0,
                        ServiceCategory: "LAV",
                        Status: 1
                    },
                    {
                        Active: true,
                        AircraftServiceId: 1,
                        Comments: null,
                        ProductCode: "102402",
                        ProductDescription: "FLEET COMM JET/FSII",
                        Quantity: 312,
                        ReservationId: 0,
                        ServiceCategory: "FUEL",
                        Status: 1
                    },
                    {
                        Active: true,
                        AircraftServiceId: 1,
                        Comments: null,
                        ProductCode: "6020",
                        ProductDescription: "WATER SERVICE",
                        Quantity: 312,
                        ReservationId: 0,
                        ServiceCategory: "WATER",
                        Status: 1
                    },
                    {
                        Active: true,
                        AircraftServiceId: 1,
                        Comments: null,
                        ProductCode: "6020",
                        ProductDescription: "FLEET COMM JET/FSII",
                        Quantity: 312,
                        ReservationId: 0,
                        ServiceCategory: "FUEL",
                        Status: 1
                    },
                ],
                PosTransactionId: "13cccdbc-9dcb-4a22-8d42-5e71e62e5cfb",
                Payments: [
                    {
                        Account: 2763.4,
                        IsAccountOnFile: false,
                        PaymentType: 0,
                        PosPaymentId: 1,
                        PosTransactionId: "b1048d58-c439-45a5-9a3c-1f05cd4928ad",
                        Status: 2
                    },
                    {
                        Account: 2763.4,
                        IsAccountOnFile: false,
                        PaymentType: 0,
                        PosPaymentId: 1,
                        PosTransactionId: "b1048d58-c439-45a5-9a3c-1f05cd4928ad",
                        Status: 32
                    }
                ]
            },

        ],
        Departures: [
            {
                CompanyName: "Signet",
                AircraftServices: [
                    {
                        Active: true,
                        AircraftServiceId: 1,
                        Comments: null,
                        ProductCode: "6020",
                        ProductDescription: "FLEET COMM JET/100LL",
                        Quantity: 312,
                        ReservationId: 0,
                        ServiceCategory: "FUEL",
                        Status: 1
                    },
                ],
                PosTransactionId: "13cccdbc-9dcb-4a22-8d42-5e71e62e5cfb",
                PosTransactionStatus: 1,
                Payments: [
                    {
                        Account: 2763.4,
                        IsAccountOnFile: false,
                        PaymentType: 0,
                        PosPaymentId: 1,
                        PosTransactionId: "b1048d58-c439-45a5-9a3c-1f05cd4928ad",
                        Status: 1
                    },
                    {
                        Account: 2763.4,
                        IsAccountOnFile: false,
                        PaymentType: 0,
                        PosPaymentId: 1,
                        PosTransactionId: "b1048d58-c439-45a5-9a3c-1f05cd4928ad",
                        Status: 32
                    }
                ]
            },
            {
                CompanyName: "Signet",
                AircraftServices: [
                    {
                        Active: true,
                        AircraftServiceId: 1,
                        Comments: null,
                        ProductCode: "6020",
                        ProductDescription: "FLEET COMM AVGAS",
                        Quantity: 312,
                        ReservationId: 0,
                        ServiceCategory: "FUEL",
                        Status: 1
                    },
                ],
                PosTransactionId: "13cccdbc-9dcb-4a22-8d42-5e71e62e5cfb",
                PosTransactionStatus: 4,
                Payments: [
                    {
                        Account: 2763.4,
                        IsAccountOnFile: false,
                        PaymentType: 0,
                        PosPaymentId: 1,
                        PosTransactionId: "b1048d58-c439-45a5-9a3c-1f05cd4928ad",
                        Status: 1
                    },
                    {
                        Account: 2763.4,
                        IsAccountOnFile: false,
                        PaymentType: 0,
                        PosPaymentId: 1,
                        PosTransactionId: "b1048d58-c439-45a5-9a3c-1f05cd4928ad",
                        Status: 32
                    }
                ]
            },
            {
                CompanyName: "Signet",
                AircraftServices: [
                    {
                        Active: true,
                        AircraftServiceId: 1,
                        Comments: null,
                        ProductCode: "6020",
                        ProductDescription: "JET FLEET",
                        Quantity: 312,
                        ReservationId: 0,
                        ServiceCategory: "FUEL",
                        Status: 1
                    },
                ],
                PosTransactionId: "b1048d58-c439-45a5-9a3c-1f05cd4928ad",
                CardOnFile: true
            },
        ]
    };

    var heavyTransportReservation =
        {
            AircraftType: "TX",
            CompanyName: "Wells Fargo",
            ArrivalFlightInformation: {}
        };

    var notHeavyReservation =
        {
            AircraftType: "SJ",
            CompanyName: "Bank of America",
            ArrivalFlightInformation: {},
            DepartureFlightInformation: {}
        }; 
});