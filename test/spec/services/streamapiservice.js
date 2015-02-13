'use strict';

describe('Service: StreamApiService', function () {

  // load the service's module
  beforeEach(module('troutDashApp'));

  // instantiate service
  var StreamApiService;
  beforeEach(inject(function (_StreamApiService_) {
    StreamApiService = _StreamApiService_;
  }));

  it('should do something', function () {
    expect(!!StreamApiService).toBe(true);
  });

});
