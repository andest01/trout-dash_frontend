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
      	scope.isSmall = true;
        console.log(scope.stream);
      	scope.isAlertSymbolDisplayed = function() {
      		if (scope.isSmall === false) {
      			return false;
      		}

      		var isRestrictions = scope.stream.Restrictions.length > 0;
      		var isMessage = scope.stream.AlertMessage != null && scope.stream.AlertMessage.length > 0;

      		if (isRestrictions && isMessage) {
      			return true;
      		}
      	};

      	scope.getAlertMessage = function() {
      		return scope.stream.AlertMessage;
      	};

        scope.expand = function() {
          scope.isSmall = !scope.isSmall;
        }
      }
    };
  });
