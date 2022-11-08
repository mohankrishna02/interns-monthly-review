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

modulum('ApplicationHostMenuAboutWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class ApplicationHostMenuAboutWidget
     * @deprecated This is only used if "theme-legacy-topbar" theme variable is on
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.ApplicationHostMenuAboutWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.ApplicationHostMenuAboutWidget.prototype */ {
        __name: "ApplicationHostMenuAboutWidget",

        /** @type {classes.ApplicationHostAboutWidget} */
        _aboutModal: null,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._element.setAttribute('title', "GBC " + context.version);
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
          if (this._aboutModal) {
            this._aboutModal.destroy();
            this._aboutModal = null;
          }
          $super.destroy.call(this);
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

          return false;
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ApplicationHostAboutMenu', cls.ApplicationHostMenuAboutWidget);
  });
