/// FOURJS_START_COPYRIGHT(D,2015)
/// Property of Four Js*
/// (c) Copyright Four Js 2015, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

'use strict';

modulum('ToggleCheckBoxWidget', ['CheckBoxWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Toggle Checkbox widget. Like a switch
     * @class ToggleCheckBoxWidget
     * @memberOf classes
     * @extends classes.CheckBoxWidget
     * @publicdoc Widgets
     */
    cls.ToggleCheckBoxWidget = context.oo.Class(cls.CheckBoxWidget, function($super) {
      return /** @lends classes.ToggleCheckBoxWidget.prototype */ {
        __name: 'ToggleCheckBoxWidget',
        __dataContentPlaceholderSelector: cls.WidgetBase.selfDataContent,

        /** @type {Boolean} **/
        _threeState: false,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._checkboxElement = this._element.getElementsByClassName('switch')[0];
        },

        /**
         * Set the value and change the widget visual as well
         * @param {string|number} value - the value to set
         * @param {boolean=} fromVM - true if value comes from the VM
         * @publicdoc
         */
        setValue: function(value, fromVM) {
          $super.setValue.call(this, value);
          this._checkboxElement.querySelector('input').checked = (value === this._checkedValue);
          this.setAriaAttribute("checked", value); // ensure it's a stringified boolean
        },

        /**
         * Will get the next value : forced to check / uncheck since toggle is only 2 states
         * @return {string|number} the checked or unchecked value
         * @publicdoc
         */
        getNextValue: function() {
          var current = this._value;
          if (current === this._uncheckedValue) {
            return this._checkedValue;
          } else if (current === this._checkedValue) {
            return this._uncheckedValue;
          }
        },

        /**
         * Get the current value of the widget according to its state
         * @return {string|number} the current value of the widget
         * @publicdoc
         */
        getValue: function() {
          var checkBox = this._checkboxElement.querySelector('input');
          if (checkBox.checked) {
            return this._checkedValue;
          } else {
            return this._uncheckedValue;
          }
        },

        /**
         * Allow/disallow widget user interaction.
         * @param {boolean} enabled - the wanted state
         * @publicdoc
         */
        setEnabled: function(enabled) {
          var checkBox = this._checkboxElement.querySelector('input');
          checkBox.disabled = !enabled;
          $super.setEnabled.call(this, enabled);
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          domEvent.preventCancelableDefault(); // click should not change automatically checkbox it is done by manageMouseClick
          return $super.manageMouseClick.call(this, domEvent);
        },

      };
    });

    cls.WidgetFactory.registerBuilder('CheckBox[customWidget=toggleButton]', cls.ToggleCheckBoxWidget);
    cls.WidgetFactory.registerBuilder('ToggleCheckBox', cls.ToggleCheckBoxWidget);
  });
