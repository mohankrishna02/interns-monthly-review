/// FOURJS_START_COPYRIGHT(D,2014)
/// Property of Four Js*
/// (c) Copyright Four Js 2014, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum("Stretch",
  function(context, cls) {
    /**
     * Stretch (x, y)
     * @class Stretch
     * @memberOf classes
     */
    cls.Stretch = context.oo.Class(function() {
      return /** @lends classes.Stretch.prototype */ {
        $static: /** @lends classes.Stretch */ {
          undef: {}
        },
        __name: "Stretch",
        /**
         * x-stretch value
         * @type {boolean|object}
         */
        _x: null,
        /**
         * y-stretch value
         * @type {boolean|object}
         */
        _y: null,
        /**
         * x-stretch opportunistic value
         * @type {boolean}
         */
        _opportunisticX: false,
        /**
         * y-stretch opportunistic value
         * @type {boolean}
         */
        _opportunisticY: false,
        /**
         * x-stretch default value
         * @type {boolean}
         */
        _defaultX: false,
        /**
         * y-stretch default value
         * @type {boolean}
         */
        _defaultY: false,
        /**
         * @constructs
         * @param {Object} [rawOptions] initialization options
         * @param {number} [rawOptions.x] x-stretch to initialize
         * @param {number} [rawOptions.y] y-stretch to initialize
         */
        constructor: function(rawOptions) {
          var opts = rawOptions || {};
          this._x = opts.x || cls.Stretch.undef;
          this._y = opts.y || cls.Stretch.undef;
        },

        /**
         * reset values
         */
        reset: function() {
          this._x = cls.Stretch.undef;
          this._y = cls.Stretch.undef;
          this._opportunisticX = false;
          this._opportunisticY = false;
        },

        /**
         * Returns whether or not has a x-stretch value
         * @return {boolean} true if has a x-stretch value
         */
        isXDefined: function() {
          return this._x !== cls.Stretch.undef;
        },

        /**
         * Returns whether or not has a y-stretch value
         * @return {boolean} true if has a y-stretch value
         */
        isYDefined: function() {
          return this._y !== cls.Stretch.undef;
        },

        /**
         * Get x-stretch value
         * @param {boolean} [useFallback] return default value if no value
         * @return {*} x-stretch value
         */
        getX: function(useFallback) {
          if (useFallback && !this.isXDefined()) {
            return this._defaultX;
          }
          return this._x;
        },

        /**
         * Get y-stretch value
         * @param {boolean} [useFallback] return default value if no value
         * @return {*} y-stretch value
         */
        getY: function(useFallback) {
          if (useFallback && !this.isYDefined()) {
            return this._defaultY;
          }
          return this._y;
        },

        /**
         * Set x-stretch value
         * @param {boolean} x value
         */
        setX: function(x) {
          if (x === null) {
            this._x = cls.Stretch.undef;
          } else {
            this._x = x;
          }
        },
        /**
         * Set y-stretch value
         * @param {boolean} y value
         */
        setY: function(y) {
          if (y === null) {
            this._y = cls.Stretch.undef;
          } else {
            this._y = y;
          }
        },

        /**
         * Get x opportunistic stretch value (e.g. would only stretch if other elements sharing stretching dimentsion stretches)
         * @return {boolean} x opportunistic stretch value
         */
        getOpportunisticX: function() {
          return this._opportunisticX;
        },

        /**
         * Get y opportunistic stretch value (e.g. would only stretch if other elements sharing stretching dimentsion stretches)
         * @return {boolean} y opportunistic stretch value
         */
        getOpportunisticY: function() {
          return this._opportunisticY;
        },

        /**
         * Set x opportunistic stretch value
         * @param {boolean} x opportunistic stretch value
         */
        setOpportunisticX: function(x) {
          this._opportunisticX = x;
        },

        /**
         * Set y opportunistic stretch value
         * @param {boolean} y opportunistic stretch value
         */
        setOpportunisticY: function(y) {
          this._opportunisticY = y;
        },

        /**
         * Set x-stretch default value
         * @param {boolean} x default value
         */
        setDefaultX: function(x) {
          this._defaultX = x;
        },

        /**
         * Set y-stretch default value
         * @param {boolean} y default value
         */
        setDefaultY: function(y) {
          this._defaultY = y;
        }
      };
    });
  });
