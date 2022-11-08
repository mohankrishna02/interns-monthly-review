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

modulum('SplitViewArrows4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class SplitViewArrows4STBehavior
     * @memberOf classes
     * @extends classes.StyleBehaviorBase
     */
    cls.SplitViewArrows4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.SplitViewArrows4STBehavior.prototype */ {
        __name: "SplitViewArrows4STBehavior",

        usedStyleAttributes: ["splitViewNavigationWithArrows"],
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setArrowsStyle) {
            var splitViewArrowsStyle = controller.getAnchorNode().getStyleAttribute('splitViewNavigationWithArrows');
            if (splitViewArrowsStyle) {
              widget.setArrowsStyle(splitViewArrowsStyle);
            }
          }
        }
      };
    });
  });
