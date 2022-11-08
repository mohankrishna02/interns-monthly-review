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

modulum('ApplicationTitleVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class ApplicationTitleVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.ApplicationTitleVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.ApplicationTitleVMBehavior.prototype */ {
        __name: "ApplicationTitleVMBehavior",

        watchedAttributes: {
          anchor: ['name', 'text']
        },

        /**
         * Switches the current window
         */
        _apply: function(controller, data) {
          var anchor = controller.getAnchorNode();
          var text = anchor.attribute('text');
          var name = anchor.attribute('name');
          anchor.getApplication().getUI().getWidget().getSidebarWidget().setApplicationName(text || name);
        }
      };
    });
  });
