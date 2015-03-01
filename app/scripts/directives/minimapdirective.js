'use strict';

/**
 * @ngdoc directive
 * @name troutDashApp.directive:miniMapDirective
 * @description
 * # miniMapDirective
 */
angular.module('troutDashApp')
  .directive('miniMapDirective', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the miniMapDirective directive');
      }
    };
  });
