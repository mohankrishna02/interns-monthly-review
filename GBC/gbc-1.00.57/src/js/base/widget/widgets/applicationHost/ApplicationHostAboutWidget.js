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

modulum('ApplicationHostAboutWidget', ['ModalWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class ApplicationHostAboutWidget
     * @memberOf classes
     * @extends classes.ModalWidget
     */
    cls.ApplicationHostAboutWidget = context.oo.Class(cls.ModalWidget, function($super) {
      return /** @lends classes.ApplicationHostAboutWidget.prototype */ {
        __name: "ApplicationHostAboutWidget",
        __templateName: "ModalWidget",

        /**
         * @type {classes.ProductInformationWidget}
         */
        _productInformation: null,

        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
        },

        _afterInitElement: function() {
          $super._afterInitElement.call(this);
          this._productInformation = cls.WidgetFactory.createWidget("ProductInformation", this.getBuildParameters());
          this.addChildWidget(this._productInformation);
          this.setClosable(true, true);
        },

        _initLayout: function() {
          // no layout
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
          if (this._productInformation) {
            this._productInformation.destroy();
            this._productInformation = null;
          }
          $super.destroy.call(this);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ApplicationHostAbout', cls.ApplicationHostAboutWidget);
  });
