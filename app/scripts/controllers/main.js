'use strict';

/**
 * @ngdoc function
 * @name troutDashApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the troutDashApp
 */
angular.module('troutDashApp')
  .controller('MainCtrl', function ($scope, StreamApiService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
  });
