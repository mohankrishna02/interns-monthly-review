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

modulum('NotNullVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Handle field validation: NotNull
     * @class NotNullVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.NotNullVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.NotNullVMBehavior.prototype */ {
        __name: "NotNullVMBehavior",

        watchedAttributes: {
          container: ['notNull']
        },

        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setNotNull) {
            var containerNode = controller.getNodeBindings().container;
            var notNull = containerNode.attribute('notNull') === 1;
            widget.setNotNull(notNull);
          }
        }
      };
    });
  });
