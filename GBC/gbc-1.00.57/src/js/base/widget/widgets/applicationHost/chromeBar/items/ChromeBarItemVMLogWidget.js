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

modulum('ChromeBarItemVMLogWidget', ['ChromeBarItemWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Button in chromeBar to open VM logs
     * @class ChromeBarItemVMLogWidget
     * @memberOf classes
     * @extends classes.ChromeBarItemWidget
     */
    cls.ChromeBarItemVMLogWidget = context.oo.Class(cls.ChromeBarItemWidget, function($super) {
      return /** @lends classes.ChromeBarItemVMLogWidget.prototype */ {
        __name: "ChromeBarItemVMLogWidget",
        __templateName: "ChromeBarItemWidget",

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          context.DebugService.registerDebugUi(this);
          this.setItemType("gbcItem");
          this.setText(i18next.t('gwc.main.chromebar.vmLog'));
          this.setTitle(i18next.t('gwc.main.chromebar.vmLog'));
          this.setImage("zmdi-file-document");
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
          var session = context.SessionService.getCurrent();
          var connector = session.getConnector();
          var sessionId = session.getSessionId();
          window.open(connector + "/monitor/log/vm-" + sessionId);

          return $super.manageMouseClick.call(this, domEvent);
        },

        /**
         * Called by Debug service to tell UI that it's ready
         * @param active
         */
        activate: function(active) {
          this._element.toggleClass("debugActivated", active);
        },

        /**
         * @inheritDoc
         */
        isHidden: function() {
          // If debug mode is not active, this item is supposed to be hidden
          return !gbc.DebugService.isActive() ? true : $super.isHidden.call(this);
        },

      };
    });
    cls.WidgetFactory.registerBuilder('ChromeBarItemVMLog', cls.ChromeBarItemVMLogWidget);
  });
