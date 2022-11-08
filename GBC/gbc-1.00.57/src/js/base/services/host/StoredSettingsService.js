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

modulum('StoredSettingsService', ['InitService', 'LocalSettingsService'],
  function(context, cls) {

    /**
     * Stored Settings Service to handle clientside specific configurations
     * @class gbc.StoredSettingsService
     */
    gbc.StoredSettingsService = context.oo.Singleton( /** @lends gbc.StoredSettingsService */ {
      __name: "StoredSettingsService",

      /**
       * NameSpace for Stored Settings to avoid conflict
       */
      _storedSettingsName: "storedSettings_gwcJS",

      /**
       * Copy of browser stored settings
       * @type {Object}
       */
      _storedSettings: null,

      /**
       * Flag to define if stored settings are enabled or not
       * @type {boolean}
       */
      _storedSettingsEnable: true,

      /**
       * Keep track of disabled tables in an array
       * @type: {Array}
       */
      _disabledTables: [],

      /**
       * Keep track of disabled tables
       */
      _disabledWindows: [],

      _eventListener: new cls.EventListener(),

      /**
       * Should be called once
       */
      init: function() {
        this._storedSettings = context.LocalSettingsService.read(this._storedSettingsName);
        if (!this._storedSettings) {
          try {
            context.LocalSettingsService.write(this._storedSettingsName, {});
          } catch (e) {
            this._storedSettingsEnable = false;
          }
        }
        context.InitService.when(gbc.constants.widgetEvents.onBeforeUnload, function() {
          this.sync();
        }.bind(this));

      },

      /**
       * Access to a local copy of stored data or browser's one if local copy is empty
       * @returns {Object}
       */
      read: function() {
        return this._storedSettings || context.LocalSettingsService.read(this._storedSettingsName);
      },

      /**
       * Write the local copy of stored data
       * @param object
       */
      write: function(object) {
        this._storedSettings = object;
      },

      /**
       * Synchronize the temporary stored settings to the browser'storage
       * @note Keep in mind that calling this many times will lower performances
       */
      sync: function() {
        context.LocalSettingsService.write(this._storedSettingsName, this._storedSettings);
      },

      /**
       * Write the stored Settings in Local Storage of the browser
       * /!\ you should not call this function directly, it will break the stored settings
       * @param {object|string} newSettings
       * @param {boolean} deep
       * @private
       */
      _update: function(newSettings, deep) {
        deep = typeof(deep) === "undefined" ? true : deep;
        // Pass in the objects to merge as arguments.
        // For a deep extend, set the first argument to `true`.
        var extend = function() {
          // Variables
          var extended = {};
          var deep = false;
          var i = 0;
          var length = arguments.length;

          // Check if a deep merge
          if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
            deep = arguments[0];
            i++;
          }

          // Merge the object into the extended object
          var merge = function(obj) {
            for (var prop in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                // If deep merge and property is an object, merge properties
                if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                  extended[prop] = extend(true, extended[prop], obj[prop]);
                } else {
                  extended[prop] = obj[prop];
                }
              }
            }
          };

          // Loop through each object and conduct a merge
          for (; i < length; i++) {
            var obj = arguments[i];
            merge(obj);
          }
          return extended;
        };

        var oldSettings = this.read();
        var finalSettings = extend(deep, oldSettings, newSettings);
        this.write(finalSettings);
      },

      /**
       * Will create an object according to the accessor key given
       * @param key {string} accessor to the setting
       * @param leafvalue
       * @returns {{}}
       * @private
       */
      _buildTree: function(key, leafvalue) {
        var obj = {};
        var splittedKey = key.split('.');
        var splicedKey = key.split('.');
        var lenght = splittedKey.length;
        var newKey = '';

        //Create branch
        if (lenght > 1) {
          for (var i = 0; lenght > 0; i++) {
            if (!obj.hasOwnProperty(splittedKey[i])) {
              newKey = splicedKey.splice(i + 1).join('.');
              if (newKey.length > 0) {
                obj[splittedKey[i]] = this._buildTree(newKey, leafvalue);
              } else {
                break;
              }
            } else {
              break;
            }
          }
        } else { //create Leaf
          obj[key] = leafvalue || false;
        }
        return obj;
      },

      /**
       * Helper to get a cookie by name
       * @param name {string}
       * @returns {*}
       * @private
       */
      _getCookie: function(name) {
        var match = document.cookie.match(new RegExp(name + '=([^;]+)'));
        if (match) {
          return match[1];
        }
      },

      /**
       * Check if table/window has been disabled by 4ST style
       * @param key {string} accessor to stored ressource
       * @returns {boolean}
       * @private
       */
      _isForcedDefault: function(key) {
        //Check if form disabled
        var formName = key.replace('gwc.forms.', '').split('.')[0];
        //Check if table disabled
        var tableName = key.replace('gwc.forms.' + formName + '.tables.', '').split('.')[0];

        return (this._disabledWindows.indexOf(formName) >= 0 || this._disabledTables.indexOf(tableName) >= 0);
      },

      /**
       * Choose to use or not Stored Settings
       * @param {boolean} state is Enable?
       */
      enable: function(state) {
        this._storedSettingsEnable = state;
        this._update({
          'storedSettingDisabled': !state
        }, false);
      },

      /**
       * Check if StoredSettings are enabled or not
       * @returns {boolean}
       */
      areEnabled: function() {
        var allStored = this.read(this._storedSettingsName);
        if (allStored === null) {
          return false;
        }
        /* jshint ignore:start */
        if (allStored.hasOwnProperty('storedSettingDisabled')) {
          this._storedSettingsEnable = !allStored.storedSettingDisabled;
        }
        /* jshint ignore:end */
        return this._storedSettingsEnable;
      },

      /**
       * Disable stored Settings of a given window
       * @param winName
       * @param disable
       */
      disableWindowStoredSettings: function(winName, disable) {
        if (!disable) {
          var index = this._disabledWindows.indexOf(winName);
          if (index >= 0) {
            this._disabledWindows.splice(index, 1);
          }
        } else {
          this._disabledWindows.push(winName);
        }
      },

      /**
       * Disable stored Settings of a given table
       * @param tableName
       * @param disable
       */
      disableTableStoredSettings: function(tableName, disable) {
        if (!disable) {
          var index = this._disabledTables.indexOf(tableName);
          if (index >= 0) {
            this._disabledTables.splice(index, 1);
          }
        } else {
          this._disabledTables.push(tableName);
        }
      },

      /**
       * Reset and erase all stored settings
       */
      reset: function() {
        this.write({});
        this._eventListener.emit('storedSettingsReset');
      },

      /**
       * Reset and erase a specific stored settings
       * @param key {?string} key to remove from stored settings
       */
      removeSettings: function(key) {
        this.setSettings(key, {}, true); //true to replace
      },

      /**
       * Reset and erase form stored settings
       * @param formName {string} name of the form to remove from stored settings
       */
      resetForm: function(formName) {
        var formkey = 'gwc.forms.' + formName;
        this.setSettings(formkey, {}, true); //true to replace
      },

      /**
       * Reset and erase form stored settings
       * @param {string} tableName - name of the form to remove from stored settings
       */
      resetTable: function(tableName) {
        var formkey = 'gwc.tables.' + tableName;
        this.setSettings(formkey, {}, true); //true to replace
      },

      /**
       * Get a stored setting by its key accessor (i.e: gwc.app.something)
       * @param {string} key
       * @returns {*}
       */
      getSettings: function(key) {
        var settings = this.read(this._storedSettingsName);
        var keys = key.split('.');
        if (this.areEnabled() && !this._isForcedDefault(key)) {
          for (var i = 0; i < keys.length; i++) {
            if (settings.hasOwnProperty(keys[i])) {
              settings = settings[keys[i]];
            } else {
              settings = null;
              break;
            }
          }
          return typeof(settings) === 'undefined' ? null : settings;
        } else {
          return null;
        }

      },

      /**
       * Store a setting, create the accessor path if non existing
       * @param key {string} accessor to the setting
       * @param settings {*}
       * @param replace {boolean=}
       * @returns {boolean} true if success / false otherwise
       */
      setSettings: function(key, settings, replace) {
        if (this.areEnabled() && !this._isForcedDefault(key)) {
          replace = typeof(replace) === 'undefined' ? false : replace;

          //get Settings first
          var existingSetting = this.getSettings(key);

          //If existing : update values
          if (!existingSetting) {
            var tree = this._buildTree(key);
            this._update(tree);
          }

          existingSetting = settings;
          var allStored = this._goDown(key, existingSetting);
          this._update(allStored, !replace);
          return true;
        } else {
          return false;
        }
      },

      /**
       * Used to be recursive
       * @param key
       * @param settings
       * @returns {*|{}}
       * @private
       */
      _goDown: function(key, settings) {
        return this._buildTree(key, settings);
      },

      //Sidebar related functions
      /**
       * Store the sidebar status: visible / hiiden
       * @param visible {bool}
       */
      setSideBarVisible: function(visible) {
        this.setSettings('gwc.app.sidebar.visible', visible);
      },

      /**
       * Check if sideBar is visible
       * @returns {bool}
       */
      isSideBarVisible: function() {
        return this.getSettings('gwc.app.sidebar.visible');
      },

      /**
       * Store the sidebar width
       * @param width {number}
       */
      setSideBarwidth: function(width) {
        this.setSettings('gwc.app.sidebar.width', width);
      },

      /**
       * Get the sidebar width
       * @returns {number}
       */
      getSideBarwidth: function() {
        return this.getSettings('gwc.app.sidebar.width');
      },

      //Language related functions
      /**
       * Manually set the language of the interface
       * @param locale {string} should be something like "en-US" or "fr-FR"
       */
      setLanguage: function(locale) {
        this.setSettings('gwc.app.locale', locale);
        gbc.I18NService.setLng(locale);
      },

      /**
       * Get the language set
       * @returns {string} locale
       */
      getLanguage: function() {
        var locale = this.getSettings('gwc.app.locale');
        if (!locale) {
          locale = this._getCookie('lang');
        }
        return locale;
      },

      //Log level related functions
      /**
       * store the log level
       * @param loglevel {string}
       */
      setLoglevel: function(loglevel) {
        this.setSettings('gwc.app.loglevel', loglevel);
      },

      /**
       * Get the log level
       * @returns {string} loglevel
       */
      getLoglevel: function() {
        return this.getSettings('gwc.app.loglevel') || 'none';
      },

      //Log types related functions
      /**
       * store the log types
       * @param logtypes {string}
       */
      setLogtypes: function(logtypes) {
        this.setSettings('gwc.app.logtypes', JSON.stringify(logtypes));
      },

      /**
       * Get the log types
       * @returns {string} logtypes
       */
      getLogtypes: function() {
        return JSON.parse(this.getSettings('gwc.app.logtypes') || "null");
      },

      //Splitter related functions
      /**
       * Define a splitter according to parameters
       * @param formName
       * @param identifier
       * @param splitInfo
       */
      setSplitter: function(formName, identifier, splitInfo) {
        var selector = 'gwc.forms.' + formName + '.layoutContainer.' + identifier;
        this.setSettings(selector, splitInfo);
      },

      /**
       * Get Splitter info
       * @param formName
       * @param identifier
       * @returns {*}
       */
      getSplitter: function(formName, identifier) {
        var selector = 'gwc.forms.' + formName + '.layoutContainer.' + identifier;
        return this.getSettings(selector);
      },

      //Collapsible group related functions
      /**
       * Define a group collapsed state according to parameters
       * @param {string} formName
       * @param {string} identifier
       * @param {boolean} collapsedInfo
       */
      setGroupCollapsedState: function(formName, identifier, collapsedInfo) {
        var selector = 'gwc.forms.' + formName + '.groupCollapsed.' + identifier;
        this.setSettings(selector, collapsedInfo);
      },

      /**
       * Get group collapsed state
       * @param {string} formName
       * @param {string} identifier
       * @returns {boolean}
       */
      getGroupCollapsedState: function(formName, identifier) {
        var selector = 'gwc.forms.' + formName + '.groupCollapsed.' + identifier;
        return this.getSettings(selector);
      },

      /**
       * Handling a callback on reset storedSettings
       * @param hook
       * @returns {*|HandleRegistration}
       */
      whenReset: function(hook) {
        return this._eventListener.when('storedSettingsReset', hook);
      }
    });
    context.InitService.register(context.StoredSettingsService);
  });
