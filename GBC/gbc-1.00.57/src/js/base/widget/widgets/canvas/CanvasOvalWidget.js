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

modulum('CanvasOvalWidget', ['CanvasAbstractWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Button widget.
     * @class CanvasOvalWidget
     * @memberOf classes
     * @extends classes.CanvasAbstractWidget
     */
    cls.CanvasOvalWidget = context.oo.Class(cls.CanvasAbstractWidget, function($super) {
      return /** @lends classes.CanvasOvalWidget.prototype */ {
        __name: "CanvasOvalWidget",

        _initElement: function() {
          this._element = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
          $super._initElement.call(this);
        },

        setParameters: function(cx, cy, rx, ry) {
          this._element.setAttribute('cx', cx);
          this._element.setAttribute('cy', cy);
          this._element.setAttribute('rx', rx);
          this._element.setAttribute('ry', ry);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('CanvasOval', cls.CanvasOvalWidget);
  }
);
