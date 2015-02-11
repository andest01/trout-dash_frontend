'use strict';

describe('Service: LinearReferenceViewModel', function () {

  // load the service's module
  beforeEach(module('troutDashApp'));

  // instantiate service
  var LinearReferenceViewModel;
  beforeEach(inject(function (_LinearReferenceViewModel_) {
    LinearReferenceViewModel = _LinearReferenceViewModel_;
  }));

  it('should do something', function () {
    expect(!!LinearReferenceViewModel).toBe(true);
  });

});
