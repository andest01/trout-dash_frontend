'use strict';
/**
 * @ngdoc directive
 * @name troutDashApp.directive:StreamListDirective
 * @description
 * # StreamListDirective
 */
angular.module('troutDashApp')
  .directive('youAreADick', function () {
    return {
    	template: '<div></div>',
      	restrict: 'A',
      	link: function postLink(scope, element, attrs) {
	        console.log('hello');
	        element.text('this is the StreamListDirective directive'); 
      	}
	};
});
