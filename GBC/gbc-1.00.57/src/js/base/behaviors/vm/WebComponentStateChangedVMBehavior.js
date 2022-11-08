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

modulum('WebComponentStateChangedVMBehavior', ['BackgroundColorVMBehavior'],
  function(context, cls) {
    /**
     * @class WebComponentStateChangedVMBehavior
     * @memberOf classes
     * @extends classes.BackgroundColorVMBehavior
     */
    cls.WebComponentStateChangedVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.WebComponentStateChangedVMBehavior.prototype */ {
        __name: "WebComponentStateChangedVMBehavior",

        watchedAttributes: {
          container: ['active', 'dialogType']
        },

        /**
         * Applies the background color only if it has been defined by the VM, use default value otherwise.
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.onStateChanged) {
            var containerNode = controller.getNodeBindings().container;
            var active = containerNode.attribute('active');
            var dialogType = containerNode.attribute('dialogType');
            widget.onStateChanged(active, dialogType);
          }

        }
      };
    });
  });
