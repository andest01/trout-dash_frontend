'use strict';

/**
 * @ngdoc service
 * @name troutDashApp.LinearReferenceViewModel
 * @description
 * # LinearReferenceViewModel
 * Factory in the troutDashApp.
 */
angular.module('troutDashApp')
  .factory('LinearReferenceViewModel', function () {
    var StreamLineViewModel = function (lineSegment, inverseLength) {
        this.lineSegment = null;
        this.xOffset = 0.0;
        this.width = 0.0;
        this.init(lineSegment, inverseLength);
    };

    StreamLineViewModel.prototype.init = function(lineSegment, inverseLength) {
      this.lineSegment = lineSegment;
      var stop = lineSegment.Stop * inverseLength;
      var start = lineSegment.Start * inverseLength;
      this.xOffset = 1.0 - stop;
      this.width = Math.abs(stop - start);
    };

    return StreamLineViewModel;
  });
