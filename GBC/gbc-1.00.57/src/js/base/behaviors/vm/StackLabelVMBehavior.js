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

modulum('StackLabelVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class StackLabelVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.StackLabelVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.StackLabelVMBehavior.prototype */ {
        __name: "StackLabelVMBehavior",

        watchedAttributes: {
          anchor: ['text']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.getParentWidget() && widget.getParentWidget().setStackLabelText) {
            var bindings = controller.getNodeBindings();
            var textNode = bindings.anchor;
            var text = textNode.attribute('text');
            widget.getParentWidget().setStackLabelText(widget, text);
          }
        }
      };
    });
  });
