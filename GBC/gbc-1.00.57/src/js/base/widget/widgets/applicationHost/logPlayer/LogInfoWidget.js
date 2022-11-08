/// FOURJS_START_COPYRIGHT(D,2019)
/// Property of Four Js*
/// (c) Copyright Four Js 2019, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('LogInfoWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Display useful info about a log (GBC log only)
     * @class LogInfoWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.LogInfoWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.LogInfoWidget.prototype */ {
        __name: "LogInfoWidget",

        _infoGBCElement: null,
        _infoBrowserElement: null,
        _infoThemeElement: null,
        _infosettingsElement: null,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
        },

        _initElement: function() {
          $super._initElement.call(this);
          this._infoGBCElement = this.getElement().querySelector(".loginfo-gbc");
          this._infoBrowserElement = this.getElement().querySelector(".loginfo-browser");
          this._infoThemeElement = this.getElement().querySelector(".loginfo-theme");
          this._infosettingsElement = this.getElement().querySelector(".loginfo-settings");
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          $super.destroy.call(this);
        },

        /**
         * Define the GBC related info
         * @param {Object} gbcInfo
         */
        setGBCInfo: function(gbcInfo) {
          var themes = gbcInfo.availableThemes.map(function(t) {
            return t.name;
          });
          var sideBarInfo = gbcInfo.isSideBarVisible ? "Yes: " + gbcInfo.sideBarSize + "px" : 'No';
          var body = "<ul>";
          body += "<li><span class='title'>- " + i18next.t('gwc.logPlayer.logInfo.version') + ": </span><span class='value'>" +
            gbcInfo.version + "-" + gbcInfo.build +
            "</span></li>";
          body += "<li><span class='title'>- " + i18next.t('gwc.logPlayer.logInfo.platform') + ": </span><span class='value'>" +
            gbcInfo.platformName + "</span></li>";
          body += "<li><span class='title'>- " + i18next.t('gwc.logPlayer.logInfo.protocol') + ": </span><span class='value'>" +
            gbcInfo.protocolType + "</span></li>";
          body += "<li><span class='title'>- " + i18next.t('gwc.logPlayer.logInfo.theme') + ": </span><span class='value'>" +
            gbcInfo.activeTheme + "</span></li>";
          body += "<li><span class='title'>- " + i18next.t('gwc.logPlayer.logInfo.availableThemes') +
            ": </span><span class='value'>" + themes + "</span></li>";
          body += "<li><span class='title'>- " + i18next.t('gwc.logPlayer.logInfo.sidebar') + ": </span><span class='value'>" +
            sideBarInfo + "</span></li>";
          body += "</ul>";
          this._infoGBCElement.querySelector(".panel-body").innerHTML = body;
        },

        /**
         * Define the Browser related info
         * @param {Object} browserInfo
         */
        setBrowserInfo: function(browserInfo) {
          var body = "<ul>";
          body += "<li><span class='title'>- " + i18next.t('gwc.logPlayer.logInfo.userAgent') + ":</span><span class='value'>" +
            browserInfo.userAgent + '</span></li>';
          body += "<li><span class='title'>- " + i18next.t('gwc.logPlayer.logInfo.os') + ": </span><span class='value'>" +
            browserInfo.os + '</span></li>';
          body += "<li><span class='title'>- " + i18next.t('gwc.logPlayer.logInfo.lang') + ": </span><span class='value'>" +
            browserInfo.activeLanguage + "</span></li>";
          body += "<li><span class='title'>- " + i18next.t('gwc.logPlayer.logInfo.availableLang') +
            ": </span><span class='value'> " + browserInfo.availableLanguages +
            "</span></li>";
          body += "<li><span class='title'>- " + i18next.t('gwc.logPlayer.logInfo.dimension') + ": </span><span class='value'>" +
            browserInfo.dimension.width + 'x' +
            browserInfo.dimension.height + '</span></li>';
          body += "<li><span class='title'>- " + i18next.t('gwc.logPlayer.logInfo.url') + ": </span><span class='value'>" +
            browserInfo.url + "</span></li>";
          body += "</ul>";
          this._infoBrowserElement.querySelector(".panel-body").innerHTML = body;
        },

        /**
         * Display the themes variables
         * @param {Object} theme
         */
        setTheme: function(theme) {
          var themeEntries = Object.keys(theme);
          var body = "<ul>";

          for (var i = 0; i < themeEntries.length; i++) {
            body += "<li><span class='title'>$" + themeEntries[i] + "</span> = <span class='value'>" + theme[themeEntries[i]] +
              "</span></li>";
          }
          body += "</ul>";

          this._infoThemeElement.querySelector(".panel-body").innerHTML = body;
        },

        /**
         * Display the StoredSettings
         * @param {Object} settings
         */
        setSettings: function(settings) {
          var body = JSON.stringify(settings, "\n", 2);
          this._infosettingsElement.querySelector(".panel-body").innerHTML = "<pre>" + body + "</pre>";
        },

      };
    });
    cls.WidgetFactory.registerBuilder('LogInfo', cls.LogInfoWidget);
  });
