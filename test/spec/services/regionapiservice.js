'use strict';

describe('Service: RegionApiService', function () {

  // load the service's module
  beforeEach(module('troutDashApp'));

  // instantiate service
  var RegionApiService;
  beforeEach(inject(function (_RegionApiService_) {
    RegionApiService = _RegionApiService_;
  }));

  it('should do something', function () {
    expect(!!RegionApiService).toBe(true);
  });

});
