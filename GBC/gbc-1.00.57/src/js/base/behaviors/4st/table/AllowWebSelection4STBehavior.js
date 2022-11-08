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

modulum('AllowWebSelection4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class AllowWebSelection4STBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.AllowWebSelection4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.AllowWebSelection4STBehavior.prototype */ {
        __name: "AllowWebSelection4STBehavior",

        usedStyleAttributes: ["allowWebSelection"],
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var tableNode = controller.getAnchorNode();
          if (widget && widget.setDefaultItemSelection) {
            var allowWebSelection = this.isSAYesLike(tableNode.getStyleAttribute("allowWebSelection"));

            widget.setDefaultItemSelection(allowWebSelection);
          }
        }
      };
    });
  });
