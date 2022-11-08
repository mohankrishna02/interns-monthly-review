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

modulum('MousePrefixedConsoleLogProvider', ['LogProviderBase'],
  function(context, cls) {

    /**
     * Console log provider to handle all mouse logs
     * @class MousePrefixedConsoleLogProvider
     * @memberOf classes
     * @extends classes.LogProviderBase
     */
    cls.MousePrefixedConsoleLogProvider = context.oo.Class(cls.LogProviderBase, /** @lends classes.PrefixedConsoleLogProvider.prototype */ {
      __name: "MousePrefixedConsoleLogProvider",
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
            var logStr = args[0];
            var mouse = logStr.match(/(onClick|onRightClick)/);
            var t = new Date().getTime();

            if (mouse) {
              var evt = args[1];
              var itemId = args[1].target.id || args[1].target.closest("gbc_WidgetBase") ? args[1].target.closest(
                "gbc_WidgetBase").getAttribute("data-aui-name") : null;

              var entry = {
                provider: prefix.replace(/\s/g, ''),
                t: t,
                itemId: itemId,
                itemElement: args[1].target.outerHTML,
                clientX: evt.clientX,
                clientY: evt.clientY,
                rightClick: mouse[1] === "onRightClick",
              };

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
