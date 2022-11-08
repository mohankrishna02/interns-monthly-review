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

modulum('TextFormat4STBehavior', ['StyleBehaviorBase'],
  function(context, cls) {
    /**
     * @class TextFormat4STBehavior
     * @memberOf classes
     * @extends classes.StyleBehaviorBase
     */
    cls.TextFormat4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      return /** @lends classes.TextFormat4STBehavior.prototype */ {
        __name: "TextFormat4STBehavior",

        usedStyleAttributes: ["textFormat"],
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setHtmlControl) {
            var format = controller.getAnchorNode().getStyleAttribute('textFormat');
            if (format === "html") {
              if (controller._widgetType === "TextEdit" &&
                controller.setAsRichText &&
                controller.getAnchorNode().attribute("dialogType") === "Input") {
                controller.setAsRichText(true); //return true to invalidate following behaviors
              } else {
                var control = document.createElement("div");
                control.addClass('textEditHtml');
                widget.setHtmlControl(control);
              }
            }
          } else if (widget && widget.setHtmlFormat) {
            var htmlFormat = controller.getAnchorNode().getStyleAttribute('textFormat');
            widget.setHtmlFormat(htmlFormat === "html");
          }
        }
      };
    });
  });
