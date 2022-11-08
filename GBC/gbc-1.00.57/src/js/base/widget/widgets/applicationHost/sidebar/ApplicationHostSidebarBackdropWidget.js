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

modulum('ApplicationHostSidebarBackdropWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class ApplicationHostSidebarBackdropWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.ApplicationHostSidebarBackdropWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.ApplicationHostSidebarBackdropWidget.prototype */ {
        __name: "ApplicationHostSidebarBackdropWidget",

        /**
         * @inheritDoc
         */
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
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
        manageMouseClick: function(domEvent) {
          this.emit(context.constants.widgetEvents.click);
          return false;
        },

        setDisplayed: function(displayed) {
          this.getElement().toggleClass("mt-sidebar-displayed", Boolean(displayed));
        },

        setUnavailable: function(unavailable) {
          this.getElement().toggleClass("mt-sidebar-unavailable", Boolean(unavailable));
        },

        onClick: function(hook) {
          return this.when(context.constants.widgetEvents.click, hook);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ApplicationHostSidebarBackdrop', cls.ApplicationHostSidebarBackdropWidget);
  });
