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

modulum('DateTimeEditWidget', ['DateEditWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * DateTimeEdit widget.
     * @class DateTimeEditWidget
     * @memberOf classes
     * @extends classes.DateEditWidget
     * @publicdoc Widgets
     */
    cls.DateTimeEditWidget = context.oo.Class(cls.DateEditWidget, function($super) {
      return /** @lends classes.DateTimeEditWidget.prototype */ {
        __name: 'DateTimeEditWidget',

        /**
         * Override dateedit max height coeff
         */
        _coeffMaxHeight: 425,

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.LeafLayoutEngine(this);
            this._layoutInformation.setSingleLineContentOnly(true);
          }
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this, true);
          // default datetime format
          this._displayFormat = 'MM/DD/YYYY HH:mm:ss';
        },

        /**
         * @inheritDoc
         */
        _getPickerConf: function() {
          var pickerConf = $super._getPickerConf.call(this);
          pickerConf.showTime = true;
          pickerConf.showSeconds = this._showSeconds;
          return pickerConf;
        },

        /**
         * @inheritDoc
         */
        setFormat: function(format) {
          $super.setFormat.call(this, format);
          this._showSeconds = Boolean(~format.toLowerCase().indexOf('s'));
          if (this._picker) {
            this._picker.destroy();
          }
          this.initDatePicker();
        }

      };
    });
    cls.WidgetFactory.registerBuilder('DateTimeEdit', cls.DateTimeEditWidget);
  });
