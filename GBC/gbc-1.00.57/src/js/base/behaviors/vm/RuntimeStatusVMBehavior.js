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

modulum('RuntimeStatusVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class RuntimeStatusVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.RuntimeStatusVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.RuntimeStatusVMBehavior.prototype */ {
        __name: "RuntimeStatusVMBehavior",

        watchedAttributes: {
          anchor: ['runtimeStatus']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var uiNode = controller.getAnchorNode();
          var app = uiNode.getApplication();
          if (app) {
            var runtimeStatus = uiNode.attribute('runtimeStatus');
            if (runtimeStatus !== "childstart" && runtimeStatus !== "processing") {
              app.setIdle();
            }
            if (runtimeStatus === "childstart") {
              app.newTask();
            }
          }
        }
      };
    });
  });
