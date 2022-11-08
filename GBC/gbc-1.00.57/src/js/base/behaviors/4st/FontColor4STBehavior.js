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

modulum('FontColor4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class FontColor4STBehavior
     * @memberOf classes
     * @extends classes.StyleBehaviorBase
     */
    cls.FontColor4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.FontColor4STBehavior.prototype */ {
        __name: "FontColor4STBehavior",

        usedStyleAttributes: ["textColor"],
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setFontSize) {
            var font = controller.getAnchorNode().getStyleAttribute('textColor');
            widget.setFontColor(this._resolveThemedColor(font));
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
