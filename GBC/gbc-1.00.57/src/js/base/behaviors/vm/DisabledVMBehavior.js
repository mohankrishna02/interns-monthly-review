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

modulum('DisabledVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Behavior controlling the StartMenuCommand's 'Disable' state
     * @class DisabledVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.DisabledVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.DisabledVMBehavior.prototype */ {
        __name: "DisabledVMBehavior",

        watchedAttributes: {
          anchor: ['disabled']
        },

        /**
         * Sets the widget 'enabled' or  'disabled' depending on the AUI tree state.
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setEnabled) {
            var disabled = controller.getAnchorNode().attribute('disabled');
            widget.setEnabled(!disabled);
          }
        }
      };
    });
  });
