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

modulum('ThinScrollBarDisplayTime4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**

     * @class ThinScrollBarDisplayTime4STBehavior
     * @memberOf classes
     * @extends classes.StyleBehaviorBase
     */
    cls.ThinScrollBarDisplayTime4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.ThinScrollBarDisplayTime4STBehavior.prototype */ {
        __name: "ThinScrollBarDisplayTime4STBehavior",

        usedStyleAttributes: ["thinScrollbarDisplayTime"],
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setThinScrollbar) {
            var thinScrollbarDisplayTime = controller.getAnchorNode().getStyleAttribute('thinScrollbarDisplayTime');
            if (thinScrollbarDisplayTime !== null) {
              widget.setThinScrollbar(parseInt(thinScrollbarDisplayTime, 10));
            }
          }
        }
      };
    });
  });
