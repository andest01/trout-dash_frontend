'use strict';

/**
 * @ngdoc directive
 * @name troutDashApp.directive:MiniMapTestHarnessDirective
 * @description
 * # MiniMapTestHarnessDirective
 */
angular.module('troutDashApp')
  .directive('miniMapTestHarnessDirective', function () {
    return {
      templateUrl: './views/minimaptestharnesstemplate.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        console.log('test harness');
        scope.onLoadTocClick = function() {
        	scope.getTableOfContents()
                .then(function(toc) {
                    scope.regions = _.values(toc)[0].children;
                });
        };

        scope.onToggleClick = function() {
        	console.log('onToggleClick');
        };

        scope.onLoadRegionGeometriesClick = function(regionModel) {
          console.log('click');
        	scope.selectRegion(regionModel);
        };

        scope.onZoomClick = function() {
        	console.log('onZoomClick');
        };
      }
    };
  });
