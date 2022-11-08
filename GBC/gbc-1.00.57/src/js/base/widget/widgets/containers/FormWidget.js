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

modulum('FormWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Form widget.
     * @class FormWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     * @publicdoc Widgets
     */
    cls.FormWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.FormWidget.prototype */ {
        __name: "FormWidget",
        /**
         * title of the current form
         * @type {?string}
         */
        _text: null,
        _scrollValues: null,

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.FormLayoutInformation(this);
          this._layoutEngine = new cls.FormLayoutEngine(this);
        },

        /**
         * @inheritDoc
         */
        addChildWidget: function(widget, options) {
          if (this._children.length !== 0) {
            throw "A form can only contain a single child";
          }
          $super.addChildWidget.call(this, widget, options);
        },

        /**
         * @param {string} text title of the current form
         */
        setText: function(text) {
          this._text = text;
        },

        /**
         * @returns {string} title of the current form
         */
        getText: function() {
          return this._text;
        }
      };
    });
    cls.WidgetFactory.registerBuilder('Form', cls.FormWidget);
  });
