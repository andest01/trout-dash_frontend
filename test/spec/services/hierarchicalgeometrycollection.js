'use strict';

describe('Service: HierarchicalGeometryCollection', function () {

  // load the service's module
  beforeEach(module('troutDashApp'));

  // instantiate service
  var HierarchicalGeometryCollection;
  beforeEach(inject(function (_HierarchicalGeometryCollection_) {
    HierarchicalGeometryCollection = _HierarchicalGeometryCollection_;
  }));

  it('should do something', function () {
    expect(!!HierarchicalGeometryCollection).toBe(true);
  });

});
