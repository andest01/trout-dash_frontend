'use strict';
/**
 * @ngdoc directive
 * @name troutDashApp.directive:StreamListDirective
 * @description
 * # StreamListDirective
 */
angular.module('troutDashApp')
  .directive('streamList', function (StreamApiService) {
    return {
    	templateUrl: '/views/streamlisttemplate.html',
      	restrict: 'A',
      	link: function postLink(scope, element, attrs) {
      		scope.stage = {
      			isLoaded: false,
      			streams: null,
      			selectedStream: null
      		};
	        StreamApiService.getStreams()
				.then(function(streams) {
					scope.stage.streams = streams;
				});

			scope.$watch('stage.streams', function(newStreams, oldStreams) {
				if (newStreams == null) {
					return;
				}


			});

			scope.$watch('stage.selectedStream', function(newSelectedStream, oldSelectedStream) {
				if (newSelectedStream == null) {
					return;
				}


			});
      	}
	};
});
