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

modulum('ApplicationHostSettingsWidget', ['ModalWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class ApplicationHostSettingsWidget
     * @memberOf classes
     * @extends classes.ModalWidget
     */
    cls.ApplicationHostSettingsWidget = context.oo.Class(cls.ModalWidget, function($super) {
      return /** @lends classes.ApplicationHostSettingsWidget.prototype */ {
        __name: "ApplicationHostSettingsWidget",
        __templateName: "ModalWidget",

        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
        },

        _initLayout: function() {
          // no layout
        },

        _initContainerElement: function() {
          $super._initContainerElement.call(this);
          this._element.addClass("mt-dialog-about");
          var dialogContents = document.createElement("div");

          var headerTitleDom = document.createElement('span');
          headerTitleDom.innerHTML = '<i class="zmdi zmdi-settings"></i> ' + i18next.t("gwc.settings");
          this.setHeader(headerTitleDom);

          this.setClosable(true, true);
          this.setContent(dialogContents);

          this._settings = cls.WidgetFactory.createWidget("Settings", this.getBuildParameters());
          dialogContents.appendChild(this._settings.getElement());
          this._settings.setParentWidget(this);
        },

        /**
         * @inheritDoc
         */
        show: function() {
          $super.show.call(this);
          if (!this._systemModal) {
            this._gbcSystemModal();
          }
        },

        destroy: function() {
          this._settings.destroy();
          this._settings = null;
          $super.destroy.call(this);
        },

        hide: function() {
          if (this._settings) {
            this._settings._restoreDefaultButton();
          }
          $super.hide.call(this);
        },
      };
    });
    cls.WidgetFactory.registerBuilder('ApplicationHostSettings', cls.ApplicationHostSettingsWidget);
  });
