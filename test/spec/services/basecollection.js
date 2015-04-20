'use strict';

describe('Service: BaseCollection', function () {

  // load the service's module
  beforeEach(module('troutDashApp'));

  // instantiate service
  var BaseCollection;
  beforeEach(inject(function (_BaseCollection_) {
    BaseCollection = _BaseCollection_;
  }));

  it('should do something', function () {
    expect(!!BaseCollection).toBe(true);
  });

});
