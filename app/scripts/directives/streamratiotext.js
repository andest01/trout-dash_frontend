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
			templateUrl: '/views/streamratiotexttemplate.html',
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				var streamLength = parseFloat(scope.stream.LengthMiles);
				var publicLandLength = parseFloat(scope.stream.PalsLength);

				scope.streamLength = streamLength.toFixed(1);
				scope.publicLandLength = publicLandLength.toFixed(1);
			}
		};
	});
