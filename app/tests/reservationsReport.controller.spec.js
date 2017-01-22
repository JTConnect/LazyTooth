describe('ReservationsReportController - ', function () {
    var scope, ReservationsReportController, $rootScope, $httpBackend, $window;

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
        ReservationsReportController = function () {
            return $controller('ReservationsReportController', {
                'scope': scope

            });
        }; 
    })); 

    describe('Get CPA Bases', function () {
        it("should populate the bases collection and get the selected base id", function () {

            var controller = ReservationsReportController();

            expect(controller.startDateTime).toEqual(new Date());
            expect(controller.isOpen).toBeFalsy();

            expect(controller.bases).toBeDefined();

            controller.BaseSelected(null, controller.bases[0], null);
            expect(controller.GetBaseId()).toEqual(controller.bases[0].BaseId);
        });

        it("should not view the report with the provided params", function () {
            spyOn($window, 'open').and.callFake(function () {
                return true; 
            }); 
            var controller = ReservationsReportController();
            controller.startDateTime = new Date(); 
            controller.ViewReport();
            expect($window.open).not.toHaveBeenCalled(); 

        });

        it("should view the report by opening up a new window", function () {
            spyOn($window, 'open').and.callFake(function () {
                return true;
            });

            var controller = ReservationsReportController();
            controller.startDateTime = new Date();
            controller.BaseSelected(null, controller.bases[0], null);
            controller.ViewReport();
            expect($window.open).toHaveBeenCalled(); 
        }); 

        it('should reset the baseid property if user clears out the base', function () {
            var controller = ReservationsReportController();
            controller.BaseSelected(null, controller.bases[0], null);
            controller.Reset();
            expect(controller.GetBaseId()).toBeUndefined();
        }); 
    }); 
});


//Test Data
var cpaBases = [{ BaseId: "P08", Iata: "MCO" }, { BaseId: "I76", Iata: "TPA" }, { BaseId: "P84", Iata: "FLL" }, { BaseId: "L23", Iata: "MIA" }];