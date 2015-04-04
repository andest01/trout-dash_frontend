'use strict';

/**
 * @ngdoc service
 * @name troutDashApp.TableOfContentsRepository
 * @description
 * # TableOfContentsRepository
 * Factory in the troutDashApp.
 */
angular.module('troutDashApp')
  .factory('TableOfContentsRepository', function ($http, $cacheFactory) {
    var TableOfContentsRepository = function () {
        
    };

    var proto = {

    };

    TableOfContentsRepository.prototype = proto;
    return new TableOfContentsRepository();
  });
