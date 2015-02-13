'use strict';

/**
 * @ngdoc directive
 * @name troutDashApp.directive:streamRatio
 * @description
 * # streamRatio
 */
angular.module('troutDashApp')
  .directive('streamRatio', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the streamRatio directive');
      }
    };
  });
