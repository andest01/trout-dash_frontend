'use strict';

/**
 * @ngdoc directive
 * @name troutDashApp.directive:streamRatioText
 * @description
 * # streamRatioText
 */
angular.module('troutDashApp')
  .directive('streamRatioText', function () {
    return {
      template: '<div></div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.text('this is the streamRatioText directive');
      }
    };
  });
