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

modulum('DateTimeEditWidgetBase', ['DateEditWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * DateTimeEdit widget Base.
     * @class DateTimeEditWidgetBase
     * @memberOf classes
     * @extends classes.DateEditWidgetBase
     * @publicdoc Widgets
     */
    cls.DateTimeEditWidgetBase = context.oo.Class(cls.DateEditWidgetBase, function($super) {
      return /** @lends classes.DateTimeEditWidgetBase.prototype */ {
        __name: 'DateTimeEditWidgetBase',
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
        setFormat: function(format) {
          this._displayFormat = format;
          this._showSeconds = Boolean(format && ~format.toLowerCase().indexOf('s'));
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          $super.destroy.call(this);
        }

      };
    });
  });
