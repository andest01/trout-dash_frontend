'use strict';

describe('Service: RegionGeometryService', function () {

  // load the service's module
  beforeEach(module('troutDashApp'));

  // instantiate service
  var RegionGeometryService;
  beforeEach(inject(function (_RegionGeometryService_) {
    RegionGeometryService = _RegionGeometryService_;
  }));

  it('should do something', function () {
    expect(!!RegionGeometryService).toBe(true);
  });

});
