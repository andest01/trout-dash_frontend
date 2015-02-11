'use strict';

/**
 * @ngdoc directive
 * @name troutDashApp.directive:StreamListItemDirective
 * @description
 * # StreamListItemDirective
 */
angular.module('troutDashApp')
  .directive('streamListItemDirective', function () {
    return {
      templateUrl: '/views/streamlistitemtemplate.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
      	
      }
    };
  });
