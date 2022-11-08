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

modulum('TableColumnDnDUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class TableColumnDndUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.TableColumnDndUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.TableColumnDndUIBehavior.prototype */ {
        /** @type {string} */
        __name: "TableColumnDnDUIBehavior",
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (widget) {
            data.dndStartHandle = widget.when(gbc.constants.widgetEvents.tableDragStart, this._onTableDragStart.bind(this,
              controller,
              data));
            data.dndEndHandle = widget.when(gbc.constants.widgetEvents.tableDragEnd, this._onTableDragEnd.bind(this, controller,
              data));
            data.dndDropHandle = widget.when(gbc.constants.widgetEvents.tableDrop, this._onTableDrop.bind(this, controller, data));
            data.dndOverHandle = widget.when(gbc.constants.widgetEvents.tableDragOver, this._onTableDragOver.bind(this, controller,
              data));
            data.dndLeaveHandle = widget.when(gbc.constants.widgetEvents.tableDragLeave, this._onTableDragLeave.bind(this,
              controller,
              data));
            data.dndEnterHandle = widget.when(gbc.constants.widgetEvents.tableDragEnter, this._onTableDragEnter.bind(this,
              controller,
              data));
          }
        },
        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.dndStartHandle) {
            data.dndStartHandle();
            data.dndStartHandle = null;
          }
          if (data.dndEndHandle) {
            data.dndEndHandle();
            data.dndEndHandle = null;
          }
          if (data.dndDropHandle) {
            data.dndDropHandle();
            data.dndDropHandle = null;
          }
          if (data.dndOverHandle) {
            data.dndOverHandle();
            data.dndOverHandle = null;
          }
          if (data.dndLeaveHandle) {
            data.dndLeaveHandle();
            data.dndLeaveHandle = null;
          }
          if (data.dndEnterHandle) {
            data.dndEnterHandle();
            data.dndEnterHandle = null;
          }
        },

        /**
         * Get value node corresponding to index in the column
         * @param columnNode
         * @param index
         * @returns {*|classes.NodeBase}
         * @private
         */
        _getValueNode: function(columnNode, index) {
          var valueListNode = columnNode.getFirstChild("ValueList");
          return valueListNode && valueListNode.getChildren()[index];
        },

        /**
         * Handle tableDragStart event
         * @private
         */
        _onTableDragStart: function(controller, data, event, sender, index, evt) {
          var node = controller.getAnchorNode();
          context.DndService.onDragStart(node.getParentNode(), this._getValueNode(node, index), evt);
        },

        /**
         * Handle tableDragEnd event
         * @private
         */
        _onTableDragEnd: function(controller, data) {
          context.DndService.onDragEnd();
        },

        /**
         * Handle tableDrop event
         * @private
         */
        _onTableDrop: function(controller, data, event, sender, index) {
          var node = controller.getAnchorNode();
          context.DndService.onDrop(this._getValueNode(node, index));
        },

        /**
         * Handle tableDragOver event
         * @private
         */
        _onTableDragOver: function(controller, data, event, sender, index, evt) {
          var node = controller.getAnchorNode();
          context.DndService.onDragOver(node.getParentNode(), this._getValueNode(node, index), evt);
        },

        /**
         * Handle tableDragLeave event
         * @private
         */
        _onTableDragLeave: function(controller, data, event, sender, index, evt) {
          var node = controller.getAnchorNode();
          context.DndService.onDragLeave(node.getParentNode(), this._getValueNode(node, index), evt);
        },

        /**
         * Handle tableDragEnter event
         * @private
         */
        _onTableDragEnter: function(controller, data, event, sender, index, evt) {
          var node = controller.getAnchorNode();
          context.DndService.onDragEnter(node.getParentNode(), this._getValueNode(node, index), evt);
        }
      };
    });
  });
