'use strict';

/**
 * @ngdoc directive
 * @name troutDashApp.directive:miniMapDirective
 * @description
 * # miniMapDirective
 */

var MINI_MAP_CLASS = '.js-mini-map';

angular.module('troutDashApp')
    .directive('miniMapDirective', [
        '$rootScope', 'GeometryApiService', '$q', '$timeout',
        function($rootScope, GeometryApiService, $q, $timeout) {
            return {
                templateUrl: './views/minimaptemplate.html',
                restrict: 'A',
                link: function postLink(scope, element, attrs) {
                    scope.minimapState = {
                        isLoading: true,
                        regionGeometries: null,
                        selectedRegionId: null,
                        selectedCountyId: null,
                        width: 45,
                        height: 45,
                        isMacro: true,

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

                        if (item.type === 'region') {
                            $timeout(function() {
                                scope.minimapState.selectedRegionId = item.id;
                                scope.$apply();
                            });
                        }

                        if (item.type === 'county') {
                            $timeout(function() {
                                scope.minimapState.selectedCountyId = item.name;
                                scope.$apply();
                            });
                        }
                    });

                    var unwatchRegionId = scope.$watch(function() {
                        return scope.minimapState.selectedRegionId;
                    }, function(newRegionId, oldRegionId) {
                        if (newRegionId == null) {
                            return;
                        }

                        if (newRegionId === oldRegionId) {
                            return;
                        }
                        // console.log('new region!', newRegionId);

                        var soughtRegion = scope.currentRegions.filter(function(f) {
                            return f.id === newRegionId;
                        });

                        if (soughtRegion.length > 0 && newRegionId !== oldRegionId) {
                            zoomToGeometry(soughtRegion[0]);
                        }

                    });

                    var unwatchCountyId = scope.$watch(function() {
                        return scope.minimapState.selectedCountyId;
                    }, function(newCounty, oldCounty) {
                        if (newCounty == null) {
                            return;
                        }

                        // console.log('new County!', newCounty);
                        var soughtCounty = scope.currentCounties.filter(function(f) {
                            return f.name === newCounty;
                        });
                        if (soughtCounty.length > 0 && newCounty !== oldCounty) {
                            selectCounty(soughtCounty[0]);
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
                        scope.projection = d3.geo.albersUsa()
                            .scale(1)
                            .translate([0, 0]);

                        // Create a path generator.
                        scope.path = d3.geo.path()
                            .projection(scope.projection)
                            .pointRadius(0.15);

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
                            .translate([0, 0])
                            .scale(1)
                            .scaleExtent([1, 8])
                            .size([40, 40])
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
                            onLoadRegion.bind(this)(region);
                            scope.minimapState.selectedRegionId = region.id;
                            scope.selectRegion(region)
                                .then(function(geometry) {
                                    $timeout(function() {

                                        resetLoadRegion();
                                        // set controller's state
                                        $timeout(minifyMinimap, 500);
                                    }, 1000);

                                });

                            // TODO: remove the minification.
                        } else {
                            macrofyMinimap();
                        }

                        $timeout(function() {
                            scope.$apply();
                        });
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

                        $timeout(function() {
                            scope.$apply();
                        });

                    };

                    var minifyMinimap = function() {
                        scope.minimapState.isMacro = false;
                    };

                    var macrofyMinimap = function() {
                        scope.minimapState.isMacro = true;
                        reset();
                    };

                    var drawGeometryToMap = function(states, regions, counties) {
                        // scope.countiesGroup = scope.counties;
                        // scope.counties.selectAll('path.minimap-geography_county')
                        //     .data(counties, function(d) {
                        //         return d.id;
                        //     })
                        //     .enter().append('path')
                        //     .attr('d', function(d) {
                        //         return scope.path(d.geometry);
                        //     })
                        //     .attr('data-id', function(d) {
                        //         return getFipsCodeSelector(d);
                        //     })
                        //     .attr('class', 'minimap-geography_county');

                        scope.regions.selectAll('path.minimap-geogrpahy_region')
                            .data(regions, function(d) {
                                return d.id;
                            })
                            .enter().append('path')

                        .attr('class', 'minimap-geogrpahy_region')
                            .attr('opacity','0.0')
                            .attr('data-id', function(d) {
                                return d.id;
                            })
                            .attr('id', function(d) {
                                return 'region_' + d.id;
                            })
                            .attr('data-name', function(d) {
                                return d.shortName;
                            })
                            .attr('d', function(d) {
                                return scope.path(d.geometry);
                            })
                            .on('click', onRegionClick)
                            .transition()
                            .attr('opacity','1.0')
                            .duration(600)
                            .delay(function(d, i) {
                                return 100 + (i * 200);
                            });
                    };

                    function reset() {
                        console.log('reset!');

                        scope.active.classed('active', false);
                        scope.active = d3.select(null);

                        scope.svg.transition()
                            .duration(300)
                            .call(scope.zoom.translate([0, 0]).scale(1).event);
                    }

                    function zoomed() {
                        scope.root.style('stroke-width', 1.5 / d3.event.scale + 'px');
                        scope.root.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
                    }

                    function onLoadRegion(regionElement) {
                        resetLoadRegion();
                        scope.minimapState.loadingRegion = d3.select(this).classed('minimap-geogrpahy_region_loading', true);
                        // show streams.
                        var arrayOfStreams = regionElement.children.map(function(county) {
                            return county.children;
                        });

                        var selectedStreams = _.unique(_.flatten(arrayOfStreams), 'Id');


                        var streamObjects = scope.streams.selectAll('path.minimap-geography_stream')
                            .data(selectedStreams, function(d) {
                                return d.Id;
                            });
                        // streamObjects.enter()
                        //     .append('path')
                        //     .attr('class', 'minimap-geography_stream')
                        //     .attr('data-id', function(d) {
                        //         return d.id;
                        //     })
                        //     .attr('id', function(d) {
                        //         return 'streamPoint_' + d.id;
                        //     })
                        //     .attr('data-name', function(d) {
                        //         return d.name;
                        //     })
                        //     .attr('d', function(d) {
                        //         return scope.path(d.geometry);
                        //     })
                        //     .style('opacity', 0)
                        //     .transition()
                        //     .delay(300)
                        //     .duration(750)
                        //     .style('opacity', 0.8);

                        // streamObjects.exit()
                        //     .transition()
                        //     .duration(100)
                        //     .style('opacity', 0)
                        //     .remove();

                    }

                    function resetLoadRegion() {
                        if (scope.minimapState.loadingRegion == null) {
                            return;
                        }

                        scope.minimapState.loadingRegion.classed('minimap-geogrpahy_region_loading', false);
                        scope.minimapState.loadingRegion = d3.select(null);
                    }

                    function zoomToGeometry(d) {
                        if (scope.active.node() === this) return reset();
                        scope.active.classed('active', false);
                        scope.active = d3.select(this).classed('active', true);

                        var bounds = scope.path.bounds(d.geometry),
                            dx = bounds[1][0] - bounds[0][0],
                            dy = bounds[1][1] - bounds[0][1],
                            x = (bounds[0][0] + bounds[1][0]) / 2,
                            y = (bounds[0][1] + bounds[1][1]) / 2,
                            scale = 0.95 / Math.max(dx / scope.minimapState.width, dy / scope.minimapState.height),
                            translate = [scope.minimapState.width / 2 - scale * x, scope.minimapState.height / 2 - scale * y];

                        scope.svg.transition()
                            .delay(200)
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
                        var fips = getFipsCodeSelector(d);
                        var attribute = '[data-id=' + fips + ']';
                        var t = scope.counties.select(attribute).node();
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
        }
    ]);