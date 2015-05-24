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

	       //  StreamApiService.getRegions()
    				// .then(function(regions) {

    				// 	scope.stage.regions = regions;
    				// });

      scope.getCountyScrollBodyId = function(county) {
          var result = '#' + scope.getCountyId(county);
          console.log(result);
          return result;
          // return '';
      };

      scope.getCountyId = function(county) {
        // console.log(county);
        return 'county_' + county.id;
      // return '';
      };

      scope.getRegionScrollBodyId = function(region) {
          var result = '#' + scope.getRegionId(region);
          console.log(result);
          return result;
      };

      scope.getRegionId = function(region) {
        var result = 'region_' + region.id;
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
