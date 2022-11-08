/// FOURJS_START_COPYRIGHT(D,2015)
/// Property of Four Js*
/// (c) Copyright Four Js 2015, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('SettingsWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class SettingsWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.SettingsWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.SettingsWidget.prototype */ {
        __name: "SettingsWidget",

        _lngWidget: null,
        _lngDefaultWidget: null,
        _themeWidget: null,
        _themeHandleRegistration: null,
        _enableWidget: null,
        _resetWidget: null,
        _msgWidget: null,
        _typeaheadWidget: null,
        _loglevelWidget: null,
        _logtypesWidget: null,

        _lngElement: null,
        _themeElement: null,
        _enableElement: null,
        _resetElement: null,
        _resetConfirm: false,

        _storeSettingsEnabled: false,

        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);

          this._storeSettingsEnabled = gbc.StoredSettingsService.areEnabled();

          //Language widget
          this._lngDefaultWidget = cls.WidgetFactory.createWidget("CheckBoxWidget", this.getBuildParameters());
          this._lngDefaultWidget.setEnabled(true);
          this._lngDefaultWidget.setText(i18next.t("gwc.storedSettings.defaultLng"));
          var isDefault = Boolean(gbc.StoredSettingsService.getSettings("gwc.app.defaultLocale"));
          this._lngDefaultWidget.setValue(isDefault);

          this._lngWidget = cls.WidgetFactory.createWidget("ComboBoxWidget", this.getBuildParameters());
          this._lngWidget.setNotNull(true);
          this._lngWidget.setEnabled(!isDefault);
          // Redefine the onclickFunction
          this._lngWidget._element.off('click.ComboBoxWidget');
          this._lngWidget._element.on('click.ComboBoxWidget', function(event) {
            event.stopPropagation();
            this._lngWidget.emit(context.constants.widgetEvents.click, event);
            this._lngWidget.emit(context.constants.widgetEvents.focus, event);
          }.bind(this));

          var allLng = gbc.I18NService.getAllLng();
          this._lngWidget.setChoices(allLng.map(function(lng) {
            return {
              text: lng.language,
              value: lng.locale
            };
          }));
          this._lngWidget.setValue(context.StoredSettingsService.getLanguage());

          this._lngWidget.when(context.constants.widgetEvents.click, function(event, data) {
            this._lngWidget.toggleDropDown();
          }.bind(this));
          this._lngWidget.when(context.constants.widgetEvents.change, function() {
            var lng = this._lngWidget.getValue();
            this.setLanguage(lng);
          }.bind(this));

          this._lngDefaultWidget.when(context.constants.widgetEvents.click, function(event, data) {
            gbc.StoredSettingsService.setSettings("gwc.app.defaultLocale", this._lngDefaultWidget.getValue() === true);
            this._lngWidget.setEnabled(!this._lngDefaultWidget.getValue());

            if (this._lngDefaultWidget.getValue()) {
              this.setLanguage(gbc.I18NService.getBrowserLanguage());
            } else {
              this._lngWidget.emit(context.constants.widgetEvents.change, this._lngWidget.getValue());
            }

          }.bind(this));

          this._themeWidget = cls.WidgetFactory.createWidget("ComboBoxWidget", this.getBuildParameters());
          this._themeWidget.setNotNull(true);
          var allThemes = context.ThemeService.getAvailableThemes();
          this._themeWidget.setChoices(allThemes.map(function(theme) {
            return {
              text: theme.title,
              value: theme.name
            };
          }));
          this._themeWidget.setValue(context.ThemeService.getCurrentTheme(), true);
          this._themeHandleRegistration = context.ThemeService.whenThemeChanged(function() {
            this._themeWidget.setValue(context.ThemeService.getCurrentTheme(), true);
          }.bind(this));
          this._themeWidget.setEnabled(allThemes.length > 1);
          this._themeWidget.when(context.constants.widgetEvents.change, function() {
            var theme = this._themeWidget.getValue();
            context.ThemeService.loadTheme(theme, function() {});
          }.bind(this));

          // Enable StoredSettings button
          this._enableWidget = cls.WidgetFactory.createWidget("CheckBoxWidget", this.getBuildParameters());
          this._enableWidget.setEnabled(true);
          this._enableWidget.setText(i18next.t("gwc.storedSettings.enable"));
          this.enableStoredSettings(this._storeSettingsEnabled);
          this._enableWidget.when(context.constants.widgetEvents.click, function() {
            this.toggleStoredSettings();
          }.bind(this));

          // Reset StoredSettings button
          this._resetWidget = cls.WidgetFactory.createWidget("ButtonWidget", this.getBuildParameters());
          this._resetWidget.setText(i18next.t("gwc.storedSettings.reset"));
          this._resetWidget.when(context.constants.widgetEvents.click, function() {
            this.resetStoredSettings(this._resetConfirm);
          }.bind(this));

          // Get containers for each widget
          this._lngElement = this._element.getElementsByClassName("lngSettings")[0];
          this._themeElement = this._element.getElementsByClassName("themeSettings")[0];
          this._storedSettingsElement = this._element.getElementsByClassName("storedSettings")[0];

          // Add widgets in each container
          this._lngElement.appendChild(this._lngWidget.getElement());
          this._lngElement.appendChild(this._lngDefaultWidget.getElement());
          this._themeElement.appendChild(this._themeWidget.getElement());
          this._storedSettingsElement.appendChild(this._resetWidget.getElement());
          this._storedSettingsElement.appendChild(this._enableWidget.getElement());

          this._msgWidget = this._element.querySelector(".message");

          if (gbc.LocalSettingsService._quotaExceededError) {
            this._msgWidget.removeClass("hidden");
          }
          gbc.LocalSettingsService._eventListener.when("QuotaExceededError", function() {
            this._msgWidget.removeClass("hidden");
          }.bind(this));

          // Debug & QA
          if (context.DebugService.isActive()) {
            this._typeaheadWidget = cls.WidgetFactory.createWidget("EditWidget", this.getBuildParameters());
            this._typeaheadWidget.setEnabled(true);
            this._typeaheadWidget.setType("number");
            var minDuration = gbc.SessionService.getCurrent() &&
              gbc.SessionService.getCurrent().getCurrentApplication() &&
              gbc.SessionService.getCurrent().getCurrentApplication().protocolInterface.getNetworkDelay() || 0;
            this._typeaheadWidget.setValue("" + minDuration);
            this._typeaheadWidget.getInputElement().on('input', function(evt) {
              var val = parseInt(this._typeaheadWidget.getValue(), 10);
              if (val > 0) {
                gbc.SessionService.getCurrent().getCurrentApplication().protocolInterface.setNetworkDelay(val);
              }
            }.bind(this));

            this._element.getElementsByClassName("debugTopic")[0].removeClass("hidden");
            this._debugTypeaheadElement = this._element.getElementsByClassName("typeahead")[0];
            this._debugTypeaheadElement.appendChild(this._typeaheadWidget.getElement());

            this._loglevelWidget = cls.WidgetFactory.createWidget("LogLevelSelector", this.getBuildParameters());
            this._loglevelWidget.when("loglevel", function(evt, src, level) {
              context.LogService.changeLevel(level);
              context.StoredSettingsService.setLoglevel(level);
            });
            this._debugLoglevelElement = this._element.getElementsByClassName("loglevel")[0];
            this._debugLoglevelElement.appendChild(this._loglevelWidget.getElement());

            this._logtypesWidget = cls.WidgetFactory.createWidget("LogTypesSelector", this.getBuildParameters());
            this._logtypesWidget.when("logtype", function(evt, src, type) {
              context.LogService.toggleType(type);
              var currentTypes = context.LogService.getActiveLogTypes();
              context.StoredSettingsService.setLogtypes(currentTypes);
              this._logtypesWidget.setCurrentTypes(currentTypes);
            }.bind(this));
            this._debugLogtypesElement = this._element.getElementsByClassName("logtypes")[0];
            this._debugLogtypesElement.appendChild(this._logtypesWidget.getElement());
          }
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._themeHandleRegistration) {
            this._themeHandleRegistration();
            this._themeHandleRegistration = null;
          }
          if (this._lngWidget) {
            this._lngWidget.destroy();
            this._lngWidget = null;
          }
          if (this._lngDefaultWidget) {
            this._lngDefaultWidget.destroy();
            this._lngDefaultWidget = null;
          }
          if (this._themeWidget) {
            this._themeWidget.destroy();
            this._themeWidget = null;
          }
          if (this._enableWidget) {
            this._enableWidget.destroy();
            this._enableWidget = null;
          }
          if (this._resetWidget) {
            this._resetWidget.destroy();
            this._resetWidget = null;
          }
          if (this._typeaheadWidget) {
            this._typeaheadWidget.destroy();
            this._typeaheadWidget = null;
          }
          if (this._loglevelWidget) {
            this._loglevelWidget.destroy();
            this._loglevelWidget = null;
          }
          if (this._logtypesWidget) {
            this._logtypesWidget.destroy();
            this._logtypesWidget = null;
          }

          this._msgWidget = null;
          $super.destroy.call(this);
        },

        _initLayout: function() {
          // no layout
        },

        _restoreDefaultButton: function() {
          // Restore default button
          this._resetConfirm = false;
          this._resetWidget.setText(i18next.t("gwc.storedSettings.reset"));
          this._resetWidget.setEnabled(true);
          this._resetWidget.setBackgroundColor(null);
          this._resetWidget.setColor(null);
        },

        setLanguage: function(lng) {
          gbc.StoredSettingsService.setLanguage(lng);
          this.getParentWidget().setFooter(i18next.t("gwc.storedSettings.changed"));
        },

        toggleStoredSettings: function() {
          if (this._storeSettingsEnabled) {
            this.enableStoredSettings(false);
          } else {
            this.enableStoredSettings(true);
          }
        },

        /**
         *
         * @param status
         */
        enableStoredSettings: function(status) {
          this._enableWidget.setValue(status ? this._enableWidget._checkedValue : this._enableWidget._uncheckedValue);
          this._storeSettingsEnabled = status;
          gbc.StoredSettingsService.enable(status);

        },
        /**
         *
         * @param force if not true, will ask for confirmation
         */
        resetStoredSettings: function(force) {
          // Ask for confirmation first
          if (!force) {
            this._resetWidget.setBackgroundColor(context.ThemeService.getValue("mt-red-200"));
            this._resetWidget.setColor(context.ThemeService.getValue("theme-secondary-color"));
            this._resetWidget.setText(i18next.t("gwc.storedSettings.confirm"));
            this._resetConfirm = true;
          } else { // Reset once confirmed
            gbc.StoredSettingsService.reset();
            this._resetConfirm = false;
            this._resetWidget.setText(i18next.t("gwc.storedSettings.done"));
            this._resetWidget.setEnabled(false);
            this._resetWidget.setBackgroundColor(context.ThemeService.getValue("mt-green-200"));
            this._resetWidget.setColor(context.ThemeService.getValue("theme-secondary-color"));
            this._registerTimeout(function() {
              this._restoreDefaultButton();
            }.bind(this), 2000);
          }
        }
      };
    });
    cls.WidgetFactory.registerBuilder('Settings', cls.SettingsWidget);
  });
