'use strict';

/**
 * @ngdoc function
 * @name troutDashApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the troutDashApp
 */
angular.module('troutDashApp')
  .controller('MainCtrl', function ($scope, StreamApiService, TableOfContentsRepository) {
    TableOfContentsRepository.getTableOfContents()
    	.then(function(results) {

    	});
    
  });
