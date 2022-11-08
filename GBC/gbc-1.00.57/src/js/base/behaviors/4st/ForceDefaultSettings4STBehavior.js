/// FOURJS_START_COPYRIGHT(D,2016)
/// Property of Four Js*
/// (c) Copyright Four Js 2016, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('ForceDefaultSettings4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class ForceDefaultSettings4STBehavior
     * @memberOf classes
     * @extends classes.StyleBehaviorBase
     */
    cls.ForceDefaultSettings4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.ForceDefaultSettings4STBehavior.prototype */ {
        __name: "ForceDefaultSettings4STBehavior",

        usedStyleAttributes: ["forceDefaultSettings"],
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          controller.forceDefaultSettings = this.isSAYesLike(controller.getAnchorNode().getStyleAttribute('forceDefaultSettings'));
        }
      };
    });
  });
