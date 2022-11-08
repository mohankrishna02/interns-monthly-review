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

modulum('CanvasTextParametersVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Behavior controlling the widget's Menu
     * @class CanvasTextParametersVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.CanvasTextParametersVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.CanvasTextParametersVMBehavior.prototype */ {
        __name: "CanvasTextParametersVMBehavior",

        watchedAttributes: {
          anchor: ['startX', 'startY', 'anchor', 'text']
        },
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var node = controller.getAnchorNode();
          var startX = node.attribute('startX');
          var startY = node.attribute('startY');
          var anchor = node.attribute('anchor');
          var text = node.attribute('text');

          var xTextAnchor = anchor.indexOf('e') !== -1 ? 'end' : anchor.indexOf('w') !== -1 ? 'start' : 'middle';
          var yTextAnchor = anchor.indexOf('s') !== -1 ? 'end' : anchor.indexOf('n') !== -1 ? 'start' : 'middle';

          var canvasWidget = controller.getWidget().getParentWidget();
          var box = canvasWidget.getLayoutInformation().getAvailable();
          var canvasWidth = box.getWidth();
          var canvasHeight = box.getHeight();
          if (typeof canvasWidth !== 'number') {
            canvasWidth = 0;
          }
          if (typeof canvasHeight !== 'number') {
            canvasHeight = 0;
          }

          controller.getWidget().setParameters(canvasWidth, canvasHeight, startX, startY, xTextAnchor, yTextAnchor, text);
        }
      };
    });
  });
