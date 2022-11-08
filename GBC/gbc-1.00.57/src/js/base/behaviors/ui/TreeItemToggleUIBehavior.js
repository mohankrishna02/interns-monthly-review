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

modulum('TreeItemToggleUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class TreeItemToggleUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.TreeItemToggleUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.TreeItemToggleUIBehavior.prototype */ {
        __name: "TreeItemToggleUIBehavior",

        /**
         * @protected
         */
        _attachWidget: function(controller, data) {
          var treeViewColumnWidget = controller.getWidget();
          if (treeViewColumnWidget) {
            data.onClickHandle = treeViewColumnWidget.when(context.constants.widgetEvents.toggleClick, this._toggleState.bind(this,
              controller, data));
          }

        },

        /**
         * @protected
         */
        _detachWidget: function(controller, data) {
          if (data.onClickHandle) {
            data.onClickHandle();
            data.onClickHandle = null;
          }
        },

        /**
         *
         * @param controller
         * @param data
         * @param event
         * @param sender
         * @param {number} index
         * @private
         */
        _toggleState: function(controller, data, event, sender, index) {
          var node = controller.getAnchorNode();
          var tableNode = node.getParentNode();
          var treeItemNode = tableNode.findNodeWithAttribute("TreeItem", "row", index);

          if (treeItemNode.attribute('hasChildren') !== 0) {
            var expanded = treeItemNode.attribute('expanded');
            if (expanded === 0) {
              expanded = 1;
            } else {
              expanded = 0;
            }
            var vmEvent = new cls.VMConfigureEvent(treeItemNode.getId(), {
              expanded: expanded
            });
            treeItemNode.getApplication().typeahead.event(vmEvent, treeItemNode);
          }
        }
      };
    });
  });
