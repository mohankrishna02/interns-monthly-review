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

modulum('ChromeBarItemAboutWidget', ['ChromeBarItemWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * About button in ChromeBar
     * @class ChromeBarItemAboutWidget
     * @memberOf classes
     * @extends classes.ChromeBarItemWidget
     */
    cls.ChromeBarItemAboutWidget = context.oo.Class(cls.ChromeBarItemWidget, function($super) {
      return /** @lends classes.ChromeBarItemAboutWidget.prototype */ {
        __name: "ChromeBarItemAboutWidget",
        __templateName: "ChromeBarItemWidget",

        /** @type {classes.ApplicationHostAboutWidget} **/
        _aboutModal: null,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this.setItemType("gbcItem");
          this.setText(i18next.t('gwc.main.chromebar.appInfo'));
          this.setTitle("GBC " + context.version);
          this.setImage("zmdi-information");
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          if (this._aboutModal === null) {
            this._aboutModal = cls.WidgetFactory.createWidget('ApplicationHostAbout', this.getBuildParameters());
            document.body.appendChild(this._aboutModal.getElement());
            this._aboutModal.when(context.constants.widgetEvents.close, function() {
              this._aboutModal.destroy();
              this._aboutModal = null;
            }.bind(this), true);
          }
          this._aboutModal.show();

          return $super.manageMouseClick.call(this, domEvent);
        },

      };
    });
    cls.WidgetFactory.registerBuilder('ChromeBarItemAbout', cls.ChromeBarItemAboutWidget);
  });
