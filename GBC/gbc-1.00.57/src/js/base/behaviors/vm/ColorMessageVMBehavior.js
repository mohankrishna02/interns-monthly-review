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

modulum('ColorMessageVMBehavior', ['ColorVMBehavior'],
  function(context, cls) {
    /**
     * @class ColorMessageVMBehavior
     * @memberOf classes
     * @extends classes.ColorVMBehavior
     */
    cls.ColorMessageVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.ColorMessageVMBehavior.prototype */ {
        __name: "ColorMessageVMBehavior",

        watchedAttributes: {
          anchor: ['color', 'reverse', 'type']
        },

        /**
         * Applies the color only if it has been defined by the VM, use default value otherwise.
         */
        _apply: function(controller, data) {
          var messageNode = controller.getAnchorNode();
          var kind = messageNode.attribute('type') === 'error' ? 'error' : 'message';
          var color = messageNode.getStyleAttribute("textColor", [kind]);
          var widget = controller.getWidget();
          if (widget.setMessageKind) {
            widget.setMessageKind(kind);
          }

          if (color) {
            widget.setColor(color);
          } else {
            if (messageNode.isAttributeSetByVM('color')) {
              var isReverse = messageNode.attribute('reverse') === 1;

              if (messageNode.attribute('color') === "white") {
                color = context.ThemeService.getValue("theme-message-color");
              } else {
                color = isReverse ? messageNode.getStyleAttribute('textColor') : messageNode.attribute('color');
              }
              widget.setColor(this._resolveThemedColor(color));
            } else {
              widget.setColor(context.ThemeService.getValue("theme-message-color"));
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
