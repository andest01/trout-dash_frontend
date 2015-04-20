'use strict';

var REGION_CACHE_KEY = 'region';
var createKey = function(stateId, regionId) {
	return REGION_CACHE_KEY + '_' + stateId + '_' + regionId;
};
/**
 * @ngdoc service
 * @name troutDashApp.RegionGeometryService
 * @description
 * # RegionGeometryService
 * Factory in the troutDashApp.
 */
angular.module('troutDashApp')
  .factory('RegionGeometryService', function (BaseApiService, RegionApiService, HierarchicalGeometryViewModel) {
    var RegionGeometryService = function () {
        BaseApiService.call(this);
    };

    var proto = RegionGeometryService.prototype = Object.create(BaseApiService.prototype);

    proto.getRegion = function(stateModel, regionModel) {
		if (stateModel == null || stateModel.shortName == null) {
			throw new Error('state cannot be null');
		}

		if (regionModel == null || regionModel.shortName == null) {
			throw new Error('region cannot be null');
		}

		var stateId = stateModel.shortName;
		var regionId = regionModel.shortName;
		var regionKey = createKey(stateId, regionId);

        if (this.cache.get(regionKey)) {
            console.log('found in cache');
            return this.cache.get(regionKey);
        }

		var promise = RegionApiService.getRegion(stateId, regionId)
			.then(function(geometry) {
				console.log('new geom', geometry);
				return geometry;
			});

        this.cache.put(regionKey, promise);
    	return promise;
	};

    RegionGeometryService.prototype = proto;
    return new RegionGeometryService();
  });
