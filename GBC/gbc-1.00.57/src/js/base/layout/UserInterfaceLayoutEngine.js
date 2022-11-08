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

modulum('UserInterfaceLayoutEngine', ['LayoutEngineBase'],
  function(context, cls) {
    /**
     * @class UserInterfaceLayoutEngine
     * @memberOf classes
     * @extends classes.LayoutEngineBase
     */
    cls.UserInterfaceLayoutEngine = context.oo.Class(cls.LayoutEngineBase, function($super) {
      return /** @lends classes.UserInterfaceLayoutEngine.prototype */ {
        __name: "UserInterfaceLayoutEngine",

        /**
         * @inheritDoc
         */
        invalidateMeasure: function(invalidation) {
          var invalidated = !invalidation || this._invalidatedMeasure < invalidation;
          $super.invalidateMeasure.call(this, invalidation);
          if (invalidated) {
            this.invalidateAllocatedSpace(this._invalidatedMeasure);
          }
        },

        /**
         * @inheritDoc
         */
        invalidateAllocatedSpace: function(invalidation) {
          var invalidated = !invalidation || this._invalidatedAllocatedSpace < invalidation;
          $super.invalidateAllocatedSpace.call(this, invalidation);
          if (invalidated) {
            this.invalidateMeasure(this._invalidatedAllocatedSpace);
          }
        }
      };
    });
  });
