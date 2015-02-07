'use strict';

/**
 * @ngdoc directive
 * @name troutDashApp.directive:StreamListItemDirective
 * @description
 * # StreamListItemDirective
 */
angular.module('troutDashApp')
  .directive('StreamListItemDirective', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the StreamListItemDirective directive');
      }
    };
  });
