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

modulum("ProtocolInterface",
  function(context, cls) {
    /**
     * Base class for protocol interface.
     * @class ProtocolInterface
     * @memberOf classes
     */
    cls.ProtocolInterface = context.oo.Class(
      /** @lends classes.ProtocolInterface.prototype */
      {
        __name: "ProtocolInterface",
        isAlive: function() {
          return false;
        },
        trackPrompt: function() {
          return false;
        }
      });
  });
