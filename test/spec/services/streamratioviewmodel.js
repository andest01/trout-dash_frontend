'use strict';

describe('Service: StreamRatioViewModel', function () {

  // load the service's module
  beforeEach(module('troutDashApp'));

  // instantiate service
  var StreamRatioViewModel;
  beforeEach(inject(function (_StreamRatioViewModel_) {
    StreamRatioViewModel = _StreamRatioViewModel_;
  }));

  it('should do something', function () {
    expect(!!StreamRatioViewModel).toBe(true);
  });

});
