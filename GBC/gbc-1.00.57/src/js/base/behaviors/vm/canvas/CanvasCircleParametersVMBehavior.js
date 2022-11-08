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

modulum('CanvasCircleParametersVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Behavior controlling the widget's Menu
     * @class CanvasCircleParametersVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.CanvasCircleParametersVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.CanvasCircleParametersVMBehavior.prototype */ {
        __name: "CanvasCircleParametersVMBehavior",

        watchedAttributes: {
          anchor: ['startX', 'startY', 'diameter']
        },
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var node = controller.getAnchorNode();
          var startX = node.attribute('startX');
          var startY = node.attribute('startY');
          var diameter = node.attribute('diameter');
          var radius = diameter / 2;
          controller.getWidget().setParameters(startX + radius, startY - radius, Math.abs(radius));
        }
      };
    });
  });
