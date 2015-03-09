'use strict';

/**
 * @ngdoc service
 * @name troutDashApp.GeometryApiService
 * @description
 * # GeometryApiService
 * Factory in the troutDashApp.
 */
angular.module('troutDashApp')
  .factory('GeometryApiService', function ($rootScope, $cacheFactory, $http, $q) {
    function GeometryApiService() {

    }

    GeometryApiService.prototype = {
      getRegionGeometries: function() {
        return $http.get('/data/regionGeometry.json')
          .then(function(response) {
            // return response.data.filter(function(stream) {
            //   return stream.Lakes.Sections.length > 0;
            // });
            return response.data;
          });
      }
    };

    return new GeometryApiService();
  });
