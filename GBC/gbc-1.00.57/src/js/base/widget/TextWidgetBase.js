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

modulum('TextWidgetBase', ['ColoredWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Base class for all widgets handling text attributes
     * @class TextWidgetBase
     * @memberOf classes
     * @publicdoc Widgets
     * @extends classes.ColoredWidgetBase
     */
    cls.TextWidgetBase = context.oo.Class(cls.ColoredWidgetBase, function($super) {
      return /** @lends classes.TextWidgetBase.prototype */ {
        __name: "TextWidgetBase",
        /**
         * Flag for augmentedFace
         * @type {boolean}
         */
        __virtual: true,
        /**
         * Current font family used
         * @type {string}
         */
        _fontFamily: "",
        /**
         * Current font weight used
         * @type {string}
         */
        _fontWeight: "",
        /**
         * Current font style used
         * @type {string}
         */
        _fontStyle: "",
        /**
         * Current font size used
         * @type {string}
         */
        _color: "",
        /**
         * Current color
         * @type {string}
         */
        _fontSize: "",
        /**
         * Current text aligned used
         * @type {string}
         */
        _textAlign: "",
        /**
         * Current text transform used
         * @type {string}
         */
        _textTransform: "none",
        /**
         * Current text decoration used
         * @type {string}
         */
        _textDecoration: "",

        /**
         * @inheritDoc
         */
        destroy: function() {
          $super.destroy.call(this);
        },

        /**
         * Set the font-family used for this widget
         * @see {@link http://www.w3.org/wiki/CSS/Properties/font-family}
         * @param {string} fontFamily the font family to use. null restores the default value.
         * @publicdoc
         */
        setFontFamily: function(fontFamily) {
          if (this._fontFamily !== fontFamily) {
            this._fontFamily = fontFamily;
            this.setStyle({
              "font-family": fontFamily
            });
          }
        },

        /**
         * Get the font-family used by this widget
         * @see {@link http://www.w3.org/wiki/CSS/Properties/font-family}
         * @returns {string} the used font family
         * @publicdoc
         */
        getFontFamily: function() {
          return this.getStyle("font-family"); // TODO must return this._fontFamily
        },

        /**
         * Set the font weight used for this widget
         * @see {@link http://www.w3org/wiki/CSS/Properties/font-weight}
         * @param weight {string} a CSS font weight value. null restores the default value.
         * @publicdoc
         */
        setFontWeight: function(weight) {
          if (this._fontWeight !== weight) {
            this._fontWeight = weight;
            this.setStyle({
              "font-weight": weight
            });
          }
        },

        /**
         * Get the font-family used by this widget
         * @see {@link http://www.w3org/wiki/CSS/Properties/font-weight}
         * @returns {string} a CSS font weight value
         * @publicdoc
         */
        getFontWeight: function() {
          return this._fontWeight;
        },

        /**
         * Set the font-style used for this widget
         * @see {@link http://www.w3.org/wiki/CSS/Properties/font-style}
         * @example setFontStyle("italic")
         * @param style {string} a CSS font style value. null restores the default value.
         * @publicdoc
         */
        setFontStyle: function(style) {
          if (this._fontStyle !== style) {
            this._fontStyle = style;
            this.setStyle({
              "font-style": style
            });
          }
        },

        /**
         * Get the font-style used by this widget
         * @see {@link http://www.w3org/wiki/CSS/Properties/font-style}
         * @returns {string} a CSS font style value
         * @publicdoc
         */
        getFontStyle: function() {
          return this._fontStyle;
        },

        /**
         * Set the font-size used for this widget
         * @see {@link http://www.w3.org/wiki/CSS/Properties/font-size}
         * @param size {string} a CSS font size value. null restores the default value.
         * @example setFontSize("12px")
         * @publicdoc
         */
        setFontSize: function(size) {
          if (this._fontSize !== size) {
            this._fontSize = size;
            this.setStyle({
              "font-size": size
            });
          }
        },

        /**
         * Set the font color used by this widget
         * @see {@link http://www.w3org/wiki/CSS/Properties/font-size}
         * @returns {string} a CSS font color value
         * @publicdoc
         */
        setFontColor: function(color) {
          if (this._color !== color) {
            this._color = color;
            this.setStyle({
              "color": color
            });
          }
        },

        /**
         * Get the font color used by this widget
         * @see {@link http://www.w3org/wiki/CSS/Properties/font-size}
         * @returns {string} a CSS font color value
         * @publicdoc
         */
        getFontColor: function(color) {
          return this._color;
        },

        /**
         * Get the font-size used by this widget
         * @see {@link http://www.w3org/wiki/CSS/Properties/font-size}
         * @returns {string} a CSS font size value
         * @publicdoc
         */
        getFontSize: function() {
          return this.getStyle("font-size"); // TODO must return this._fontSize
        },

        /**
         * Set the text-align used for this widget
         * @see {@link http://www.w3.org/wiki/CSS/Properties/text-align}
         * @param align {string} a CSS text alignment. null restores the default value.
         * @example setTextAlign("right")
         * @publicdoc
         */
        setTextAlign: function(align) {
          if (this._textAlign !== align) {
            this._textAlign = align;
            this.setStyle({
              "text-align": align
            });
          }
        },

        /**
         * Get the text-align used by this widget
         * @see {@link http://www.w3.org/wiki/CSS/Properties/text-align}
         * @returns {string} a text alignment
         * @publicdoc
         */
        getTextAlign: function() {
          return this._textAlign;
        },

        /**
         * Set the text-transform used for this widget
         * @see {@link http://www.w3.org/wiki/CSS/Properties/text-transform}
         * @param transform {string} a CSS text transform. null restores the default value.
         * @example setTextTransform("upper")
         * @publicdoc
         */
        setTextTransform: function(transform) {
          if (this._textTransform !== transform) {
            this._textTransform = transform;
            this.addClass(transform + "shift");
          }
        },

        /**
         * Remove both class which cause text-transform
         * @publicdoc
         */
        removeTextTransform: function() {
          this.removeClass("upshift");
          this.removeClass("downshift");
          this._textTransform = "none";
        },

        /**
         * Get the text-transform used by this widget
         * @see {@link http://www.w3.org/wiki/CSS/Properties/text-transform}
         * @returns {string} a CSS text transform
         * @publicdoc
         */
        getTextTransform: function() {
          return this._textTransform;
        },

        /**
         * Get the text-decoration used by this widget
         * @see {@link http://www.w3.org/wiki/CSS/Properties/text-decoration}
         * @return {string} a CSS text decoration
         * @publicdoc
         */
        getTextDecoration: function() {
          return this._textDecoration;
        },

        /**
         * Set the text-decoration used for this widget
         * @see {@link http://www.w3.org/wiki/CSS/Properties/text-decoration}
         * @publicdoc
         */
        setTextDecoration: function(decoration) {
          if (this._textDecoration !== decoration) {
            this._textDecoration = decoration;
            this.setStyle({
              "text-decoration": decoration
            });
          }
        }
      };
    });
  });
