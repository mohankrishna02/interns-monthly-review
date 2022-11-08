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

modulum("AuiProtocolReader",
  function(context, cls) {
    /**
     * @class AuiProtocolReader
     * @memberOf classes
     */
    cls.AuiProtocolReader = context.oo.StaticClass(
      /** @lends classes.AuiProtocolReader */
      {
        __name: "AuiProtocolReader",
        translate: function(obj) {
          return context.AuiProtocolParser.parse(obj);
        }
      });
  });
