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

modulum('LocalSettingsService', ['InitService'],
  function(context, cls) {

    /**
     * @class gbc.LocalSettingsService
     */
    context.LocalSettingsService = context.oo.StaticClass( /** @lends gbc.LocalSettingsService */ {
      __name: "LocalSettingsService",
      _eventListener: null,
      _quotaExceededError: false,

      init: function() {
        this._eventListener = new cls.EventListener();
        if (!localStorage) {
          console.error("localStorage is not enabled, you might experience some errors");
        }
      },

      read: function(id) {
        if (localStorage) {
          return JSON.parse(localStorage.getItem(id));
        } else {
          return false;
        }
      },

      write: function(id, contents) {
        try {
          localStorage.setItem(id, JSON.stringify(contents));
        } catch (e) {
          if (e.name === "QuotaExceededError") {
            console.error(e);
            this._quotaExceededError = true;
            this._eventListener.emit("QuotaExceededError");
          }
        }
      },
      remove: function(id) {
        localStorage.removeItem(id);
      },
      keys: function() {
        return Object.keys(localStorage);
      },
      clear: function() {
        localStorage.clear();
      }
    });
    context.InitService.register(context.LocalSettingsService);
  });
