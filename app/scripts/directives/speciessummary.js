'use strict';

/**
 * @ngdoc directive
 * @name troutDashApp.directive:speciesSummary
 * @description
 * # speciesSummary
 */
angular.module('troutDashApp')
  .directive('speciesSummary', function () {
    return {
      templateUrl: '/views/speciessummarytemplate.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
      	//debugger;
      }
    };
  });
