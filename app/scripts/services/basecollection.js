'use strict';

/**
 * @ngdoc service
 * @name troutDashApp.BaseCollection
 * @description
 * # BaseCollection
 * Factory in the troutDashApp.
 */
angular.module('troutDashApp')
  .factory('BaseCollection', function (BaseModel) {
    function BaseCollection(udefOrArray) {
        this._models = [];
        if (udefOrArray) {
            this._addAll(udefOrArray);
        }
    }

    /** @lends BaseCollection.prototype */
    BaseCollection.prototype = {

        /**
         * @property {Function} model BaseModel constructor function, used to convert raw JSON into models
         */
        model: BaseModel,
        constructor: BaseCollection,

        /**
         * @property {BaseModel[]} _models Reference store for model instances
         */
        _models: null,

        /**
         * @property {Number} Number of models in the colleciton
         */
        length: 0,

        /**
         * @method
         * @return {Object[]} Array of POJO model data
         */
        toJSON: function() {
            return this.map(function(model) {
                return model.toJSON();
            });
        },

        toArray: function() {
            return this._models.slice();
        },

        destroy: function() {
            this.each(function(model) {
                model.destroy();
            });
            this._models.length = 0;
            this._models = null;
        },

        /**
         * @method
         * @param {BaseModel[]|null} arrayOrUndefined Returns a new instance of BaseCollection.
         * @return {BaseCollection} Returns a copy of the collection. If an array of BaseModels are passed, only those
         *                          models are included. Otherwise, the full collection is copied.
         */
        copy: function(arrayOrUndefined) {
            if (arrayOrUndefined) {
                return new this.constructor(arrayOrUndefined);
            }

            return new this.constructor(this._models);
        },

        /**
         * @method
         * @param {Object[]|BaseModel[]} modelData Convenience method for adding many models.  Iterates and calls #add
         * @see add
         */
        _addAll: function(modelData) {
            var i;
            var len = modelData.length;
            for (i = 0; i < len; i++) {
                this.add(modelData[i]);
            }
        },

        /**
         * Adds a model to the collection.  If type Object is passed, it gets passed to new {this.model} first
         * @method
         * @param {Object|BaseModel} modelData Model data to add
         */
        add: function(modelData) {
            var instanceModel;
            if (!(modelData instanceof this.model)) {
                instanceModel = new this.model(modelData);
            } else {
                instanceModel = modelData;
            }

            this._models.push(instanceModel);
            this.length++;
            return this.length;
        },

        /**
         * Remove a model from the collection.  Delegates to _removeByModel or _removeByModelId based on the parameter
         * @method
         * @param {BaseModel|Number} modelDataOrId Model instance or model id value
         * @return {Number} Length of the collection after attempting to remove the model
         */
        remove: function(modelDataOrId) {
            var model;
            // avoid concurrency bug
            var referenceToModelOrId = modelDataOrId;
            if (referenceToModelOrId instanceof this.model) {
                model = this._removeByModel(referenceToModelOrId);
            } else {
                model = this._removeById(referenceToModelOrId);
            }

            if (model && model !== -1) {
                this.length--;
            }

            return this.length;
        },

        /**
         * Remove all elements from the collection and reset its length to 0
         * @method
         */
        empty: function() {
            this._models.length = 0;
            this.length = 0;
        },

        /**
         * Return the first element from the collection
         * Especially useful for creating non-queue based pools
         * @return {BaseModel|undefined}
         */
        first: function() {
            return this._models[0];
        },

        /**
         * Applies browser-standard sorting via Array.prototype.sort to _models
         * @method
         * @param {Function} sortFn Sorting function to use
         */
        sort: function(sortFn) {
            this._models.sort(sortFn);
        },

        /**
         * Applies browser-standard sorting via Array.prototype.sort to _models.  Directly compares model keys
         * @method
         * @param {String} key      Model key to sort by
         * @param {Boolean|Undefined} sortDesc If true, sorts by descending order
         */
        sortBy: function(key, sortDesc) {
            this.sort(function(modelA, modelB) {
                var a = modelA[key];
                var b = modelB[key];

                if (sortDesc) {
                    return a > b ? -1 : a < b ? 1 : 0;
                } else {
                    return a < b ? -1 : a > b ? 1 : 0;
                }
            });
        },

        /**
         * Strategy method for browser-standard sorting via Array.prototype.sort to _models. Delegates sorting to a
         * private method based on the type parameter
         * @method
         * @param {String} key      Model key to sort by
         * @param {Boolean|Undefined} sortDesc If true, sorts by descending order
         * @param {BaseCollection.SORT.TYPE} type Sorting method is delegated by the type value
         */
        sortByType: function(key, sortDesc, type) {
            if (type === 'string') {
                this.sortByString(key, sortDesc, true);
            } else if (type === 'arrayLength') {
                this.sortByCount(key, sortDesc);
            } else if (type === 'number') {
                this.sortByNumber(key, sortDesc);
            } else {
                this.sortBy(key, sortDesc);
            }
        },

        /**
         * Strategy method for browser-standard sorting via Array.prototype.sort to _models. Key must be a model
         * property of type String.
         * Default sort is ascii order, unless useLowercase is true
         * @method
         * @param {String} key      Model key to sort by
         * @param {Boolean|Undefined} sortDesc If true, sorts by descending order
         * @param {Boolean} [type=false] Use alphabetical instead of ascii
         */
        sortByString: function(key, sortDesc, useLowercase) {
            this.sort(function(modelA, modelB) {
                var a = modelA[key];
                var b = modelB[key];

                if (useLowercase) {
                    a = a.toLowerCase();
                    b = b.toLowerCase();
                }

                if (sortDesc) {
                    return a > b ? -1 : a < b ? 1 : 0;
                } else {
                    return a < b ? -1 : a > b ? 1 : 0;
                }
            });
        },

        /**
         * Strategy method for browser-standard sorting via Array.prototype.sort to _models. Key must be a model
         * property of type Array.
         * Default sort is ascending order, unless sortDesc is true
         * @method
         * @param {String} key      Model key to sort by
         * @param {Boolean|Undefined} sortDesc If true, sorts by descending order
         * @param {Boolean} [type=false] Use descending or ascending order (ascending is default)
         */
        sortByCount: function(key, sortDesc) {
            this.sort(function(modelA, modelB) {
                var a = modelA[key] ? modelA[key].length : 0;
                var b = modelB[key] ? modelB[key].length : 0;

                if (sortDesc) {
                    return a > b ? -1 : a < b ? 1 : 0;
                } else {
                    return a < b ? -1 : a > b ? 1 : 0;
                }
            });
        },

         /**
         * Strategy method for browser-standard sorting via Array.prototype.sort to _models. Key must be a model
         * property of type Array.
         * Default sort is ascending order, unless sortDesc is true
         * @method
         * @param {String} key      Model key to sort by
         * @param {Boolean|Undefined} sortDesc If true, sorts by descending order
         * @param {Boolean} [type=false] Use descending or ascending order (ascending is default)
         */
        sortByNumber: function(key, sortDesc) {
            this.sort(function(modelA, modelB) {
                var a = modelA[key] ? modelA[key] : 0;
                var b = modelB[key] ? modelB[key] : 0;

                if (sortDesc) {
                    return a > b ? -1 : a < b ? 1 : 0;
                } else {
                    return a < b ? -1 : a > b ? 1 : 0;
                }
            });
        },

        /**
         * @method
         * @param  {Number|String} id ID of the model to return
         * @return {BaseModel}    Found model
         */
        get: function(id) {
            var i = 0;
            var len = this._models.length;
            for (; i < len; i++) {
                // Some server IDs are BIGINT (strings), others are numbers. However, all are auto-incremented, so
                // 0 is never a valid identifier and type coersion is both acceptable and necessary in this case.
                /* jshint eqeqeq:false */
                if (this._models[i].id == id) {
                    return this._models[i];
                }
            }
        },

        /**
         * Return the model at the given index.  Appropriate only when .each is not acceptable (i.e. in a for loop)
         * @param  {Integer} index index of the model
         * @return {BaseModel}
         */
        at: function(index) {
            return this._models[index];
        },

        /**
         * @method
         * @param  {Number} pageNumber Starting index of models to return
         * @param  {Number} perPage    Range length of models to return
         * @return {BaseModel[]}       Array of models starting at pageNumber up to but not including pageNumber+perPage
         */
        getPage: function(pageNumber, perPage) {
            var startIndex = perPage * (pageNumber - 1);
            var endIndex = startIndex + perPage;

            if (startIndex > this._models.length - 1) {
                return [];
            }

            return this._models.slice(startIndex, endIndex);
        },

        contains: function(id) {
            var i;
            var len = this.length;
            for (i = 0; i < len; i++) {
                if (this._models[i].id === id) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Compare this collection to another, then
         *   remove and add items individually until the two match
         * @param otherCollection {BaseCollection}
         *   A collection of the same type as `this`
         * @return {Object<Array<?>>}
         *   A diff representing the changes made to this object. Example:
         *   - this collection's IDs: [1, 2, 3, 4, 5]
         *   - other collection's IDs: [4, 5, 6, 7]
         *   - after merge, this collection's IDs: [4, 5, 6, 7]
         *   - return value: {removed: [1, 2, 3], added: [6, 7]}
         */
        merge: function(otherCollection) {
            var self;
            var removed; 
            var added;

            // Ignore collections of different types
            if (this.constructor !== otherCollection.constructor) {
                return []; // exit early
            }

            self = this;
            removed = [];
            added = [];

            // Remove models
            this.each(function(element, index) {
                if (!otherCollection.contains(element.id)) {
                    this.remove(element.id);
                    removed.push(element.id);
                }
            });

            // Add model objects
            otherCollection.each(function(element, index) {
                if (!this.contains(element.id)) {
                    this.add(element);
                    added.push(element.id);
                }
            });

            return {
                'removed': removed,
                'added': added
            };

        },

        /**
         * @method
         * @param  {Number} id ID of model to remove
         * @return {BaseModel|Number} Model removed, or -1 if model not found
         */
        _removeById: function(id) {
            var len = this.length;
            var i;

            for (i = 0; i < len; i++) {
                if (this._models[i].id === id) {
                    return this._models.splice(i, 1);
                }
            }
        },

        /**
         * @method
         * @param  {BaseModel} Model to remove
         * @return {BaseModel|Number} Model removed, or -1 if model not found
         */
        _removeByModel: function(model) {
            var len = this.length;
            var i;

            for(i = 0; i < len; i++) {
                if (this._models[i] === model) {
                    return this._models.splice(i, 1);
                }
            }
        }
    };

    // Borrowed from Backbone
    // @see http://backbonejs.org/docs/backbone.html
    var methods = [
        'forEach',
        'each',
        'map',
        'reduce',
        'find',
        'filter',
        'indexOf'
    ];

    _.each(methods, function(method) {
        BaseCollection.prototype[method] = function() {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(this._models);
            return _[method].apply(_, args);
        };
    });

    /**
     * Sorting constants
     * @memberOf BaseCollection
     * @constant
     */
    BaseCollection.SORT = {
        /** @enum Sorting types */
        TYPE: {
            ARRAY_LENGTH: 'arrayLength',
            STRING: 'string',
            DATE: 'date',
            NUMBER: 'number'
        }
    };

    return BaseCollection;
  });
