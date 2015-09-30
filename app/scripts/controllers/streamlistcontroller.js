'use strict';

/**
 * @ngdoc function
 * @name troutDashApp.controller:StreamlistcontrollerCtrl
 * @description
 * # StreamlistcontrollerCtrl
 * Controller of the troutDashApp
 */
angular.module('troutDashApp')
	.controller('StreamlistcontrollerCtrl', ['$scope', 'StreamApiService', 
		'TableOfContentsRepository', 'RegionGeometryService', 
		'$anchorScroll',
		function ($scope, StreamApiService, TableOfContentsRepository, RegionGeometryService, $anchorScroll) {
		$scope.isSmallView = true;

		var getInitialMapState = function() {
			var mapState = {
				isExpanded: false,
				isLoading: false,
				selectedRegionGeometry: null,
				selectedRegion: null,
				selectedCounty: null,
				highlightedStream: null,
				currentClientCoordinates: [NaN, NaN]
			};
			return mapState;
		};

		$scope.mapState = getInitialMapState();

		$scope.selectCounty = function(countyId) {
			console.log(countyId);
		};

		$scope.selectRegion = function(regionModel) {
			if (regionModel == null) {
				throw new Error('regionModel cannot be null');
			}

			

			// TODO: fix this to have an actual cache.
			// try to pull it from the cache
			var canRetrieveFromCache = false;
			if (canRetrieveFromCache) {
				// return it from our cache.
				// TODO: fix this part too
				$scope.mapState.selectedRegionGeometry = null;
				$scope.mapState.selectedRegion = [regionModel];
				return;
			}

			// load it from our repository.
			var stateModel = regionModel.parent;
			return RegionGeometryService.getRegion(stateModel, regionModel)
				.then(function(newSelectedRegionGeometry) {
					$scope.mapState.selectedRegionGeometry = [newSelectedRegionGeometry];
					$scope.mapState.selectedRegion = [regionModel];
					// just scroll all the way to the top on region changes.
					// $anchorScroll('top');
					return newSelectedRegionGeometry;
				});
		};

		$scope.getTableOfContents = function() {
			return TableOfContentsRepository.getTableOfContents()
				.then(function(toc) {
					return toc;
				});
		};

		$scope.bustCache = function() {
			console.log('busting cache...');
			// this is actually going directly to the base cache...
			TableOfContentsRepository.bustTableOfContentsCache();
		};

		$scope.toggleMinimap = function() {
			if ($scope.mapState == null) {
				return;
			}

			$scope.mapState.isExpanded = !$scope.mapState.isExpanded;
		};
	}]);
