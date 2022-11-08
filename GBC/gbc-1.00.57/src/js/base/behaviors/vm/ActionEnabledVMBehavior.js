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

modulum('ActionEnabledVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Behavior controlling the widget's Menu
     * @class ActionEnabledVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.ActionEnabledVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.ActionEnabledVMBehavior.prototype */ {
        __name: "ActionEnabledVMBehavior",

        watchedAttributes: {
          anchor: ['active'],
          parent: ['active']
        },

        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var bindings = controller.getNodeBindings();
          var activeValue = bindings.anchor.attribute('active');
          var parentActiveValue = bindings.parent.attribute('active');

          // enable/disable accelerators
          var appService = bindings.anchor.getApplication().getActionApplicationService();
          if (activeValue && parentActiveValue) {
            appService.registerAction(bindings.anchor);
          } else {
            appService.destroyAction(bindings.anchor);
          }
        },

        /**
         * @inheritDoc
         */
        _detach: function(controller, data) {
          var anchorNode = controller.getAnchorNode();
          var actionService = anchorNode.getApplication().getActionApplicationService();
          actionService.destroyAction(anchorNode);
        }
      };
    });
  });
