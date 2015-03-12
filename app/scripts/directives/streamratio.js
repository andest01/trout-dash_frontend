'use strict';

/**
 * @ngdoc directive
 * @name troutDashApp.directive:streamRatio
 * @description
 * # streamRatio
 */
angular.module('troutDashApp')
  .directive('streamRatio', function (StreamRatioViewModel) {
    return {
      templateUrl: './views/streamratiotemplate.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var model = new StreamRatioViewModel(scope.stream.TroutStreamsLength, scope.stream.PalsLength);
        scope.streamRatio = model;
      }
    };
  });
