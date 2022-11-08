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

modulum('FontStyle4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class FontStyle4STBehavior
     * @memberOf classes
     * @extends classes.StyleBehaviorBase
     */
    cls.FontStyle4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.FontStyle4STBehavior.prototype */ {
        __name: "FontStyle4STBehavior",

        usedStyleAttributes: ["fontStyle"],
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setFontStyle) {
            var font = controller.getAnchorNode().getStyleAttribute('fontStyle');
            widget.setFontStyle(font);
          }
        }
      };
    });
  });
