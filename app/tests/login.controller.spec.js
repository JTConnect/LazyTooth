describe('LoginController', function () {
    var scope, createController, mockAuthenticationService, $rootScope, $httpBackend;
    var emptyObject = {};

    beforeEach(module("app"));

    beforeEach(module(function ($provide) {
        $provide.factory('AuthenticationService', function ($q) {
            var loginUser = jasmine.createSpy('loginUser').and.callFake(function (userConfigObject) {
                var userObject = [{ access_token: "this is invoked through a fake implementation of the service" }];
                if (userConfigObject.grant_type = "password" && userConfigObject.username.length > 0 && userConfigObject.password.length > 0) {
                    return $q.when(userObject);
                }
                else {
                    return $q.reject("error occured");
                }
            })

            return {
                LoginUser: loginUser
            }
        });
    }));

    beforeEach(inject(function ($controller, _$state_, AuthenticationService, _$rootScope_, _$httpBackend_) {
        scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $httpBackend.whenGET(/.*.html/).respond(200, ''); // providing the template to the ui-router
        createController = function () {
            return $controller('LoginController', {
                'AuthenticationService': AuthenticationService,
                '$state': _$state_,
                '$scope': scope
            });
        };
    }));

    //injecting the templates to test requires a flush of the $httpBackend service.. 
    afterEach(function () {
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


    it('should equal to Login Controller', function () {
        var controller = createController();
        expect(controller.title).toEqual("Login Controller");
    });

    it('should be empty', function () {
        var controller = createController();
        expect(controller.userCredentails).toEqual(emptyObject);
    });

    it('should login user to the dashboard view and resolve promise', function () {
        var controller = createController();
        controller.userCredentails = { username: "test", password: "test" };
        controller.loginForm = {};
        controller.loginForm.$invalid = false;
        controller.loginUser();

        expect(controller.loginPromise).toBeDefined();

        controller.loginPromise.then(function (data) {
            expect(data[0].access_token).toBeDefined();
        }).catch(function (err) {
            expect(err).toBeUndefined();
        });

        $rootScope.$digest();

    })
});