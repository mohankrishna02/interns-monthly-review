/// FOURJS_START_COPYRIGHT(D,2014)
/// Property of Four Js*
/// (c) Copyright Four Js 2014, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('ScrollGridLayoutEngine', ['GridLayoutEngine'],
  function(context, cls) {
    /**
     * @class ScrollGridLayoutEngine
     * @memberOf classes
     * @extends classes.GridLayoutEngine
     */
    cls.ScrollGridLayoutEngine = context.oo.Class(cls.GridLayoutEngine, function($super) {
      return /** @lends classes.ScrollGridLayoutEngine.prototype */ {
        __name: "ScrollGridLayoutEngine",
        /**
         * @inheritDoc
         * @constructs
         */
        constructor: function(widget) {
          $super.constructor.call(this, widget);
        },

        /**
         * @inheritDoc
         */
        adjustMeasure: function() {
          $super.adjustMeasure.call(this);
          var layoutInfo = this._getLayoutInfo();
          if (!layoutInfo.lineHeight) {
            layoutInfo.lineHeight = layoutInfo.getMeasured().getHeight();
          }
          layoutInfo.getMinimal().setHeight(layoutInfo.lineHeight + layoutInfo.getDecorating()
            .getHeight(true));
        },

        /**
         * @inheritDoc
         */
        measure: function() {
          $super.measure.call(this);
          var decorating = this._getLayoutInfo().getDecorating();
          decorating.setWidth(decorating.getWidth() + window.scrollBarSize);
        },

        /**
         * @inheritDoc
         */
        prepareApplyLayout: function() {
          $super.prepareApplyLayout.call(this);
          var layoutInfo = this._widget.getLayoutInformation();
          var rules = this._styleRules[".g_measured #w_" + this._widget.getUniqueIdentifier() + ".g_measureable"];
          rules.height = layoutInfo.getAllocated().getHeight() + "px";
          rules.width = layoutInfo.getAllocated().getWidth() + "px";
        }
      };
    });
  });
