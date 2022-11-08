/// FOURJS_START_COPYRIGHT(D,2019)
/// Property of Four Js*
/// (c) Copyright Four Js 2019, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

'use strict';

modulum('ComboBoxWidgetBase', ['FieldWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Combobox widget base class.
     * @class ComboBoxWidgetBase
     * @memberOf classes
     * @extends classes.FieldWidgetBase
     * @publicdoc Widgets
     */

    cls.ComboBoxWidgetBase = context.oo.Class(cls.FieldWidgetBase, function($super) {
      return /** @lends classes.ComboBoxWidgetBase.prototype */ {
        __name: 'ComboBoxWidgetBase',
        /**
         * Flag for augmentedFace
         * @type {boolean}
         */
        __virtual: true,

        /**
         * Is the combobox query editable?
         * @type {boolean}
         * @protected
         */
        _isQueryEditable: null,

        /**
         * Bind all events listeners on combobox and create the combobox dropdown
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);

          this.setFocusable(true);
          this.setAriaAttribute("expanded", "false");
          this.setAriaAttribute("live", "polite");
        },

        /**
         * Set widget mode. Useful when widget have peculiar behavior in certain mode
         * @param {string} mode the widget mode
         * @param {boolean} active the active state
         */
        setWidgetMode: function(mode, active) {
          this._updateTextTransform();
        },

        /**
         * Returns whether or not the user should be able to input data freely
         * @return {boolean} true if user can input data
         */
        canInputText: function() {
          return this._isQueryEditable;
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          this._onRequestFocus(domEvent); // request focus
          return true;
        },

        /**
         * Get the value of the dropdown list at given position
         * @param {number} pos - position in the dropdown
         * @return {*} value at given position
         * @publicdoc
         */
        getValueAtPosition: function(pos) {
          return null;
        },

        /**
         * get the available items
         * @return {Object[]}
         */
        getItems: function() {
          return [];
        },

        /**
         * set combobox choice(s)
         * @param {ListDropDownWidgetItem|ListDropDownWidgetItem[]} choices - a single or a list of choices
         * @publicdoc
         */
        setChoices: function(choices) {},

        /**
         * Display the dropdown
         * @publicdoc
         */
        showDropDown: function() {},

        toggleDropDown: function() {},

        /**
         * @inheritDoc
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          this._element.toggleClass('disabled', !enabled);
        },

        /**
         * sets the combobox as query editable
         * @param {boolean} isQueryEditable
         */
        setQueryEditable: function(isQueryEditable) {
          this._isQueryEditable = isQueryEditable;
          this._updateTextTransform();
        },

        /**
         * @inheritDoc
         */
        setTextTransform: function(transform) {
          if (this._textTransform !== transform) {
            this._textTransform = transform;
            this._updateTextTransform();
          }
        },

        /**
         * @inheritDoc
         */
        getTextTransform: function() {
          return this.canInputText() ? this._textTransform : "none";
        },

        /**
         * @inheritDoc
         */
        removeTextTransform: function() {
          this._textTransform = 'none';
        },
        /**
         * update text transform behavior
         * @protected
         */
        _updateTextTransform: function() {},

        /**
         * @inheritDoc
         */
        setPlaceHolder: function(placeholder) {
          this.setAriaAttribute("placeholder", placeholder);
        }
      };
    });
  });
