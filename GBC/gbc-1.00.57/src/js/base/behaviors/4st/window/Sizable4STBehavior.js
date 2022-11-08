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

modulum('Sizable4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class Sizable4STBehavior
     * @memberOf classes
     * @extends classes.StyleBehaviorBase
     */
    cls.Sizable4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.Sizable4STBehavior.prototype */ {
        __name: "Sizable4STBehavior",

        usedStyleAttributes: ["sizable", "border"],

        /**
         *
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var node = controller && controller.getAnchorNode(),
            widget = controller && controller.getWidget();
          if (widget) {
            var isSizable = node.getStyleAttribute('sizable') ? !this.isSANoLike(node.getStyleAttribute('sizable')) : true,
              modal = widget.getModal && widget.getModal();
            if (!modal) {
              widget.getLayoutInformation().setSizable(isSizable);
            } else {
              var noBorder = node.getStyleAttribute('border') === "none";
              if (!noBorder && modal.setSizable) {
                widget.getLayoutInformation().setSizable(isSizable);
                modal.setSizable(isSizable);
              }
            }
          }
        }
      };
    });
  });
