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

modulum('TreeItemKeyExpandUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class TreeItemKeyExpandUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.TreeItemKeyExpandUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.TreeItemKeyExpandUIBehavior.prototype */ {
        __name: "TreeItemKeyExpandUIBehavior",

        /**
         * @protected
         */
        _attachWidget: function(controller, data) {
          if (controller && controller.getWidget()) {
            var tableWidget = controller.getAnchorNode().getParentNode().getController().getWidget();
            data.rightHandle = tableWidget.when(context.constants.widgetEvents.keyArrowRight, this._expandOrCollapse.bind(this,
              controller,
              data, 1));
            data.leftHandle = tableWidget.when(context.constants.widgetEvents.keyArrowLeft, this._expandOrCollapse.bind(this,
              controller,
              data,
              0));
          }
        },

        /**
         * @protected
         */
        _detachWidget: function(controller, data) {
          if (data.rightHandle) {
            data.rightHandle();
            data.rightHandle = null;
          }
          if (data.leftHandle) {
            data.leftHandle();
            data.leftHandle = null;
          }
        },

        /**
         * @param {classes.ControllerBase} controller
         * @param {Object} data
         * @param {number} expand
         * @param eventType
         * @param source
         * @param event
         * @private
         */
        _expandOrCollapse: function(controller, data, expand, eventType, source, event) {
          var node = controller.getAnchorNode();
          var tableNode = node.getParentNode();
          var offset = tableNode.attribute('offset');
          var currentRow = tableNode.attribute('currentRow');
          var treeItemNode = tableNode.findNodeWithAttribute("TreeItem", "row", currentRow - offset);
          if (treeItemNode &&
            (expand === 1 || (source.getScrollableArea() && source.getScrollableArea().scrollLeft === 0))
          ) { // if we have previously horizontally scrolled, we need to scroll back before collapsing nodes
            var vmEvent = null;
            if (expand && (treeItemNode.attribute("expanded") === 1)) {
              event.preventCancelableDefault(); // preventDefault avoid horizontal scroll

              vmEvent = new cls.VMConfigureEvent(tableNode.getId(), {
                currentRow: treeItemNode.attribute("row") + offset + 1
              });
            } else if (!expand && (treeItemNode.attribute("expanded") === 0)) {
              event.preventCancelableDefault(); // preventDefault avoid horizontal scroll

              var parent = treeItemNode.getParentNode();
              if (parent._tag === "TreeItem") {
                vmEvent = new cls.VMConfigureEvent(tableNode.getId(), {
                  currentRow: treeItemNode.attribute("row") - (parent.getChildren().indexOf(treeItemNode) + 1) + offset
                });
              }
            } else if (treeItemNode.attribute("hasChildren")) {
              event.preventCancelableDefault(); // preventDefault avoid horizontal scroll

              vmEvent = new cls.VMConfigureEvent(treeItemNode.getId(), {
                expanded: expand
              });
            }
            if (vmEvent) {
              treeItemNode.getApplication().typeahead.event(vmEvent, tableNode);
            }
          }
        }
      };
    });
  });
