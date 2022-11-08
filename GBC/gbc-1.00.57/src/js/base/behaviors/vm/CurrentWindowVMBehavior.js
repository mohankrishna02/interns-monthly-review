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

modulum('CurrentWindowVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class CurrentWindowVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.CurrentWindowVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.CurrentWindowVMBehavior.prototype */ {
        __name: "CurrentWindowVMBehavior",

        watchedAttributes: {
          anchor: ['currentWindow']
        },
        /**
         * Switches the current window
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setCurrentWindowId) {
            var currentWindowId = controller.getAnchorNode().attribute('currentWindow');
            widget.setCurrentWindowId(currentWindowId);
          }
        }
      };
    });
  });
