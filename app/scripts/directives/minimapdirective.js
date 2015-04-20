'use strict';

/**
 * @ngdoc directive
 * @name troutDashApp.directive:miniMapDirective
 * @description
 * # miniMapDirective
 */

var MINI_MAP_CLASS = '.js-mini-map';

angular.module('troutDashApp')
  .directive('miniMapDirective', function ($rootScope, GeometryApiService, $q) {
    return {
      templateUrl: './views/minimaptemplate.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
      	scope.minimapState = {
        	isLoading: true,
        	regionGeometries: null,
        	selectedRegionId: null,
        	selectedCountyId: null,
            width: 200,
            height: 200,
            isMacro: false,

            loadingRegion: d3.select(null)
        };

        scope.active = d3.select(null);
        scope.selectedCounty = d3.select(null);

        $rootScope.$on('county-select', function(event, item) {
            console.log(item);
            
        });

        $rootScope.$on('header-clone', function(event, item) {
        	if (item == null) {
        		return;
        	}

            console.log(item);

        	if (item.RegionId != null) {
        		scope.minimapState.selectedRegionId = item.RegionId;
                scope.$apply();
        		console.log('new region', scope.minimapState.selectedRegionId);
        	}

        	if (item.CountyName != null) {
        		scope.minimapState.selectedCountyId = item.CountyName;
                scope.$apply();
        		console.log('new county', scope.minimapState.selectedCountyId);
        	}
        });

        var unwatchRegionId = scope.$watch(function() {
        		return scope.minimapState.selectedRegionId;
			}, function(newRegion, oldRegion) {
				if (newRegion == null) {
					return;
				}

				console.log('new region!', newRegion);
                var soughtRegion = scope.currentRegions.features.filter(function(f) {
                    return f.properties.gid === newRegion;
                });

                if (soughtRegion.length > 0 && newRegion !== oldRegion) {
                    zoomToGeometry(soughtRegion[0]);
                }

			});

        var unwatchCountyId = scope.$watch(function() {
        		return scope.minimapState.selectedCountyId;
			}, function(newCounty, oldCounty) {
				if (newCounty == null) {
					return;
				}

				console.log('new County!', newCounty);
                var soughtRegion = scope.currentCounties.features.filter(function(f) {
                    return f.properties.name === newCounty;
                });
                if (soughtRegion.length > 0 && newCounty !== oldCounty) {
                    selectCounty(soughtRegion[0]);
                }
			});

        var unwatchGeometries = scope.$watch(function() {
        		return scope.minimapState.regionGeometries;
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

        // var gettingGeometries = GeometryApiService.getRegionGeometries();
        // var gettingRegionData = StreamApiService.getRegions();

        // This function takes geometry and will create a geometry and path
        // function that are centred on this geometry.
        var initializeMap = function(stateObject) {
            // initialize a unit projection.
            scope.projection = d3.geo.mercator()
                .scale(1)
                .translate([0, 0]);

            // Create a path generator.
            scope.path = d3.geo.path()
                .projection(scope.projection)
                .pointRadius(0.1);

            var state = stateObject.geometry;

            // Compute the bounds of a feature of interest, then derive scale & translate.
            var b = scope.path.bounds(state),
                s = 0.95 / Math.max((b[1][0] - b[0][0]) / scope.minimapState.width, (b[1][1] - b[0][1]) / scope.minimapState.height),
                t = [(scope.minimapState.width - s * (b[1][0] + b[0][0])) / 2, (scope.minimapState.height - s * (b[1][1] + b[0][1])) / 2];

            // Update the projection to use computed scale & translate.
            scope.projection
                .scale(s)
                .translate(t);

            scope.zoom = d3.behavior.zoom()
                .translate([0,0])
                .scale(1)
                .scaleExtent([1, 8])
                .on('zoom', zoomed);

            scope.svg = d3.select(element[0]).select(MINI_MAP_CLASS)
                .append('svg')
                .attr('viewBox', '0 0 ' + scope.minimapState.width + ' ' + scope.minimapState.height)
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr('class', 'minimap-root')
                .on('click', stopped, true);

            scope.root = scope.svg.append('g')
                .attr('class', 'minimap-geography');

            scope.root.append('rect')
                .attr('class', 'minimap-geography_background')
                .attr('width', '100%')
                .attr('height', '100%')
                .on('click', onBackgroundClick);

            scope.counties = scope.root.append('g')
                .attr('class', 'minimap-geography minimap-geogrpahy_counties');

            scope.states = scope.root.append('g')
                .attr('class', 'minimap-geography minimap-geogrpahy_states');

            scope.streams = scope.root.append('g')
                .attr('class', 'minimap-geography minimap-geogrpahy_streams');

            scope.regions = scope.root.append('g')
                .attr('class', 'minimap-geography minimap-geogrpahy_regions');  
        };

        var onRegionClick = function(region, regionId) {
            var isMacro = scope.minimapState.isMacro;
            if (isMacro) {
                // assume selection has occured.

                // set loading state on region.
                scope.selectRegion(region)
                    .then(function(geometry) {
                        // set controller's state
                        scope.mapState.selectedRegion = geometry;
                    });

                // TODO: remove the minification.
                minifyMinimap();
                
            } else {
                macrofyMinimap();
            }

            scope.$apply();
        };

        var onBackgroundClick = function() {
            var isMacroMode = scope.minimapState.isMacro;
            console.log(isMacroMode);
            if (isMacroMode) {
                // TODO: reset state
                // TODO: set to minify

                minifyMinimap();
                
            } else {
                // TODO: set state to outer.
                macrofyMinimap();

            }
            scope.$apply();
        };

        var minifyMinimap = function() {
            scope.minimapState.isMacro = false;
        };

        var macrofyMinimap = function() {
            scope.minimapState.isMacro = true;
        };

        var drawGeometryToMap = function(states, regions, counties) {
            // scope.countiesGroup = scope.counties;
            scope.counties.selectAll('path.minimap-geography_county')
              .data(counties, function(d) {
                return d.id;
              })
            .enter().append('path')
              .attr('d', function(d) { return scope.path(d.geometry); })
              .attr('data-id', function(d) {
                return getFipsCodeSelector(d);
              })
              .attr('class', 'minimap-geography_county')
              .style({'fill': function(d) {
                var count = d.stream_count;
                if (count === 0) {
                    return 'none';
                }
                var color = scope.countyChoroplethScale(count);
                return ''+ color;
              }});

            // scope.regionsGroup = scope.g.append('g').attr('class', 'regions');
            scope.regions.selectAll('path.minimap-geogrpahy_region') 
              .data(regions, function(d) {
                return d.id;
              })
            .enter().append('path')
              .attr('d', function(d) {
                return scope.path(d.geometry);
                })
              .attr('class', 'minimap-geogrpahy_region')
              .attr('data-id', function(d) {
                return d.id;
              })
              .attr('data-name', function(d) {
                return d.shortName;
              })
              .on('click', onRegionClick);
        };

        function reset() {
            console.log('reset!');

            scope.active.classed('active', false);
            scope.active = d3.select(null);

            scope.svg.transition()
                .duration(750)
                .call(scope.zoom.translate([0, 0]).scale(1).event);
        }

        function zoomed() {
          scope.root.style('stroke-width', 1.5 / d3.event.scale + 'px');
          scope.root.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
        }

        function zoomToGeometry(d) {
            console.log(d);
            if (scope.active.node() === this) return reset();
            scope.active.classed('active', false);
            scope.active = d3.select(this).classed('active', true);

            var bounds = scope.path.bounds(d),
                dx = bounds[1][0] - bounds[0][0],
                dy = bounds[1][1] - bounds[0][1],
                x = (bounds[0][0] + bounds[1][0]) / 2,
                y = (bounds[0][1] + bounds[1][1]) / 2,
                scale = 0.95 / Math.max(dx / scope.minimapState.width, dy / scope.minimapState.height),
                translate = [scope.minimapState.width / 2 - scale * x, scope.minimapState.height / 2 - scale * y];

            scope.svg.transition()
                .duration(750)
                .call(scope.zoom.translate(translate).scale(scale).event);
        }

        function getFipsCode(countyFeature) {
            if (countyFeature == null) {
                return '';
            }

            var fips = countyFeature.statefp + countyFeature.countyfp;
            return fips;
        }

        function getFipsCodeSelector(countyFeature) {
            return 'county_' + getFipsCode(countyFeature);
        }

        function selectCounty(d) {
            console.log(d);
            var fips = getFipsCodeSelector(d);
            var attribute = '[data-id=' + fips + ']';
            var t = scope.countiesGroup.select(attribute).node();
            if (scope.selectedCounty.node() === t) {
                return;
            }

            scope.selectedCounty.classed('active', false);
            scope.selectedCounty = d3.select(t).classed('active', true);
        }

        function stopped() {
            if (d3.event.defaultPrevented) d3.event.stopPropagation();
        }

        scope.getTableOfContents()
            .then(function(toc) {
                console.log('minimap got toc');

                var states = _.map(toc);
                var regions = _(states)
                    .pluck('children')
                    .flatten()
                    .value();

                var counties = _(regions)
                    .pluck('children')
                    .flatten()
                    .value();

                scope.currentState = states[0];
                scope.currentCounties = counties;
                scope.currentRegions = regions;

                var minStreamCount = 0;
                var countyStreamCounts = scope.currentCounties.map(function(feat) {
                    return Math.max(0, feat.stream_count);
                });
                var maxStreamCount = d3.max(countyStreamCounts);

                scope.countyChoroplethScale = d3.scale.linear()
                    .domain([minStreamCount, maxStreamCount])
                    .range(['#FFFFBB', '#BB00CC']);


                scope.minimapState.isLoading = false;
                initializeMap(scope.currentState);
                drawGeometryToMap(states, regions, counties);

            });

        scope.$on('$destroy', function() {
        	unwatchRegionId();
        	unwatchCountyId();
            unwatchGeometries();
            unwatchTableOfContents();
        });
      }
    };
  });
