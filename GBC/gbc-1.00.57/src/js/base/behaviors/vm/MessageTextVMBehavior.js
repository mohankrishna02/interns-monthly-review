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

modulum('MessageTextVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class MessageTextVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.MessageTextVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.MessageTextVMBehavior.prototype */ {
        __name: "MessageTextVMBehavior",

        watchedAttributes: {
          anchor: ['text'],
          decorator: ['text']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setText) {
            var bindings = controller.getNodeBindings();
            var textNode = bindings.decorator && bindings.decorator.isAttributeSetByVM('text') ? bindings.decorator : bindings.anchor;
            var text = textNode.attribute('text');
            widget.setText(text);
          }
        }
      };
    });
  });
