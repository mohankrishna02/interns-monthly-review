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

modulum('ApplicationHostMenuSettingsWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class ApplicationHostMenuSettingsWidget
     * @deprecated This is only used if "theme-legacy-topbar" theme variable is on
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.ApplicationHostMenuSettingsWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.ApplicationHostMenuSettingsWidget.prototype */ {
        __name: "ApplicationHostMenuSettingsWidget",

        /** @type {classes.ApplicationHostSettingsWidget} */
        _settingsModal: null,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._element.setAttribute('title', "Stored settings");

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
        _initLayout: function() {
          // no layout
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
              this._settingsModal.destroy();
              this._settingsModal = null;
            }.bind(this), true);
          }
          this._settingsModal.show();
          return false;
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ApplicationHostSettingsMenu', cls.ApplicationHostMenuSettingsWidget);
  });
