'use strict';

describe('Service: StateApiService.js', function () {

  // load the service's module
  beforeEach(module('troutDashApp'));

  // instantiate service
  var StateApiService.js;
  beforeEach(inject(function (_StateApiService.js_) {
    StateApiService.js = _StateApiService.js_;
  }));

  it('should do something', function () {
    expect(!!StateApiService.js).toBe(true);
  });

});
