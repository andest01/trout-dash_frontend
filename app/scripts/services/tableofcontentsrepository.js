'use strict';

var TABLE_OF_CONTENTS_CACHE_KEY = 'tableOfContents';
var COUNTIES_CACHE_KEY = 'counties';
var REGIONS_CACHE_KEY = 'regions';

/**
 * @ngdoc service
 * @name troutDashApp.TableOfContentsRepository
 * @description
 * # TableOfContentsRepository
 * Factory in the troutDashApp.
 */
angular.module('troutDashApp')
  .factory('TableOfContentsRepository', ['BaseApiService', 'RegionGeometryService', 'HierarchicalGeometryViewModel',
    function (BaseApiService, RegionGeometryService, HierarchicalGeometryViewModel) {

    var TableOfContentsRepository = function () {
        BaseApiService.call(this);
        this.logCache();
    };

    var proto = TableOfContentsRepository.prototype = Object.create(BaseApiService.prototype);

    proto.bustTableOfContentsCache = function() {
        var key = TABLE_OF_CONTENTS_CACHE_KEY;
        this.cache.remove(TABLE_OF_CONTENTS_CACHE_KEY);
    };

    proto.getTableOfContents = function() {
		var key = TABLE_OF_CONTENTS_CACHE_KEY;
        if (this.cache.get(key)) {
            console.log('found in cache');
            return this.cache.get(key);
        }

		var promise = this.doCall({}, '/data/tableOfContents.topo.json')
			.then(function(regionTopoJson) {
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
                        stateModel.shortName = prop.short_name;
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
                        regionModel.shortName = feature.properties.name;
                        regionModel.id = feature.properties.gid;
                        regionModel.name = feature.properties.name;
                        regionModel.geometry = feature;
                        regionModel.type = 'region';
                        return regionModel;})
                    .sortBy('name')
                    .indexBy('id')
                    .value();
                
                var countyhash = _(counties.features)
                    .filter(function(feature) {
                        return feature.properties.stream_count > 0;
                    })
                    .map(function(feature) {
                        var countyModel = new HierarchicalGeometryViewModel();
                        var properties = feature.properties;
                        countyModel.id = properties.gid;
                        countyModel.name = properties.name;
                        countyModel.geometry = feature;
                        _.extend(countyModel, properties);
                        countyModel.type = 'county';
                        return countyModel;})
                    .sortBy('name')
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
                        console.table(streamModel.AccessPoints);
                        streamModel.type = 'streamCentroid';
                        return streamModel;})
                    .sortBy('name')
                    .indexBy('id')
                    .value();

                _.forEach(stateHash, function(state) {
                    var stateId = state.id;
                    var regions = regionByState[stateId];
                    state.children = regions;
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
                    _.forEach(stream.Counties, function(streamCountyModel) {
                        var countyModel = countyhash[streamCountyModel.Id];
                        countyModel.children.push(stream);
                        // what to do about the parent tho?
                    });
                });

                this.logCache();
                return stateHash;

			}.bind(this));
        this.cache.put(key, promise);
        return promise;
    };

    TableOfContentsRepository.prototype = proto;
    return new TableOfContentsRepository();
  }]);
