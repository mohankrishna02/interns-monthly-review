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

modulum('KeyboardPrefixedConsoleLogProvider', ['LogProviderBase'],
  function(context, cls) {

    /**
     * Console log provider to handle all keyboard logs
     * @class KeyboardPrefixedConsoleLogProvider
     * @memberOf classes
     * @extends classes.LogProviderBase
     */
    cls.KeyboardPrefixedConsoleLogProvider = context.oo.Class(cls.LogProviderBase, /** @lends classes.PrefixedConsoleLogProvider.prototype */ {
      __name: "KeyboardPrefixedConsoleLogProvider",
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
            var t = new Date().getTime();
            var args = Array.prototype.slice.call(arguments);
            var bufferedKey = args[1];
            var eventKey = args[2];

            var keyMatch = args[0].match(/(Delayed|onKeyDown|processKey).*: (.*)/);

            var entry = {
              provider: prefix.replace(/\s/g, ''), // Change [KEYBOARD   ] to [KEYBOARD]
              t: t,
              type: keyMatch ? keyMatch[1] : "unknown",
              bufferedKey: bufferedKey,
              eventKey: eventKey
            };
            context.LogService.record(entry);
          }
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
