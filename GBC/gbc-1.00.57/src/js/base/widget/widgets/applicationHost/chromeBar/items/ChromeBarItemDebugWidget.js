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

modulum('ChromeBarItemDebugWidget', ['ChromeBarItemWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Open AUI tree debug in chromeBar
     * @class ChromeBarItemDebugWidget
     * @memberOf classes
     * @extends classes.ChromeBarItemWidget
     */
    cls.ChromeBarItemDebugWidget = context.oo.Class(cls.ChromeBarItemWidget, function($super) {
      return /** @lends classes.ChromeBarItemDebugWidget.prototype */ {
        __name: "ChromeBarItemDebugWidget",
        __templateName: "ChromeBarItemWidget",

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          context.DebugService.registerDebugUi(this);
          this.setItemType("gbcItem");
          this.setText(i18next.t('gwc.main.chromebar.debugTools'));
          this.setTitle("[Debug] AUI tree");
          this.setImage("zmdi-memory");
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          context.DebugService.unregisterDebugUi(this);
          $super.destroy.call(this);
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
        manageMouseClick: function(domEvent) {
          context.DebugService.show();
          return $super.manageMouseClick.call(this, domEvent);
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
    cls.WidgetFactory.registerBuilder('ChromeBarItemDebug', cls.ChromeBarItemDebugWidget);
  });
