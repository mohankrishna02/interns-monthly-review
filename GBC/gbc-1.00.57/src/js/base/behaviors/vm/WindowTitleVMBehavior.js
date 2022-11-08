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

modulum('WindowTitleVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class WindowTitleVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.WindowTitleVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.WindowTitleVMBehavior.prototype */ {
        __name: "WindowTitleVMBehavior",

        watchedAttributes: {
          anchor: ['name', 'text']
        },

        /**
         * Switches the current window
         */
        _apply: function(controller, data) {
          var anchorNode = controller.getAnchorNode();
          var text = anchorNode.attribute('text');
          var name = anchorNode.attribute('name');
          controller.getWidget().getSidebarWidget().setWindowName(text || name);
        }
      };
    });
  });
