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

(
  function(context, cls) {
    /**
     * @class UAPing
     * @memberOf classes
     */
    cls.UAPing = context.oo.StaticClass(
      /** @lends classes.UAPing */
      {
        run: function(application, callback) {
          cls.UANetwork.ping(application, callback);
        }
      });
  })(gbc, gbc.classes);
