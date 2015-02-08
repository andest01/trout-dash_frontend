'use strict';

describe('Directive: streamLine', function () {

  // load the directive's module
  beforeEach(module('troutDashApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<stream-line></stream-line>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the streamLine directive');
  }));
});
