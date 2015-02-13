'use strict';

/**
 * @ngdoc directive
 * @name troutDashApp.directive:streamLine
 * @description
 * # streamLine
 */
angular.module('troutDashApp')
	.directive('streamLine', function (LinearReferenceViewModel) {
	return {
		templateUrl: '/views/streamlinetemplate.html',
		restrict: 'A',
		link: function (scope, element, attrs) {
			var length = parseFloat(scope.stream.LengthMiles);
			if (length <= 0) {
				return;
			}

			var inverseLength = 1/length;

            // console.log(scope.stream);
			scope.stage = {
				width: 292
			};

			scope.streamLine = d3.select(element[0])
                .append('svg')
                .attr('class', 'stream-line')
                .attr('width', scope.stage.width)
                .attr('height', 16)
                .attr('xmlns', 'http://www.w3.org/2000/svg');

            // PUBLIC LAND
            // Prepare
            scope.publicSegments = scope.stream.Pal.Sections.map(function(segment) {
                return new LinearReferenceViewModel(segment, inverseLength);
            });

            // Stage
            scope.streamLine.publicLand = scope.streamLine.append('g')
                .attr('class', 'stream-line_public-land');

            // Execute
            scope.streamLine.publicLand.selectAll('rect')
                    .data(scope.publicSegments).enter()
                    .append('rect')
                    .attr('x', function(d) {
                        return d.xOffset * scope.stage.width;
                    })
                    .attr('y', 0)
                    .attr('width', function(d) {
                        return d.width * scope.stage.width;
                    })
                    .attr('height', 11)
                    .attr('rx', 4)
                    .attr('ry', 4)
                    .attr('class', 'public-land');


            // STREAM LINE
            scope.streamLine.stream = scope.streamLine.append('g')
	            .attr('class', 'stream-line_stream')
	            .append('rect')
	            .attr('x', 0)
	            .attr('y', 3)
	            .attr('height', 5)
	            .attr('width', scope.stage.width);

	        // LAKES
            // Prepare
            scope.lakes = scope.stream.Lakes.Sections.map(function(segment) {
                return new LinearReferenceViewModel(segment, inverseLength);
            });

            // Stage
            scope.streamLine.lakes = scope.streamLine.append('g')
                .attr('class', 'stream-line_stream'); // TODO: CHANGE TO LAKE CLASS

            // Execute
            scope.streamLine.lakes.selectAll('rect')
                    .data(scope.lakes).enter()
                    .append('rect')
                    .attr('x', function(d) {
                        return d.xOffset * scope.stage.width;
                    })
                    .attr('y', 1)
                    .attr('width', function(d) {
                        return d.width * scope.stage.width;
                    })
                    .attr('height', 9)
                    .attr('rx', 4)
                    .attr('ry', 4)
                    .attr('class', 'stream-line_stream');

            





            // TROUT STREAM SECTIONS
            scope.publicSegments = scope.stream.TroutStreams.Sections.map(function(segment) {
                return new LinearReferenceViewModel(segment, inverseLength);
            });

            // Stage
            scope.streamLine.troutStreamSections = scope.streamLine.append('g')
                .attr('class', 'stream-line_route');

            // Execute
            scope.streamLine.append('g')
                    .attr('class', 'stream-line_route')
                    .selectAll('g').data(scope.publicSegments).enter()
                    .append('g')
                    .append('rect')
                    .attr('x', function(d) { 
                        return d.xOffset * scope.stage.width;})
                    .attr('y', 3)
                    .attr('width', function(d) { 
                        return d.width * scope.stage.width;})
                    .attr('height', 5)
                    .attr('class', 'stream-line_route');

                        // RESTRICTIONS
            scope.stream.Restrictions.forEach(function(restriction, index) {

                var restrictionModels = restriction.Sections.map(function(segment) {
                    var linearReferenceViewModel = new LinearReferenceViewModel(segment, inverseLength);
                    segment.segment = linearReferenceViewModel;
                    return segment;
                });

                scope.streamLine.append('g')
                    .attr('class', index === 0 
                            ? 'stream-line_restriction' 
                            : 'stream-line_restriction_secondary')
                    .selectAll('g').data(restrictionModels).enter()
                    .append('g')
                    // .selectAll('rect').data(function(d) {
                    //     return d.segment;
                    // }).enter()
                    .append('rect')
                    .attr('x', function(d) { 
                        return d.segment.xOffset * scope.stage.width;})
                    .attr('y', 3)
                    .attr('width', function(d) { 
                        return d.segment.width * scope.stage.width;})
                    .attr('height', 5)
                    .attr('class', 'restriction');
            });

            
            var createTickMarks = function(LengthMiles) {
			    var clampedLength = Math.floor(length);
			    var tickMarks = [];
			    if (clampedLength < 1) {
			        tickMarks.push({
			                xOffset: 0,
			                width: 1,
			                height: 3,
			                yOffset: 7
			            });

			        return tickMarks;
			    }

			    var tickWidth = scope.stage.width / LengthMiles;
			    for (var i = 0; i <= clampedLength; i++) {
			        tickMarks.push({
			                xOffset: i * tickWidth,
			                width: 1.5,   
			                height: 4,
			                yOffset: 8
			            }
			        );
			    }
			    
			    return tickMarks;
			};

			var tickMarks = createTickMarks(length);
            var firstMark = tickMarks[0];

            firstMark.width = 1;
            firstMark.height = 3;
            scope.streamLine.tickMarks = scope.streamLine
                .append('g')
                .attr('class', 'stream-line_grid-lines')
                .selectAll('rect').data(tickMarks).enter()
                .append('rect')
                .attr('x', function(d) { return d.xOffset;})
                .attr('y', function(d) { return d.yOffset;})
                .attr('width', function(d) {return d.width;})
                .attr('height', function(d) { return d.height;})
                .attr('class', 'tick');


            scope.getCounties = function() {
                if (!scope.stream.Counties) {
                    return null;
                }

                return scope.stream.Counties.join(',');
            };
		}
	};
});
