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

modulum('BookmarkService', ['InitService', 'LocalSettingsService'],
  function(context, cls) {

    /**
     * Service to keep bookmark of favorite apps
     * @class gbc.BookmarkService
     */
    context.BookmarkService = context.oo.StaticClass( /** @lends gbc.BookmarkService */ {
      __name: 'BookmarkService',

      /**
       * Name of the event
       */
      _refreshedEvent: 'refreshed',

      /**
       * Position of the last bookmark
       * @type {number}
       */
      _lastBookmarks: -1,

      /**
       * List of all bookmarks
       * @type {Array}
       */
      _bookmarks: [],

      /**
       * Event Listener shortcut
       */
      _eventListener: new cls.EventListener(),

      /**
       * Init function
       */
      init: function() {
        this._refresh(true);
      },

      /**
       * Write the bookmark
       * @param {boolean} emit flag to trig the refresh event at the end of function
       */
      update: function(emit) {
        context.LocalSettingsService.write('lastBookmarks', new Date().getTime());
        context.LocalSettingsService.write('bookmarks', this._bookmarks);
        if (emit) {
          this._eventListener.emit(this._refreshedEvent);
        }
      },

      /**
       * Get all bookmarked apps
       * @returns {Array}
       */
      getBookmarks: function() {
        return this._bookmarks;
      },

      /**
       * Get a bookmark in localstorage defined by his name
       * @param   {string} name The displayed name in the list
       * @returns {Object} The matching bookmark
       */
      getBookmark: function(name) {
        return this._bookmarks.find(function(n) {
          return n.name === name || n.url === name;
        });
      },

      /**
       * Replace a bookmark
       * @param name
       * @param url
       */
      switchBookmark: function(name, url) {
        if (this.getBookmark(name)) {
          this._removeBookmark(name, true);
        } else {
          this._addBookmark(name, url, true);
        }
      },

      /**
       * Add a bookmark to the localstorage
       * @param   {string}  name Name to be displayed
       * @param   {string}  url  Link to the bookmark content
       * @returns {boolean} true if succesfully added, false otherwise
       */
      addBookmark: function(name, url) {
        return this._addBookmark(name, url, true);
      },

      /**
       * Search localStorage and remove a bookmark
       * @param   {string}   name Name to be removed
       */
      removeBookmark: function(name) {
        this._removeBookmark(name, true);
      },

      /**
       * Handler once the bookmarks are refreshed
       * @param hook callback
       * @returns {*|HandleRegistration}
       */
      onRefreshed: function(hook) {
        return this._eventListener.when(this._refreshedEvent, hook);
      },

      /**
       * Update bookmarks
       * @param {boolean} emit flag to trig the refresh event at the end of function
       * @private
       */
      _refresh: function(emit) {
        var lastBookmarks = context.LocalSettingsService.read('lastBookmarks') || 0;
        if (lastBookmarks > this._lastBookmarks) {
          this._bookmarks = (context.LocalSettingsService.read('bookmarks') || []).remove(null);
        }
        if (emit) {
          this._eventListener.emit(this._refreshedEvent);
        }
      },

      /**
       * Add a bookmark to the localstorage
       * @param   {string}  name Name to be displayed
       * @param   {string}  url  Link to the bookmark content
       * @param   {boolean}  emit if emits the change
       * @returns {boolean} true if succesfully added, false otherwise
       * @private
       */
      _addBookmark: function(name, url, emit) {
        this._refresh();
        if (this.getBookmark(name)) {
          this.removeBookmark(name);
        }
        var mark = {
          'name': name,
          'description': '',
          'url': url,
          'date': Date.now()
        };

        this._bookmarks.unshift(mark);
        this.update(emit);
      },

      /**
       * Search localStorage and remove a bookmark
       * @param {string} name - Name to be removed
       * @param {boolean} emit
       */
      _removeBookmark: function(name, emit) {
        this._refresh();
        var toRemove = this.getBookmark(name);
        this._bookmarks.remove(toRemove);
        this.update(emit);
        return toRemove;
      }
    });
    context.InitService.register(context.BookmarkService);
  });
