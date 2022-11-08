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

modulum('LogProviderBase',
  function(context, cls) {

    /**
     * @class LogProviderBase
     * @memberOf classes
     */
    cls.LogProviderBase = context.oo.Class( /** @lends classes.LogProviderBase.prototype */ {
      __name: "LogProviderBase",

      /** @type {boolean} */
      _enabled: false,

      /**
       * Get the logger with all necessary methods
       * @return {Object|null}
       */
      getLogger: function() {
        throw "LogProvider is abstract. Implement it to log.";
      },

      /**
       * Activate this logProvider
       * @param {Boolean} enable - true to enable, false otherwise
       */
      enable: function(enable) {
        this._enabled = enable;
      },

      /**
       * Check if this logProvider is enabled
       * @return {boolean} true if enabled, false otherwise
       */
      isEnabled: function() {
        return this._enabled;
      }
    });
  });
