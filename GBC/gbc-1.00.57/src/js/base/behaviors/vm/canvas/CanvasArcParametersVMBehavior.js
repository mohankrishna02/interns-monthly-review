/// FOURJS_START_COPYRIGHT(D,2014)
/// Property of Four Js*
/// (c) Copyright Four Js 2014, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('CanvasArcParametersVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Behavior controlling the widget's Menu
     * @class CanvasArcParametersVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.CanvasArcParametersVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.CanvasArcParametersVMBehavior.prototype */ {
        __name: "CanvasArcParametersVMBehavior",

        watchedAttributes: {
          anchor: ['startX', 'startY', 'diameter', 'startDegrees', 'extentDegrees']
        },
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var node = controller.getAnchorNode();
          var startX = node.attribute('startX');
          var startY = node.attribute('startY');
          var diameter = node.attribute('diameter');
          var startDegrees = node.attribute('startDegrees');
          var extentDegrees = node.attribute('extentDegrees');

          var startAngle = (extentDegrees >= 0 ? startDegrees : startDegrees + extentDegrees) * Math.PI / 180;
          var endAngle = (extentDegrees >= 0 ? startDegrees + extentDegrees : startDegrees) * Math.PI / 180;

          var d2 = diameter / 2;
          var r = Math.abs(d2);
          var cx = startX + d2;
          var xy = startY - d2;

          var x1 = cx + r * Math.cos(startAngle);
          var y1 = cx + r * Math.sin(startAngle);
          var x2 = cx + r * Math.cos(endAngle);
          var y2 = cx + r * Math.sin(endAngle);

          var largeArcFlag = Math.abs(extentDegrees) < 180 ? 0 : 1;
          var sweepFlag = largeArcFlag === 0 ? 1 : 0;

          controller.getWidget().setParameters(startX, startY, diameter, startDegrees, extentDegrees);
        }
      };
    });
  });
