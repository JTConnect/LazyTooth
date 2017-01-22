describe('DashboardController - ', function () {
    var scope, DashboardController, $rootScope, $httpBackend, $window;

    beforeEach(module('app'));

    beforeEach(module(function ($provide) {
        $provide.factory('LookupService', function () {
            var formatBases = jasmine.createSpy('formatBases').and.callFake(function (callback) {
                callback(null, cpaBases);
            });

            return {
                FormatBases: formatBases
            };
        });
    }));

    beforeEach(inject(function (_$rootScope_, $controller, _$httpBackend_, _LookupService_, _$window_) {
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        scope = _$rootScope_.$new();
        $window = _$window_;
        DashboardController = function () {
            return $controller('DashboardController', {
                $scope: scope
            });
        };
    }));

    describe("Test the Base Functionality", function () {
        it("should select a base", function () {
            var controller = DashboardController();
            controller.BaseSelected(null, controller.bases[0], null);
            expect(controller.base.BaseId).toEqual(controller.bases[0].BaseId);
        });

        it("should open the report window with the correct parameters", function () {
            spyOn($window, 'open').and.callFake(function () {
                return true; 
            }); 

            var controller = DashboardController();
            var date = moment().format('YYYY-MM-DD');
            controller.BaseSelected(null, controller.bases[1], null);
            controller.GenerateReservationReport();
            expect($window.open).toHaveBeenCalledWith("http://signetapi-development.trafficmanager.net/Report/Reservations/" + controller.base.BaseId + "/" + date + "/" + 24);
        }); 
    }); 
});

//Test Data
var cpaBases = [{ BaseId: "P08", Iata: "MCO" }, { BaseId: "I76", Iata: "TPA" }, { BaseId: "P84", Iata: "FLL" }, { BaseId: "L23", Iata: "MIA" }];