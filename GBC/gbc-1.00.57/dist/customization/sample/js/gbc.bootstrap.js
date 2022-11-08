/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

/*
 bootstrapper for gbc environment
 will let embedding platforms do their job
 */

(function(context) {
  var queryString = {};
  window.location.search.substring(1).split("&").map(function(item) {
    var kv = item.split("=", 2);
    queryString[kv[0]] = kv[1];
  });

  /**
   * @namespace window.gbcWrapper
   */
  context.gbcWrapperInfo = {
    /**
     * platform type
     * can be "browser" or "native"
     * @type {string}
     */
    platformType: queryString.UR_PLATFORM_TYPE || "browser",
    /**
     * platform name
     * can be "browser", "GDC", "GMA", "GMI"
     * @type {string}
     */
    platformName: queryString.UR_PLATFORM_NAME || "browser",
    /**
     * protocol type
     * can be "ua" or "direct"
     * @type {string}
     */
    protocolType: queryString.UR_PROTOCOL_TYPE || "ua"
  };

})(window);
