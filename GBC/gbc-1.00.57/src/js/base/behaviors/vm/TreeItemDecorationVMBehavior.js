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

modulum('TreeItemDecorationVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class TreeItemDecorationVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.TreeItemDecorationVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.TreeItemDecorationVMBehavior.prototype */ {
        __name: "TreeItemDecorationVMBehavior",

        watchedAttributes: {
          anchor: ['expanded', 'hasChildren', 'row']
        },

        /**
         * @param {classes.ControllerBase} controller
         * @param {Object} data
         */
        setup: function(controller, data) {
          data.depth = 0;
          var n = controller.getAnchorNode().getParentNode();
          while (n && n.getTag() === 'TreeItem') {
            n = n.getParentNode();
            ++data.depth;
          }
        },
        /**
         *
         */
        _apply: function(controller, data) {
          var treeItemNode = controller.getAnchorNode();
          var treeViewColumnNode = treeItemNode.getAncestor('Table').getFirstChild('TableColumn');
          treeItemNode.getAncestor('Table').getWidget().setAriaRole("tree");
          var treeItemChildren = treeItemNode.getParentNode().getChildren();
          var row = treeItemNode.attribute('row');
          if (row !== -1) {
            var valueList = treeViewColumnNode.getFirstChild("ValueList");
            if (valueList) {
              var valueNode = valueList.getChildren()[row];
              if (valueNode) {
                valueNode.getController().getNodeBindings().treeItem = treeItemNode; // set treeItem binding for value node
                var hasChildren = treeItemNode.attribute('hasChildren') !== 0;
                var isExpanded = hasChildren && treeItemNode.attribute('expanded') !== 0;
                var treeViewColumnWidget = treeViewColumnNode.getController().getWidget(),
                  cellWidget = treeViewColumnWidget.getColumnItem(row);
                if (cellWidget) {
                  cellWidget.setAriaRole("treeitem");
                  cellWidget.setAriaAttribute("setsize", treeItemChildren.length);
                  cellWidget.setAriaAttribute("posinset", treeItemChildren.indexOf(treeItemNode) + 1);
                  cellWidget.setDepth(data.depth);
                  cellWidget.setLeaf(!hasChildren);
                  if (hasChildren) {
                    cellWidget.setAriaExpanded(isExpanded.toString());
                    cellWidget.setExpanded(isExpanded);
                  }
                }
              }
            }
          }
        }
      };
    });
  });
