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

modulum('ApplicationHostMenuDebugWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class ApplicationHostMenuDebugWidget
     * @deprecated This is only used if "theme-legacy-topbar" theme variable is on
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.ApplicationHostMenuDebugWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.ApplicationHostMenuDebugWidget.prototype */ {
        __name: "ApplicationHostMenuDebugWidget",

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          context.DebugService.registerDebugUi(this);
        },

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
        destroy: function() {
          context.DebugService.unregisterDebugUi(this);
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          context.DebugService.show();
          return false;
        },

        activate: function(active) {
          this._element.toggleClass("debugActivated", active);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ApplicationHostDebugMenu', cls.ApplicationHostMenuDebugWidget);
  });
