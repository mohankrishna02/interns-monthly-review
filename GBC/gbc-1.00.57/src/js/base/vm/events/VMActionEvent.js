/// FOURJS_START_COPYRIGHT(D,2015)
/// Property of Four Js*
/// (c) Copyright Four Js 2015, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";
modulum('VMActionEvent', ['VMEventBase'],
  function(context, cls) {
    /**
     *
     * @class VMActionEvent
     * @memberOf classes
     * @extends classes.VMEventBase
     */
    cls.VMActionEvent = context.oo.Class({
      base: cls.VMEventBase
    }, function() {
      return /** @lends classes.VMActionEvent.prototype */ {
        __name: "VMActionEvent",
        type: "actionEvent",
        /**
         * @type {Object}
         */
        attributes: null,

        /**
         * to know that the action is not from a user interaction (ON IDLE)
         * @type {boolean}
         */
        noUserActivity: false,

        /**
         * @param {string} idRef reference of the node holding the action
         */
        constructor: function(idRef) {
          this.attributes = {
            idRef: idRef
          };
        }
      };
    });
  });
