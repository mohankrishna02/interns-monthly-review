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

modulum('SliderLayoutEngine', ['LeafLayoutEngine'],
  function(context, cls) {

    /**
     * @class SliderLayoutEngine
     * @memberOf classes
     * @extends classes.LayoutEngineBase
     */
    cls.SliderLayoutEngine = context.oo.Class(cls.LeafLayoutEngine, function($super) {
      return /** @lends classes.SliderLayoutEngine.prototype */ {
        __name: "SliderLayoutEngine",

        /**
         * @inheritDoc
         */
        measure: function() {
          $super.measure.call(this);
          var layoutInfo = this._widget.getLayoutInformation();
          if (this._widget._orientation === "vertical") {
            layoutInfo.getMeasured().rotate();
            layoutInfo.getPreferred().rotate();
            layoutInfo.getMinimal().rotate();
            layoutInfo.getMaximal().rotate();
          }
        },

      };
    });
  });
