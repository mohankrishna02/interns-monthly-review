/// FOURJS_START_COPYRIGHT(D,2017)
/// Property of Four Js*
/// (c) Copyright Four Js 2017, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('FocusOnFieldVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class FocusOnFieldVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.FocusOnFieldVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.FocusOnFieldVMBehavior.prototype */ {
        __name: "FocusOnFieldVMBehavior",

        watchedAttributes: {
          anchor: ['focusOnField']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setFocusOnField) {
            var focusOnField = (controller.getAnchorNode().attribute('focusOnField') === 1);
            widget.setFocusOnField(focusOnField);
          }

        }
      };
    });
  });
