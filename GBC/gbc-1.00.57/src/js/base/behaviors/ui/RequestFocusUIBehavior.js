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

modulum('RequestFocusUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class RequestFocusUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.RequestFocusUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.RequestFocusUIBehavior.prototype */ {
        __name: "RequestFocusUIBehavior",

        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (widget) {
            data.focusListener = widget.when(context.constants.widgetEvents.requestFocus, this._onRequestFocus.bind(this,
              controller,
              data));
          }
        },

        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.focusListener) {
            data.focusListener();
            data.focusListener = null;
          }
          if (data.focusReadyListener) {
            data.focusReadyListener();
            data.focusReadyListener = null;
          }
        },
        /**
         *
         * @param controller
         * @param data
         * @private
         */
        _onRequestFocus: function(controller, data) {
          var anchorNode = controller.getAnchorNode();
          var app = anchorNode.getApplication();
          // Keep capture allowed value when the event is received.
          var restoringFocus = app.focus.isRestoringVMFocus();
          if (!restoringFocus) {

            if (controller.isInMatrix()) {
              var matrixNode = controller.getNodeBindings().container;
              if (matrixNode.attribute("dialogType") === "DisplayArray") {
                var valueNodeIndex = anchorNode.getIndex();
                var offset = matrixNode.attribute('offset');
                var size = matrixNode.attribute('size');
                var currentRow = valueNodeIndex + offset;

                if (currentRow >= size) {
                  // don't request focus if currentRow >= size, this is invalid in Display array
                  return;
                }
              }
            }

            var originWidgetNode = app.focus.getFocusedNode();
            var widget = controller.getWidget();
            if (originWidgetNode !== anchorNode) {

              if (originWidgetNode) {
                var originWidgetController = originWidgetNode.getController();
                if (
                  originWidgetController
                ) { // check if controller exists. In come case we could have a MenuAction node which doesn't have a controller
                  originWidgetController.sendWidgetValue(true);
                }
              }

              var cursors = { // for widgets which don't support cursors send 0,0 to VM to set focus
                start: 0,
                end: 0
              };
              if (widget.hasCursors()) {
                cursors = widget.getCursors();
              }
              app.typeahead.focus(anchorNode, cursors.start, cursors.end);

              this._setFocusToWidget(widget, anchorNode);
            } else if (!widget.hasDOMFocus()) {
              this._setFocusToWidget(widget);
            }
          }
        },
        /**
         *
         * @param {classes.WidgetBase} widget
         * @param {classes.NodeBase} [node]
         * @private
         */
        _setFocusToWidget: function(widget, node) {
          // set the focused node for typeahead (when mouse click)
          if (node) {
            node.getApplication().focus.setFocusedNode(node);
          }

          var table = widget.getTableWidgetBase();
          if (table && table.isDisplayMode() && widget.isInTable()) { // In a table (DISPLAY ARRAY)
            var tableNode = node ? node.getAncestor("Table") : null;
            if (tableNode) { // set focus on the table node
              node.getApplication().focus.setFocusedNode(tableNode);
            }
            table.setFocus(true);
            if (node) {
              table.setCurrentRow(node.getIndex());
            }
          } else if (node && widget.isInMatrix()) { // In a matrix
            var matrixNode = node.getParentNode().getParentNode();
            matrixNode.getController().updateCurrentRow(matrixNode, node.getIndex());
          } else {
            widget.setFocus(true);
          }
        }
      };
    });
  });
