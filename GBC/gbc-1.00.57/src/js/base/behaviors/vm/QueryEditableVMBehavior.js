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

modulum('QueryEditableVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class QueryEditableVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.QueryEditableVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.QueryEditableVMBehavior.prototype */ {
        __name: "QueryEditableVMBehavior",

        watchedAttributes: {
          decorator: ['queryEditable']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setQueryEditable) {
            var bindings = controller.getNodeBindings();
            var queryEditableNode = bindings.decorator ? bindings.decorator : bindings.anchor;
            var queryEditable = Boolean(queryEditableNode.attribute('queryEditable'));

            widget.setQueryEditable(queryEditable);
          }
        }
      };
    });
  });
