'use strict';

/**
 * @ngdoc service
 * @name troutDashApp.StreamRatioViewModel
 * @description
 * # StreamRatioViewModel
 * Factory in the troutDashApp.
 */
angular.module('troutDashApp')
  .factory('StreamRatioViewModel', function () {
        var StreamRatioViewModel = function(totalLength, publicLandLength) {
            this.totalLength = 0;
            this.publicLandLength = 0;
            this.init(totalLength, publicLandLength);
        };

        var proto = StreamRatioViewModel.prototype;

        proto.init = function(totalLength, publicLandLength) {
            if (totalLength == null || publicLandLength < 0) {
                throw new Error('totalLength cannot be null or less than 0');
            }

            if (publicLandLength == null || publicLandLength < 0) {
                throw new Error('publicLength cannot be null or less than 0');
            }

            if (publicLandLength > totalLength) {
                // clamp - technically this can be true, given the fact
                // that a stream can have easement and not be a trout stream section.
                // BUG: Currently we're computing how much is on trout streams.

                publicLandLength = totalLength;
            }

            this.totalLength = totalLength;
            this.publicLandLength = publicLandLength;

            var computeRadiusFromLength = function(length) {
                var area = Math.sqrt(length / Math.PI);
                return area;
            };

            this.waterRadius = computeRadiusFromLength(this.totalLength);
            // LIE about the width.
           	// use the diameter of the water ratio to determine how large
           	var publicLandLengthTOWaterLengthRatio = this.publicLandLength / this.totalLength;
            this.publicLandRadius = this.waterRadius * publicLandLengthTOWaterLengthRatio;
        };

        return StreamRatioViewModel;
  });
