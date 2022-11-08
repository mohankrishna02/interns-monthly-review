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

modulum('ThemeService',
  function(context, cls) {

    /**
     * Theme Service to customize the application
     * @namespace gbc.ThemeService
     * @gbcService
     */
    context.ThemeService = context.oo.StaticClass( /** @lends gbc.ThemeService */ {
      __name: "ThemeService",

      /**
       * internal event emitter
       * @private
       */
      _eventListener: new cls.EventListener(),

      /**
       * current theme parsed values
       * @type {*}
       * @private
       */
      _currentVariables: [],

      /**
       * current theme in DOM resources
       * @type {*}
       * @private
       */
      _currentResources: {},

      /**
       * current theme resources pathes
       * @type {*}
       * @private
       */
      _currentPathes: {},

      /**
       * list of usable themes
       * @type {*}
       * @private
       */
      _availableThemes: window.__gbcThemesInfo,

      /**
       * current theme name
       * @type {string}
       * @private
       */
      _currentThemeName: "",

      /**
       * collection of test functions used in theme conditions
       */
      _conditionMatchers: {
        isMobile: function() {
          return window.isMobile();
        },
        isPhone: function() {
          return window.isPhone();
        },
        isTablet: function() {
          return window.isTablet();
        },
        isDesktop: function() {
          return !window.isMobile();
        },
        isTouchDevice: function() {
          return window.isTouchDevice();
        },
        isUR: function() {
          return window.gbc.__wrapper.isNative();
        },
        isBrowser: function() {
          return window.gbc.__wrapper.isBrowser();
        },
        isChrome: function() {
          return window.browserInfo.isChrome;
        },
        isEdge: function() {
          return window.browserInfo.isEdge;
        },
        isFirefox: function() {
          return window.browserInfo.isFirefox;
        },
        isIE: function() {
          return window.browserInfo.isIE;
        },
        isOpera: function() {
          return window.browserInfo.isOpera;
        },
        isSafari: function() {
          return window.browserInfo.isSafari;
        },
        isAndroid: function() {
          return window.isAndroid();
        },
        isIOS: function() {
          return window.isIOS();
        }
      },

      /**
       * test theme conditions against matchers
       * @param {Array<string>} conditions list of theme conditions
       * @return {boolean} true if all conditions matches
       * @private
       */
      _conditionsMatches: function(conditions) {
        var i = 0,
          len = conditions && conditions.length || 0;
        for (; i < len; i++) {
          try {
            if (!this._conditionMatchers[conditions[i]]()) {
              return false;
            }
          } catch (e) {
            return false;
          }
        }
        return true;
      },

      /**
       * filter list of themes against their conditions
       * @param {Array} list list of themes
       * @return {Array} filtered list of themes
       * @private
       */
      _filterThemeList: function(list) {
        var result = [],
          i = 0,
          len = list && list.length || 0;
        for (; i < len; i++) {
          if (this._conditionsMatches(list[i].conditions)) {
            result.push(list[i]);
          }
        }
        return result;
      },

      /**
       * get a value from theme
       * @param {string} id the theme value id
       * @return {*} the value
       */
      getValue: function(id) {
        return context.ThemeService._currentVariables[id];
      },

      /**
       * set a value to the local theme - internal use only
       * @param {string} id the theme value id
       * @param {*} value the value
       * @ignore
       */
      setValue: function(id, value) {
        context.ThemeService._currentVariables[id] = value;
      },

      /**
       * get a resource path from theme
       * @param {string} id the theme resource id
       * @return {*} the resource path
       */
      getResource: function(id) {
        return context.ThemeService._currentPathes.themes[context.ThemeService._currentThemeName].indexOf(id) >= 0 ?
          ("themes/" + context.ThemeService._currentThemeName + "/resources/" + id) :
          ("resources/" + id);
      },

      /**
       * Thanks to Edge/IE, for need to be sure the current theme is well loaded
       * @returns {boolean} true if current theme is loaded
       * @private
       */
      _isCurrentThemeLoaded: function() {
        return Boolean(context.ThemeService._currentPathes.themes[context.ThemeService._currentThemeName]);
      },

      /**
       * Get available themes
       * @return {Array} the themes
       */
      getAvailableThemes: function() {
        return this._availableThemes;
      },

      /**
       * get current theme name
       * @return {string} the current theme name
       */
      getCurrentTheme: function() {
        return this._currentThemeName;
      },
      /**
       * parse theme variables from injected json
       * @return {{variables:Object, pathes:Object}} theme information
       * @private
       */
      _loadValues: function() {
        var styles = window.getComputedStyle(document.body, ":after"),
          vars = styles.getPropertyValue("content"),
          result = JSON.parse(Base64.fromBase64(vars)),
          variablesKeys = Object.keys(result.variables),
          i = 0,
          len = variablesKeys.length;
        for (; i < len; i++) {
          var key = variablesKeys[i];
          if (/^b64\(.*\)$/.test(result.variables[key])) {
            result.variables[key] = JSON.parse(Base64.fromBase64(result.variables[key].replace(/^b64\((.*)\)$/, "$1")));
          }
        }
        return result;
      },

      /**
       * load theme
       * @param {string} name theme name
       * @param {function} [callback] callback when theme has been loaded
       * @param {boolean} [noSave] true to avoid stored settings save
       */
      loadTheme: function(name, callback, noSave) {
        if (!noSave) {
          context.StoredSettingsService.setSettings('gwc.app.theme', name);
          // force writing in browser'storage in case of new window opening
          context.StoredSettingsService.sync();
        }
        if (context.ThemeService._currentThemeName !== name) {
          context.ThemeService._currentThemeName = name;
          var link = document.createElement("link");
          link.rel = "stylesheet";
          link.type = "text/css";
          link.href = "./themes/" + name + "/main.css";
          link.onload = function() {
            var themeInfo = context.ThemeService._loadValues();
            context.ThemeService._currentVariables = themeInfo.variables;
            context.ThemeService._currentPathes = themeInfo.pathes;
            if (this._isCurrentThemeLoaded()) {
              if (this._currentResources.link) {
                this._currentResources.link.remove();
              }
              this._currentResources.link = link;
              context.classes.WidgetFactory.registerThemeOverrides(themeInfo.widgetFactory);
              window.requestAnimationFrame(function() {
                // TODO: remove this second requestAnimationFrame when GBC-2251 is done (and fixes the font issue)
                window.requestAnimationFrame(function() {
                  this._onThemeLoaded();
                  if (typeof callback === "function") {
                    callback();
                  }
                }.bind(this));
              }.bind(this));
            } else {
              context.LogService.error("Theme '" + name + "' cannot be loaded!");
              link.remove();
              this.loadTheme(this._availableThemes[0].name, callback);
            }
          }.bind(this);
          link.onerror = function() {
            context.LogService.error("Theme '" + name + "' cannot be loaded!");
            link.remove();
            this.loadTheme(this._availableThemes[0].name, callback);
          }.bind(this);
          link.insertAfter(this._currentResources.link || document.head.getElementsByTagName("title")[0]);
        } else {
          if (typeof callback === "function") {
            callback();
          }
        }
      },

      /**
       * updates theme dependant elements in loaded gbc
       * @private
       */
      _onThemeLoaded: function() {
        this._eventListener.emit(context.constants.widgetEvents.themeChange);
        document.getElementById("favicon_element").href = context.ThemeService.getResource("img/gbc_logo.ico");
        var session = context.SessionService.getCurrent();
        if (session) {
          var apps = session.getApplications(),
            len = apps && apps.length || 0,
            i = 0;
          for (; i < len; i++) {
            var app = apps[i],
              layout = app && app.layout,
              model = app && app.model;
            if (layout) {
              layout.reset();
            }
            if (model) {
              model.getNodesByTag("Window").forEach(function(item) {
                item.getWidget().getLayoutEngine().reset(true);
              });
            }
          }
        }
      },

      /**
       * fired when theme changed
       * @param {Hook} hook the hook
       * @return {HandleRegistration} the handle registration
       */
      whenThemeChanged: function(hook) {
        return this._eventListener.when(context.constants.widgetEvents.themeChange, hook);
      },

      /**
       * load initial theme
       * @param {?string} initialTheme initial theme to load
       * @param {function} callback callback when theme has been loaded
       */
      initTheme: function(initialTheme, callback) {
        this._availableThemes = this._filterThemeList(this._availableThemes);
        if (this._availableThemes.length) {
          var storedTheme = context.StoredSettingsService.getSettings('gwc.app.theme');
          this.loadTheme(initialTheme ||
            storedTheme && this._availableThemes.find(function(item) {
              return item.name === storedTheme;
            }) && storedTheme ||
            this._availableThemes[0].name,
            callback, Boolean(initialTheme));
        } else {
          this._displayConsoleScreenOfDeath();
        }
      },

      /**
       * Show critical error if no theme is available
       * @private
       */
      _displayConsoleScreenOfDeath: function() {
        window.critical.display("Internal failure: No applicable theme found.");
      }
    });
  });
