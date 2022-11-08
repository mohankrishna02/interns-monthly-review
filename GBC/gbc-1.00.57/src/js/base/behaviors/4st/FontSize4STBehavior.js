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

modulum('FontSize4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class FontSize4STBehavior
     * @memberOf classes
     * @extends classes.StyleBehaviorBase
     */
    cls.FontSize4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.FontSize4STBehavior.prototype */ {
        __name: "FontSize4STBehavior",

        usedStyleAttributes: ["fontSize"],
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setFontSize) {
            var font = controller.getAnchorNode().getStyleAttribute('fontSize');
            widget.setFontSize(font);
          }
        }
      };
    });
  });
