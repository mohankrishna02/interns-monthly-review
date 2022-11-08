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

modulum('I18NService', ['InitService'],
  function(context, cls) {

    /**
     * Localization Service to translate the app
     * @namespace gbc.I18NService
     * @gbcService
     * @publicdoc
     */
    context.I18NService = context.oo.StaticClass( /** @lends gbc.I18NService */ {
      __name: 'I18NService',
      _init: false,

      /**
       * Language to use if not defined by user or browser
       * @type {string}
       */
      _fallBackLng: 'en-US',

      /**
       * Event listener object
       * @type {*}
       */
      _eventListener: new cls.EventListener(), //used to listen when i18next is ready

      /**
       * Event name once I18N is ready
       */
      _i18nReady: 'i18nReady',

      /**
       * Flag to determine if service is ready or not
       * @type {boolean}
       */
      isReady: false,

      /**
       * Init service method. should be called only once.
       */
      init: function() {
        window.i18next
          .use(window.i18nextBrowserLanguageDetector)
          .init({
            fallbackLng: this._getNormalizedLanguage(),
            resources: window.gbcLocales,
            detection: {
              lookupQuerystring: 'setLng',
              lookupCookie: 'lang',
              caches: ['cookie']
            }
          }, this._onReady.bind(this));
      },

      /**
       * Set the language of the app
       * @param locale {string} language code to set (e.g en_US, fr_FR ...)
       * @publicdoc
       */
      setLng: function(locale) {
        window.i18next.changeLanguage(this._getNormalizedLanguage(locale)[0]);
      },

      /**
       * Translate a widget with i18n data
       * @param {classes.WidgetBase} widget Widget to translate
       * @publicdoc
       */
      translate: function(widget) {
        if (this.isReady) {
          widget.translate();
        } else {
          return this._eventListener.when(this._i18nReady, widget.translate.bind(widget));
        }
        return null;
      },

      /**
       * Get all available translations with locales id
       * @returns {Array} - array of locales id
       * @publicdoc
       */
      getAllLng: function() {
        return Object.keys(window.gbcLocales).map(function(key) {
          if (key !== 'undefined') {
            return {
              'locale': key,
              'language': window.i18next.exists('gwc.lngName', {
                lng: key,
                fallbackLng: 'undef'
              }) ? window.i18next.t('gwc.lngName', {
                lng: key
              }) : key
            };
          }
        });
      },

      /**
       * Ready Handler
       * @private
       */
      _onReady: function() {
        this._checkLanguageCompatibility();
        var storedLng = gbc.StoredSettingsService.getLanguage();
        var cookieLng = gbc.StoredSettingsService._getCookie('lang');
        var language = cookieLng || storedLng || this._fallBackLng;
        document.querySelector("html").setAttribute("lang", language.substring(0, 2));
        // Emit I18n ready
        this._eventListener.emit(this._i18nReady);
        this.isReady = true;
      },

      /**
       * Try to find the closest language as defined by browser
       * @private
       */
      _checkLanguageCompatibility: function() {
        var storedLng = gbc.StoredSettingsService.getLanguage();
        var cookieLng = gbc.StoredSettingsService._getCookie('lang');
        var language = cookieLng || storedLng || this._fallBackLng;

        if (language && !window.gbcLocales[language]) {
          var allLngKeys = Object.keys(window.gbcLocales);
          for (var i = 0; i < allLngKeys.length; i++) {
            if (language.startsWith(allLngKeys[i].substring(0, 2))) {
              this.setLng(allLngKeys[i]);
              gbc.StoredSettingsService.setSettings('gwc.app.locale', allLngKeys[i]);
              break;
            }
          }
        }
      },

      /**
       * Helper to get the browser current language
       * @returns {string} - locale id
       * @public
       */
      getBrowserLanguage: function() {
        return navigator.language || navigator.userLanguage;
      },

      /**
       * Get the normalized locale according to the parameter
       * Will do its best to identify an existing locale
       * @param {string} [locale] - initial str to test, if undef, will take browser language, or fallback one: en-US
       * @return {Array} list of usable locales as fallback (i.e: ["fr-FR","en-US"]) this list allways contain at least one item
       * @private
       */
      _getNormalizedLanguage: function(locale) {
        locale = typeof locale === "undefined" ? false : locale;
        var fallback = locale || this.getBrowserLanguage() || this._fallBackLng;
        var availableLC = Object.keys(window.gbcLocales);
        var fallbackLanguageList = [];
        var localeRegex = /^([a-z]{2})[-_]?([A-Z0-9]*)/;
        var r = null;
        var fallbackR = localeRegex.exec(fallback); // try to match fallback on standardized locale format

        if (fallbackR) {
          for (var i = 0; i < availableLC.length; i++) {
            r = localeRegex.exec(availableLC[i]);
            // Check perfect match (i.e 'es-ES'), then taking care of lang without region (i.e 'es-419', 'es_AR' will take only 'es' into account)
            if (availableLC[i].indexOf(fallback) === 0 || r[1] === fallbackR[1]) {
              if (availableLC[i] === locale) { // add it at begining of the array if the locale match
                fallbackLanguageList.unshift(availableLC[i]);
              } else { // add it at the end of the array
                fallbackLanguageList.push(availableLC[i]);
              }

            }
          }
        }
        // Use en-US as default if nothing found
        if (fallbackLanguageList.indexOf(this._fallBackLng) === -1) {
          fallbackLanguageList.push(this._fallBackLng);
        }
        return fallbackLanguageList;
      },

    });
    context.InitService.register(context.I18NService);
  });
