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

modulum('CanvasRectangleWidget', ['CanvasAbstractWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Button widget.
     * @class CanvasRectangleWidget
     * @memberOf classes
     * @extends classes.CanvasAbstractWidget
     */
    cls.CanvasRectangleWidget = context.oo.Class(cls.CanvasAbstractWidget, function($super) {
      return /** @lends classes.CanvasRectangleWidget.prototype */ {
        __name: "CanvasRectangleWidget",

        _initElement: function() {
          this._element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          $super._initElement.call(this);
        },

        setParameters: function(x, y, width, height) {
          this._element.setAttribute('x', x);
          this._element.setAttribute('y', y);
          this._element.setAttribute('width', width);
          this._element.setAttribute('height', height);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('CanvasRectangle', cls.CanvasRectangleWidget);
  }
);
