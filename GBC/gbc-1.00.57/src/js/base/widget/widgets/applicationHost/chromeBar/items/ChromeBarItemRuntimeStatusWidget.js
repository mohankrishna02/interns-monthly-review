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

modulum('ChromeBarItemRuntimeStatusWidget', ['ChromeBarItemWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Runtime Status in ChromeBar
     * Note: not added to dom, since it's handled by loading bar
     * @class ChromeBarItemRuntimeStatusWidget
     * @memberOf classes
     * @extends classes.ChromeBarItemWidget
     */
    cls.ChromeBarItemRuntimeStatusWidget = context.oo.Class(cls.ChromeBarItemWidget, function($super) {
      return /** @lends classes.ChromeBarItemRuntimeStatusWidget.prototype */ {
        __name: "ChromeBarItemRuntimeStatusWidget",
        __templateName: "ChromeBarItemWidget",

        _active: false,
        _count: 0,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this.setItemType("gbcItem");
          this.setTitle(i18next.t('gwc.file.upload.processing'));
          this.setImage("zmdi-upload");
        },

        /**
         * Change style when idle
         */
        setIdle: function() {
          this._count--;
          if (this._count === 0) {
            this.removeClass("processing");

          }
        },

        /**
         * Change style when processing
         */
        setProcessing: function() {
          this._count++;
          this.addClass("processing");
        }

      };
    });
    cls.WidgetFactory.registerBuilder('ChromeBarItemRuntimeStatus', cls.ChromeBarItemRuntimeStatusWidget);
  });
