'use strict';

/**
 * @ngdoc service
 * @name troutDashApp.StreamApiService
 * @description
 * # StreamApiService
 * Factory in the troutDashApp.
 */
angular.module('troutDashApp')
  .factory('StreamApiService', function ($rootScope, $cacheFactory, $http, $q, $timeout) {
    function StreamApiService() {

    }

    StreamApiService.prototype = {
      getStreams: function() {
        var deferred = $q.defer();

        $timeout(function() {
          var gettingData = $http.get('./data/trout-dash-minnesota.json')
          .then(function(response) {
            return response.data;
          });

          deferred.resolve(gettingData);
        }, 1000);

        return deferred.promise;
      },

      getRegions: function() {
        // return $http.get('./data/regionDetails.json')
        //   .then(function(response) {
        //     return response.data;
        //   });

          var deferred = $q.defer();

          $timeout(function() {
            var gettingData = $http.get('./data/regionDetails.json')
            .then(function(response) {
              return response.data;
            });

            deferred.resolve(gettingData);
          }, 1000);

          return deferred.promise;
      }
    };

    return new StreamApiService();
});
