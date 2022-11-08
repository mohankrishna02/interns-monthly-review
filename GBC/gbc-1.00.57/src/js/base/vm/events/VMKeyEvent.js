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
modulum('VMKeyEvent', ['VMEventBase'],
  function(context, cls) {
    /**
     *
     * @class VMKeyEvent
     * @memberOf classes
     * @extends classes.VMEventBase
     */
    cls.VMKeyEvent = context.oo.Class({
      base: cls.VMEventBase
    }, function() {
      return /** @lends classes.VMKeyEvent.prototype */ {
        __name: "VMKeyEvent",
        type: "keyEvent",
        /**
         * @type {Object}
         */
        attributes: null,
        /**
         * @param keyName {string} keyName name of the pressed key
         * @param idRef {string?} optional idRef (used for canvas)
         */
        constructor: function(keyName, idRef) {
          this.attributes = {
            keyName: keyName
          };
          if (idRef !== undefined) {
            this.attributes.idRef = idRef;
          }
        }
      };
    });
  });
