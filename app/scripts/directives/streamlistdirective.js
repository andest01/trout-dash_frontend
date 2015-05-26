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
    	templateUrl: './views/streamlisttemplate.html',
      	restrict: 'A',
      	link: function postLink(scope, element, attrs) {
      		scope.stage = {
      			isLoaded: false,
      			streams: null,
      			selectedStream: null
      		};

      scope.getCountyScrollBodyId = function(county) {
          var result = '#' + scope.getCountyId(county);
          return result;
          // return '';
      };

      scope.getScrollContainer = function() {
        return '#js-list-container';
      };

      scope.getCountyId = function(county) {
        return 'hdr-county_' + county.id;
      // return '';
      };

      scope.getRegionScrollBodyId = function(region) {
          var result = '#' + scope.getRegionId(region);
          return result;
      };

      scope.getRegionId = function(region) {
        var result = 'hdr-region_' + region.id;
        return result;
      };

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
