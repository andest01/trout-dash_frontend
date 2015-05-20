'use strict';

/**
 * @ngdoc service
 * @name troutDashApp.BaseApiService
 * @description
 * # BaseApiService
 * Factory in the troutDashApp.
 */
var DEBUGGER_LATENCY = 3000;
var sessionStorage = window.sessionStorage;

angular.module('troutDashApp')
  .factory('BaseApiService', function ($rootScope, $cacheFactory, $http, $q, $timeout) {
    var globalCache = $cacheFactory('du');

    function BaseApiService() {
        this.cache = globalCache;
    }

    BaseApiService.prototype = {
      cache: null,
      resetCache: function() {
          globalCache.removeAll();
      },

      logCache: function() {
        var info = this.cache.info();
        console.log('cache', info);
      },

      doCall: function(data, endpoint, cache) {
        cache = false;

        var config = {
            url: BaseApiService.API_BASE_PATH + endpoint,
            params: data,
            cache: cache,
            method: 'GET'
        };

        var deferred = $q.defer();

          $timeout(function() {
            var gettingData = $http(config)
              .then(function(response) {
                  if (response && response.data && response.data.exceptionType) {
                      return $q.reject(response.data);
                  }

                  return response.data;
              }).catch(function(reason) {
                  // perform some operation here if need be...
                  return $q.reject(reason);
              });

            deferred.resolve(gettingData);
          }, DEBUGGER_LATENCY);

          return deferred.promise;

        // return $http(config)
        //   .then(function(response) {
        //       if (response && response.data && response.data.exceptionType) {
        //           return $q.reject(response.data);
        //       }

        //       return response.data;
        //   }).catch(function(reason) {
        //       // perform some operation here if need be...
        //       return $q.reject(reason);
        //   });

      }
    };

    BaseApiService.API_BASE_PATH = '';

    return BaseApiService;
  });
