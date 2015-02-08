'use strict';

/**
 * @ngdoc directive
 * @name troutDashApp.directive:streamLine
 * @description
 * # streamLine
 */
angular.module('troutDashApp')
  .directive('streamLine', function () {
    return {
      template: '<div></div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.text('this is the streamLine directive');
      }
    };
  });
