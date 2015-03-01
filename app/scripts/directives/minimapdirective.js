'use strict';

/**
 * @ngdoc directive
 * @name troutDashApp.directive:miniMapDirective
 * @description
 * # miniMapDirective
 */

var MINI_MAP_CLASS = '.js-mini-map';

angular.module('troutDashApp')
  .directive('miniMapDirective', function ($rootScope, GeometryApiService, StreamApiService, $q) {
    return {
      templateUrl: './views/minimaptemplate.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
      	scope.stage = {
        	isLoading: true,
        	regionGeometries: null,
        	selectedRegionId: null,
        	selectedCountyId: null
        };

        $rootScope.$on('header-clone', function(event, item) {
        	if (item == null) {
        		return;
        	}

        	if (item.RegionId != null) {
        		scope.stage.selectedRegionId = item.RegionId;
        		console.log('new region', scope.stage.selectedRegionId);
        	}

        	if (item.CountyId != null) {
        		scope.stage.selectedCountyId = item.CountyId;
        		console.log('new county', scope.stage.selectedCountyId);
        	}
        });

        var unwatchRegionId = scope.$watch(function() {
        		return scope.stage.selectedRegionId;
			}, function(newRegion, oldRegion) {
				if (newRegion == null) {
					return;
				}

				console.log('new region!', newRegion);
			});

        var unwatchCountyId = scope.$watch(function() {
        		return scope.stage.selectedCountyId;
			}, function(newCounty, oldCounty) {
				if (newCounty == null) {
					return;
				}

				console.log('new County!', newCounty);
			});

        var unwatchGeometries = scope.$watch(function() {
        		return scope.stage.regionGeometries;
			}, function(newGeometries, oldGeometries) {
				if (newGeometries == null) {
					return;
				}

				console.log('new Geometries!', newGeometries);
				drawGeometries(newGeometries);
			});

        var drawGeometries = function(geometries) {
        	var root = d3.select(element[0]);
        	console.log(root);
        };

        var highlightCounty = function(countyId) {
        	console.log('highlight county');
        };

        var zoomToRegion = function(regionId) {
        	console.log('zoom to region');
        };

        var gettingGeometries = GeometryApiService.getRegionGeometries();
        var gettingRegionData = StreamApiService.getRegions();

        $q.all([gettingGeometries, gettingRegionData])
        	.then(function(results) {
        		console.log('done');

        		var geometries = results[0];
        		var regions = results[1];

        		scope.stage.regionGeometries = geometries;
        		if (scope.stage.selectedRegionId == null) {
        			scope.stage.selectedRegionId = regions[0].RegionId;
        			scope.stage.selectedCountyId = regions[0].Counties[0].CountyId;
        		}

        		scope.stage.isLoading = false;
        	});

        scope.$on('$destroy', function() {
        	unwatchRegionId();
        	unwatchCountyId();
        });
      }
    };
  });
