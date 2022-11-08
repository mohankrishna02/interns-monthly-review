/// FOURJS_START_COPYRIGHT(D,2019)
/// Property of Four Js*
/// (c) Copyright Four Js 2019, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('LogRecorderWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class LogPlayerWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.LogRecorderWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.LogRecorderWidget.prototype */ {
        __name: "LogRecorderWidget",

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this.setTitle(i18next.t('gwc.main.chromebar.getRecordedLog'));
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(dom) {
          gbc.LogService.download();
          return true;
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          $super.destroy.call(this);
        },

      };
    });
    cls.WidgetFactory.registerBuilder('LogRecorder', cls.LogRecorderWidget);
  });
