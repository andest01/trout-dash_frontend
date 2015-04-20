'use strict';

describe('Service: BaseApiService', function () {

  // load the service's module
  beforeEach(module('troutDashApp'));

  // instantiate service
  var BaseApiService;
  beforeEach(inject(function (_BaseApiService_) {
    BaseApiService = _BaseApiService_;
  }));

  it('should do something', function () {
    expect(!!BaseApiService).toBe(true);
  });

});
