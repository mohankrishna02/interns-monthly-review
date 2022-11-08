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

(function(contextWin) {
  // try to store js errors for forensics
  contextWin.__jsErrors = contextWin.__jsErrors || [];

  /**
   * @namespace classes
   * @alias classes
   */
  var classes = {};

  /**
   * Genero Browser Client main entry point service
   * @namespace gbc
   * @gbcService
   */
  var gbc = contextWin.augmentedFace.Singleton( /** @lends gbc.prototype */ {
    __name: "gbc",
    oo: contextWin.augmentedFace,

    version: "%%VERSION%%" || "none",
    build: "%%BUILD%%" || "none",
    tag: "%%TAG%%" || "dev-snapshot",
    dirtyFlag: "%%DIRTY%%" || "",
    prodMode: "%%PROD%%",
    systemAppId: -1,
    qaMode: false,
    unitTestMode: false,
    canShowExitWarning: true,
    bootstrapInfo: contextWin.__gbcBootstrap || {},
    moment: contextWin.moment,
    styler: contextWin.styler,
    StateMachine: contextWin.StateMachine,
    classes: classes,
    constants: {
      theme: {}
    },
    errorCount: 0,
    jsErrorCount: 0,
    systemModalOpened: false, // true if a modal system (about, settings, etc...) is currently opened

    /**
     * prepare GBC system environment
     * @memberOf gbc
     */
    preStart: function() {
      document.body.toggleClass("is-mobile-device", contextWin.isMobile());
      document.body.toggleClass("is-not-mobile-device", !contextWin.isMobile());
      document.body.toggleClass("is-touch-device", contextWin.isTouchDevice());
      document.body.toggleClass("is-not-touch-device", !contextWin.isTouchDevice());
      document.body.toggleClass("is-firefox", contextWin.browserInfo.isFirefox);
      document.body.toggleClass("is-edge", contextWin.browserInfo.isEdge);
      document.body.toggleClass("is-ie", contextWin.browserInfo.isIE);
      document.body.toggleClass("is-chrome", contextWin.browserInfo.isChrome);
      document.body.toggleClass("is-opera", contextWin.browserInfo.isOpera);
      document.body.toggleClass("is-safari", contextWin.browserInfo.isSafari);
      document.body.toggleClass("is-ios", contextWin.browserInfo.isIOS);
      document.body.toggleClass("is-android", contextWin.browserInfo.isAndroid);
      if (contextWin.gbc.bootstrapInfo.serverVersion) {
        contextWin.gbc.bootstrapInfo.serverVersion = contextWin.gbc.bootstrapInfo.serverVersion.replace(" - Build ", "-");
      }
      contextWin.gbc.bootstrapInfo.subAppInfo = parseInt(contextWin.gbc.bootstrapInfo.subAppInfo, 10) || 0;
      // Event activation changed
      contextWin.gbc.DebugService.whenActivationChanged(function(event, src, active) {
        contextWin.gbc.LogService.enableProviders(active);
      });
      contextWin.gbc.LogService.registerLogProvider(
        new classes.KeyboardPrefixedConsoleLogProvider("[KEYBOARD ]", "background: #AA6; color: #FFF"), "keyboard", "Keyboard");
      contextWin.gbc.LogService.registerLogProvider(
        new classes.MousePrefixedConsoleLogProvider("[MOUSE    ]", "background: #A66; color: #FFF"), "mouse", "Mouse");
      contextWin.gbc.LogService.registerLogProvider(
        new classes.UiPrefixedConsoleLogProvider("[UI       ]", "background: #015d51; color: #FFF"), "ui", "UI");
      contextWin.gbc.LogService.registerLogProvider(
        new classes.PrefixedConsoleLogProvider("[TYPEAHEAD]", "background: #6A6; color: #FFF"), "typeahead", "TypeAhead");
      contextWin.gbc.LogService.registerLogProvider(
        new classes.PrefixedConsoleLogProvider("[FOCUS    ]", "background: #A6A; color: #FFF"), "focus", "Focus");
      contextWin.gbc.LogService.registerLogProvider(
        new classes.PrefixedConsoleLogProvider("[gICAPI   ]", "background: #6AA; color: #FFF"), "gICAPI", "gICAPI");
      contextWin.gbc.LogService.registerLogProvider(
        new classes.NetworkPrefixedConsoleLogProvider("[NETWORK  ]", "background: #66A; color: #FFF"), "networkProtocol",
        "Network");
      contextWin.gbc.LogService.registerLogProvider(new classes.BufferedConsoleLogProvider(), null, "Default");

      // need to enable or disable debug mode explicitly
      // because DebugService can be also be activated by GAS parameters
      if (window.isURLParameterEnabled(contextWin.location.search, "debugmode")) {
        contextWin.gbc.DebugService.activate();
      } else if (window.isURLParameterDisabled(contextWin.location.search, "debugmode")) {
        contextWin.gbc.DebugService.disable();
      }

      contextWin.gbc.bootstrapInfo.gbcPath = "resources";

      if (window.isURLParameterEnabled(contextWin.location.search, "qainfo")) {
        contextWin.gbc.qaMode = true;

        // helper querystrings for QA
        if (window.isURLParameterEnabled(contextWin.location.search, "contextmenu")) {
          gbc.ThemeService.setValue("theme-disable-context-menu", false);
        }
        if (window.isURLParameterEnabled(contextWin.location.search, "mobileui")) {
          gbc.ThemeService.setValue("aui-mobileUI-default", true);
        }
      }

      // inhibit default browser behaviors
      document.body.addEventListener('keydown', function(event) {
        var contentEditable = Boolean(event.target.getAttribute("contenteditable")) &&
          event.target.getAttribute("contenteditable") !== "false";
        var isInputable = event.target.tagName === "TEXTAREA" || event.target.tagName === "INPUT" ||
          (event.target.tagName === "DIV" && contentEditable);

        if (event.ctrlKey) {
          if (event.which === 80 /* p */ || event.which === 83 /* s */ ) {
            event.preventCancelableDefault();
          }
          if (event.which === 65 /* a */ && !isInputable) {
            event.preventCancelableDefault();
          }
        }

        if (event.which === 8 /* backspace */ && (!isInputable || event.target.readOnly)) {
          event.preventCancelableDefault(); // inhibit previous page on backspace
        }

        // fallback to manage accelerators is focused unfortunately ended on body
        gbc.InitService.onKeyFallback(event);
      });

      if (contextWin.gbc.qaMode) {
        contextWin.gbc.classes.DebugHelper.activateDebugHelpers();
      }

      /**
       * Disable default IE behavior when pressing F1 key (which launch a apage toward microsoft website)
       * ref: https://agile.strasbourg.4js.com/jira/browse/ENGGCS-3879
       */
      if ('onhelp' in window) {
        // To avoid IE to popup the help dialog on F1, we override associated 'onhelp' event
        window.onhelp = function() {
          return false;
        };
      }
    },

    /**
     * start the GBC system (home page or application if bootstrapped)
     */
    start: function() {
      if (contextWin.gbc.__gbcStarted) {
        return;
      }
      contextWin.gbc.__gbcStarted = true;
      gbc.HostService.preStart();
      document.body.addClass("flexible_host_stretch_row");
      if (gbc.DebugService.isMonitorWindow()) {
        return;
      }
      contextWin.gbc.HostService.start();
    },
    /**
     * GBC system entry point
     */
    run: function(callback) {
      modulum.assemble();
      var queryStringTheme = contextWin.location.search.match(/^(?:.*[?&])?theme=([^&$]+)(?:&.*)?$/);
      gbc.ThemeService.initTheme(queryStringTheme && queryStringTheme[1], function() {
        gbc.InitService.initServices();
        gbc.preStart();
        var start = function() {
          gbc.start();
        };
        if (Object.isFunction(contextWin.__gbcDefer)) {
          contextWin.__gbcDefer(start);
        } else {
          contextWin.requestAnimationFrame(start);
        }
        if (callback instanceof Function) {
          callback();
        }
      });
    },
    /**
     * display before ending warning if needed when quitting the web page
     * @return {string}
     */
    showExitWarning: function() {
      if (gbc.ThemeService.getValue("theme-disable-ending-popup") !== true &&
        !contextWin.__desactivateEndingPopup &&
        !window.isURLParameterEnabled(contextWin.location.search, "noquitpopup") &&
        !contextWin.gbc.DebugService.isActive() && gbc.SessionService.getCurrent() && gbc.SessionService
        .getCurrent().getCurrentApplication()) {
        return "The Genero application is still running.\n" +
          "If you leave now, some data may be lost.\n" +
          "Please use the application user interface to exit the application before navigating away from this page.";
      }
    },
    /**
     * emulated window.alert
     * @param {string} text
     * @param {string} header
     * @param {Function?} closeCallback
     * @ignore
     */
    alert: function(text, header, closeCallback) {
      var modal = contextWin.gbc.classes.WidgetFactory.createWidget('Modal', {
        appHash: gbc.systemAppId
      });
      modal._gbcSystemModal();
      modal.setHeader(header);

      var contents = document.createElement("div");
      contents.setAttribute("style", "white-space: pre;");
      contents.textContent = text;

      modal.setContent(contents);
      document.body.appendChild(modal.getElement());
      modal.onClose(function() {
        modal.destroy();
        modal = null;
        contents = null;
        if (closeCallback) {
          closeCallback();
        }
      }.bind(this));

      modal.show();
    }
  });

  var rawError = function() {
    var args = Array.prototype.join.call(arguments, " ");
    contextWin.__jsErrors.push(args);
    console.error(args);
  };

  var stackCallback = function(stackframes) {
    rawError("ERROR - Stacktrace");
    var stringifiedStack = "    at " + stackframes.map(function(sf) {
      return sf.toString();
    }).join('\n    at ');
    rawError(stringifiedStack);
  };

  var stackErrorCallback = function(err) {
    rawError(err);
  };

  /**
   * log and stacktrace errors of the GBC system
   * @param errorText
   * @param error
   * @param _fromNativeCall
   * @ignore
   */
  gbc.error = function(errorText, error, _fromNativeCall) {
    var text = Object.isString(errorText) && errorText || error && error.toString && error.toString(),
      err = error || (errorText && errorText.stack);
    rawError(text);
    if (!_fromNativeCall) {
      gbc.__wrapper.nativeCall({
        name: "error",
        args: [text]
      });
    }
    if (contextWin.StackTrace && err && typeof(err) !== "string") {
      contextWin.StackTrace.fromError(err).then(stackCallback).catch(stackErrorCallback);
    }
  };
  /**
   *
   * @param msg
   * @param file
   * @param line
   * @param col
   * @param error
   * @ignore
   */
  contextWin.onerror = function(msg, file, line, col, error) {
    gbc.error(msg, error);
    if (window.isURLParameterEnabled(contextWin.location.search, "debugmode")) {
      window.critical.display(msg);
    }
  };

  /**
   * js stacktrace emulation
   * @ignore
   */
  gbc.stack = function() {
    if (contextWin.StackTrace) {
      contextWin.StackTrace.generateArtificially().then(stackCallback).catch(stackErrorCallback);
    }
  };

  contextWin.addEventListener("unload", function() {
    var i = 0,
      sessions = gbc.SessionService && gbc.SessionService.getSessions(),
      len = sessions && sessions.length;
    if (len) {
      for (; i < len; i++) {
        if (sessions[i]) {
          sessions[i].closeSession(true);
        }
      }
    }
    gbc.InitService.emit(gbc.constants.widgetEvents.onUnload);
  });

  /**
   * @ignore
   * @return {*|string}
   */
  contextWin.onbeforeunload = function() {
    //emit hook
    gbc.InitService.emit(gbc.constants.widgetEvents.onBeforeUnload);
    gbc.LogService.ui.log("window onBeforeUnload called");

    if (gbc.canShowExitWarning) {
      // Deprecated since chrome 51 : https://www.chromestatus.com/feature/5349061406228480
      return gbc.showExitWarning();
    }
  };

  /**
   * @ignore
   * @return {*|string}
   */
  contextWin.onblur = function() {
    //emit hook
    gbc.InitService.emit(gbc.constants.widgetEvents.onBlur);
  };

  contextWin.modulum.inject(gbc, gbc.classes);
  contextWin.addEventListener('unload', function() {
    gbc.DebugService.destroy();
    gbc.InitService.destroy();
    document.body.innerHTML = "";
  });

  /**
   * testing purpose only
   * @param callback
   * @ignore
   * @private
   */
  gbc.__isIdleTest = function(callback) {
    contextWin.setTimeout(function() {
      try {
        var session = contextWin.gbc && contextWin.gbc.SessionService && contextWin.gbc.SessionService.getCurrent();
        callback({
          session: Boolean(session),
          idle: !session || !session.getCurrentApplication() || session.isCurrentIdle(),
          jsErrors: window.__jsErrors
        });
      } catch (e) {
        var result = {
          ___TEST_EXCEPTION: true
        };
        result.message = e.toString();
        result.stack = e.stack && e.stack.toString();
        callback(result);
      }
    }, contextWin.browserInfo && (contextWin.browserInfo.isIE || contextWin.browserInfo.isFirefox) ? 10 : 1);
  };

  if (window.isURLParameterEnabled(contextWin.location.search, "unittestmode")) {
    gbc.unitTestMode = true;
  }
  gbc.__wrapper = contextWin.gbcWrapper;

  contextWin.gbc = gbc;

  contextWin.gbcWrapper.__init();
})(window);
