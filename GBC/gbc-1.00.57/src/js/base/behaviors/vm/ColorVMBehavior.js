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

modulum('ColorVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class ColorVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.ColorVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.ColorVMBehavior.prototype */ {
        __name: "ColorVMBehavior",

        usedStyleAttributes: ["textColor"],

        watchedAttributes: {
          anchor: ['color', 'reverse'],
          decorator: ['color', 'reverse']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setColor) {
            var bindings = controller.getNodeBindings();
            var colorNode = bindings.anchor;

            if (bindings.decorator && !bindings.anchor.isAttributeSetByVM('color')) {
              colorNode = bindings.decorator;
            }

            var isReverse = colorNode.attribute('reverse') === 1;
            var color = null;
            if (!isReverse && colorNode.isAttributeSetByVM('color')) {
              color = colorNode.attribute('color');
              // Weird choice but what is white should be black if not reverse on modern UI
              if (color === 'white') {
                color = controller.getAnchorNode().getStyleAttribute('textColor');
                if (!color) {
                  color = context.ThemeService.getValue("theme-secondary-color");
                }

                if (bindings.container && bindings.container.getTag() === "TableColumn") {
                  return;
                }
              }
              widget.setColor(this._resolveThemedColor(color));
            } else {
              color = controller.getAnchorNode().getStyleAttribute('textColor');
              if (color) {
                color = this._resolveThemedColor(color);
              }
              widget.setColor(color);
            }
          }
        },

        /**
         * Get defined themed color corresponding to color name passed as argument
         * @param {string} color - color name
         * @returns {string} returns the color hexadecimal code
         * @private
         */
        _resolveThemedColor: function(color) {
          var themedColor = context.ThemeService.getValue("gbc-genero-" + color);
          if (themedColor) {
            return themedColor;
          } else {
            return color;
          }
        }
      };
    });
  });
