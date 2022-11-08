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

modulum('StyleBehaviorBase', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class StyleBehaviorBase
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.StyleBehaviorBase = context.oo.Class(cls.BehaviorBase, function($super) {
      return /** @lends classes.StyleBehaviorBase.prototype */ {
        __name: "StyleBehaviorBase",

        /**
         * Test if style attribute is "yes" like
         * @param {number|string} sa Style attribute
         */
        isSAYesLike: function(sa) {
          return sa === 1 || sa === "yes" || sa === "true";
        },

        /**
         * Test if style attribute is "no" like
         * @param {number|string} sa Style attribute
         */
        isSANoLike: function(sa) {
          return sa === 0 || sa === "no" || sa === "false" || sa === "none";
        }
      };
    });
  });
