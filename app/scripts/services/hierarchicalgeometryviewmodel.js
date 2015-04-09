'use strict';

/**
 * @ngdoc service
 * @name troutDashApp.HierarchicalGeometryViewModel
 * @description
 * # HierarchicalGeometryViewModel
 * Factory in the troutDashApp.
 */
angular.module('troutDashApp')
  .factory('HierarchicalGeometryViewModel', function () {
    function HierarchicalGeometryViewModel() {
        this.init();
    }

    HierarchicalGeometryViewModel.prototype =  {
      id: null,
      name: '',
      geometry: null,
      centroidLatitude: NaN,
      centroidLongitude: NaN,
      type: null,
      parent: null,
      children: [],

      init: function() {
        this.id = null;
        this.name = '';
        this.geometry = null;
        this.centroidLongitude = NaN;
        this.centroidLatitude = NaN;
        this.parent = null;
        this.children = [];
      }
    };


    return HierarchicalGeometryViewModel;
  });
