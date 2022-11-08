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

modulum('TraditionalFormSizingVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class TraditionalFormSizingVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.TraditionalFormSizingVMBehavior = context.oo.Singleton(cls.BehaviorBase, function() {
      return /** @lends classes.TraditionalFormSizingVMBehavior.prototype */ {
        __name: "TraditionalFormSizingVMBehavior",

        watchedAttributes: {
          parent: ['width', 'height', 'posX', 'posY']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var window = controller.getAnchorNode().getParentNode();
          var widget = controller.getWidget();
          var baseheight =
            parseFloat(context.ThemeService.getValue("theme-field-default-height")) +
            2 * parseFloat(context.ThemeService.getValue("theme-field-height-ratio"));
          var left = window.attribute("posX");
          var top = (window.attribute("posY")) * baseheight;
          var width = window.attribute("width");
          var height = (window.attribute("height")) * baseheight;
          var letterSpacing = context.ThemeService.getValue("theme-traditional-mode-letter-spacing");
          widget.setStyle({
            position: 'absolute',
            top: top + 'px !important',
            left: 'calc(' + left + 'ch + ' + left + ' * ' + letterSpacing + ') !important',
            height: height + 'px !important',
            width: 'calc(' + width + 'ch + ' + width + ' * ' + letterSpacing + ') !important'
          });
        }
      };
    });
  }
);
