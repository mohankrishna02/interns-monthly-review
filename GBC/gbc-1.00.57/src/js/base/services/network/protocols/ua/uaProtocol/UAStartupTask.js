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
     * @class UAStartupTask
     * @memberOf classes
     */
    cls.UAStartupTask = context.oo.StaticClass(
      /** @lends classes.UAStartupTask */
      {
        run: function(application, callback) {
          var headers = {
            Accept: "application/octet-stream"
          };
          cls.UANetwork.runTask(application, callback, null, {
            headers: headers
          });
        }
      });
  })(gbc, gbc.classes);
