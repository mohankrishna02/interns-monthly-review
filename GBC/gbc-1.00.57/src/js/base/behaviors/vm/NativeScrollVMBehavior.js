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

modulum('NativeScrollVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class NativeScrollVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.NativeScrollVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.NativeScrollVMBehavior.prototype */ {
        __name: "NativeScrollVMBehavior",

        watchedAttributes: {
          anchor: ['offset', 'size', 'pageSize', 'active']
        },
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var node = controller.getAnchorNode();
          var widget = controller.getWidget();

          if (widget && widget.updateContentPosition) {
            controller.requestOffsetPending = false;
            var active = node.attribute('active');
            var pageSize = node.attribute('pageSize');
            // If the container isn't active, consider it as empty.
            // The DVM doesn't set size and offset to 0 when exiting the current dialog (DISPLAY ARRAY or INPUT ARRAY)
            // This avoids the container to remain scrollable on inactive Tables and ScrollGrids
            var size = active ? node.attribute('size') : 0;
            var offset = active ? node.attribute('offset') : 0;
            widget.updateContentPosition(size, pageSize, offset);
          }
        }
      };
    });
  });
