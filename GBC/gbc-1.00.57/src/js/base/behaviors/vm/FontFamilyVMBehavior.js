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

modulum('FontFamilyVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class FontFamilyVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.FontFamilyVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.FontFamilyVMBehavior.prototype */ {
        __name: "FontFamilyVMBehavior",

        usedStyleAttributes: ['fontFamily'],

        watchedAttributes: {
          anchor: ['fontPitch'],
          decorator: ['fontPitch']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setFontFamily) {
            var bindings = controller.getNodeBindings();
            var fontPitchNode = null;
            if (bindings.decorator) {
              fontPitchNode = bindings.decorator;
            } else if (bindings.anchor.isAttributePresent('fontPitch')) {
              fontPitchNode = bindings.anchor;
            }
            if (fontPitchNode && fontPitchNode.isAttributeSetByVM('fontPitch')) {
              var fontPitch = fontPitchNode.attribute('fontPitch');
              widget.setFontFamily(fontPitch === "fixed" ? 'Droid Sans Mono, monospace' : null);
            } else {
              var font = controller.getAnchorNode().getStyleAttribute('fontFamily');
              if (font) {
                widget.setFontFamily(font);
              }
            }
          }
        }
      };
    });
  });
