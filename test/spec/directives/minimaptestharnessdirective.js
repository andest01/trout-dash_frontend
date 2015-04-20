'use strict';

describe('Directive: MiniMapTestHarnessDirective', function () {

  // load the directive's module
  beforeEach(module('troutDashApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<-mini-map-test-harness-directive></-mini-map-test-harness-directive>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the MiniMapTestHarnessDirective directive');
  }));
});
