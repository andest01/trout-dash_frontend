'use strict';

/**
 * @ngdoc service
 * @name troutDashApp.GeometryApiService
 * @description
 * # GeometryApiService
 * Factory in the troutDashApp.
 */
angular.module('troutDashApp')
  .factory('GeometryApiService', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
