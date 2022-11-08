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

modulum('CanvasArcWidget', ['CanvasAbstractWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * CanvasArc widget.
     * @class CanvasArcWidget
     * @memberOf classes
     * @extends classes.CanvasAbstractWidget
     */
    cls.CanvasArcWidget = context.oo.Class(cls.CanvasAbstractWidget, function($super) {
      return /** @lends classes.CanvasArcWidget.prototype */ {
        __name: "CanvasArcWidget",

        _initElement: function() {
          this._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
          $super._initElement.call(this);
        },

        setParameters: function(startX, startY, diameter, startDegrees, extentDegrees) {
          var startAngle = (extentDegrees >= 0 ? startDegrees : startDegrees + extentDegrees) * Math.PI / 180;
          var endAngle = (extentDegrees >= 0 ? startDegrees + extentDegrees : startDegrees) * Math.PI / 180;

          var d2 = diameter / 2;
          var r = Math.abs(d2);
          var cx = startX + d2;
          var cy = startY - d2;

          var x1 = cx + r * Math.cos(startAngle);
          var y1 = cy + r * Math.sin(startAngle);
          var x2 = cx + r * Math.cos(endAngle);
          var y2 = cy + r * Math.sin(endAngle);

          var largeArcFlag = Math.abs(extentDegrees) < 180 ? 0 : 1;

          var d = "M " + cx + " " + cy + " " +
            "L " + x1 + " " + y1 + " " +
            "A " + r + " " + r + " 0 " + largeArcFlag + " 1 " + x2 + " " + y2 + " " +
            "Z";

          this._element.setAttribute('d', d);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('CanvasArc', cls.CanvasArcWidget);
  }
);
