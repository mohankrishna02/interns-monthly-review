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

modulum('CanvasPolygonWidget', ['CanvasAbstractWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Button widget.
     * @class CanvasPolygonWidget
     * @memberOf classes
     * @extends classes.CanvasAbstractWidget
     */
    cls.CanvasPolygonWidget = context.oo.Class(cls.CanvasAbstractWidget, function($super) {
      return /** @lends classes.CanvasPolygonWidget.prototype */ {
        __name: "CanvasPolygonWidget",

        _initElement: function() {
          this._element = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
          $super._initElement.call(this);
        },

        setParameters: function(points) {
          var pointsStr = "";
          for (var i = 0; i < points.length; i = i + 2) {
            if (i !== 0) {
              pointsStr += ' ';
            }
            pointsStr += points[i + 1] + ',' + points[i];
          }
          this._element.setAttribute('points', pointsStr);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('CanvasPolygon', cls.CanvasPolygonWidget);
  }
);
