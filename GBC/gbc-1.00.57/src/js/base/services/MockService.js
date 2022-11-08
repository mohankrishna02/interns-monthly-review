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

modulum('MockService', ['InitService'],
  function(context, cls) {

    /**
     * @class gbc.MockService
     */
    context.MockService = context.oo.StaticClass( /** @lends gbc.MockService */ {
      __name: "MockService",
      _init: false,
      init: function() {},

      fakeApplication: function(forUnit) {
        if (!this._init) {
          this._init = true;
          context.LogService.registerLogProvider(new cls.ConsoleLogProvider(), "networkProtocol", "FakeApp Network");
          context.LogService.registerLogProvider(new cls.BufferedConsoleLogProvider(), null);
          gbc.start();
        }
        var currentSession = context.SessionService.getCurrent();
        if (forUnit) {
          if (currentSession) {
            currentSession.destroy(true);
            currentSession = null;
          }

          // Force ListView to be Table for unit tests
          if (window.isMobile()) {
            window.gbc.ThemeService.setValue("theme-table-default-widget", "table");
          }
        }
        var params = {
          mode: "no"
        };
        var newApp = null;
        if (!currentSession) {
          newApp = context.SessionService.start("fake", params).getCurrentApplication();
          newApp.getSession()._sessionId = "00000000000000000000000000000000";
        } else {
          currentSession.start("fake", params);
          newApp = currentSession.getCurrentApplication();
        }
        newApp.applicationInfo.ignoreFrontcallModules = ["webcomponent"];
        return newApp;
      }
    });
    context.InitService.register(context.MockService);
  });
