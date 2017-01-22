(function () {
    angular
        .module('app')
        .factory('FlightBoardService', FlightBoardService);

    FlightBoardService.$inject = ['$interval', '$uibModal', 'HttpRequestService', 'AuthenticationSettings', 'DateTimeService', 'HelperMethodsService', 'CurrentUserService'];

    function FlightBoardService($interval, $uibModal, HttpRequestService, AuthenticationSettings, DateTimeService, HelperMethodsService, CurrentUserService) {
        var self = this;

        self.serviceCategory = [
            { Id: 1, name: 'Car' },
            { Id: 2, name: 'Cater' },
            { Id: 3, name: 'CustHandling' },
            { Id: 4, name: 'Deice' },
            { Id: 5, name: 'Etc' },
            { Id: 6, name: 'Fuel' },
            { Id: 7, name: 'Gpu' },
            { Id: 8, name: 'Handling' },
            { Id: 9, name: 'Hotel' },
            { Id: 10, name: 'Intial' },
            { Id: 11, name: 'Lav' },
            { Id: 12, name: 'Other' },
            { Id: 14, name: 'Secondary' },
            { Id: 15, name: 'Water' }
        ];

        self.transportationType = [
           { Id: 1, type: 'rental', abbreviation: 'R' },
           { Id: 2, type: 'limo', abbreviation: 'L' },
           { Id: 3, type: 'taxi', abbreviation: 'T' },
           { Id: 4, type: 'crew car', abbreviation: 'C' },
           { Id: 5, type: 'personal', abbreviation: 'P'}
        ];

        self.flightDirection = [{ id: 1, name: "arrival" }, { id: 2, name: "departure" }];
        self.heavyCharterTypes = ["tx"];
        self.flightBoardRoute = "root.appLayout.flightBoard";
        self.prefix = "Flight";
        self.fuelTypes = ['jet a +', 'avgas', '100ll', 'jet a -'];
        self.sections = { arrival: 'arrival', sameDay: 'sameDay', departure: 'departure' };

        return {
            StructureReservationData: structureReservationData,
            GetReservationsByBase: getReservationsByBase,
            GetUserSettings: getUserSettings,
            FlattenReservation: flattenReservation,
            TriggerModal: triggerModal,
            IsQuickTurn: isQuickTurn,
            SortFlights: sortFlights,
            IsHeavyCharter: isHeavyCharter,
            RemoveFlights: removeFlights,
            GetFlights: getFlights,
            CheckDeparturesForHeavyTransport: checkDeparturesForHeavyTransport
        };



        function triggerModal(route) {
            var trigger = false;

            if (route !== self.flightBoardRoute) { return trigger; }

            if (CurrentUserService.GetFlightBoardConfiguration() === null) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'app/core/templates/modal/warningModal.html',
                    controller: 'WarningModalController',
                    size: '',
                });
                trigger = true;
            }
            return trigger;
        }

        /*API Services*/


        /**
         * This function does the following: 
         * Gets Flight Reservations. 
         * @param data an object with three properties: BaseId, StartDateTime, and DurationHours. 
         * @return an Http promise that when resolved will give access to reservations in two categories
         * Arrivals and Departures (For ex. {Arrivals: [], Departures: []})
         */
        function getReservationsByBase(data) {
            return HttpRequestService.Go({
                method: "POST",
                url: AuthenticationSettings.ResourcesAPI + "api/FlightBoard/" + "GetReservationsByBase",
                data: JSON.stringify(data)
            });
        }

        function getUserSettings() {
            return {
                BaseId: "P08",
                Roles: []
            };
        }


        /*FlightBoard Logic*/

        function setPaginationCounter(itemsPerPage, dataLength, currentPage) {
            var begin, end;
            begin = (currentPage - 1) * itemsPerPage;
            end = begin + itemsPerPage;
            if ((end - dataLength) > 0) {
                var difference = dataLength - begin;
                end = begin + difference;
            }
            begin += 1;
            return { begin: begin, end: end };
        }

        function createFlightObject(pageNum, itemsPerPage, hourRange, date) {
            var obj = {
                Pagination: { CurrentPage: pageNum, itemsPerPage: itemsPerPage },
                Date: date,
                HourRange: hourRange
            };
            return obj;
        }

        function calculateHourRange(arithmetic, hourRange) {
            if (hourRange === 0 && arithmetic == "s") {
                return 0;
            }

            if (arithmetic == "s") {
                hourRange -= 1;
            }

            if (arithmetic == "a") {
                hourRange += 1;
            }

            return hourRange;
        }

        /**
         * This function does the following: 
         * gets same day, and heavy charter flights 
         * formats departure dates and looks for heavy charters
         * removes same day flights and heavy charters from arrival and departure arrays.
         * @param data encapsulates both arrivals and departures
         * @return an object with three properties: sameDayFlights, heavyCharters, and data (Arrivals and Departures)
         */
        function structureReservationData(data) {
            if (HelperMethodsService.IsObjectNull(data)) return;

            var sameDayFlights = [],
                heavyCharters = [],
                arrivals = data.Arrivals,
                departures = data.Departures;
     
            getFlights(arrivals, sameDayFlights, heavyCharters);
            checkDeparturesForHeavyTransport(departures, heavyCharters);
            removeFlights(arrivals, departures, sameDayFlights, heavyCharters);

            sortArrivals(arrivals);
            sortSameDayFlights(sameDayFlights);
            sortDepartures(departures);
            sortHeavyCharters(heavyCharters);

            return { sameDayFlights: sameDayFlights, heavyCharters: heavyCharters, data: data };
        }

       /**
         * The following four functions are used to initiate the sort methods for 
         * the flights. 
         */
        function sortArrivals(arrivals) {
            sortFlights(arrivals, self.sections.arrival);
            for (var i in arrivals) {
                formatReservationTimes(arrivals[i], self.flightDirection[0].id);
            }
        }
        
        function sortSameDayFlights(sameDayFlights) {
            sortFlights(sameDayFlights, self.sections.sameDay);
            for (var i in sameDayFlights) {
                formatReservationTimes(sameDayFlights[i]);
            }
        }
        
        function sortDepartures(departures) {
            sortFlights(departures, self.sections.departure);
            for (var i = 0; i < departures.length; i++) {
                formatReservationTimes(departures[i], self.flightDirection[1].id);
           }
        }

        function sortHeavyCharters(heavyCharters) {
            for (var i = 0; i < heavyCharters.length; i++) {
                if (heavyCharters[i].IsArrival === true) {
                    formatReservationTimes(heavyCharters[i], self.flightDirection[0].id);
                }
                else if(heavyCharters[i].IsDeparture === true) {
                    formatReservationTimes(heavyCharters[i], self.flightDirection[1].id);
                }
                else if (heavyCharters[i].IsSameDay === true) {
                    formatReservationTimes(heavyCharters[i]);
                }
            }
        }

        /**
         * This function does the following: 
         * iterates through the departure array to find heavy transport flights.
         * @param departures array with departure flights
         * @param heavyCharters array with heavy flights 
         */
        function checkDeparturesForHeavyTransport(departures, heavyCharters) {
            for (var i = 0; i < departures.length; i++) {             
                if (isHeavyCharter(departures[i])) {
                    departures[i].IsDeparture = true;
                    heavyCharters.push(departures[i]);
                }
            }
        }

        function sortFlights(array, section) {
            if (HelperMethodsService.IsObjectNull(array)) return;

            if (section === self.sections.arrival) {
                array.sort(function (aFlight, bFlight) {
                    var aDateTime;
                    var bDateTime;

                    if (!HelperMethodsService.IsPropertyEmpty(aFlight.ArrivalFlightInformation.FlightDateTime)) {
                        aDateTime = aFlight.ArrivalFlightInformation.FlightDateTime;
                    }
                    else if (HelperMethodsService.IsPropertyEmpty(aFlight.ArrivalFlightInformation.FlightDateTime) && !HelperMethodsService.IsPropertyEmpty(aFlight.ArrivalFlightInformation.EstimatedFlightDateTime)) {
                        aDateTime = aFlight.ArrivalFlightInformation.EstimatedFlightDateTime;
                    }

                    if (!HelperMethodsService.IsPropertyEmpty(bFlight.ArrivalFlightInformation.FlightDateTime)) {
                        bDateTime = bFlight.ArrivalFlightInformation.FlightDateTime;
                    }
                    else if (HelperMethodsService.IsPropertyEmpty(bFlight.ArrivalFlightInformation.FlightDateTime) && !HelperMethodsService.IsPropertyEmpty(bFlight.ArrivalFlightInformation.EstimatedFlightDateTime)) {
                        bDateTime = bFlight.ArrivalFlightInformation.EstimatedFlightDateTime;
                    }

                    return aDateTime > bDateTime ? 1 : -1;

                });
            }

            if (section === self.sections.sameDay) {
                array.sort(function (aFlight, bFlight) {


                    var aDateTime = sortMethodForSameDayFlights(aFlight);
                    var bDateTime = sortMethodForSameDayFlights(bFlight);

                    return aDateTime > bDateTime ? 1 : -1;
                });
            }

            if (section === self.sections.departure) {
                array.sort(function (aFlight, bFlight) {
                    var aDateTime;
                    var bDateTime;

                    if (!HelperMethodsService.IsPropertyEmpty(aFlight.DepartureFlightInformation.FlightDateTime)) {
                        aDateTime = aFlight.DepartureFlightInformation.FlightDateTime;
                    }
                    else if (HelperMethodsService.IsPropertyEmpty(aFlight.DepartureFlightInformation.FlightDateTime) && !HelperMethodsService.IsPropertyEmpty(aFlight.DepartureFlightInformation.EstimatedFlightDateTime)) {
                        aDateTime = aFlight.DepartureFlightInformation.EstimatedFlightDateTime;
                    }

                    if (!HelperMethodsService.IsPropertyEmpty(bFlight.DepartureFlightInformation.FlightDateTime)) {
                        bDateTime = bFlight.DepartureFlightInformation.FlightDateTime;
                    }
                    else if (HelperMethodsService.IsPropertyEmpty(bFlight.DepartureFlightInformation.FlightDateTime) && !HelperMethodsService.IsPropertyEmpty(bFlight.DepartureFlightInformation.EstimatedFlightDateTime)) {
                        bDateTime = bFlight.DepartureFlightInformation.EstimatedFlightDateTime;
                    }

                    return aDateTime > bDateTime ? 1 : -1;
                });
            }
            return array;
        }


        function sortMethodForSameDayFlights(flight) {
            var dateTime;
            var enter = false;

            if (!HelperMethodsService.IsPropertyEmpty(flight.DepartureFlightInformation.FlightDateTime)) {
                enter = true;
                dateTime = flight.DepartureFlightInformation.FlightDateTime;
            }
            else if (!enter) {
                if ((!HelperMethodsService.IsPropertyEmpty(flight.DepartureFlightInformation.EstimatedFlightDateTime) && !HelperMethodsService.IsPropertyEmpty(flight.ArrivalFlightInformation.FlightDateTime))) {
                    enter = true;
                    dateTime = flight.DepartureFlightInformation.EstimatedFlightDateTime;
                }

                if (!enter && !HelperMethodsService.IsPropertyEmpty(flight.ArrivalFlightInformation.FlightDateTime)) {
                    enter = true;
                    dateTime = flight.ArrivalFlightInformation.FlightDateTime;
                }

                if (!enter && !HelperMethodsService.IsPropertyEmpty(flight.ArrivalFlightInformation.EstimatedFlightDateTime)) {
                    enter = true;
                    dateTime = flight.ArrivalFlightInformation.EstimatedFlightDateTime;
                }
            }

            return dateTime;

        }

        /**
         * This function does the following: 
         * Flattens the data for arrivals and departures.  
         * @param data encapsulates both arrivals and departures
        */
        function flattenReservation(data) {
            if (HelperMethodsService.IsObjectNull(data)) return;

            var arrivals = data.Arrivals,
                departures = data.Departures;

            startFlattenProcess(arrivals);
            startFlattenProcess(departures);
        }

        /*Private functions */

        /**
         * This function does the following: 
         * Iterates through the arrivals array and finds same day and or heavy transport flights. The arrivals array is the only 
         * array that will possibly have same day flights. The dates in the arrival flights and their corresponding departures 
         * are formatted accordingly. 
         * @param arrivals array with arrival flights filtered by the flightboard calendar date and corresponding departure flights. 
         * @param sameDayFlights empty array to hold flights (arrivals and departures) on the same day. 
         * @param heavyCharters empty array to hold flights that are considered heavy. 
         */
        function getFlights(arrivals, sameDayFlights, heavyCharters) {

            for (var i = 0; i < arrivals.length; i++) {
                if (!HelperMethodsService.IsObjectNull(arrivals[i].ArrivalFlightInformation) && !HelperMethodsService.IsObjectNull(arrivals[i].DepartureFlightInformation)) {
                    if (DateTimeService.FormatDate(arrivals[i].ArrivalFlightInformation.EstimatedFlightDateTime) == DateTimeService
                        .FormatDate(arrivals[i].DepartureFlightInformation.EstimatedFlightDateTime)) {
                        isQuickTurn(arrivals[i]);
                        //  formatReservationTimes(arrivals[i]);
                        if (isHeavyCharter(arrivals[i])) {
                            arrivals[i].IsSameDay = true;
                            heavyCharters.push(arrivals[i]);
                        }
                        else {
                            sameDayFlights.push(arrivals[i]);
                        }

                        continue;
                    }
                }
                //   formatReservationTimes(arrivals[i], self.flightDirection[0].id);
                if (isHeavyCharter(arrivals[i])) {
                    arrivals[i].IsArrival = true;
                    heavyCharters.push(arrivals[i]);
                }
            }
        }

        /**
         * This function does the following: 
         * Checks if the Departure time minus the arrival time is greater than -1 or less than or equal to 30 mins. 
         * If the expression is true, the flight is considered a Quick Turn. 
         * @param arrival a flight object from the arrivals. 
         */
        function isQuickTurn(arrival) {
            arrival.QuickTurn = false;
            if (!HelperMethodsService.IsPropertyEmpty(arrival.ArrivalFlightInformation.FlightDateTime)) { startDate = arrival.ArrivalFlightInformation.FlightDateTime; }
            else { startDate = arrival.ArrivalFlightInformation.EstimatedFlightDateTime; }
            var difference = DateTimeService.GetDifference(startDate, arrival.DepartureFlightInformation.EstimatedFlightDateTime, "minutes");
            if (difference > -1 && difference <= 30) { arrival.QuickTurn = true; }
            return arrival;
        }

        function isHeavyCharter(flight) {
            return ((!HelperMethodsService.IsPropertyEmpty(flight.AircraftType)) && (self.heavyCharterTypes.indexOf(flight.AircraftType.toLowerCase()) > -1));
        }

        function removeFlights(arrivals, departures, sameDayFlights, heavyCharters) {
            for (var i in sameDayFlights) {
                var index = arrivals.indexOf(sameDayFlights[i]);
                if (index > -1) { arrivals.splice(index, 1); }
            }

            for (var j in heavyCharters) {
                var arrivalsIndex = arrivals.indexOf(heavyCharters[j]);
                if (arrivalsIndex > -1) { arrivals.splice(arrivalsIndex, 1); }
                var departuresIndex = departures.indexOf(heavyCharters[j]);
                if (departuresIndex > -1) { departures.splice(departuresIndex, 1); }
            }
        }

        /**
         * This function does the following: 
         * Checks if the flight object is an arrival or departure and formats the date according to the flight
         * direction id. If the flight direction id is null or undefined then the logic defaults to formatting 
         * the date with just the time. 
         * @param obj a flight object 
         * @param flightDirectionId an id that dictates if the flight object is an arrival or departure flight object. 
         */
        function formatReservationTimes(obj, flightDirectionId) {
            if (!HelperMethodsService.IsObjectNull(obj.ArrivalFlightInformation)) {
                if (!HelperMethodsService.IsPropertyEmpty(obj.ArrivalFlightInformation.FlightDateTime)) {
                    if (flightDirectionId == 1) { obj.ArrivalFlightInformation.FlightDateTime = DateTimeService.FormatTime(obj.ArrivalFlightInformation.FlightDateTime); }
                    else if (flightDirectionId == 2) { obj.ArrivalFlightInformation.FlightDateTime = DateTimeService.FormatDate(obj.ArrivalFlightInformation.FlightDateTime); }
                    else { obj.ArrivalFlightInformation.FlightDateTime = DateTimeService.FormatTime(obj.ArrivalFlightInformation.FlightDateTime); }
                }
                if (!HelperMethodsService.IsPropertyEmpty(obj.ArrivalFlightInformation.EstimatedFlightDateTime)) {
                    if (flightDirectionId == 1) { obj.ArrivalFlightInformation.EstimatedFlightDateTime = DateTimeService.FormatTime(obj.ArrivalFlightInformation.EstimatedFlightDateTime); }
                    else if (flightDirectionId == 2) { obj.ArrivalFlightInformation.EstimatedFlightDateTime = DateTimeService.FormatDate(obj.ArrivalFlightInformation.EstimatedFlightDateTime); }
                    else { obj.ArrivalFlightInformation.EstimatedFlightDateTime = DateTimeService.FormatTime(obj.ArrivalFlightInformation.EstimatedFlightDateTime); }
                }
            }

            if (!HelperMethodsService.IsObjectNull(obj.DepartureFlightInformation)) {
                if (!HelperMethodsService.IsPropertyEmpty(obj.DepartureFlightInformation.FlightDateTime)) {
                    if (flightDirectionId == 1) { obj.DepartureFlightInformation.FlightDateTime = DateTimeService.FormatDate(obj.DepartureFlightInformation.FlightDateTime); }
                    else if (flightDirectionId == 2) { obj.DepartureFlightInformation.FlightDateTime = DateTimeService.FormatTime(obj.DepartureFlightInformation.FlightDateTime); }
                    else { obj.DepartureFlightInformation.FlightDateTime = DateTimeService.FormatTime(obj.DepartureFlightInformation.FlightDateTime); }
                }
                if (!HelperMethodsService.IsPropertyEmpty(obj.DepartureFlightInformation.EstimatedFlightDateTime)) {
                    if (flightDirectionId == 1) { obj.DepartureFlightInformation.EstimatedFlightDateTime = DateTimeService.FormatDate(obj.DepartureFlightInformation.EstimatedFlightDateTime); }
                    else if (flightDirectionId == 2) { obj.DepartureFlightInformation.EstimatedFlightDateTime = DateTimeService.FormatTime(obj.DepartureFlightInformation.EstimatedFlightDateTime); }
                    else { obj.DepartureFlightInformation.EstimatedFlightDateTime = DateTimeService.FormatTime(obj.DepartureFlightInformation.EstimatedFlightDateTime); }
                }
            }
        }

        function startFlattenProcess(data) {
            for (var i in data) {
                flattenGroundTransportation(data[i]);
                flattenAircraftServices(data[i]);
                flattenTransactionPayment(data[i]);

                if (data[i].CustomsRequiredInbound === false) { data[i].CustomsRequiredInbound = ""; }
                else if (data[i].CustomsRequiredInbound === true) { data[i].CustomsRequiredInbound = "Y"; }
            }
        }

        /**
         * This function does the following: 
         * Checks if there is a valid aircraft service and creates a object with the
         * service and attaches it to the obj param
         * @param obj a flight object
         */
        function flattenAircraftServices(obj) {
            for (var i in obj.AircraftServices) {

                for (var j in self.serviceCategory) {

                    if (!HelperMethodsService.IsPropertyEmpty(obj.AircraftServices[i].ServiceCategory) && (obj.AircraftServices[i].ServiceCategory.toLowerCase() == self.serviceCategory[j].name.toLowerCase())) {

                        if (!HelperMethodsService.IsObjectNull(obj.Fuel) && obj.AircraftServices[i].ServiceCategory.toLowerCase() === "fuel") {
                            obj.Fuel.Quantity += obj.AircraftServices[i].Quantity;
                            obj.Fuel.Comments += ", " + obj.AircraftServices[i].Comments;
                            break;
                        }

                        obj[self.serviceCategory[j].name] = {};
                        obj[self.serviceCategory[j].name].Active = obj.AircraftServices[i].Active;
                        obj[self.serviceCategory[j].name].AircraftServiceId = obj.AircraftServices[i].AircraftServiceId;
                        obj[self.serviceCategory[j].name].Comments = obj.AircraftServices[i].Comments;
                        obj[self.serviceCategory[j].name].LastUpdatedBy = obj.AircraftServices[i].LastUpdatedBy;
                        obj[self.serviceCategory[j].name].ProductCode = obj.AircraftServices[i].ProductCode;
                        obj[self.serviceCategory[j].name].Quantity = obj.AircraftServices[i].Quantity;
                        obj[self.serviceCategory[j].name].ServiceCategory = obj.AircraftServices[i].ServiceCategory;
                        obj[self.serviceCategory[j].name].ServiceCategoryId = obj.AircraftServices[i].ServiceCategoryId;
                        obj[self.serviceCategory[j].name].Status = obj.AircraftServices[i].Status;
                        obj[self.serviceCategory[j].name].Type = obj.AircraftServices[i].Type;

                        if (self.serviceCategory[j].name.toLowerCase() == "fuel") {
                            //checks for avgas
                            if (!HelperMethodsService.IsPropertyEmpty(obj.AircraftServices[i].ProductDescription) && (obj.AircraftServices[i].ProductDescription.toLowerCase().indexOf('avgas') > -1 || obj.AircraftServices[i].ProductDescription.toLowerCase().indexOf('100ll') > -1)) {
                                obj[self.serviceCategory[j].name].ProductDescription = "A";
                            }

                            //checks to see if there is prist or fsii
                            if (!HelperMethodsService.IsPropertyEmpty(obj.AircraftServices[i].ProductDescription) && (obj.AircraftServices[i].ProductDescription.toLowerCase().indexOf('prist') > -1 || obj.AircraftServices[i].ProductDescription.toLowerCase().indexOf('fsii') > -1)) {
                                obj[self.serviceCategory[j].name].ProductDescription = "JET A +";
                            }

                            //if description is still empty then give it a default value. 
                            if (HelperMethodsService.IsPropertyEmpty(obj[self.serviceCategory[j].name].ProductDescription)) {
                                obj[self.serviceCategory[j].name].ProductDescription = "JET A -";
                            }
                        }
                        else {
                            obj[self.serviceCategory[j].name].ProductDescription = obj.AircraftServices[i].ProductDescription;
                        }

                        break;
                    }
                }
            }
        }


        /**
         * This function does the following: 
         * iterates through all of the ground transportation objects of a flight, 
         * and when it finds a match in the transportation type array, its sets 
         * the value to the AllTransportations in the obj. 
         * @param obj a flight object
         */
        function flattenGroundTransportation(obj) {

            if (HelperMethodsService.IsObjectNull(obj.GroundTransportations)) return;

            var all = [];

            for (var i in obj.GroundTransportations) {
                for (var j in self.transportationType) {
                    if (!HelperMethodsService.IsPropertyEmpty(obj.GroundTransportations[i].CarType.Name) && (obj.GroundTransportations[i].CarType.Name.toLowerCase() === self.transportationType[j].type)) {

                        var nameAbbreviation = self.transportationType[j].abbreviation; // CarType
                        var type = obj.GroundTransportations[i].Type.Name; // Crew or Passenger

                        if (!HelperMethodsService.IsPropertyEmpty(type) && (type.toLowerCase() == "passenger")) { type = "P"; }
                        if (!HelperMethodsService.IsPropertyEmpty(type) && (type.toLowerCase() == "crew")) { type = "C"; }

                        var fullTransportationLabel = type + "" + nameAbbreviation;

                        all.push({ label: fullTransportationLabel, count: 1 });

                        break;
                    }
                }
            }

            var array = angular.copy(all);
            for (var b in array) {
                var current = array[b];
                for (var c in array) {
                    if (current.label == array[c].label && b !== c && current.flagged !== true) {
                        //found a match, flag the match 
                        array[c].flagged = true;
                        current.count += 1;
                    }
                }
            }

            obj.AllTransportations = { Text: "", Status: true };
            for (var s in array) {
                if (array[s].flagged !== true) {
                    if (obj.AllTransportations.Text.length > 0) { obj.AllTransportations.Text += ", "; }
                    obj.AllTransportations.Text += array[s].label + "(" + array[s].count + ")";
                }
            }
        }

        function flattenTransactionPayment(obj) {
            obj.InvoiceIcon = "";
            obj.InvoiceText = "";
            var transactionPaymentStatus = [];

            if (HelperMethodsService.IsPropertyEmpty(obj.PosTransactionId)) return;

            var array = obj.Payments,
                transactionHeaderStatus = obj.PosTransactionStatus,
                directBillNumber = obj.DirectBillNumber;

            for (var i in array) {
                transactionPaymentStatus.push(array[i].Status);
            }

            if (transactionPaymentStatus.indexOf(2) > -1) {
                obj.InvoiceIcon = "fa fa-usd";
            }
            else if (((transactionPaymentStatus.indexOf(32) > -1 && transactionHeaderStatus == 1) && transactionPaymentStatus.indexOf(2) === -1) || obj.CardOnFile === true) {
                obj.InvoiceText = "CS";
            }
            else if (!HelperMethodsService.IsPropertyEmpty(directBillNumber)) {
                obj.InvoiceIcon = "fa fa-check";
            }
            else {
                obj.InvoiceIcon = "fa fa-asterisk";
            }
        }
    }
})();