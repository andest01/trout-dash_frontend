'use strict';

/**
 * @ngdoc function
 * @name troutDashApp.controller:StreamlistcontrollerCtrl
 * @description
 * # StreamlistcontrollerCtrl
 * Controller of the troutDashApp
 */
angular.module('troutDashApp')
	.controller('StreamlistcontrollerCtrl', function ($scope, StreamApiService, TableOfContentsRepository, RegionGeometryService) {
		$scope.isSmallView = true;

		var getInitialMapState = function() {
			var mapState = {
				isExpanded: false,
				isLoading: false,
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
			console.log(regionModel);
			// try to pull it from the cache
			var canRetrieveFromCache = false;
			if (canRetrieveFromCache) {
				// return it from our cache.
				return;
			}

			// load it from our repository.
			var stateModel = regionModel.parent;
			return RegionGeometryService.getRegion(stateModel, regionModel);
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
	});
