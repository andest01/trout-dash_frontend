'use strict';

/**
 * @ngdoc service
 * @name troutDashApp.TableOfContentsRepository
 * @description
 * # TableOfContentsRepository
 * Factory in the troutDashApp.
 */
angular.module('troutDashApp')
  .factory('TableOfContentsRepository', function ($http, $cacheFactory, RegionGeometryService, HierarchicalGeometryViewModel) {
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
    				var regionTopoJson = response.data;
    				console.log('finished loading topojson');
	                var state = topojson.feature(regionTopoJson, regionTopoJson.objects.state);
                    var regions = topojson.feature(regionTopoJson, regionTopoJson.objects.region);
                    var counties = topojson.feature(regionTopoJson, regionTopoJson.objects.county);
                    var streams = topojson.feature(regionTopoJson, regionTopoJson.objects.streamProperties);

                    var stateHash = _(state.features)
                        .map(function(feature) {
                            var stateModel = new HierarchicalGeometryViewModel();
                            var prop = feature.properties;
                            stateModel.id = prop.gid;
                            stateModel.name = prop.name;
                            stateModel.centroidLatitude = NaN;
                            stateModel.centroidLongitude = NaN;
                            stateModel.parent = null;
                            stateModel.type = 'state';
                            stateModel.children = [];
                            stateModel.geometry = feature;
                            return stateModel;})
                        .indexBy('id')
                        .value();

                    var regionHash = _(regions.features)
                        .map(function(feature) {
                            var regionModel = new HierarchicalGeometryViewModel();
                            regionModel.id = feature.properties.gid;
                            regionModel.name = feature.properties.name;
                            regionModel.geometry = feature;
                            regionModel.type = 'region';
                            return regionModel;})
                        .indexBy('id')
                        .value();
                    
                    var countyhash = _(counties.features)
                        .map(function(feature) {
                            var countyModel = new HierarchicalGeometryViewModel();
                            var properties = feature.properties;
                            countyModel.id = properties.gid;
                            countyModel.name = properties.name;
                            countyModel.geometry = feature;
                            _.extend(countyModel, properties);
                            countyModel.type = 'county';
                            return countyModel;})
                        .indexBy('id')
                        .value();

                    var countyByRegion = _(countyhash)
                        .groupBy('region_id')
                        .value();

                    // TODO: Fix this nonsense.
                    var minnesota = stateHash['49'];
                    var regionByState = _(regionHash)
                        .groupBy(function() {
                            return minnesota.id;})
                        .value();

                    var streamHash = _(streams.features)
                        .map(function(feature) {
                            var streamModel = new HierarchicalGeometryViewModel();
                            var properties = feature.properties;
                            streamModel.id = properties.Id;
                            streamModel.name = properties.Name;
                            streamModel.geometry = feature;
                            streamModel.centroidLongitude = properties.CentroidLongitude;
                            streamModel.centroidLatitude = properties.CentroidLatitude;
                            _.extend(streamModel, properties);
                            streamModel.type = 'streamCentroid';
                            return streamModel;})
                        .indexBy('id')
                        .value();

                    var streamHash = _(streams.features)
                        .map(function(feature) {
                            var streamModel = new HierarchicalGeometryViewModel();
                            var properties = feature.properties;
                            streamModel.id = properties.Id;
                            streamModel.name = properties.Name;
                            streamModel.geometry = feature;
                            streamModel.centroidLongitude = properties.CentroidLongitude;
                            streamModel.centroidLatitude = properties.CentroidLatitude;
                            _.extend(streamModel, properties);
                            streamModel.type = 'streamCentroid';
                            return streamModel;})
                        .indexBy('id')
                        .value();

                    _.forEach(stateHash, function(state) {
                        var stateId = state.id;
                        var regions = regionByState[stateId];
                        console.log('new regions', regions);
                        state.children = regions;
                        console.log(state.children);
                        // _(regions).forEach(function(r) { r.parent = state; });
                        _.forEach(state.children, function(region) {
                            var regionId = region.id;
                            var counties = countyByRegion[regionId];
                            region.children = counties;
                            region.parent = state;
                            _.forEach(region.children, function(c) { c.parent = region; });
                        });
                    });

                    // now we have to get the streams under the counties.
                    // we have to respect the Many to Many relationship.
                    _.forEach(streamHash, function(stream) {
                        console.log(stream);
                        _.forEach(stream.Counties, function(streamCountyModel) {
                            console.log(stream, streamCountyModel);
                            var countyModel = countyhash[streamCountyModel.Id];
                            countyModel.children.push(stream);
                            // what to do about the parent tho?
                        });
                    });

                    debugger;
    			});
    	},

    	resetCache: function() {
    		globalCache.removeAll();
    	}
    };

    TableOfContentsRepository.prototype = proto;
    return new TableOfContentsRepository();
  });
