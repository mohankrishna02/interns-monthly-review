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

modulum('LogPlayerService',
  function(context, cls) {

    /**
     * Log Player Service to centralize log playing logic used in LogPlayerWidget and in UR Log Player
     * @namespace gbc.LogPlayerService
     * @gbcService
     */
    context.LogPlayerService = context.oo.StaticClass( /** @lends gbc.LogPlayerService */ {
      __name: "LogPlayerService",

      /**
       * @type {Map<number, Map<number, classes.VMApplication>>}
       */
      _fakeSessions: null,

      /**
       * Get the mock application registered with a session id and an application id
       * @param {number} sessionId
       * @param {number} appId
       * @returns {classes.VMApplication}
       */
      getApplication: function(sessionId, appId) {
        if (!this._fakeSessions) {
          this._fakeSessions = new Map();
        }
        if (!this._fakeSessions.has(sessionId)) {
          this._fakeSessions.set(sessionId, new Map());
        }
        var fakeSession = this._fakeSessions.get(sessionId);
        if (!fakeSession.has(appId)) {
          var app = window.gbc.MockService.fakeApplication();
          app.setRunning(true);
          app.info().webComponent = window.location.origin +
            window.location.pathname.replace(/\/[^\/]+$/, "/") +
            context.ThemeService.getResource("webcomponents");
          fakeSession.set(appId, app);
        }
        return fakeSession.get(appId);
      },

      /**
       * Set a given app visible
       * @param {classes.VMApplication} app- application to set visible
       */
      setVisibleApplication: function(app) {
        var session = app.getSession();
        if (session) {
          session.getWidget().setCurrentWidget(app.getUI().getWidget());
        }
      },

      /**
       * Unregister a mock application
       * @param sessionId
       * @param appId
       */
      removeApplication: function(sessionId, appId) {
        if (!this._fakeSessions) {
          this._fakeSessions = new Map();
        }
        var session = this._fakeSessions.get(sessionId);
        if (session) {
          session.delete(appId);
          if (!session.size) {
            this._fakeSessions.delete(sessionId);
          }
        }
      },

      /**
       * Clean all applications/session
       */
      cleanApplications: function() {
        if (this._fakeSessions) {
          this._fakeSessions.clear();
        }
      },

      /**
       * Replace resource reference with mock ones
       * @param {string} order
       * @param {Object?} imageMap
       * @returns {string}
       */
      mockOrderResources: function(order, imageMap) {
        var imgMock = context.ThemeService.getResource("img/logo.png"),
          ttfMock = context.ThemeService.getResource("fonts/materialdesignicons-webfont.ttf");

        var imgReplacer = function(tpl, data) {
          return tpl.replace(/([^"]+\.(png|jpg|gif|svg))(\?[^\\"]+)?/g, function(id) {
            return data && data[id] || imgMock;
          });
        };

        order = imgReplacer(order, imageMap);

        return order.replace(/"[^"]+\.ttf\?[^"]+"/g, "\"" + ttfMock + "\"") // Fonts
          .replace(/componentType "[^"]+"/g, "componentType \"empty\""); // webcomponents
      }
    });
  });
