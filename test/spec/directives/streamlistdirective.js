'use strict';

describe('Directive: StreamListDirective', function () {

  // load the directive's module
  beforeEach(module('troutDashApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<-stream-list-directive></-stream-list-directive>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the StreamListDirective directive');
  }));
});
