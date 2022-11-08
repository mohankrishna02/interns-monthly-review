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

modulum('ShowGrid4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class ShowGrid4STBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.ShowGrid4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.ShowGrid4STBehavior.prototype */ {
        __name: "ShowGrid4STBehavior",

        usedStyleAttributes: ["showGrid"],
        watchedAttributes: {
          anchor: ['dialogType']
        },

        /**
         * Indicates if the grid lines must be visible in a table.
         * Values can be "yes" (default when INPUT ARRAY),"no" (default when DISPLAY ARRAY). (1 or 0 on older front-ends).
         *
         * By default, when a Table is in editable mode (INPUT ARRAY), the front-end displays grid lines in the table.
         * You can change this behavior by setting this attribute to "no".
         *
         * By default, when a Table is in editable mode (DISPLAY ARRAY), the front-end does not display grid lines in the table.
         * You can change this behavior by setting this attribute to "yes".
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var tableNode = controller.getAnchorNode();
          var showGrid = tableNode.getStyleAttribute("showGrid");
          var dialogType = tableNode.attribute("dialogType");
          if (widget && widget.setShowGrid) {
            var apply = (showGrid === null &&
                (dialogType === "Input" || dialogType === "InputArray" ||
                  dialogType === "Construct")) ||
              this.isSAYesLike(showGrid);
            widget.setShowGrid(apply);
          }
        }
      };
    });
  });
