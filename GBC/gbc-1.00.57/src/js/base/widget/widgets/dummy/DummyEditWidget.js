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

modulum('DummyEditWidget', ['EditWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Edit widget.
     * @class DummyEditWidget
     * @memberOf classes
     * @extends classes.EditWidget
     */
    cls.DummyEditWidget = context.oo.Class(cls.EditWidget, function($super) {
      return /** @lends classes.DummyEditWidget.prototype */ {
        __name: "DummyEditWidget",
        __dataContentPlaceholderSelector: cls.WidgetBase.selfDataContent,

        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.LeafLayoutEngine(this);
          this._layoutInformation._fixedSizePolicyForceMeasure = true;
        },

        _initElement: function() {
          $super._initElement.call(this);
          this._element.addClass("gbc_EditWidget");
        },

        /**
         * @inheritDoc
         */
        setReadOnly: function(readonly) {

        },

        /**
         * @inheritDoc
         */
        isReadOnly: function() {
          return Boolean(this._element.getAttribute("readonly"));
        },

        /**
         * @param {number} maxlength maximum number of characters allowed in the field
         */
        setMaxLength: function(maxlength) {

        },

        /**
         * @returns {number} the maximum number of characters allowed in the field
         */
        getMaxLength: function() {
          this._element.getIntAttribute("maxlength");
        },

        /**
         * @param {boolean} isPassword true if the widget should be in 'password' mode, false otherwise
         */
        setIsPassword: function(isPassword) {

        },

        /**
         * @returns {boolean} true if the widget is in 'password' mode, false otherwise
         */
        isPassword: function() {
          return this._element.getAttribute("type") === "password";
        },

        /**
         * Used to manage the keyboardHint.
         * @param {string} valType the type attribute value to set
         */
        setType: function(valType) {

        },

        /**
         * @returns {string} this Edit current type
         */
        getType: function() {
          return this._element.getAttribute("type");
        },

        /**
         * @inheritDoc
         */
        setFocus: function(fromMouse) {
          this._inputElement.domFocus();
          $super.setFocus.call(this, fromMouse);
        },

        /**
         * Set current display format to use on each set value
         * @param {string} format - display format
         * @publicdoc
         */
        setDisplayFormat: function(format) {
          this._displayFormat = format;
        },

        /**
         * Get the display format if any
         * @return {?string} the display format
         * @publicdoc
         */
        getDisplayFormat: function() {
          return this._displayFormat;
        },

        /**
         * @param {boolean} enabled true if the widget allows user interaction, false otherwise.
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('DummyEdit', cls.DummyEditWidget);
  });
