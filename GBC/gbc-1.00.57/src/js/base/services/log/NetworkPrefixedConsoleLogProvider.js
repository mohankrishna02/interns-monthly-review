/// FOURJS_START_COPYRIGHT(D,2019)
/// Property of Four Js*
/// (c) Copyright Four Js 2019, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('NetworkPrefixedConsoleLogProvider', ['LogProviderBase'],
  function(context, cls) {

    /**
     * Console log provider to handle all Network logs
     * @class NetworkPrefixedConsoleLogProvider
     * @memberOf classes
     * @extends classes.LogProviderBase
     */
    cls.NetworkPrefixedConsoleLogProvider = context.oo.Class(cls.LogProviderBase, /** @lends classes.PrefixedConsoleLogProvider.prototype */ {
      __name: "NetworkPrefixedConsoleLogProvider",
      _logger: null,

      /**
       * @inheritDoc
       */
      constructor: function(prefix, prefixStyle) {
        var _prefix = (prefixStyle ? "%c" : "") + prefix;
        this._logger = {
          debug: function() {
            var args = Array.prototype.slice.apply(arguments);
            if (prefixStyle) {
              args.unshift(prefixStyle);
            }
            args.unshift(_prefix);
            console.debug.apply(console, args);
          },
          log: function() {
            var args = Array.prototype.slice.apply(arguments);
            if (prefixStyle) {
              args.unshift(prefixStyle);
            }
            args.unshift(_prefix);
            console.log.apply(console, args);
          },
          info: function() {
            var args = Array.prototype.slice.apply(arguments);
            if (prefixStyle) {
              args.unshift(prefixStyle);
            }
            args.unshift(_prefix);
            console.info.apply(console, args);
          },
          warn: function() {
            var args = Array.prototype.slice.apply(arguments);
            if (prefixStyle) {
              args.unshift(prefixStyle);
            }
            args.unshift(_prefix);
            console.warn.apply(console, args);
          },
          error: function() {
            var args = Array.prototype.slice.apply(arguments);
            if (prefixStyle) {
              args.unshift(prefixStyle);
            }
            args.unshift(_prefix);
            console.error.apply(console, args);
          },
          record: function() {
            var args = Array.prototype.slice.call(arguments);
            var logStr = args.join(" ");
            var isRequest = logStr.indexOf("HTTP REQUEST") >= 0;
            var isResponse = logStr.indexOf("HTTP RESPONSE") >= 0;
            var t = new Date().getTime();

            if (isRequest || isResponse) {
              var urlInfo = args[1].match(
                /(\w*).*(POST|GET).*\/ua\/(\w+)\/([a-f0-9]*)[^?]*\??(?:appId=(\d*)&pageId=(\d*))?/);
              var appId = urlInfo ? parseInt(urlInfo[5]) : context.LogService.getLastRecord().appId;
              var pageId = urlInfo ? parseInt(urlInfo[6]) : context.LogService.getLastRecord().pageId;
              var uaType = urlInfo ? urlInfo[3] : "unknown";
              var entry = {
                provider: prefix.replace(/\s/g, ''),
                t: t,
                httpType: args[0].trim(),
                httpMethod: urlInfo && urlInfo[2],
                uaType: uaType,
                uaDetails: urlInfo && urlInfo[1],
                type: args[1].trim(),
                data: args[2] && ("" + args[2]).trim()
              };

              if (uaType === "sua") {
                entry.appId = appId;
                entry.pageId = pageId;
              }

              context.LogService.record(entry);
            }
          },
        };
      },

      /**
       * @inheritDoc
       */
      getLogger: function() {
        return this._logger;
      }
    });
  });
