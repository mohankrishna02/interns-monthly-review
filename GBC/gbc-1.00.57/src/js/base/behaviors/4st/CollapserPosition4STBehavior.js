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

modulum('CollapserPosition4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * 4ST style used to change collapser position
     * @class CollapserPosition4STBehavior
     * @memberOf classes
     * @extends classes.StyleBehaviorBase
     */
    cls.CollapserPosition4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.CollapserPosition4STBehavior.prototype */ {
        __name: "CollapserPosition4STBehavior",

        usedStyleAttributes: ["collapserPosition"],

        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var node = controller && controller.getAnchorNode(),
            widget = controller.getWidget();

          if (node && widget && widget.setCollapserPosition) {
            var position = node.getStyleAttribute("collapserPosition");
            // Only left and right positions are allowed, others are ignored
            if (["left", "right"].indexOf(position) >= 0) {
              widget.setCollapserPosition(position);
            }
          }
        },

      };
    });
  });
