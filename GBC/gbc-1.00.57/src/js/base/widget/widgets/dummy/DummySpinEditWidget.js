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

modulum('DummySpinEditWidget', ['SpinEditWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * SpinEdit widget.
     * @class DummySpinEditWidget
     * @memberOf classes
     * @extends classes.SpinEditWidget
     */
    cls.DummySpinEditWidget = context.oo.Class(cls.SpinEditWidget, function($super) {
      return /** @lends classes.DummySpinEditWidget.prototype */ {
        __name: "DummySpinEditWidget",
        __templateName: "SpinEditWidget",

        /**
         * @inheritDoc
         */
        _processKey: function(event, keyString) {

        },

        /**
         * @inheritDoc
         */
        getValue: function() {
          var value = parseInt(this._inputElement.value, 10);
          var isDefined = Object.isNumber(value) && !Object.isNaN(value);
          return isDefined ? value : this._inputElement.value;
        },

        /**
         * All input widgets in constructs are left aligned (because of search criteria)
         */
        setTextAlign: function(align) {
          this.setStyle("input", {
            "text-align": this.getStart()
          });
        },

      };
    });
    cls.WidgetFactory.registerBuilder('DummySpinEdit', cls.DummySpinEditWidget);
  });
