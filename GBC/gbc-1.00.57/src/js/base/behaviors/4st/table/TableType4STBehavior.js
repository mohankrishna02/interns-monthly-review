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

modulum('TableType4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class TableType4STBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.TableType4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.TableType4STBehavior.prototype */ {
        __name: "TableType4STBehavior",

        usedStyleAttributes: ["tableType"],
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var tableNode = controller.getAnchorNode();
          var tableType = tableNode.getStyleAttribute("tableType");
          if (widget && widget.setFrozenTable) {
            widget.setFrozenTable(tableType === "frozenTable");
          }
        }
      };
    });
  });
