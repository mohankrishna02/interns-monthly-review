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

modulum('DateTimeEditMobileWidget', ['DateTimeEditWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * DateTimeEdit widget.
     * @class DateTimeEditMobileWidget
     * @memberOf classes
     * @extends classes.DateTimeEditWidgetBase
     * @publicdoc Widgets
     */
    cls.DateTimeEditMobileWidget = context.oo.Class(cls.DateTimeEditWidgetBase, function($super) {
      return /** @lends classes.DateTimeEditMobileWidget.prototype */ {
        __name: 'DateTimeEditMobileWidget',

        /**
         * @inheritDoc
         */
        __dataContentPlaceholderSelector: '.gbc_dataContentPlaceholder',

        /**
         * Active/disable seconds for the widget. By default yes.
         * @type {boolean}
         */
        _showSeconds: false,

        /**
         * @inheritDoc
         */
        _displayFormat: null,

        /**
         * @inheritDoc
         */
        _maxLength: -1,

        /**
         * @type {Node}
         */
        _pickerLabel: null,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this, true);
          // default datetime format
          this._displayFormat = 'MM/DD/YYYY HH:mm:ss';

          this._inputElement.on('touchstart.DateTimeEditWidgetBase', this._onRequestFocus.bind(this));

          // Trick to open picker when touching icon
          this._inputElement.setAttribute("id", this.getRootClassName() + "_input");
          this._pickerLabel = this._element.getElementsByTagName("label")[0];
          this._pickerLabel.setAttribute("for", this.getRootClassName() + "_input");
          this._inputElement.on("change.DateTimeEditWidgetBase", function(event) {
            this.setValue(event.target.value);
            this.emit(context.constants.widgetEvents.change);
          }.bind(this));
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._inputElement.off("change.DateTimeEditWidgetBase");
          $super.destroy.call(this);
        },

        /**
         * Overrided to prevent pikaday picker to open
         * // TODO it seems to be never called, there is pikaday in mobile
         */
        _onIconClick: function(event) {
          event.stopPropagation();
          // if widget already has VM focus, we need to explicitly set focus to input when clicking on dateedit icon, otherwise keyboard binding are not trapped.
          // if widget doesn't have VM focus, VM will set focus to input.
          if (this.hasVMFocus() && this.isEnabled() && !this.isModal()) {
            this._inputElement.domFocus();
          }
          this._onRequestFocus(event); // request focus
        },

        /**
         * @inheritDoc
         */
        setValue: function(value, fromVM) {
          var dateObj;
          // if from VM, convert it to good format, so it can open the picker at the right date
          if (value) {
            if (fromVM) {
              dateObj = context.moment(value, this._displayFormat);
              if (dateObj.isValid()) {
                this._inputElement.value = dateObj.format("YYYY-MM-DDTHH:mm:ss");
              }
            } else {
              dateObj = context.moment(value, "YYYY-MM-DDTHH:mm:ss");
            }
            this._inputElement.setAttribute("data-date", dateObj.format(this._displayFormat));
          } else { // manage null/empty value
            if (fromVM) {
              this._inputElement.value = value;
            }
            this._inputElement.setAttribute("data-date", value);
          }
        },

        /**
         * @inheritDoc
         */
        getValue: function() {
          return this._inputElement.getAttribute("data-date");
        },

        /**
         * @inheritDoc
         */
        setFormat: function(format) {
          $super.setFormat.call(this, format);
          if (this._showSeconds) {
            // Display seconds
            this.getInputElement().setAttribute("step", "1");
          } else {
            this.getInputElement().removeAttribute("step");
          }
        }
      };
    });
  });
