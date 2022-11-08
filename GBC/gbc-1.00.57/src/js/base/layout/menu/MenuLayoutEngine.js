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

modulum('MenuLayoutEngine', ['LayoutEngineBase'],
  function(context, cls) {
    /**
     * @class MenuLayoutEngine
     * @memberOf classes
     * @extends classes.LayoutEngineBase
     */
    cls.MenuLayoutEngine = context.oo.Class(cls.LayoutEngineBase, function($super) {
      return /** @lends classes.MenuLayoutEngine.prototype */ {
        __name: "MenuLayoutEngine",

        /**
         * @inheritDoc
         */
        needMeasureSwitching: function() {
          return !this._widget || !this._widget.isPopup || !this._widget.isPopup();
        },

        /**
         * @inheritDoc
         */
        ignoreMeasureInvalidation: function() {
          return this._widget && this._widget.isPopup && this._widget.isPopup();
        }
      };
    });
  });
