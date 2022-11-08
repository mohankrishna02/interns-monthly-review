/// FOURJS_START_COPYRIGHT(D,2015)
/// Property of Four Js*
/// (c) Copyright Four Js 2015, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('ColoredWidgetBase', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Base class for all widgets handling colors (background and fore)
     * @class ColoredWidgetBase
     * @memberOf classes
     * @extends classes.WidgetBase
     * @publicdoc Widgets
     */
    cls.ColoredWidgetBase = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.ColoredWidgetBase.prototype */ {
        __name: "ColoredWidgetBase",
        __virtual: true,
        /**
         * true to ignore background color
         * @type {boolean}
         * @protected
         */
        _ignoreBackgroundColor: false,
        /**
         * the widget's main color
         * @type {?string}
         * @protected
         */
        _color: null,
        /**
         * the widget's main background color
         * @type {?string}
         * @protected
         */
        _backgroundColor: null,

        /**
         * @inheritDoc
         */
        _afterInitElement: function() {
          this.getElement().toggleClass("gbc_WidgetBase_standalone", !(this._inTable || this._inScrollGrid));
          this.getElement().toggleClass("gbc_WidgetBase_in_array", this._inTable || this._inScrollGrid);
        },

        /**
         * Set the fore color
         * @see {@link http://www.w3.org/wiki/CSS/Properties/color}
         * @param {string} color a CSS color definition. Can be a color name ('red', 'blue'),
         *                 an hex code ('#f5d48a') or a color function ('rgb(128, 255, 0)').
         *                 null restores the default value.
         * @publicdoc
         */
        setColor: function(color) {
          if (this._color !== color) {
            this._color = color;
            this.setStyle({
              selector: ".gbc_WidgetBase_standalone",
              appliesOnRoot: true
            }, {
              "color": color ? color + " !important" : null,
              "fill": color ? color + " !important" : null
            });
            this.setStyle({
              preSelector: ".nohighlight ",
              selector: ".gbc_WidgetBase_in_array",
              appliesOnRoot: true
            }, {
              "color": color ? color + " !important" : null,
              "fill": color ? color + " !important" : null
            });
            this.setStyle({
              preSelector: ".highlight ",
              selector: ".gbc_WidgetBase_in_array:not(.currentRow)",
              appliesOnRoot: true
            }, {
              "color": color ? color + " !important" : null,
              "fill": color ? color + " !important" : null
            });
          }
        },

        /**
         * Returns the fore color
         * @see {@link http://www.w3.org/wiki/CSS/Properties/color}
         * @returns {?string} a color definition as an RGB function ('rgb(128, 255, 0)')
         * @publicdoc
         */
        getColor: function() {
          return this._color;
        },

        /**
         * Returns the fore color (directly from style css)
         * @see {@link http://www.w3.org/wiki/CSS/Properties/color}
         * @returns {string} a color definition as an RGB function ('rgb(128, 255, 0)')
         * @publicdoc
         */
        getColorFromStyle: function() {
          return this.getStyle(".gbc_WidgetBase_standalone", "color", true);
        },

        /**
         * Sets the background color
         * @see {@link http://www.w3.org/wiki/CSS/Properties/background-color}
         * @param {string} color a CSS color definition. Can be a color name ('red', 'blue'),
         *                 an hex code ('#f5d48a') or a color function ('rgb(128, 255, 0)')
         *                 null restores the default value.
         * @publicdoc
         */
        setBackgroundColor: function(color) {
          if (this._backgroundColor !== color) {
            this._backgroundColor = color;
            this.setStyle({
              selector: ".gbc_WidgetBase_standalone",
              appliesOnRoot: true
            }, {
              "background-color": color && !this._ignoreBackgroundColor ? color + " !important" : null
            });
            this.setStyle({
              preSelector: ".nohighlight ",
              selector: ".gbc_WidgetBase_in_array",
              appliesOnRoot: true
            }, {
              "background-color": color && !this._ignoreBackgroundColor ? color + " !important" : null
            });
            this.setStyle({
              preSelector: ".highlight ",
              selector: ".gbc_WidgetBase_in_array:not(.currentRow)",
              appliesOnRoot: true
            }, {
              "background-color": color && !this._ignoreBackgroundColor ? color + " !important" : null
            });
          }
        },
        /**
         * Set whether or not to ignore bckground color
         * @param {boolean} ignore true to ignore
         * @protected
         */
        setIgnoreBackgroundColor: function(ignore) {
          this._ignoreBackgroundColor = ignore;
          this.setBackgroundColor(this._backgroundColor);
        },

        /**
         * Returns the background color
         * @see {@link http://www.w3.org/wiki/CSS/Properties/background-color}
         * @returns {?string} a color definition as an RGB function ('rgb(128, 255, 0)')
         * @publicdoc
         */
        getBackgroundColor: function() {
          return this._backgroundColor;
        }
      };
    });
  });
