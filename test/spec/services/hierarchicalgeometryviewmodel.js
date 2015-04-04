'use strict';

describe('Service: HierarchicalGeometryViewModel', function () {

  // load the service's module
  beforeEach(module('troutDashApp'));

  // instantiate service
  var HierarchicalGeometryViewModel;
  beforeEach(inject(function (_HierarchicalGeometryViewModel_) {
    HierarchicalGeometryViewModel = _HierarchicalGeometryViewModel_;
  }));

  it('should do something', function () {
    expect(!!HierarchicalGeometryViewModel).toBe(true);
  });

});
