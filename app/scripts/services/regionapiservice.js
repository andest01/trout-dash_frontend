'use strict';
var createPath = function(stateId, regionId) {
	return stateId + '/' + regionId + '.topo.json';
};
/**
 * @ngdoc service
 * @name troutDashApp.RegionApiService
 * @description
 * # RegionApiService
 * Factory in the troutDashApp.
 */
angular.module('troutDashApp')
  .factory('RegionApiService', function (BaseApiService) {
    var RegionApiService = function () {
        BaseApiService.call(this);
        this.logCache();
    };

    var proto = RegionApiService.prototype = Object.create(BaseApiService.prototype);

    proto.getRegion = function(stateId, regionId) {
    	if (stateId == null) {
			throw new Error('stateId cannot be null');
		}

		if (regionId == null) {
			throw new Error('regionId cannot be null');
		}

		var path = createPath(stateId, regionId);
        return this.doCall({}, '/data/' + path);
    };

    RegionApiService.prototype = proto;
    return new RegionApiService();
  });
