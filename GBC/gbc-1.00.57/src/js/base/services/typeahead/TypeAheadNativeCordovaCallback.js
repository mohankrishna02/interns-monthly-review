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

modulum('TypeAheadNativeCordovaCallback', ['TypeAheadCommand'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * TypeAhead native cordovacallback action.
     * @class TypeAheadNativeCordovaCallback
     * @memberOf classes
     * @extends classes.TypeAheadCommand
     */
    cls.TypeAheadNativeCordovaCallback = context.oo.Class(cls.TypeAheadCommand, function($super) {
      return /** @lends classes.TypeAheadNativeCordovaCallback.prototype */ {
        __name: "TypeAheadNativeCordovaCallback",

        /**
         * @param {classes.VMApplication} app owner
         */
        constructor: function(app) {
          $super.constructor.call(this, app, null);
        },

        /**
         * @inheritDoc
         */
        execute: function() {
          this._app.action.executeByName("cordovacallback");

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
        },

        /**
         * @inheritDoc
         */
        isUnique: function() {
          return true;
        }
      };
    });
  }
);
