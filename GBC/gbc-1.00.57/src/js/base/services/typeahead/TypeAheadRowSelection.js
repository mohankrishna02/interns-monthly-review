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

modulum('TypeAheadRowSelection', ['TypeAheadCommand'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * TypeAhead rowSelection event.
     * @class TypeAheadRowSelection
     * @memberOf classes
     * @extends classes.TypeAheadCommand
     */
    cls.TypeAheadRowSelection = context.oo.Class(cls.TypeAheadCommand, function($super) {
      return /** @lends classes.TypeAheadRowSelection.prototype */ {
        __name: "TypeAheadRowSelection",

        $static: /** @lends classes.TypeAheadRowSelection */ {
          currentRow: 1,
          toggle: 2,
          selectAll: 3,
        },

        /** @type boolean */
        _ctrlKey: false,

        /** @type boolean */
        _shiftKey: false,

        /** @type number */
        _type: 1,

        /** @type String */
        _actionName: null,

        /**
         *
         * @param {classes.VMApplication} app owner
         * @param {classes.TableNode} node
         * @param {boolean} ctrlKey - ctrl key pressed
         * @param {boolean} shiftKey - shift key pressed
         * @param {number} type - type of row selection (currentRow, toggle, selectAll)
         * @param {string} [actionName] - actionName used to change current row
         */
        constructor: function(app, node, ctrlKey, shiftKey, type, actionName) {
          $super.constructor.call(this, app, node);
          this._ctrlKey = ctrlKey;
          this._shiftKey = shiftKey;
          this._type = type;
          this._actionName = actionName ? actionName : null;
        },

        /**
         * Build row selection event
         * @param {number} row - base row to compute selection
         * @returns {classes.VMRowSelectionEvent} row selection event
         */
        buildRowSelectionEvent: function(row) {

          var controller = this._node.getController();
          var startIndex = row;
          var endIndex = row;
          var mode = "set";

          if (this._shiftKey) {
            if (controller.multiRowSelectionRoot === -1) {
              controller.multiRowSelectionRoot = this._node.attribute('currentRow');
            }

            startIndex = controller.multiRowSelectionRoot;
            endIndex = row;
            mode = this._ctrlKey ? "exset" : "set";

            controller.updateMultiRowSelectionRoot = false;
          } else if (this._ctrlKey) {
            var children = this._node.getChildren();
            var rowInfoListNode = children[children.length - 1];
            var rowInfoNode = rowInfoListNode.getChildren()[row - this._node.attribute('offset')];

            mode = rowInfoNode && rowInfoNode.attribute('selected') === 1 ? "unset" : "exset";
          }

          var event = new cls.VMRowSelectionEvent(this._node.getId(), {
            startIndex: startIndex,
            endIndex: endIndex,
            selectionMode: mode
          });

          return event;
        },

        /**
         * @inheritDoc
         */
        execute: function() {
          var events = [];

          if (this._type === cls.TypeAheadRowSelection.currentRow && this._actionName) {
            var newCurrentRow = cls.TypeAheadCurrentRow.computeNewRowFromAction(this._node, this._actionName, this._node.attribute(
              "currentRow"), false);
            events.push(this.buildRowSelectionEvent(newCurrentRow));
          } else if (this._type === cls.TypeAheadRowSelection.toggle) { // toggle selection of currentRow
            events.push(this.buildRowSelectionEvent(this._node.attribute("currentRow")));
          } else if (this._type === cls.TypeAheadRowSelection.selectAll) { // select all
            events.push(new cls.VMRowSelectionEvent(this._node.getId(), {
              startIndex: 0,
              endIndex: this._node.attribute('size') - 1,
              selectionMode: "set"
            }));
          }

          return {
            processed: events.length > 0,
            vmEvents: events
          };
        }
      };
    });
  }
);
