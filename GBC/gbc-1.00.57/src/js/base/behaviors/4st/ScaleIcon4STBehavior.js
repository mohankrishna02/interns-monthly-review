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

modulum('ScaleIcon4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * Defines the scaling behaviors of the associated icon.
     * Values can be:
     *    "no": No scaling occurs and the image is taken as-is.
     *          It is up to the developer to resize the source image to avoid misalignment.
     *          This is the default on GDC/GBC.
     *    "yes": Image are scaled down according to the height of the widget (button or edit field).
     *           Setting a big font can result in a big icon. This is the default on GMA/GMI.
     *    "nnnpx": Image are scaled down according to the specified size.
     *             For example, scaleIcon="128px" will make every icon a maximum of 128*128 pixels.
     *             At least one side equal to 128 pixels, depending if the source image is square or not.
     * @class ScaleIcon4STBehavior
     * @memberOf classes
     * @extends classes.StyleBehaviorBase
     */
    cls.ScaleIcon4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.ScaleIcon4STBehavior.prototype */ {
        __name: "ScaleIcon4STBehavior",

        usedStyleAttributes: ["scaleIcon"],

        /**
         * @param {classes.ControllerBase} controller
         * @param data
         * @param scaleByDefault
         */
        setup: function(controller, data, scaleByDefault) {
          data._scaleByDefault = Boolean(scaleByDefault);
        },
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setAutoScale) {
            var scaleIconValue = controller.getAnchorNode().getStyleAttribute('scaleIcon');
            if (scaleIconValue !== null) {
              widget.setAutoScale(this.isSAYesLike(scaleIconValue));
            } else {
              widget.setAutoScale(data._scaleByDefault);
            }
          }
        }
      };
    });
  });
