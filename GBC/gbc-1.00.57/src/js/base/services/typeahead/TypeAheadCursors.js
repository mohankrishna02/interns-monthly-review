/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('TypeAheadCursors', ['TypeAheadCommand'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * TypeAhead cursors change
     * This class updates the cursors of a widget
     * @class TypeAheadCursors
     * @memberOf classes
     * @extends classes.TypeAheadCommand
     */
    cls.TypeAheadCursors = context.oo.Class(cls.TypeAheadCommand, function($super) {
      return /** @lends classes.TypeAheadCursors.prototype */ {
        __name: "TypeAheadCursors",

        /** @type {?number} */
        _cursor: null,
        /** @type {?number} */
        _cursor2: null,
        /** @type {boolean} */
        _canBeExecuted: true,

        /**
         * @param {classes.VMApplication} app owner
         * @param {classes.NodeBase} node - target node
         * @param {number} cursor1 - current starting cursor of the node
         * @param {number} [cursor2] - current ending cursor of the node
         * @param {boolean} [canBeExecuted] - true if the current command can be executed, false otherwise
         */
        constructor: function(app, node, cursor1, cursor2, canBeExecuted) {
          $super.constructor.call(this, app, node);
          this._cursor = cursor1;
          if (cursor2 !== undefined) {
            this._cursor2 = cursor2;
          }
          this._canBeExecuted = canBeExecuted;
        },

        /**
         * @inheritDoc
         */
        execute: function() {
          var ctrl = this._node.getController();
          var event = null;
          if (ctrl) {
            var node = this._node.isInTable() || this._node.isInMatrix() ? this._node.getParentNode().getParentNode() : this._node;
            var vmCursor = node.attribute('cursor');
            var vmCursor2 = node.attribute('cursor2');
            var cursorData = {};
            var hasData = false;
            // Sending only modified cursors to the VM.
            if (vmCursor !== this._cursor) {
              cursorData.cursor = this._cursor;
              hasData = true;
            }
            if (this._cursor2 !== null && vmCursor2 !== this._cursor2) {
              cursorData.cursor2 = this._cursor2;
              hasData = true;
            }
            if (hasData) {
              event = new cls.VMConfigureEvent(node.getId(), cursorData);
              return {
                processed: true,
                vmEvents: [event]
              };
            }
          }
          return {
            processed: false,
            vmEvents: []
          };
        },

        /**
         * @inheritDoc
         */
        canBeExecuted: function() {
          return this._canBeExecuted;
        }
      };
    });
  }
);
