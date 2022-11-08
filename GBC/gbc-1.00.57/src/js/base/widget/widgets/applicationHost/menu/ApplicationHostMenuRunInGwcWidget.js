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

modulum('ApplicationHostMenuRunInGwcWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class ApplicationHostMenuRunInGwcWidget
     * @deprecated This is not used anymore, and will be removed soon
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.ApplicationHostMenuRunInGwcWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.ApplicationHostMenuRunInGwcWidget.prototype */ {
        __name: "ApplicationHostMenuRunInGwcWidget",

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
          window.open(window.location.href.replace("/ua/r/", "/wa/r/"));
          return false;
        },

        activate: function(active) {
          var session = context.SessionService.getCurrent(),
            sessionInfo = session && session.info(),
            sessionServerVersion = sessionInfo && sessionInfo.serverVersion;
          if (cls.ServerHelper.compare(sessionServerVersion || context.bootstrapInfo.serverVersion, "GAS/3.10.00") < 0) {
            this._element.toggleClass("debugActivated", active);
          }
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ApplicationHostMenuRunInGwc', cls.ApplicationHostMenuRunInGwcWidget);
  });
