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

modulum('DummyDateEditWidget', ['DateEditWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * DummyDateEdit widget.
     * @class DummyDateEditWidget
     * @memberOf classes
     * @extends classes.DateEditWidget
     */
    cls.DummyDateEditWidget = context.oo.Class(cls.DateEditWidget, function($super) {
      return /** @lends classes.DummyDateEditWidget.prototype */ {
        __name: "DummyDateEditWidget",
        __templateName: "DateEditWidget",
        _unboundField: null,

        _initElement: function(datetime) {
          $super._initElement.call(this, datetime);
          this._unboundField = document.createElement("div");
        },

        destroy: function() {
          $super.destroy.call(this);
          this._unboundField = null;
        },

        _onIconClick: function(event) {
          this._dropDown.getElement().appendChild(this._picker.el);
          $super._onIconClick.call(this, event);
        },

        _getPickerConf: function() {
          var pickerConf = $super._getPickerConf.call(this);
          pickerConf.field = this._unboundField;
          return pickerConf;
        },

        /**
         * @inheritDoc
         */
        setDate: function(date) {
          $super.setDate.call(this, date);

          // manually set date to unbound input field on dropdown opening
          if (this._dropDown.isVisible()) {
            var formattedDate = this.getDate();
            if (formattedDate !== this.getValue()) {
              this._inputElement.value = formattedDate;
            }
          }
        },

        // -- Calendar type specific functions --

        _onDateSelect: function(date) {
          this.setValue(context.moment(date).format(this._displayFormat));
          $super._onDateSelect.call(this, date);
        },

        /**
         * All input widgets in constructs are left aligned (because of search criteria)
         */
        setTextAlign: function(align) {
          this.setStyle("input", {
            "text-align": this.getStart()
          });
        }

      };
    });
    cls.WidgetFactory.registerBuilder('DummyDateEdit', cls.DummyDateEditWidget);
  });
