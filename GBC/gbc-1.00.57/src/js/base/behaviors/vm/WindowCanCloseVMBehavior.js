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

modulum('WindowCanCloseVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class WindowCanCloseVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.WindowCanCloseVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.WindowCanCloseVMBehavior.prototype */ {
        /** @type {string} */
        __name: "WindowCanCloseVMBehavior",

        watchedAttributes: {
          parent: ['active'],
          anchor: ['active']
        },
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var anchorNode = controller.getAnchorNode(),
            windowNode = anchorNode && anchorNode.getAncestor('Window'),
            windowController = windowNode && windowNode.getController(),
            windowWidget = windowController && windowController.getWidget();
          if (windowWidget && windowWidget.setClosable) {
            var activeValue = anchorNode.attribute('active');
            windowWidget.setClosable(activeValue);
          }
        },

        /**
         * @inheritDoc
         */
        _detach: function(controller) {
          var anchorNode = controller.getAnchorNode(),
            windowNode = anchorNode && anchorNode.getAncestor('Window'),
            windowController = windowNode && windowNode.getController(),
            windowWidget = windowController && windowController.getWidget();
          if (windowWidget && windowWidget.setClosable) {
            windowWidget.setClosable(false);
          }
        }
      };
    });
  });
