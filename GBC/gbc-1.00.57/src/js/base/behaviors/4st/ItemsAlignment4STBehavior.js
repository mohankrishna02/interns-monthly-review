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

modulum('ItemsAlignment4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class ItemsAlignment4STBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.ItemsAlignment4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.ItemsAlignment4STBehavior.prototype */ {
        __name: "ItemsAlignment4STBehavior",

        usedStyleAttributes: ["scrollgridItemsAlign"],
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var anchorNode = controller.getAnchorNode();

          if (widget && widget.setItemsAlignment) {
            var itemsAlignmentAttr = anchorNode.getStyleAttribute("itemsAlignment");
            widget.setItemsAlignment(itemsAlignmentAttr);
          }
        }
      };
    });
  });
