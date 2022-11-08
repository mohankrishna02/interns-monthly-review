/// FOURJS_START_COPYRIGHT(D,2019)
/// Property of Four Js*
/// (c) Copyright Four Js 2019, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('TypeAheadNativeBack', ['TypeAheadCommand'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * TypeAhead native back action.
     * @class TypeAheadNativeBack
     * @memberOf classes
     * @extends classes.TypeAheadCommand
     */
    cls.TypeAheadNativeBack = context.oo.Class(cls.TypeAheadCommand, function($super) {
      return /** @lends classes.TypeAheadNativeBack.prototype */ {
        __name: "TypeAheadNativeBack",

        /** @type String[] */
        _actionList: null,

        /**
         * @param {classes.VMApplication} app owner
         * @param {String[]} actionList list of actions to execute
         */
        constructor: function(app, actionList) {
          $super.constructor.call(this, app, null);
          this._actionList = actionList;
        },

        /**
         * @inheritDoc
         */
        execute: function() {
          var found = false,
            list = this._actionList,
            len = list && list.length;
          var actionService = this._app.action;
          for (var i = 0; i < len; i++) {
            if (actionService.getAction(list[i])) {
              found = true;
              actionService.executeByName(list[i]);
              break;
            }
          }
          if (!found) {
            context.__wrapper.nativeCall({
              name: "noBackAction"
            });
          }

          return {
            processed: true,
            vmEvents: []
          };
        },

        /**
         * @inheritDoc
         */
        isPredictable: function() {
          return false;
        }
      };
    });
  }
);
