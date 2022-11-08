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

modulum('ChromeBarItemSettingsWidget', ['ChromeBarItemWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Button in chromeBar to open GBC settings modal
     * @class ChromeBarItemSettingsWidget
     * @memberOf classes
     * @extends classes.ChromeBarItemWidget
     */
    cls.ChromeBarItemSettingsWidget = context.oo.Class(cls.ChromeBarItemWidget, function($super) {
      return /** @lends classes.ChromeBarItemSettingsWidget.prototype */ {
        __name: "ChromeBarItemSettingsWidget",
        __templateName: "ChromeBarItemWidget",

        /** @type {classes.ApplicationHostSettingsWidget} */
        _settingsModal: null,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this.setItemType("gbcItem");
          this.setText(i18next.t('gwc.main.chromebar.settings'));
          this.setTitle(i18next.t('gwc.main.chromebar.settings'));
          this.setImage("zmdi-settings");

          // Add info about browser storage full
          if (gbc.LocalSettingsService._quotaExceededError) {
            this.addClass("error");
          }
          gbc.LocalSettingsService._eventListener.when("QuotaExceededError", function() {
            this.addClass("error");
          }.bind(this));
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._settingsModal) {
            this._settingsModal.destroy();
            this._settingsModal = null;
          }
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          if (this._settingsModal === null) {
            this._settingsModal = cls.WidgetFactory.createWidget('ApplicationHostSettings', this.getBuildParameters());
            document.body.appendChild(this._settingsModal.getElement());
            this._settingsModal.when(context.constants.widgetEvents.close, function() {
              if (this._settingsModal) {
                this._settingsModal.destroy();
                this._settingsModal = null;
              }
            }.bind(this), true);
          }
          this._settingsModal.show();

          return $super.manageMouseClick.call(this, domEvent);
        },

      };
    });
    cls.WidgetFactory.registerBuilder('ChromeBarItemSettings', cls.ChromeBarItemSettingsWidget);
  });
