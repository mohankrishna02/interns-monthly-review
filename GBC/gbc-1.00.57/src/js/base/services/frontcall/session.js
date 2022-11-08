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

modulum('FrontCallService.modules.session', ['FrontCallService'],
  function(context, cls) {
    /**
     * Session module to store variables into browser's sessions
     * @instance session
     * @memberOf gbc.FrontCallService.modules
     */
    context.FrontCallService.modules.session = /** @lends gbc.FrontCallService.modules.session */ {
      _name: 'session_gwcJS',

      /**
       * Set a variable into browser's sessions
       * @param {string} key identifier of the variable to store
       * @param {*} value of the variable to store
       * @returns {Array}
       */
      setvar: function(key, value) {
        if (!key) {
          this.parametersError();
          return [];
        }
        var sessionObj = context.LocalSettingsService.read(context.FrontCallService.modules.session._name) || {};
        sessionObj[key] = value;
        try {
          context.LocalSettingsService.write(context.FrontCallService.modules.session._name, sessionObj);
        } catch (ex) {
          this.runtimeError('Could not write in localStorage. Maximum size may be reached.');
        }
        return [];
      },

      /**
       * Get a variable from browser's sessions
       * @param {string} key identifier of the item to get
       * @returns {*}
       */
      getvar: function(key) {
        if (!key) {
          this.parametersError();
          return [];
        }
        var sessionObj = context.LocalSettingsService.read(context.FrontCallService.modules.session._name) || {};
        var value = sessionObj[key];
        if (value) {
          return [value];
        } else {
          return [];
        }
      },
    };
  }
);
