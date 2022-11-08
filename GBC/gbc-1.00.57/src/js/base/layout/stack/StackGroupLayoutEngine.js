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

modulum('StackGroupLayoutEngine', ['StackLayoutEngine'],
  function(context, cls) {
    /**
     * @class StackGroupLayoutEngine
     * @memberOf classes
     * @extends classes.StackLayoutEngine
     */
    cls.StackGroupLayoutEngine = context.oo.Class(cls.StackLayoutEngine, function($super) {
      return /** @lends classes.StackGroupLayoutEngine.prototype */ {
        __name: "StackGroupLayoutEngine",

        _titleWidth: 0,

        /**
         * @inheritDoc
         */
        measure: function(invalidation) {
          $super.measure.call(this);
          if (this._widget._title.getLayoutEngine().isInvalidatedMeasure(invalidation)) {
            this._titleWidth = this._widget._title.getElement().clientWidth + this._getLayoutInfo().getDecorating().getHeight(true);
          }
        },

        /**
         * @inheritDoc
         */
        adjustMeasure: function() {
          $super.adjustMeasure.call(this);
          var layoutInfo = this._getLayoutInfo();
          var minimal = layoutInfo.getMinimal().getWidth(true);
          layoutInfo.getMinimal().setWidth(Math.max(this._titleWidth, minimal));
        }
      };
    });
  });
