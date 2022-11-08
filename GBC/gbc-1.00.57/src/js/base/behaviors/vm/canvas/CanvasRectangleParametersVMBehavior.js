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

modulum('CanvasRectangleParametersVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Behavior controlling the widget's Menu
     * @class CanvasRectangleParametersVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.CanvasRectangleParametersVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.CanvasRectangleParametersVMBehavior.prototype */ {
        __name: "CanvasRectangleParametersVMBehavior",

        watchedAttributes: {
          anchor: ['startX', 'startY', 'endX', 'endY']
        },
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var node = controller.getAnchorNode();
          var startX = node.attribute('startX');
          var startY = node.attribute('startY');
          var endX = node.attribute('endX');
          var endY = node.attribute('endY');
          // Normalize
          var x = Math.min(startX, endX);
          var y = Math.min(startY, endY);
          var width = Math.abs(endX - startX);
          var height = Math.abs(endY - startY);
          controller.getWidget().setParameters(x, y, width, height);
        }
      };
    });
  });
