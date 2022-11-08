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

modulum('TypeAheadCurrentRow', ['TypeAheadCommand'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * TypeAhead currentRow event.
     * @class TypeAheadCurrentRow
     * @memberOf classes
     * @extends classes.TypeAheadCommand
     */
    cls.TypeAheadCurrentRow = context.oo.Class(cls.TypeAheadCommand, function($super) {
      return /** @lends classes.TypeAheadCurrentRow.prototype */ {
        $static: /** @lends classes.TypeAheadCurrentRow */ {
          /**
           * Compute new row according to an action
           * @param {classes.MatrixNode|classes.TableNode} containerNode
           * @param {string} actionName
           * @param {number} row - Reference current row
           * @param {boolean} [inputMode] - Input mode
           * @returns {number|null}
           */
          computeNewRowFromAction: function(containerNode, actionName, row, inputMode) {

            if (!cls.ActionNode.isTableNavigationAction(actionName)) {
              return null;
            }
            var pageSize = containerNode.attribute('pageSize');
            var size = containerNode.attribute('size');

            var newCurrentRow = null;

            if (actionName === 'nextrow') {
              newCurrentRow = cls.TypeAheadCurrentRow._computeNewRowFromDelta(containerNode, 1, row);
            } else if (actionName === 'prevrow') {
              newCurrentRow = cls.TypeAheadCurrentRow._computeNewRowFromDelta(containerNode, -1, row);
            } else if (actionName === 'nextpage') {
              newCurrentRow = cls.TypeAheadCurrentRow._computeNewRowFromDelta(containerNode, pageSize, row);
            } else if (actionName === 'prevpage') {
              newCurrentRow = cls.TypeAheadCurrentRow._computeNewRowFromDelta(containerNode, -pageSize, row);
            } else if (actionName === 'firstrow') {
              newCurrentRow = 0;
            } else if (actionName === 'lastrow') {
              newCurrentRow = size - 1;
            }

            // check that new row is in the correct size range [0...size]
            if (newCurrentRow >= size) {
              if (!inputMode || actionName !== "nextrow") { // only exception is in Input mode when the action is "nextrow"
                newCurrentRow = size - 1;
              }
            } else if (newCurrentRow < 0) {
              newCurrentRow = 0;
            }

            return newCurrentRow;
          },

          /**
           * Compute new row according to a delta value
           * @param {classes.MatrixNode|classes.TableNode} node
           * @param {number} delta
           * @param {number} currentRow - Reference current row
           * @returns {number}
           * @private
           */
          _computeNewRowFromDelta: function(node, delta, currentRow) {

            var size = node.attribute('size');

            var offset = node.attribute('offset');
            var pageSize = node.attribute('pageSize');

            var newCurrentRow = null;

            if (pageSize === 1) {
              newCurrentRow = currentRow + delta;
            } else {
              // handle step = +-/ pageSize behavior (like Explorer)
              if (delta === pageSize) {
                var isVerticalScrollAtEnd = node.getController().getWidget() ? node.getController().getWidget()
                  .isVerticalScrollAtEnd() :
                  false;
                if (offset + pageSize >= size || isVerticalScrollAtEnd) {
                  newCurrentRow = size;
                } else if (currentRow >= offset + pageSize - 1) {
                  //we are on the last row
                  newCurrentRow = currentRow + pageSize;
                } else {
                  //we move to the next page
                  newCurrentRow = offset + pageSize - 1;
                }
              } else if (delta === -(pageSize)) {
                if (currentRow < offset) {
                  newCurrentRow = Math.max(0, currentRow - pageSize + 1);
                } else if (currentRow === offset) {
                  newCurrentRow = offset - pageSize;
                } else {
                  newCurrentRow = offset;
                }
              } else {
                newCurrentRow = currentRow + delta;
              }
            }

            return newCurrentRow;
          }
        },
        __name: "TypeAheadCurrentRow",

        /** @type String */
        _actionName: null,

        /** @type {number} */
        _currentRowToValidate: -1,

        /** @type {boolean} */
        _ctrlKey: false,

        /** @type {boolean} */
        _shiftKey: false,

        /**
         * @param {classes.VMApplication} app owner
         * @param {classes.TableNode|classes.MatrixNode} node
         * @param {string} actionName - actionName used to change current row
         * @param {boolean} [ctrlKey] - ctrlKey pressed during command creation
         * @param {boolean} [shiftKey] - shiftKey pressed during command creation
         */
        constructor: function(app, node, actionName, ctrlKey, shiftKey) {
          $super.constructor.call(this, app, node);
          this._actionName = actionName;
          this._ctrlKey = ctrlKey ? ctrlKey : false;
          this._shiftKey = shiftKey ? shiftKey : false;
        },

        /**
         * @inheritDoc
         */
        execute: function() {
          var oldCurrentRow = this._node.attribute("currentRow");
          var dialogType = this._node.attribute('dialogType');
          var displayDialog = (dialogType === "Display" || dialogType === "DisplayArray");

          var newCurrentRow = cls.TypeAheadCurrentRow.computeNewRowFromAction(this._node, this._actionName, this._node.attribute(
            "currentRow"), !displayDialog);
          if (newCurrentRow !== null && (oldCurrentRow !== newCurrentRow)) {
            this._currentRowToValidate = newCurrentRow;
            var events = [];
            // if mrs and one modifier is pressed, we must not send ActionEvent but ConfigureEvent with currentRow
            var forceConfigureEvent = (this._ctrlKey || this._shiftKey) && (this._node.attribute('multiRowSelection') !== 0);
            var actionNode = this._app.action.getAction(this._actionName);
            if (actionNode && !forceConfigureEvent) {
              events.push(new cls.VMActionEvent(actionNode.getId()));
            } else {
              events.push(new cls.VMConfigureEvent(this._node.getId(), {
                currentRow: newCurrentRow
              }));
            }

            // Paged ScrollGrids need to compute the offset in the client to keep it in sync properly
            var scrollGridNode = this._node.getAncestor('ScrollGrid');
            if (scrollGridNode && scrollGridNode.getController().isPagedScrollGrid()) {
              var offset = scrollGridNode.attribute('offset');
              var pageSize = scrollGridNode.attribute('pageSize');
              var size = scrollGridNode.attribute('pageSize');
              if (newCurrentRow < offset || newCurrentRow >= offset + pageSize || newCurrentRow > size - pageSize) {
                offset = Math.floor(newCurrentRow / pageSize) * pageSize;
                events.push(new cls.VMConfigureEvent(this._node.getId(), {
                  offset: offset
                }));
              }
            }
            return {
              processed: true,
              vmEvents: events
            };
          }
          return {
            processed: false,
            vmEvents: []
          };
        },

        /**
         * @inheritDoc
         */
        validate: function() {
          var currentRow = this._node.attribute('currentRow');
          return this._currentRowToValidate === currentRow;
        },

        /**
         * @inheritDoc
         */
        rollback: function() {
          $super.rollback.call(this);
          if (this._node) {
            var ctrl = this._node.getController();
            if (ctrl) {
              var widget = ctrl.getWidget();
              if (widget && widget.setCurrentRow) {
                widget.setCurrentRow(this._node.attribute('currentRow'));
              }
            }
          }
        },

        /**
         * @returns {classes.NodeBase} the node to be focused
         */
        getNode: function() {
          return this._node;
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
