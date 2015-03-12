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
      templateUrl: './views/restrictionlegendtemplate.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
      	
      }
    };
  });
