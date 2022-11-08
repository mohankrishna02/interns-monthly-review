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

modulum('FrontCallService.modules.theme', ['FrontCallService'],
  function(context, cls) {

    /**
     * Themes module to manage (activate, list and get) front-end themes
     * @instance theme
     * @memberOf gbc.FrontCallService.modules
     */
    context.FrontCallService.modules.theme = /** @lends gbc.FrontCallService.modules.theme */ {
      /**
       * Load and activate a given theme by name
       * @param {string} name theme name
       * @returns {Array}
       */
      setTheme: function(name) {
        if (name === undefined) {
          this.parametersError();
          return undefined;
        }
        context.ThemeService.loadTheme(name, function() {
          this.setReturnValues([]);
        }.bind(this), true);
      },

      /**
       * Get the current theme name
       * @return {string} the current theme name
       */
      getCurrentTheme: function() {
        var currentTheme = context.ThemeService.getCurrentTheme();
        return [currentTheme];
      },

      /**
       * List all available themes
       * @return {Array} list of all available themes. One theme is an object composed of attributes 'name', 'title' and 'conditions'
       */
      listThemes: function() {
        var allThemes = context.ThemeService.getAvailableThemes();
        return [allThemes];
      }
    };
  }
);
