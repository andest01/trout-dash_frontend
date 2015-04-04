'use strict';

describe('Service: RegionRepositoryService', function () {

  // load the service's module
  beforeEach(module('troutDashApp'));

  // instantiate service
  var RegionRepositoryService;
  beforeEach(inject(function (_RegionRepositoryService_) {
    RegionRepositoryService = _RegionRepositoryService_;
  }));

  it('should do something', function () {
    expect(!!RegionRepositoryService).toBe(true);
  });

});
