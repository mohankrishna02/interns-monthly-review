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

modulum('TableSizeVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Behavior controlling the the change of size in a table
     * @class TableSizeVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.TableSizeVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.TableSizeVMBehavior.prototype */ {
        __name: "TableSizeVMBehavior",

        watchedAttributes: {
          table: ['size']
        },
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          if (controller && controller.changeWidgetKind) {
            var tableColumnNode = controller.getNodeBindings().container;
            var dialogType = tableColumnNode.attribute('dialogType');
            var active = tableColumnNode.attribute('active');
            var hasChanged = controller.changeWidgetKind(dialogType, active);
            var widget = controller.getWidget();
            if (widget && widget.getParentWidget() && widget.getParentWidget().updateVisibility) {
              widget.getParentWidget().updateVisibility();
            }
            var treeItem = controller.getNodeBindings().treeItem;
            if (treeItem) {
              treeItem.applyBehaviors(null, true, true);
            }
            return hasChanged; // return true to force apply of next behaviors
          }
          return false;
        }
      };
    });
  });
