'use strict';

describe('Service: TableOfContentsRepository', function () {

  // load the service's module
  beforeEach(module('troutDashApp'));

  // instantiate service
  var TableOfContentsRepository;
  beforeEach(inject(function (_TableOfContentsRepository_) {
    TableOfContentsRepository = _TableOfContentsRepository_;
  }));

  it('should do something', function () {
    expect(!!TableOfContentsRepository).toBe(true);
  });

});
