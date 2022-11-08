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

modulum('HistoryService', ['InitService', 'LocalSettingsService'],
  function(context, cls) {

    /**
     * @class gbc.HistoryService
     */
    gbc.HistoryService = context.oo.StaticClass( /** @lends gbc.HistoryService */ {
      __name: 'HistoryService',

      /**
       * Name of the event
       */
      _refreshedEvent: 'refreshed',

      /**
       * Namespace for this part of local storage to avoid inconsistency
       */
      _localSettingsName: 'history_gwcJS',

      /**
       * List of all history entry
       * @type {Array}
       */
      _history: [],

      /**
       * Event Listener shortcut
       */
      _eventListener: new cls.EventListener(),

      /**
       * Init function
       */
      init: function() {
        this.refresh();
      },

      refresh: function() {
        this._history = (context.LocalSettingsService.read(this._localSettingsName) || []).remove(null);
        this._eventListener.emit(this._refreshedEvent);
      },

      /**
       * Get History stored
       * @returns {Array} History marks list
       */
      getHistory: function(name) {
        if (name) {
          return this._history.find(function(n) {
            return n.name === name || n.url === name;
          });
        } else {
          return this._history;
        }
      },

      /**
       * Add something to the history stack
       * @param   {classes.VMApplication} application The name to be displayed
       * @param   {string} url  The link to go with this history mark
       * @param flag
       */
      addHistory: function(application, url, flag) {
        if (typeof(flag) === 'undefined') {
          flag = '';
        }

        this._history.removeMatching(function(n) {
          return n.name === application.info().appId || n.url === name;
        });

        this._history.unshift({
          'name': application.info().appId,
          'description': '',
          'url': url,
          'date': Date.now(),
          'flag': flag,
          'session': application.info().session
        });
        this._history = this._history.slice(0, 10); // take top 10
        context.LocalSettingsService.write(this._localSettingsName, this._history);
        this.refresh();
      },

      /**
       * Remove a given history entry
       * @param   {string} name The name of the entry to remove
       */
      removeHistory: function(name) {
        this._history.removeMatching(function(n) {
          return n.name === ('' + name) || n.url === name;
        });
        context.LocalSettingsService.write(this._localSettingsName, this._history);
        this.refresh();
      },

      /**
       * Remove all the History stored
       */
      clearHistory: function() {
        context.LocalSettingsService.write(this._localSettingsName, []);
        this.refresh();
      },
      onRefreshed: function(hook) {
        return this._eventListener.when(this._refreshedEvent, hook);
      }
    });
    context.InitService.register(context.HistoryService);
  });
