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

modulum('TypeAheadEvent', ['TypeAheadCommand'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * TypeAhead event.
     * This class sends an event to the VM. Only applicable for non-validable and non-rollbackable commands.
     * @class TypeAheadEvent
     * @memberOf classes
     * @extends classes.TypeAheadCommand
     */
    cls.TypeAheadEvent = context.oo.Class(cls.TypeAheadCommand, function($super) {
      return /** @lends classes.TypeAheadEvent.prototype */ {
        __name: "TypeAheadEvent",

        /** @type {classes.VMEventBase} */
        _event: null,

        /**
         * @param {classes.VMApplication} app owner
         * @param {classes.VMEventBase} event to execute
         * @param {classes.NodeBase} [node] optional used only to check integrity of event
         */
        constructor: function(app, event, node) {
          $super.constructor.call(this, app, node);
          this._event = event;
        },

        /**
         * @inheritDoc
         */
        execute: function() {
          return {
            processed: true,
            vmEvents: [this._event]
          };
        },

        /**
         * @inheritDoc
         */
        needsVmSync: function() {
          return (this._event instanceof cls.VMActionEvent || this._event instanceof cls.VMKeyEvent);
        },

        /**
         * @inheritDoc
         */
        isPredictable: function() {
          return (!(this._event instanceof cls.VMActionEvent) && !(this._event instanceof cls.VMKeyEvent));
        },

      };
    });
  }
);
