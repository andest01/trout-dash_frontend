'use strict';

/**
 * @ngdoc directive
 * @name troutDashApp.directive:restrictionLegend
 * @description
 * # restrictionLegend
 */
angular.module('troutDashApp')
  .directive('restrictionLegend', function () {
    return {
      template: '<div></div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.text('this is the restrictionLegend directive');
      }
    };
  });
