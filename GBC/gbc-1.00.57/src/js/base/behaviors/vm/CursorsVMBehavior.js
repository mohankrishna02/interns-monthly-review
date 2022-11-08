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

modulum('CursorsVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class CursorsVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.CursorsVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.CursorsVMBehavior.prototype */ {
        __name: "CursorsVMBehavior",
        _focusRestoredHandler: null,

        watchedAttributes: {
          container: ['cursor', 'cursor2', 'currentRow', 'offset', 'currentColumn', 'dialogType'],
          ui: ['focus'],
          table: ['currentRow', 'currentColumn', 'offset', 'dialogType']
        },

        /**
         * Get container node
         * @param {classes.NodeBase} containerNode - basic container node
         * @returns {classes.NodeBase} returns container node
         * @private
         */
        _getMainArrayContainer: function(containerNode) {
          switch (containerNode.getTag()) {
            case 'TableColumn':
              return containerNode.getParentNode();
            case 'Matrix':
              return containerNode;
            default:
              return null;
          }
        },

        /**
         * Set cursors position to the widget input field
         * @param controller
         * @param data
         * @private
         */
        _apply: function(controller, data) {
          var widget = null;
          var anchorNode = controller.getAnchorNode();
          var containerNode = controller.getNodeBindings().container;
          var app = anchorNode.getApplication();
          var uiNode = app.uiNode();
          var focusedNodeId = uiNode.attribute('focus');

          var arrayContainer = this._getMainArrayContainer(containerNode);
          if (arrayContainer) {
            // Table or Matrix
            if (focusedNodeId === arrayContainer._id) {
              var currentRow = arrayContainer.attribute("currentRow");
              var offset = arrayContainer.attribute("offset");
              var anchorRowIndex = anchorNode.getIndex();
              if (anchorRowIndex === currentRow - offset) {
                if (arrayContainer.getTag() === "Table") { // consider also currentColumn for table
                  var currentColumn = arrayContainer.attribute("currentColumn");
                  var anchorColumnIndex = containerNode.getIndex();
                  if (anchorColumnIndex === currentColumn) {
                    widget = controller.getWidget();
                  }
                } else {
                  widget = controller.getWidget();
                }
              }
            }
          } else {
            // FormField
            if (focusedNodeId === anchorNode.getId()) {
              widget = controller.getWidget();
            }
          }

          if (widget && widget.hasCursors()) {

            if (this._focusRestoredHandler) {
              this._focusRestoredHandler();
            }
            // set cursor should be done after restoreVMFocus so we have to done it after all orders management
            this._focusRestoredHandler = containerNode.getApplication().focus.when(context.constants.widgetEvents.focusRestored,
              function() {

                // event executed once : we release reference because event listener will destroy it
                this._focusRestoredHandler = null;

                var cursor = containerNode.attribute('cursor');
                var cursor2 = containerNode.attribute('cursor2');
                var completerNode = controller.getNodeBindings() ? controller.getNodeBindings().completer : null;
                widget = controller.getWidget();

                //TODO may access the widget in an other way
                if (widget && widget.hasCursors()) {
                  var widgetValue = "";
                  var auiValue = "";
                  // convert both widget and aui value as string to compare without any type conflict
                  if (controller._getAuiValue && controller._getWidgetValue) { // focus on a ValueContainerBaseController
                    auiValue = controller._getAuiValue();
                    widgetValue = controller._getWidgetValue();
                  }
                  if (widget.isEnabled() &&
                    (widgetValue === auiValue || // TODO explain that ?
                      (Boolean(completerNode) && completerNode.attribute("size") <= 1)
                    ) && !app.typeahead.hasPendingValueCommands(anchorNode)) {
                    if (widget.getInputElement && document.activeElement !== widget.getInputElement()) {
                      widget.setFocus();
                    }
                    widget.setCursors(cursor, cursor2);
                  }
                }
              }.bind(this), true);
          }
        },

        /**
         * @inheritDoc
         */
        _detach: function(controller, data) {
          if (this._focusRestoredHandler) {
            this._focusRestoredHandler();
            this._focusRestoredHandler = null;
          }
        }
      };
    });
  });
