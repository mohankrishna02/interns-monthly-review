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

modulum('FrontCallService.modules.localStorage', ['FrontCallService'],
  function(context, cls) {

    /**
     * Local storage module to store variables into browser's local storage
     * @instance localStorage
     * @memberOf gbc.FrontCallService.modules
     */
    context.FrontCallService.modules.localStorage = /** @lends gbc.FrontCallService.modules.localStorage */ {

      /**
       * Set an item in browser's local storage
       * @param {string} key of the item
       * @param {*} value of the item
       * @returns {Array} empty
       */
      setItem: function(key, value) {
        if (!key) {
          this.parametersError();
          return [];
        }
        try {
          var content = context.LocalSettingsService.read('userLocalStorage');
          if (!content) {
            content = {};
          }
          content[key] = value;
          context.LocalSettingsService.write('userLocalStorage', content);
        } catch (ex) {
          this.runtimeError('Could not setItem in localStorage. Maximum size may be reached.');
        }
        return [];
      },

      /**
       * Get an item from browser's local storage
       * @param {string} key identifier of the item to get
       * @returns {*}
       */
      getItem: function(key) {
        if (!key) {
          this.parametersError();
          return [];
        }
        var content = context.LocalSettingsService.read('userLocalStorage');
        return (content && content[key]) ? [content[key]] : [];
      },

      /**
       * Remove an item in browser's local storage
       * @param {string} key identifier of the item to remove
       * @returns {Array} empty
       */
      removeItem: function(key) {
        if (!key) {
          this.parametersError();
          return [];
        }
        try {
          var content = context.LocalSettingsService.read('userLocalStorage');
          if (content) {
            delete content[key];
          } else {
            content = {};
          }
          context.LocalSettingsService.write('userLocalStorage', content);
        } catch (ex) {
          this.runtimeError('Could not removeItem in localStorage. Maximum size may be reached.');
        }
        return [];
      },

      /**
       * Get all the items keys in browser's local storage
       * @returns {string[]}
       */
      keys: function() {
        var content = context.LocalSettingsService.read('userLocalStorage');
        return content ? [JSON.stringify(Object.keys(content))] : [];
      },

      /**
       * Empty the browser's local storage
       * @returns {Array} empty
       */
      clear: function() {
        try {
          context.LocalSettingsService.write('userLocalStorage', {});
        } catch (ex) {
          this.runtimeError('Could not clear in localStorage. Maximum size may be reached.');
        }
        return [];
      }
    };
  }
);
