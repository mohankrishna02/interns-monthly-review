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

modulum('PrefixedConsoleLogProvider', ['LogProviderBase'],
  function(context, cls) {

    /**
     * @class PrefixedConsoleLogProvider
     * @memberOf classes
     * @extends classes.LogProviderBase
     */
    cls.PrefixedConsoleLogProvider = context.oo.Class(cls.LogProviderBase, /** @lends classes.PrefixedConsoleLogProvider.prototype */ {
      __name: "PrefixedConsoleLogProvider",
      _logger: null,

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
            var t = new Date().getTime();

            var entry = {
              provider: prefix.replace(/\s/g, ''),
              t: t,
              log: logStr
            };
            context.LogService.record(entry);
          }
        };
      },
      getLogger: function() {
        return this._logger;
      }
    });
  });
