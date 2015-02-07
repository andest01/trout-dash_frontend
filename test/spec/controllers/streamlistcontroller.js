'use strict';

describe('Controller: StreamlistcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('troutDashApp'));

  var StreamlistcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StreamlistcontrollerCtrl = $controller('StreamlistcontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
