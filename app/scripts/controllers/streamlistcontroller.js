'use strict';

/**
 * @ngdoc function
 * @name troutDashApp.controller:StreamlistcontrollerCtrl
 * @description
 * # StreamlistcontrollerCtrl
 * Controller of the troutDashApp
 */
angular.module('troutDashApp')
	.controller('StreamlistcontrollerCtrl', function ($scope, StreamApiService) {
		$scope.isSmallView = true;
	});
