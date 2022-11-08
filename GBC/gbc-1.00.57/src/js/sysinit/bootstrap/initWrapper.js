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
 see tools/doc/internaldoc/UR/implement.md for documentation
 bootstrapper for gbc environment
 will let embedding platforms do their job
 */

(function(context) {
  var readyCallbacks = [],
    /**
     *
     * @param event
     * @param src
     * @param data
     */
    doReadyCallbacks = function(event, src, data) {
      if (!context.gbcWrapper._readyData) {
        context.gbcWrapper._readyData = data;
      }
      context.gbcWrapper.ready = true;
      var i = 0,
        len = readyCallbacks.length;
      for (; i < len; i++) {
        readyCallbacks[i]();
      }
      readyCallbacks = [];
    };
  /**
   * @namespace window.gbcWrapper
   */
  context.gbcWrapper = {
    events: {
      /**
       * Event ready
       * Fired once when platform declares its low level bindings are ready
       */
      READY: "ready",
      /**
       * Event close
       * Fired when platform's close button is clicked
       */
      CLOSE: "close",
      /**
       * Event end
       * Fired when an application ends
       */
      END: "end",
      /**
       * Event receive
       * Fired when data are received
       */
      RECEIVE: "receive",
      /**
       * Event nativeAction
       * Fired when native sends an action to be managed by UR (e.g. pushNotification, cordovaCallback
       */
      NATIVEACTION: "nativeAction",
      /**
       * Event debugNode
       * Fired when debugNode is selected in the debugger
       */
      DEBUGNODE: "debugNode",
      /**
       * Event query
       * Fired when native platforms needs to query the universal renderer
       * answer will be sent via queryResult
       */
      QUERY: "query"
    },
    /**
     * true when all platform bindings are ready to use
     */
    ready: false,

    /**
     * @typedef {Object} ReadyData
     * @property {Object<string, *>} [headers]
     * @property {string} [meta]
     * @property {boolean} [debugMode]
     * @property {boolean} [isLogReplay]
     * @property {Number} [logLevel]
     * @property {string} nativeResourcePrefix
     * @property {Object<string, string|Array<string>>} [forcedURfrontcalls]
     */

    /**
     * application start data
     * @type {?ReadyData}
     */
    _readyData: null,

    /**
     * @typedef {Object<string, string|Array<string>>} ForcedURFrontCalls
     */

    /**
     * list of frontcalls per module forced to be called at browser side
     * @type {Object<string, string|Array<string>>}
     */
    _forcedURfrontcalls: {
      "webcomponent": "*",
      "qa": ["startqa", "getattribute"]
    },

    /**
     * platform type
     * can be "browser" or "native"
     */
    platformType: context.gbcWrapperInfo.platformType || "browser",
    /**
     * platform name
     * can be "browser", "GDC", "GMA", "GMI"
     */
    platformName: context.gbcWrapperInfo.platformName || "browser",
    /**
     * protocol type
     * can be "ua" or "direct"
     */
    protocolType: context.gbcWrapperInfo.protocolType || "ua",

    /**
     * inform the platform that Universal Renderer is fully initialized and wait for data
     * param {Object<string, *>} options additional information for the protocol
     */
    URReady: function(attr) {},

    /**
     * send data through the platform
     * @param {string} data stringified aui order
     * @param {Object<string, *>} options additional information for the protocol
     *   e.g. in no user activity actions, options will be set to {userActivity: "no"}
     */
    send: function(data, options) {},

    /**
     * inform the platform about a childstart
     */
    childStart: function() {},

    /**
     * send interrupt signal through the platform
     */
    interrupt: function() {},

    /**
     * send close signal through the platform
     */
    close: function() {},

    /**.
     * @callback frontcallCallback
     * @param {{status:number, result:string, errorMessage:string}} result
     */

    /**
     * call the platform's frontcall
     * @param {number} nodeId
     * @param {frontcallCallback} callback
     */
    frontcall: function(nodeId, callback) {},

    /**
     * Send answer of query event to native platform
     * @param {*} data the an object depending on the query
     */
    queryResult: function(data) {},

    /**
     * Show the native aui debugger
     * @param {Number} data the node id or -1
     */
    showDebugger: function(data) {},

    /**
     * Call a named native function
     * @param {{name:string, args:Array}} data native call info
     *
     * Possible call data are:
     *
     * > `{name:"windowTitle",args: [<document.title>]}`
     * > will update the document title to the native
     *
     * > `{name:"error",args: [<error message>]}`
     * > will send error messages to the native
     *
     * > `{name:"noBackAction"}`
     * > will inform the native there is no back resolved action (after a 'nativeAction' 'back')
     *
     */
    nativeCall: function(data) {},

    /**
     * Inform the native platform that a the log was processed
     * Fired in UR log player mode when a log order is fully processed
     */
    logProcessed: function() {},

    /**
     * fires event in gbcWrapper
     * @param {string} eventType the event type
     * @param {*} [data] any data to fire with
     * DO NOT IMPLEMENT
     */
    emit: function(eventType, data) {},

    /**
     * gbcWrapper initializer
     * GBC internal
     * DO NOT IMPLEMENT
     * @private
     */
    __init: function() {
      console.log(
        "GBC", context.gbc.version + "-" + context.gbc.build,
        "- Platform:", context.gbcWrapper.platformName,
        "- Protocol:", context.gbcWrapper.protocolType);
      context.gbcWrapper.on = function(eventType, eventHandler) {
        if (eventType === context.gbcWrapper.events.READY) {
          if (eventHandler instanceof Function) {
            if (this.ready) {
              eventHandler();
            } else {
              if (this._eventListener) {
                this._eventListener.when(eventType, eventHandler, true);
              } else {
                readyCallbacks.push(eventHandler);
              }
            }
            return;
          } else {
            throw new Error("gbcWrapper: onReady callback is not a function");
          }
        }
        if (this._eventListener) {
          this._eventListener.when(eventType, eventHandler);
        }
      };
      if (context.gbcWrapper.protocolType === "direct") {
        context.__gbcDefer = function(start) {
          start();
        };
      }
    },

    /**
     * gbcWrapper prepare wrapper before real start
     * GBC internal
     * DO NOT IMPLEMENT
     * @private
     */
    __prepare: function() {
      var listener = context.gbcWrapper._eventListener =
        new context.gbc.classes.EventListener();
      context.gbcWrapper.emit = function(eventType, data) {
        this._eventListener.emit(eventType, data);
      };
      listener.when(context.gbcWrapper.events.READY, doReadyCallbacks);
      if (context.gbcWrapper.isBrowser()) {
        this.emit(context.gbcWrapper.events.READY);
      }
    },
    /**
     * gbcWrapper ending wrapper initialization after GBC ready
     * GBC internal
     * DO NOT IMPLEMENT
     * @private
     */
    __gbcReady: function() {
      if (context.gbcWrapper.protocolType === "direct") {
        context.gbcWrapper.on(context.gbcWrapper.events.QUERY, function(event, src, data) {
          context.gbc.NativeService.onQuery(data);
        });
        context.gbcWrapper.on(context.gbcWrapper.events.NATIVEACTION, function(event, src, data) {
          context.gbc.NativeService.onNativeAction(data);
        });
        context.gbcWrapper.on(context.gbcWrapper.events.CLOSE, function() {
          context.gbc.NativeService.onNativeAction({
            name: "close"
          });
        });
        context.gbcWrapper.on(context.gbcWrapper.events.READY, function() {
          if (context.gbcWrapper._readyData.nativeResourcePrefix) {
            context.gbcWrapper.nativeResourcePrefix =
              context.gbcWrapper._readyData.nativeResourcePrefix.replace(/\/$/, "") + "/__dvm__/";
          } else {
            throw new Error("gbcWrapper: onReady data did not contain a valid 'nativeResourcePrefix'");
          }
          if (context.gbcWrapper._readyData.debugMode) {
            context.gbc.DebugService.activate();
          }
          if (context.gbcWrapper._readyData.language) {
            context.gbc.I18NService.setLng(context.gbcWrapper._readyData.language);
          }
          context.gbc.LogService.changeLevel(
            ["none", "error", "warn", "log", "all"][context.gbcWrapper._readyData.logLevel || 0] || "none"
          );
          if (context.gbcWrapper._readyData.forcedURfrontcalls) {
            context.gbcWrapper._forcedURfrontcalls = context.gbcWrapper._readyData.forcedURfrontcalls;
          }
          // 
          if (context.gbcWrapper._readyData.isLogReplay) {
            var app = context.gbc.LogPlayerService.getApplication(0, 0);
            context.gbcWrapper.on(context.gbcWrapper.events.RECEIVE, function(event, src, data) {
              app.dvm.manageAuiOrders(data, function() {
                if (app.ending || app.ended) {
                  context.gbcWrapper.logProcessed();
                } else {
                  app.layout.afterLayoutComplete(function() {
                    context.gbcWrapper.logProcessed();
                  }, true);
                }
              });
            });
            context.gbcWrapper.URReady({
              UCName: "GBC",
              UCVersion: gbc.version,
              mobileUI: gbc.ThemeService.getValue("aui-mobileUI-default") ? 1 : 0
            });
          } else {
            context.gbc.SessionService.startDirect(context.gbcWrapper, context.gbcWrapper._readyData.headers);
          }
        });
      }
    },

    /**
     * returns whether or not gbc runs in native mode
     * GBC internal
     * DO NOT IMPLEMENT
     * @return {boolean} true if gbc runs in native mode
     */
    isNative: function() {
      return this.platformType === "native";
    },

    /**
     * returns whether or not gbc runs in browser mode
     * GBC internal
     * DO NOT IMPLEMENT
     * @return {boolean} true if gbc runs in browser mode
     */
    isBrowser: function() {
      return this.platformType === "browser";
    },

    /**
     * transforms a resource path
     * GBC internal
     * DO NOT IMPLEMENT
     * @param {string} path raw path
     * @param {string} [nativePrefix] native prefix if any
     * @param {string} [browserPrefix] browser prefix if any
     * @return {string} the transformed resource path
     */
    wrapResourcePath: function(path, nativePrefix, browserPrefix) {
      // if path has a scheme, don't change it
      if (!path || /^(http[s]?|[s]?ftp|data|file|font)/i.test(path)) {
        return path;
      }
      var startPath = this.isNative() ?
        this.nativeResourcePrefix + (nativePrefix ? nativePrefix + "/" : "") :
        (browserPrefix ? browserPrefix + "/" : "");
      // Prevent Windows path like C:\foo\too.ttf
      return startPath + (this.isNative() ? encodeURIComponent(path).replace("%2F", "/") : path);
    },

    /**
     * in native mode, will check if function call is forced to be done by UR
     * GBC internal
     * DO NOT IMPLEMENT
     * @param {string} moduleName the function call module
     * @param {string} functionName the function call name
     * @return {boolean} whtether or not function call is forced to by done by UR
     * @private
     */
    isFrontcallURForced: function(moduleName, functionName) {
      return Boolean(this._forcedURfrontcalls[moduleName]) &&
        ((this._forcedURfrontcalls[moduleName] === "*") ||
          (this._forcedURfrontcalls[moduleName].indexOf(functionName) >= 0));
    }
  };

})(window);
