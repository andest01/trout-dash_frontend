'use strict';

/**
 * @ngdoc service
 * @name troutDashApp.HierarchicalGeometryCollection
 * @description
 * # HierarchicalGeometryCollection
 * Factory in the troutDashApp.
 */
angular.module('troutDashApp')
  .factory('HierarchicalGeometryCollection', function (BaseCollection, HierarchicalGeometryViewModel) {
    function HierarchicalGeometryCollection(data) {
        BaseCollection.call(this, data);
    }

    /** @lends  HierarchicalGeometryCollection.prototype */
    var proto = HierarchicalGeometryCollection.prototype = Object.create(BaseCollection.prototype);
    HierarchicalGeometryCollection.prototype.constructor = HierarchicalGeometryCollection;

    /**
     * Constructor used to create models from JSON data
     * @property {Function} model HierarchicalGeometryViewModel constructor function
     */
    proto.model = HierarchicalGeometryViewModel;

    return HierarchicalGeometryCollection;
  });
