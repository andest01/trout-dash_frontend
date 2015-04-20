'use strict';

/**
 * @ngdoc service
 * @name troutDashApp.RegionRepositoryService
 * @description
 * # RegionRepositoryService
 * Factory in the troutDashApp.
 */
angular.module('troutDashApp')
  .factory('RegionRepositoryService', function (RegionGeometryService, TableOfContentsRepository, $q) {
    var RegionRepositoryService = function () {
        
    };

    var proto = {
    	getRegions: function() {
    		return TableOfContentsRepository.getTableOfContents()
    			.then(function(states) {
    				console.log('got em');
    			});
    	},

    	isCached: function(regionid) {
            return false;
    	},

    	cacheRegion: function(regionId) {
            return true;
    	},

    	uncacheRegion: function(regionId) {
            return true;
    	},

        getRegion: function(regionId) {
            if (this.isCached()) {
                // todo this
            }

            
        }
    };

    RegionRepositoryService.prototype = proto;
    return new RegionRepositoryService();
  });
