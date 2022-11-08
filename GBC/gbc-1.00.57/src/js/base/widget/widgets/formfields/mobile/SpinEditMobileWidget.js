/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

'use strict';

modulum('SpinEditMobileWidget', ['SpinEditWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * SpinEdit Mobile widget.
     * @class SpinEditMobileWidget
     * @memberOf classes
     * @extends classes.SpinEditWidgetBase
     * @publicdoc Widgets
     *
     * ignore step attr
     */
    cls.SpinEditMobileWidget = context.oo.Class(cls.SpinEditWidgetBase, function($super) {
      return /** @lends classes.SpinEditMobileWidget.prototype */ {
        __name: 'SpinEditMobileWidget',

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this.getElement().on('touchstart.SpinEditMobileWidget', this._onTouch.bind(this));
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this.getElement().off('touchstart.SpinEditMobileWidget');
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        _onTouch: function(event) {
          if (this.isEnabled()) {
            this._inputElement.setAttribute("placeholder", this._inputElement.value);
            this._inputElement.value = "";
          }
          this._onRequestFocus(event); // request focus
        },

        /**
         * @inheritDoc
         */
        _onInput: function() {
          $super._onInput.call(this);

          // Check value
          var curVal = this.getValue();
          if (this._max && curVal > this._max) {
            this.setValue(this._max);
          }
          if (this._min && curVal < this._min) {
            this.setValue(this._min);
          }
        },

        /**
         * @inheritDoc
         */
        getValue: function() {
          // Use vm value if not defined
          var value = parseInt(this._inputElement.value, 10);
          var isDefined = Object.isNumber(value) && !Object.isNaN(value);
          return isDefined ? value : this._oldValue;
        },

        /**
         * @inheritDoc
         */
        loseFocus: function() {
          if (this._inputElement.value === "") {
            this._inputElement.value = this._oldValue;
          }
        }
      };
    });
  });
