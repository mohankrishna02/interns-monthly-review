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

modulum('TypeAheadFunctionCallResult', ['TypeAheadCommand'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * TypeAhead event.
     * This class sends an event to the VM. Only applicable for non-validable and non-rollbackable commands.
     * @class TypeAheadFunctionCallResult
     * @memberOf classes
     * @extends classes.TypeAheadCommand
     */
    cls.TypeAheadFunctionCallResult = context.oo.Class(cls.TypeAheadCommand, function($super) {
      return /** @lends classes.TypeAheadFunctionCallResult.prototype */ {
        __name: "TypeAheadFunctionCallResult",

        _status: null,
        _message: null,
        _values: null,

        /**
         * @param app {classes.VMApplication} app owner
         * @param status front call result status
         * @param message front call result status message
         * @param values front call result values
         */
        constructor: function(app, status, message, values) {
          $super.constructor.call(this, app, null);
          this._status = status;
          this._message = message;
          this._values = values;
          // Got the function call result, so functioncall is not processing anymore
          context.FrontCallService.setFunctionCallProcessing(false);
        },

        /**
         * @inheritDoc
         */
        execute: function() {
          var event = new cls.VMFunctionCallEvent(this._status, this._message, this._values);
          return {
            processed: true,
            vmEvents: [event]
          };
        }
      };
    });
  }
);
