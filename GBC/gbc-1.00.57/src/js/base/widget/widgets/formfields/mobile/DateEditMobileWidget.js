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

modulum('DateEditMobileWidget', ['DateEditWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * DateEdit widget Mobile.
     * Limitations: you cannot use some 4ST : daysOff, firstDayOfWeek, showCurrentMonthOnly, showWeekNumber
     * @class DateEditMobileWidget
     * @memberOf classes
     * @extends classes.DateEditWidgetBase
     * @publicdoc Widgets
     */
    cls.DateEditMobileWidget = context.oo.Class(cls.DateEditWidgetBase, function($super) {
      return /** @lends classes.DateEditMobileWidget.prototype */ {
        __name: 'DateEditMobileWidget',

        /**
         * @type {Node}
         */
        _pickerLabel: null,

        // TODO cleaning it should have no pikaday in mobile version ?

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);

          this._inputElement.setAttribute("data-date", "");

          // Trick to open picker when touching icon
          this._inputElement.setAttribute("id", this.getRootClassName() + "_input");
          this._pickerLabel = this._element.getElementsByTagName("label")[0];
          this._pickerLabel.setAttribute("for", this.getRootClassName() + "_input");

          this._inputElement.on("change.DateEditMobileWidget", function(event) {
            if (this.isEnabled()) {
              var valueAsDate = event.target.valueAsDate;
              if (valueAsDate) {
                var d = {
                  year: valueAsDate.getUTCFullYear(),
                  month: valueAsDate.getUTCMonth() + 1,
                  day: valueAsDate.getUTCDate()
                };
                var momentDate = gbc.moment(d.year + "-" + d.month + "-" + d.day, "YYYY-MM-DD");
                if (momentDate.isValid()) {
                  this.setValue(momentDate.format(this._displayFormat));
                }
              } else {
                this.setValue("");
              }
              this.emit(context.constants.widgetEvents.change);
            }
          }.bind(this));
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._inputElement.off("change.DateEditMobileWidget");
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          this._onRequestFocus(domEvent); // request focus
          return true;
        },

        /**
         * @inheritDoc
         */
        setValue: function(value, fromVM) {
          // if from VM, convert it to good format, so it can open the picker at the right date!
          if (fromVM) {
            var dateObj = context.moment(value, this._displayFormat);
            if (dateObj.isValid()) {
              this._inputElement.value = dateObj.format("YYYY-MM-DD");
            } else {
              this._inputElement.value = value;
            }
          }
          this._inputElement.setAttribute("data-date", value);
        },

        /**
         * @inheritDoc
         */
        getValue: function() {
          return this._inputElement.getAttribute("data-date");
        }

      };
    });
  });
