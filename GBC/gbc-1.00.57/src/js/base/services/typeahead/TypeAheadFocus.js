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

modulum('TypeAheadFocus', ['TypeAheadCommand'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * TypeAhead focus check.
     * This class checks the current state of the AUI tree to ensure the appropriate node has the focus
     * @class TypeAheadFocus
     * @memberOf classes
     * @extends classes.TypeAheadCommand
     */
    cls.TypeAheadFocus = context.oo.Class(cls.TypeAheadCommand, function($super) {
      return /** @lends classes.TypeAheadFocus.prototype */ {
        __name: "TypeAheadFocus",

        /** @type {number} */
        _cursor: 0,
        /** @type {number} */
        _cursor2: 0,
        /** @type {?string} */
        _actionName: null,

        /** @type {number} */
        _currentRowToValidate: -1,
        /** @type {number} */
        _currentColumnToValidate: -1,

        /**
         * @param {classes.VMApplication} app owner
         * @param {classes.NodeBase} node that should have the focus
         * @param {number} cursor1 - current starting cursor of the node
         * @param {number} cursor2 - current ending cursor of the node
         * @param {string} actionName - name of the action leading to this focus change
         */
        constructor: function(app, node, cursor1, cursor2, actionName) {
          $super.constructor.call(this, app, node);
          this._cursor = cursor1 || 0;
          this._cursor2 = cursor2 || 0;
          this._actionName = actionName;
        },

        /**
         * @inheritDoc
         */
        execute: function() {
          var controller = this._node.getController();
          var events = [];
          if (controller) {
            if (this._node.isInTable()) {
              events = this._requestTableCellFocus();
            } else if (this._node.isInMatrix()) {
              events = this._requestMatrixCellFocus();
            } else if (this._node.getTag() === "Table") {
              events = this._requestTableFocus();
            } else if (this._node.getTag() === "ScrollGrid") {
              events = this._requestScrollGridFocus();
            } else {
              events = this._requestFieldFocus();
            }
          }
          return {
            processed: events.length > 0,
            vmEvents: events
          };
        },

        _sendKeyEvent: function() {
          var key = null;
          if (this._actionName && ['nextfield', 'prevfield'].indexOf(this._actionName) !== -1) {
            // Send the key event instead of a focus in the expected field.
            // This ensures that the VM and GBC computed the same field
            // This ensures proper rollbacks in case of BEFORE/AFTER FIELD triggers
            var requiredAccelerator = cls.ActionNode.getRequiredAccelerator(this._actionName);
            if (!!requiredAccelerator) {
              key = requiredAccelerator;
            } else {
              var actionNode = this._app.getDefaultActionForName(this._actionName);
              key = actionNode !== null ? actionNode.attribute('acceleratorName') : null;
            }
            if (!key) {
              key = cls.ActionApplicationService.getLocalActionAccelerator(this._actionName);
            }
            if (key) {
              return [new cls.VMKeyEvent(key)];
            }
          }
          return [];
        },

        /**
         * @inheritDoc
         */
        validate: function() {
          var controller = this._node.getController();
          if (!controller) { // controller may be null if it has been destroyed during process
            return false;
          }
          if (this._node.isInTable()) {
            return this._validateTableCellFocus();
          } else if (this._node.isInMatrix()) {
            return this._validateMatrixCellFocus();
          } else if (this._node.getTag() === "ScrollGrid") {
            return this._validateScrollGridFocus();
          } else {
            return this._validateFocus();
          }
        },

        /**
         * @inheritDoc
         */
        rollback: function() {
          $super.rollback.call(this);

          var controller = this._node.getController();
          if (!controller) { // controller may be null if it has been destroyed during process
            return false;
          }
          if (this._node.isInTable()) {
            return this._rollbackTableCellFocus();
          }
        },

        /**
         * Request focus on a form field
         * @returns {classes.VMEventBase[]} the event to send to the VM.
         * @private
         */
        _requestFieldFocus: function() {
          var events = this._sendKeyEvent();
          if (events.length !== 0) {
            return events;
          }
          if (this._node.attribute('active') === 0) {
            // Do not request any focus if not active to not cancel selection of text during this operation (needed to CTRL-C)
            // https://agile.strasbourg.4js.com/jira/browse/GBC-669
            return [];
          }
          var ui = this._app.uiNode();

          if (ui.attribute('focus') !== this._node.getId()) {
            // special for webcomp
            var originWidgetNode = this._app.getFocusedVMNode();
            var originWidgetController = originWidgetNode.getController();
            var originWidget = originWidgetController.getWidget();
            if (originWidget && originWidget.flushWebcomponentData) {
              originWidget.flushWebcomponentData();
            }

            var event = new cls.VMConfigureEvent(this._node.getId(), {
              cursor: this._cursor,
              cursor2: this._cursor2
            });
            return [event];
          }
          return [];
        },

        /**
         * Requests the focus on a Table
         * @returns {classes.VMEventBase[]} the event to send to the VM.
         * @private
         */
        _requestTableFocus: function() {
          var events = this._sendKeyEvent();
          if (events.length !== 0) {
            return events;
          }

          var tableNode = this._node;

          // if table is not active or if it has already the focus
          if (tableNode.attribute('active') === 0 || this._app.getFocusedVMNode() === tableNode) {
            return []; // Nothing to do
          }

          // ask focus for first active table column index
          var columnIndex = 0;
          var columnNodes = tableNode.getChildren('TableColumn');
          for (var i = 0; i < columnNodes.length; i++) {
            var col = columnNodes[i];
            if (col.attribute('noEntry') === 0 && col.attribute('active') === 1) {
              columnIndex = i;
              break;
            }
          }
          var rowIndex = tableNode.attribute("currentRow");

          var event = new cls.VMConfigureEvent(tableNode.getId(), {
            currentColumn: columnIndex,
            currentRow: rowIndex
          });

          return [event];
        },

        /**
         * Requests the focus on a Table
         * @returns {classes.VMEventBase[]} the event to send to the VM.
         * @private
         */
        _requestScrollGridFocus: function() {
          var scrollGridNode = this._node;
          var valueNodeIndex = scrollGridNode.getController().getCurrentRow();
          var offset = scrollGridNode.attribute('offset');
          var vmCurrentRow = scrollGridNode.attribute('currentRow');
          var currentRow = valueNodeIndex + offset;

          this._currentRowToValidate = currentRow;

          var events = this._sendKeyEvent();
          if (events.length !== 0) {
            return events;
          }
          if (scrollGridNode.attribute('active') === 0) {
            // Restore the focus to its previous location
            return [];
          }
          if (currentRow !== vmCurrentRow) {
            var eventData = {
              currentRow: currentRow,
            };

            events = [];
            events.push(new cls.VMConfigureEvent(scrollGridNode.getId(), eventData));
            if (scrollGridNode.getController().isPagedScrollGrid()) {
              var pageSize = scrollGridNode.attribute('pageSize');
              var offsetEventData = {
                offset: Math.floor(currentRow / pageSize) * pageSize
              };
              events.push(new cls.VMConfigureEvent(scrollGridNode.getId(), offsetEventData));
            }
            return events;
          }
          return [];
        },

        /**
         * Request focus on a matrix field
         * @returns {classes.VMEventBase[]} the event to send to the VM.
         * @private
         */
        _requestMatrixCellFocus: function() {
          var containerNode = this._node.getParentNode().getParentNode();
          var ui = this._app.uiNode();
          var valueNodeIndex = this._node.getIndex();
          var offset = containerNode.attribute('offset');
          var vmCurrentRow = containerNode.attribute('currentRow');
          var currentRow = valueNodeIndex + offset;
          var isSameCurrentRow = currentRow === vmCurrentRow;

          var dialogType = containerNode.attribute('dialogType');
          var displayDialog = dialogType === "Display" || dialogType === "DisplayArray";

          this._currentRowToValidate = currentRow;
          var scrollGridNode = this._node.getAncestor("ScrollGrid");
          var isPagedScrollGrid = scrollGridNode && scrollGridNode.getController().isPagedScrollGrid();

          var events = this._sendKeyEvent();
          if (events.length !== 0) {
            if (isPagedScrollGrid) {
              events.push(new cls.VMConfigureEvent(containerNode.getId(), {
                offset: offset
              }));
            }
            return events;
          }
          if (containerNode.attribute('active') === 0) {
            // Restore the focus to its previous location
            return [];
          }
          if (ui.attribute('focus') !== containerNode.getId() || !isSameCurrentRow) {
            var eventData = {
              currentRow: currentRow,
            };
            if (!displayDialog) {
              eventData.cursor = this._cursor;
              eventData.cursor2 = this._cursor2;
            }

            events = [];
            events.push(new cls.VMConfigureEvent(containerNode.getId(), eventData));
            if (isPagedScrollGrid) {
              events.push(new cls.VMConfigureEvent(containerNode.getId(), {
                offset: offset
              }));
            }
            return events;
          }
          return [];
        },

        /**
         * Request focus on a table cell
         * @returns {classes.VMEventBase[]} the event to send to the VM.
         * @private
         */
        _requestTableCellFocus: function() {
          var containerNode = this._node.getParentNode().getParentNode();
          var tableNode = containerNode.getParentNode();
          var ui = this._app.uiNode();

          var eventParams = {};
          var valueNodeIndex = this._node.getIndex();
          var offset = tableNode.attribute('offset');
          eventParams.currentRow = valueNodeIndex + offset;

          this._currentRowToValidate = eventParams.currentRow;

          var needFocus = ui.attribute('focus') !== tableNode.getId() ||
            eventParams.currentRow !== tableNode.attribute('currentRow');

          var dialogType = containerNode.attribute('dialogType');
          var displayDialog = dialogType === "Display" || dialogType === "DisplayArray";
          var isActiveColumn = (containerNode.attribute('active') === 1);

          var focusOnField = tableNode.attribute('focusOnField') === 1;
          if (!displayDialog || focusOnField) { // Input, InputArray, Construct or FocusOnField attribute set
            eventParams.currentColumn = containerNode.getIndex('TableColumn');
            needFocus = needFocus || !tableNode.isAttributeSetByVM('currentColumn') || eventParams.currentColumn !== tableNode
              .attribute(
                'currentColumn');
            if (isActiveColumn) { // we check column on validation only if column is active
              this._currentColumnToValidate = eventParams.currentColumn;
            }
          }

          var events = this._sendKeyEvent();
          if (events.length !== 0) {
            return events;
          }

          if (needFocus) {
            var event = new cls.VMConfigureEvent(tableNode.getId(), eventParams);
            events = [event];
            if (!displayDialog) {
              var event2 = new cls.VMConfigureEvent(containerNode.getId(), {
                cursor: this._cursor,
                cursor2: this._cursor2
              });
              events = events.concat(event2);
            }
            return events;
          }
          return [];
        },

        /**
         * Checks that the appropriate scrollgrid line has the focus
         * @returns {boolean} true if the focus is set properly, false otherwise
         * @private
         */
        _validateScrollGridFocus: function() {
          var currentRow = this._node.attribute('currentRow');
          return this._currentRowToValidate === currentRow;
        },

        /**
         * Checks that the appropriate matrix cell has the focus
         * @returns {boolean} true if the focus is set properly, false otherwise
         * @private
         */
        _validateMatrixCellFocus: function() {
          var containerNode = this._node.getParentNode().getParentNode();
          var ui = this._app.uiNode();
          var dialogType = containerNode.attribute('dialogType');
          var displayDialog = dialogType === "Display" || dialogType === "DisplayArray";
          // validate focused column only in input/input array mode
          if (!displayDialog && ui.attribute("focus") !== containerNode.getId()) {
            return false;
          }

          var offset = containerNode.attribute('offset');
          var currentRow = containerNode.attribute('currentRow');
          return this._node.getIndex() === (currentRow - offset);
        },

        /**
         * Checks that the appropriate table cell has the focus
         * @returns {boolean} true if the focus is set properly, false otherwise
         * @private
         */
        _validateTableCellFocus: function() {
          var containerNode = this._node.getParentNode().getParentNode();
          var tableNode = containerNode.getParentNode();

          var ui = this._app.uiNode();
          if (ui.attribute("focus") !== tableNode.getId()) {
            return false;
          }

          var currentRow = tableNode.attribute('currentRow');

          var valid = (this._currentRowToValidate === currentRow);

          if (this._currentColumnToValidate >= 0) {
            var currentColumn = tableNode.attribute('currentColumn');
            valid = valid && (this._currentColumnToValidate === currentColumn);
          }

          return valid;
        },

        /**
         * Checks that the appropriate widget has the focus
         * @returns {boolean} true if the focus is set properly, false otherwise
         * @private
         */
        _validateFocus: function() {
          var ui = this._app.uiNode();
          return ui.attribute("focus") === this._node.getId();
        },

        /**
         * Rollback for table cell focus command
         * @private
         */
        _rollbackTableCellFocus: function() {
          var containerNode = this._node.getParentNode().getParentNode();
          var tableNode = containerNode.getParentNode();
          var tableCtrl = tableNode.getController();
          if (tableCtrl) {
            var tableWidget = tableCtrl.getWidget();
            if (tableWidget) {
              var offset = tableNode.attribute('offset');
              var auiCurrentRow = tableNode.attribute('currentRow');
              var auiCurrentColumn = tableNode.attribute('currentColumn');

              // reset current row and col to the aui values
              tableWidget.setCurrentRow(auiCurrentRow - offset);
              tableWidget.setCurrentColumn(auiCurrentColumn);
            }
          }
        },

        /**
         * @inheritDoc
         */
        needsVmSync: function() {
          return true;
        }
      };
    });
  }
);
