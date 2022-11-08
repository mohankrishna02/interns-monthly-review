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

modulum('Reverse4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class Reverse4STBehavior
     * @memberOf classes
     * @extends classes.StyleBehaviorBase
     */
    cls.Reverse4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.Reverse4STBehavior.prototype */ {
        __name: "Reverse4STBehavior",

        usedStyleAttributes: ["reverse"],
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setReverse) {
            var reverse = controller.getUINode().getStyleAttribute('reverse');
            widget.setReverse(this.isSAYesLike(reverse));
          }
        }
      };
    });
  });
