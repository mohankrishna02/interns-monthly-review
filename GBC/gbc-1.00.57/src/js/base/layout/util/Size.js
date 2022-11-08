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

modulum("Size",
  function(context, cls) {
    /**
     * size (width, height)
     * @class Size
     * @memberOf classes
     */
    cls.Size = context.oo.Class(function() {
      return /** @lends classes.Size.prototype */ {
        $static: /** @lends classes.Size */ {
          /**
           * common size value regular expression
           * @type {RegExp}
           */
          valueRE: /([0-9]+)(px|em|ch|ln|col|row)/,

          /**
           * column based size value regular expression
           * @type {RegExp}
           */
          colsRE: /^([0-9]+)(ch|col|co)?$/,

          /**
           * maximal value constant
           * @type {number}
           */
          maximal: Number.POSITIVE_INFINITY,
          /**
           * Test if given value is intented to be a value representing a number of columns
           * @param {string} value - the value to test
           * @return {boolean} true if given value is intented to be a value representing a number of columns
           */
          isCols: function(value) {
            return cls.Size.colsRE.test(value);
          },

          _defaultTranslate: function(size) {
            var ratio = parseFloat(context.ThemeService.getValue("theme-font-size-ratio"));
            if (Number.isNaN(ratio)) {
              ratio = 1;
            }
            return size * 16 * ratio;
          },

          /**
           * translates a raw size in pixels
           * @param {*} size raw size
           * @param {Function|number} baseSize a function that takes size in parameter, or size of an unit
           * @return {number} the pixel size
           */
          translate: function(size, baseSize) {
            var trans = cls.Size._defaultTranslate;
            if (baseSize) {
              if (baseSize instanceof Function) {
                trans = baseSize;
              } else if (!Number.isNaN(+baseSize) && (+baseSize > 0)) {
                trans = function(size) {
                  return size * (+baseSize);
                };
              }
            }
            var pxResult = 0;
            if (size) {
              if (Object.isNumber(size)) {
                pxResult = trans(size);
              } else {
                var result = cls.Size.valueRE.exec(size);
                if (result) {
                  var numeric = +result[1],
                    unit = result[2];
                  switch (unit) {
                    case "ln":
                      pxResult = trans(numeric);
                      break;
                    case "col":
                      // TODO : read col widths
                      pxResult = trans(numeric * 2);
                      break;
                    case "row":
                      pxResult = numeric * cls.TableWidget.defaultRowHeight;
                      break;
                    case "ch":
                    case "em":
                      pxResult = trans(numeric);
                      break;
                    default:
                      pxResult = numeric;
                      break;
                  }
                }
              }
            }
            return pxResult;
          },
          __cachedPxImportant: {},
          /**
           * get a cached string corresponding to the size en px
           * @param {number} val
           * @return {string}
           */
          cachedPxImportant: function(val) {
            if (!this.__cachedPxImportant[val]) {
              this.__cachedPxImportant[val] = [val, "px !important"].join("");
            }
            return this.__cachedPxImportant[val];
          }
        },
        __name: "Size",

        /**
         * the undefined value
         * @type {*}
         */
        _undefinedValue: null,
        /**
         * the width value
         * @type {classes.SizeValue}
         */
        _width: null,

        /**
         * the height value
         * @type {classes.SizeValue}
         */
        _height: null,

        /**
         * @type {number}
         */
        _defaultWidth: 0,
        /**
         * @type {number}
         */
        _defaultHeight: 0,
        /**
         *
         * @param {Object} [rawOptions] initialization options
         * @param {*} [rawOptions.undefinedValue] value when undefined
         * @param {number} [rawOptions.width] width to initialize
         * @param {number} [rawOptions.height] height to initialize
         * @constructs classes.Size
         */
        constructor: function(rawOptions) {
          var opts = rawOptions || {};
          this._undefinedValue = opts.undefinedValue || 0;
          this._width = Object.isNumber(opts.width) ? opts.width : this._undefinedValue;
          this._height = Object.isNumber(opts.height) ? opts.height : this._undefinedValue;
        },

        /**
         * reset values to undefined value
         */
        reset: function() {
          this._width = this._undefinedValue;
          this._height = this._undefinedValue;
        },

        /**
         * Return whether or not width is set
         * @param {boolean} [considerZero] true to consider 0 as a value
         * @return {boolean} true if width is set
         */
        hasWidth: function(considerZero) {
          return this._width !== this._undefinedValue && (Boolean(considerZero) || this._width > 0);
        },

        /**
         * Return whether or not height is set
         * @param {boolean} [considerZero] true to consider 0 as a value
         * @return {boolean} true if height is set
         */
        hasHeight: function(considerZero) {
          return this._height !== this._undefinedValue && (Boolean(considerZero) || this._height > 0);
        },

        /**
         * Return whether or not width or height is set
         * @param {boolean} [considerZero] true to consider 0 as a value
         * @return {boolean} true if either width or height is set
         */
        hasSize: function(considerZero) {
          return this.hasWidth(considerZero) || this.hasHeight(considerZero);
        },

        /**
         * Get the width.
         * @param {boolean} [useFallback] return undefined value if width value is not defined
         * @return {number} the width
         */
        getWidth: function(useFallback) {
          if (useFallback && !this.hasWidth(true)) {
            return this._defaultWidth;
          }
          return this._width;
        },

        /**
         * Get the height.
         * @param {boolean} [useFallback] return undefined value if height value is not defined
         * @return {number} the height
         */
        getHeight: function(useFallback) {
          if (useFallback && !this.hasHeight(true)) {
            return this._defaultHeight;
          }
          return this._height;
        },

        /**
         * Set the width
         * @param {number} width the width. If width is null, sets the undefined value
         */
        setWidth: function(width) {
          if (width === null) {
            this._width = this._undefinedValue;
          } else {
            this._width = width;
          }
        },

        /**
         * Set the height
         * @param {number} height the height. If height is null, sets the undefined value
         */
        setHeight: function(height) {
          if (height === null) {
            this._height = this._undefinedValue;
          } else {
            this._height = height;
          }
        },

        /**
         * Returns a new Size object with values from a substraction of each member
         * @param {classes.Size} size the other size to substract
         * @return {classes.Size} a new instance with the values resulting of a substraction
         */
        minus: function(size) {
          var result = new cls.Size({
            width: this.getWidth(true) - size.getWidth(true),
            height: this.getHeight(true) - size.getHeight(true)
          });
          result._defaultWidth = this._defaultWidth;
          result._defaultHeight = this._defaultHeight;
          return result;
        },

        /**
         * Returns a new Size object with the same values and default values
         * @param {boolean} [useFallback] use default value if value is not defined
         * @return {classes.Size} a new instance with the same values
         */
        clone: function(useFallback) {
          var result = new cls.Size({
            width: this.getWidth(useFallback),
            height: this.getHeight(useFallback)
          });
          result._defaultWidth = this._defaultWidth;
          result._defaultHeight = this._defaultHeight;
          return result;
        },

        /**
         * flip width and height values.
         */
        rotate: function() {
          var width = this.getHeight(true),
            height = this.getWidth(true);
          this._width = width;
          this._height = height;
        }
      };
    });
  });
