/// FOURJS_START_COPYRIGHT(D,2017)
/// Property of Four Js*
/// (c) Copyright Four Js 2017, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('StackLabelWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * StackLabel widget.
     * @class StackLabelWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.StackLabelWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.StackLabelWidget.prototype */ {
        __name: "StackLabelWidget",

        _text: null,
        _textElement: null,

        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.LeafLayoutEngine(this);
        },

        _initElement: function() {
          $super._initElement.call(this);
          this._textElement = this.getElement();
          this.setHidden(true);
        },
        destroy: function() {
          $super.destroy.call(this);
        },
        setText: function(text) {
          this._setTextContent(text, "_textElement");
          this._text = text;
          this.setHidden(!text);
        },
        setHidden: function(hidden) {
          $super.setHidden.call(this, hidden || !this._text);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('StackLabel', cls.StackLabelWidget);
  });
