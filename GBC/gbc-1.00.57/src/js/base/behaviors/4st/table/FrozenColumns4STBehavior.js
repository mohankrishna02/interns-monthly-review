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

modulum('FrozenColumns4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class FrozenColumns4STBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.FrozenColumns4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.FrozenColumns4STBehavior.prototype */ {
        __name: "FrozenColumns4STBehavior",

        usedStyleAttributes: ["leftFrozenColumns", "rightFrozenColumns"],

        /**
         * @param {classes.ControllerBase} controller
         * @param {Object} data
         */
        setup: function(controller, data) {
          data.firstApply = true;
        },
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var tableNode = controller.getAnchorNode();
          if (widget) {

            var storedFrozenLeft = data.firstApply ? controller.getStoredSetting("leftFrozen") : null;
            var storedFrozenRight = data.firstApply ? controller.getStoredSetting("rightFrozen") : null;

            var leftFrozenColumns = null;
            var rightFrozenColumns = null;

            if (storedFrozenLeft !== null) {
              leftFrozenColumns = storedFrozenLeft;
            } else {
              leftFrozenColumns = tableNode.getStyleAttribute("leftFrozenColumns");
            }

            if (storedFrozenRight !== null) {
              rightFrozenColumns = storedFrozenRight;
            } else {
              rightFrozenColumns = tableNode.getStyleAttribute("rightFrozenColumns");
            }

            // NOTE don't reset value from style if it doesn't change because it can reset the value set by the table contextmenu
            if (leftFrozenColumns && (data._leftFrozenDefaultValue !== leftFrozenColumns)) {
              widget.setLeftFrozenColumns(leftFrozenColumns);
              data._leftFrozenDefaultValue = leftFrozenColumns;
            }
            if (rightFrozenColumns && (data._rightFrozenDefaultValue !== rightFrozenColumns)) {
              widget.setRightFrozenColumns(rightFrozenColumns);
              data._rightFrozenDefaultValue = rightFrozenColumns;
            }
          }

          data.firstApply = true;
        }
      };
    });
  });
