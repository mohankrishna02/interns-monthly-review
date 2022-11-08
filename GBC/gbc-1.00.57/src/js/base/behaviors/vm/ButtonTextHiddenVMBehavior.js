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

modulum('ButtonTextHiddenVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class ButtonTextHiddenVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.ButtonTextHiddenVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.ButtonTextHiddenVMBehavior.prototype */ {
        __name: "ButtonTextHiddenVMBehavior",

        watchedAttributes: {
          anchor: ['buttonTextHidden']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setButtonTextHidden) {
            var buttonTextHidden = controller.getAnchorNode().attribute('buttonTextHidden');
            widget.setButtonTextHidden(buttonTextHidden);
          }
        }
      };
    });
  });
