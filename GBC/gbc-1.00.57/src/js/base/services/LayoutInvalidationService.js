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

modulum('LayoutInvalidationService',
  function(context, cls) {

    /**
     * Layout Invalidation Service to manage layout invalidations
     * @namespace gbc.LayoutInvalidationService
     * @gbcService
     */
    context.LayoutInvalidationService = context.oo.StaticClass( /** @lends gbc.LayoutInvalidationService */ {
      __name: "LayoutInvalidationService",

      /**
       * next invalidation timestamp
       * @type {number}
       */
      _nextInvalidation: 2,

      /**
       * get next layout timestamp
       * @return {number} the next layout timestamp
       */
      nextInvalidation: function() {
        return this._nextInvalidation++;
      },

      getInitialInvalidation: function() {
        return Number.POSITIVE_INFINITY;
      }
    });
  });
