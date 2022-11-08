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

modulum('Alignment4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class Alignment4STBehavior
     * @memberOf classes
     * @extends classes.StyleBehaviorBase
     */
    cls.Alignment4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.Alignment4STBehavior.prototype */ {
        __name: "Alignment4STBehavior",
        _values: {
          y: ["top", "verticalCenter", "bottom"],
          x: ["left", "horizontalCenter", "right"]
        },

        usedStyleAttributes: ["alignment"],
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setAlignment) {
            var isButton = controller.getAnchorNode().getTag() === "Button";
            var pos = controller.getAnchorNode().getStyleAttribute('alignment');
            if (pos) {
              if (pos === "center") {
                pos = "verticalCenter horizontalCenter";
              }
              var y = "top";
              var x = "left";
              var positions = pos.split(" ");
              if (this._values.y.indexOf(positions[0]) !== -1) {
                y = positions[0];
                x = positions.length === 2 ? positions[1] : null;
              } else if (this._values.x.indexOf(positions[0]) !== -1) {
                x = positions[0];
                y = positions.length === 2 ? positions[1] : null;
              }
              widget.setAlignment(y, x);
            } else if (!isButton) {
              if (controller.isInTable()) {
                widget.setAlignment('verticalCenter', 'horizontalCenter');
              } else {
                widget.setAlignment('top', 'left');
              }
            }
          }
        }
      };
    });
  });
