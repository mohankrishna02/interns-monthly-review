/// FOURJS_START_COPYRIGHT(D,2016)
/// Property of Four Js*
/// (c) Copyright Four Js 2016, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('PageSizeVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Behavior
     * @class PageSizeVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.PageSizeVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.PageSizeVMBehavior.prototype */ {
        __name: "PageSizeVMBehavior",

        watchedAttributes: {
          anchor: ['pageSize']
        },

        /**
         * Updates pageSize
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setPageSize) {
            var anchorNode = controller.getAnchorNode();
            var pageSize = anchorNode.attribute('pageSize');
            widget.setPageSize(pageSize);
          }
        }
      };
    });
  });
