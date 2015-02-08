'use strict';

/**
 * @ngdoc service
 * @name troutDashApp.StreamApiService
 * @description
 * # StreamApiService
 * Factory in the troutDashApp.
 */
angular.module('troutDashApp')
  .factory('StreamApiService', function ($rootScope, $cacheFactory, $http, $q) {
    function StreamApiService() {

    }

    StreamApiService.prototype = {
      getStreams: function() {
        return $http.get('/data/trout-dash-minnesota.json')
          .then(function(response) {
            return response.data;
          });
      }
    };

    return new StreamApiService();
});
