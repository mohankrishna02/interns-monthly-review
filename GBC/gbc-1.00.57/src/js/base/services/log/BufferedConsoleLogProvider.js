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

modulum('BufferedConsoleLogProvider', ['LogProviderBase', 'ConsoleLogProvider'],
  function(context, cls) {

    /**
     * @class BufferedConsoleLogProvider
     * @memberOf classes
     * @extends classes.LogProviderBase
     */
    cls.BufferedConsoleLogProvider = context.oo.Class(cls.LogProviderBase, function($super) {
      return /** @lends classes.BufferedConsoleLogProvider.prototype */ {
        __name: "BufferedConsoleLogProvider",
        throttle: 100,
        buffer: null,
        console: null,
        currentLevel: "none",
        constructor: function() {
          $super.constructor.call(this);
          this.buffer = [];
          this.console = new cls.ConsoleLogProvider();
        },
        flush: function(force) {
          if (this.buffer.length) {
            if (force || this.buffer.length >= this.throttle) {
              this.console.getLogger()[this.currentLevel](this.buffer.join("\n"));
              this.buffer.length = 0;
            }
          }
        },
        getLogger: function() {
          var result = {};
          var levels = context.LogService.levels;
          for (var l = 0; l < levels.length; l++) {
            var item = levels[l];
            result[item] = this._loggerMethod.bind(this, item);
          }
          return result;
        },
        _loggerMethod: function(level, arg) {
          if (level !== "all") {
            this.flush(this.currentLevel !== level);
            this.currentLevel = level;
            this.buffer.push(arg);
          }
        }
      };
    });
  });
