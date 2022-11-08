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

modulum('CanvasLineWidget', ['CanvasAbstractWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Button widget.
     * @class CanvasLineWidget
     * @memberOf classes
     * @extends classes.CanvasAbstractWidget
     */
    cls.CanvasLineWidget = context.oo.Class(cls.CanvasAbstractWidget, function($super) {
      return /** @lends classes.CanvasLineWidget.prototype */ {
        __name: "CanvasLineWidget",

        _initElement: function() {
          this._element = document.createElementNS("http://www.w3.org/2000/svg", "line");
          this._element.setAttribute('stroke-width', "2px");
          $super._initElement.call(this);
        },

        setParameters: function(x1, y1, x2, y2) {
          this._element.setAttribute('x1', x1);
          this._element.setAttribute('y1', y1);
          this._element.setAttribute('x2', x2);
          this._element.setAttribute('y2', y2);
        },

        setColor: function(color) {
          this._element.setAttribute('stroke', color);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('CanvasLine', cls.CanvasLineWidget);
  }
);
