describe('HttpRequestService', function () {
    var $q, deferred, $httpBackend, factory, httpRequestCall;
    var httpConfiguration = {
        method: 'POST',
        url: 'http://localhost:2307/'
    };

    beforeEach(module('app')); //<--- Hook module

    beforeEach(inject(function ($injector, HttpRequestService) {
        $httpBackend = $injector.get('$httpBackend');
        $q = $injector.get('$q');
        deferred = $q.defer();
        factory = HttpRequestService;

    }));

    // verifying there is no outstanding operation for $httpBackend
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


    describe('Checking if variables needed for HttpRequestService are defined, ', function () {
        it('factory should be defined', function () {
            expect(factory).toBeDefined();
        });

        it('$q should be defined', function () {
            expect($q).toBeDefined();
        });

        it('$httpBackend should be defined', function () {
            expect($httpBackend).toBeDefined();
        });

        it('deffered should be defined', function () {
            expect(deferred).toBeDefined();
        });
    });

    describe('Test the Go method, ', function () {

        it('should resolve promise successfully', function () {
            $httpBackend.expect('POST', 'http://localhost:2307/')
                .respond(200, [{ success: 1, id: 123 }]);

            factory.Go(httpConfiguration)
                .then(function (data) {
                    expect(data[0].success).toBeTruthy();
                });

            $httpBackend.flush();
        });


        it('should reject the http request and send error message', function () {
            $httpBackend.expect('POST', 'http://localhost:2307/')
                .respond(400, [{ message: "Error Occured" }]);

            factory.Go(httpConfiguration)
                .then(function (data) {
                }).catch(function (err) {
                    expect(err[0].message).toEqual("Error Occured");
                });

            $httpBackend.flush();
        });
    });
})