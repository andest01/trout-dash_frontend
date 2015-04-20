'use strict';

/**
 * @ngdoc service
 * @name troutDashApp.BaseModel
 * @description
 * # BaseModel
 * Factory in the troutDashApp.
 */
angular.module('troutDashApp')
  .factory('BaseModel', function () {
    function BaseModel(json) {
        if (json) {
            this._fromJSON(json);
        }
    }

    /** @lends  BaseModel.prototype */
    BaseModel.prototype = {
        constructor: BaseModel,
        /**
         * Merges properties from a POJO into the model
         * @param  {Object} json raw data
         */
        _fromJSON: function(json) {
            var key;
            for (key in json) {
                if (json.hasOwnProperty(key)) {
                    this[key] = json[key];
                }
            }
        },

        /**
         * Returns an object hash of the model properties
         * @return {Object}
         */
        toJSON: function() {
            var hash = {};
            var key;
            for (key in this) {
                if (this.hasOwnProperty(key) && typeof this[key] !== 'function') {
                    hash[key] = this[key];
                }
            }

            return hash;
        },

        destroy: function() {
            var key;
            for (key in this) {
                if (this.hasOwnProperty(key)) {
                    delete this[key];
                }
            }
        }
    };

    BaseModel.generateIdomaticName = function(model) {
        return model.type;
    };

    return BaseModel;
  });
