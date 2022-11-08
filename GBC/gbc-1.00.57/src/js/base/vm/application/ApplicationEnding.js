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
modulum('ApplicationEnding',
  function(context, cls) {
    /**
     * application ending
     * @class ApplicationEnding
     * @memberOf classes
     */
    cls.ApplicationEnding = context.oo.Class(
      /** @lends classes.ApplicationEnding.prototype */
      {
        __name: "ApplicationEnding",
        normal: false,
        flag: null,
        message: null,
        constructor: function(isNormal, flag) {
          this.normal = isNormal;
          this.flag = flag;
        }
      });
    cls.ApplicationEnding.ok = new cls.ApplicationEnding(true);
    cls.ApplicationEnding.notok = function(message) {
      var result = new cls.ApplicationEnding(false, "notok");
      result.message = message;
      gbc.LogService.networkProtocol.error(message);
      return result;
    };
    cls.ApplicationEnding.notFound = new cls.ApplicationEnding(false, "notFound");
    cls.ApplicationEnding.forbidden = new cls.ApplicationEnding(false, "forbidden");
    cls.ApplicationEnding.uaProxy = function(message) {
      var result = new cls.ApplicationEnding(false, "uaProxy");
      result.message = message;
      return result;
    };
    cls.ApplicationEnding.autoLogout = function(message) {
      var result = new cls.ApplicationEnding(false, "autoLogout");
      result.message = message;
      return result;
    };
    cls.ApplicationEnding.logPlayer = new cls.ApplicationEnding(true, "hidden");

  });
