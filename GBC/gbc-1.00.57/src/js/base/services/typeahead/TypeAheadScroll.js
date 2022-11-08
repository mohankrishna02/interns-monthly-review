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

modulum('TypeAheadScroll', ['TypeAheadCommand'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * TypeAhead scroll event.
     * @class TypeAheadScroll
     * @memberOf classes
     * @extends classes.TypeAheadCommand
     */
    cls.TypeAheadScroll = context.oo.Class(cls.TypeAheadCommand, function($super) {
      return /** @lends classes.TypeAheadScroll.prototype */ {
        __name: "TypeAheadScroll",

        /** @type number */
        _offset: 0,

        /**
         * @param {classes.VMApplication} app owner
         * @param {classes.NodeBase} node scroll target
         * @param {number} offset new scroll offset
         */
        constructor: function(app, node, offset) {
          $super.constructor.call(this, app, node);
          this._offset = offset;
        },

        /**
         * @inheritDoc
         */
        execute: function() {
          var event = new cls.VMConfigureEvent(this._node.getId(), {
            offset: this._offset
          });
          return {
            processed: true,
            vmEvents: [event]
          };
        },

        /**
         * @inheritDoc
         */
        isPredictable: function() {
          return false;
        },

        /**
         * @inheritDoc
         */
        merge: function(command) {
          if (command instanceof cls.TypeAheadScroll) {
            if (command._node === this._node) {
              this._offset = command._offset;
              return true;
            }
          }
          return false;
        }
      };
    });
  }
);
