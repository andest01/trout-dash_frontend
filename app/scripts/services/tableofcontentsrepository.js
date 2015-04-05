'use strict';

/**
 * @ngdoc service
 * @name troutDashApp.TableOfContentsRepository
 * @description
 * # TableOfContentsRepository
 * Factory in the troutDashApp.
 */
angular.module('troutDashApp')
  .factory('TableOfContentsRepository', function ($http, $cacheFactory, RegionGeometryService) {
  	var globalCache = $cacheFactory('tm');

    var TableOfContentsRepository = function () {
        this.cache = globalCache;
        var info = this.cache.info();
        console.log(info);
    };

    var proto = {
    	getTableOfContents: function() {
    		var key = 'tableOfContents';
    		if (this.cache.get(key)) {
    			console.log('found in cache');
    			return this.cache.get(key);
    		}

    		console.log('loading table of contents from network');
    		$http.get('/data/state.topo.json')
    			.then(function(response) {
    				debugger;
    				var regionTopoJson = response.data;
    				console.log('finished loading topojson');
	                var state = topojson.feature(regionTopoJson, regionTopoJson.objects.state);
	                var counties = topojson.feature(regionTopoJson, regionTopoJson.objects.county);
	                var regions = topojson.feature(regionTopoJson, regionTopoJson.objects.region);
	                var properties = topojson.feature(regionTopoJson, regionTopoJson.objects.streamProperties);
    			});

    	},

    	resetCache: function() {
    		globalCache.removeAll();
    	}
    };

    TableOfContentsRepository.prototype = proto;
    return new TableOfContentsRepository();
  });
