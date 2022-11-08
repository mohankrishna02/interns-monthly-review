/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('ChromeBarLayoutEngine', ['LayoutEngineBase'],
  function(context, cls) {
    /**
     * @class ChromeBarLayoutEngine
     * @memberOf classes
     * @extends classes.LayoutEngineBase
     */
    cls.ChromeBarLayoutEngine = context.oo.Class(cls.LayoutEngineBase, function($super) {
      return /** @lends classes.ChromeBarLayoutEngine.prototype */ {
        __name: "ChromeBarLayoutEngine",

        /**
         * @inheritDoc
         */
        constructor: function(widget) {
          $super.constructor.call(this, widget);
        },

        /**
         * @inheritDoc
         */
        measureDecoration: function() {
          this._getLayoutInfo().setDecorating(
            this._widget.getElement().clientWidth - this._widget.getContainerElement().clientWidth,
            this._widget.getElement().clientHeight - this._widget.getContainerElement().clientHeight
          );
        },

        /**
         * @inheritDoc
         */
        notifyLayoutApplied: function() {
          $super.notifyLayoutApplied.call(this);
          // Refresh chromeBar to put overflown widgets in sidebar
          this._widget.refresh(); // true to force a refresh without conditions

        },

      };
    });
  });
