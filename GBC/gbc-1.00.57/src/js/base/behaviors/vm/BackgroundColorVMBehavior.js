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

modulum('BackgroundColorVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class BackgroundColorVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.BackgroundColorVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.BackgroundColorVMBehavior.prototype */ {
        __name: "BackgroundColorVMBehavior",

        usedStyleAttributes: ["backgroundColor"],

        watchedAttributes: {
          anchor: ['color', 'reverse'],
          decorator: ['color', 'reverse'],
          container: ['dialogType', 'currentRow', 'offset']
        },

        /**
         * Test if style attribute is "yes" like
         * @param {number|string} sa Style attribute
         */
        isSAYesLike: function(sa) {
          return sa === 1 || sa === "yes" || sa === "true";
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setBackgroundColor) {
            var bindings = controller.getNodeBindings();
            var colorNode = bindings.anchor;
            if (bindings.container && bindings.container.getTag() === "TableColumn") { // TABLE case
              widget.setBackgroundColor(null);
              widget.getParentWidget().setBackgroundColor(null);
              var dialogType = bindings.container.attribute("dialogType");
              if (dialogType === "Display" || dialogType === "DisplayArray") {
                widget = widget.getParentWidget();
              }
            }

            if (bindings.decorator && !bindings.anchor.isAttributeSetByVM('color')) {
              colorNode = bindings.decorator;
            }

            var isReverse = colorNode.attribute('reverse') === 1;
            var color = null;
            if (isReverse && colorNode.isAttributeSetByVM('color')) {
              color = colorNode.attribute('color');
              if (color === "white") {
                color = context.ThemeService.getValue("theme-field-disabled-background-color");
              }
              widget.setBackgroundColor(this._resolveThemedColor(color));
            } else {
              color = controller.getAnchorNode().getStyleAttribute('backgroundColor');
              if (color) {
                color = color.trim();
                widget.setBackgroundColor(this._resolveThemedColor(color));
              } else {
                widget.setBackgroundColor(isReverse ? "lightgrey" : null);
              }
            }

            if (bindings.container && bindings.container.getTag() === "Matrix") { // MATRIX case
              var currentRow = bindings.container.attribute("currentRow");
              var offset = bindings.container.attribute("offset");
              var size = bindings.container.attribute("size");
              if (currentRow < size && currentRow - offset === bindings.anchor.getIndex()) {
                var sg = controller.getAnchorNode().getAncestor("ScrollGrid");
                if (!sg || this.isSAYesLike(sg.getStyleAttribute("highlightCurrentRow"))) {
                  widget.setBackgroundColor(null); // current highlight color is the background color
                }
              }
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
          return themedColor || color;
        }
      };
    });
  });
