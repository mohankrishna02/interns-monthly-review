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

modulum('ButtonType4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class ButtonType4STBehavior
     * @memberOf classes
     * @extends classes.StyleBehaviorBase
     */
    cls.ButtonType4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.ButtonType4STBehavior.prototype */ {
        __name: "ButtonType4STBehavior",

        usedStyleAttributes: ["buttonType"],
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setButtonType) {
            var buttonType = controller.getAnchorNode().getStyleAttribute('buttonType');
            if (buttonType) {
              widget.setButtonType(buttonType);
            }
          }
        }
      };
    });
  });
