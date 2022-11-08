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

modulum("CharSize",
  function(context, cls) {
    /**
     * Data class to store sizes af character in terms of Genero layout.
     * Will store width of a "M", width of a "0", and height of a "M"
     * @class CharSize
     * @memberOf classes
     */
    cls.CharSize = context.oo.Class(function() {
      return /** @lends classes.CharSize.prototype */ {
        $static: /** @lends classes.CharSize */ {
          translate: function(size, widthM, width0) {
            return cls.Size.translate(size, function(s) {
              var result = Math.min(6, s) * widthM;
              if (s > 6) {
                result += (s - 6) * width0;
              }
              return result;
            });
          },
        },
        __name: "CharSize",
        /**
         * @type {classes.SizeValue}
         */
        _widthM: null,
        /**
         * @type {classes.SizeValue}
         */
        _width0: null,
        /**
         * @type {classes.SizeValue}
         */
        _height: null,
        /**
         * @type {number}
         */
        _defaultWidthM: 0,
        /**
         * @type {number}
         */
        _defaultWidth0: 0,
        /**
         * @type {number}
         */
        _defaultHeight: 0,
        /**
         *
         * @param {{widthM:number, width0:number, height:number}} [rawOptions]
         */
        constructor: function(rawOptions) {
          var opts = rawOptions || {};
          this._widthM = Object.isNumber(opts.widthM) ? opts.widthM : 0;
          this._width0 = Object.isNumber(opts.width0) ? opts.width0 : 0;
          this._height = Object.isNumber(opts.height) ? opts.height : 0;
        },

        /**
         * reset values to 0
         */
        reset: function() {
          this._widthM = 0;
          this._width0 = 0;
          this._height = 0;
        },

        /**
         * Return whether or not width of a "M" is set
         * @param {boolean} [considerZero] true to consider 0 as a value
         * @return {boolean} true if width of a "M" is set
         */
        hasWidthM: function(considerZero) {
          return considerZero && !this._widthM || this._widthM > 0;
        },

        /**
         * Return whether or not width of a "0" is set
         * @param {boolean} [considerZero] true to consider 0 as a value
         * @return {boolean} true if width of a "0" is set
         */
        hasWidth0: function(considerZero) {
          return considerZero && !this._width0 || this._width0 > 0;
        },

        /**
         * Return whether or not height of a "M" is set
         * @param {boolean} [considerZero] true to consider 0 as a value
         * @return {boolean} true if height of a "M" is set
         */
        hasHeight: function(considerZero) {
          return considerZero && !this._height || this._height > 0;
        },

        /**
         * Return whether or not widths or height is set
         * @param {boolean} [considerZero] true to consider 0 as a value
         * @return {boolean} true if either widths or height is set
         */
        hasSize: function(considerZero) {
          return (this.hasWidth0(considerZero) && this.hasWidthM(considerZero)) || this.hasHeight(considerZero);
        },

        /**
         * Get the width of a "M"
         * @param {boolean} [useFallback] true to return default "M" width value if not set
         * @return {?number} width of a "M"
         */
        getWidthM: function(useFallback) {
          if (useFallback && !this.hasWidthM(true)) {
            return this._defaultWidthM;
          }
          return this._widthM;
        },

        /**
         * Get the width of a "0"
         * @param {boolean} [useFallback] true to return default "0" width value if not set
         * @return {?number} width of a "0"
         */
        getWidth0: function(useFallback) {
          if (useFallback && !this.hasWidth0(true)) {
            return this._defaultWidth0;
          }
          return this._width0;
        },

        /**
         * Get the height of a "M"
         * @param {boolean} [useFallback] true to return default "M" height value if not set
         * @return {?number} height of a "M"
         */
        getHeight: function(useFallback) {
          if (useFallback && !this.hasHeight(true)) {
            return this._defaultHeight;
          }
          return this._height;
        },

        /**
         * Set the width of a "M"
         * @param {number} widthM the value
         */
        setWidthM: function(widthM) {
          this._widthM = widthM;
        },

        /**
         * Set the width of a "0"
         * @param {number} width0 the value
         */
        setWidth0: function(width0) {
          this._width0 = width0;
        },

        /**
         * Set the height of a "M"
         * @param {number} height the value
         */
        setHeight: function(height) {
          this._height = height;
        }
      };
    });
  });
