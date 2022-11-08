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

modulum('TextActionVMBehavior', ['BehaviorBase'],
  /**
   * Manage "Text" attribute only for Action widgets
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class TextActionVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.TextActionVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.TextActionVMBehavior.prototype */ {
        __name: "TextActionVMBehavior",

        watchedAttributes: {
          anchor: ['name', 'comment', 'text', 'actionIdRef'],
          decorator: ['action', 'actionIdRef']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && (widget.setText || widget.setActionTitle)) {
            var anchorNode = controller.getAnchorNode();
            var appService = anchorNode.getApplication().getActionApplicationService();
            var actionName;
            if (controller._widgetType === "ButtonEdit") {
              anchorNode = controller.getNodeBindings().decorator;
              actionName = anchorNode.attribute('action');
            } else {
              actionName = anchorNode.attribute('name');
            }
            var text = anchorNode.attribute('text');
            var isTextDefined = anchorNode.isAttributeSetByVM('text');
            // for actions if there is no anchor attribute 'text' we use action attribute 'text'
            if (!isTextDefined || controller._widgetType === "ButtonEdit") { // Button edit too
              if (actionName) {
                var actionNode = appService.getActiveDialogAction(actionName);
                if (actionNode) {
                  isTextDefined = actionNode.isAttributeSetByVM('text');
                  //Comment attribute should be use in priority, text as fallback
                  text = actionNode.attribute('comment');
                  if (text.length <= 0) {
                    text = actionNode.attribute('text');
                  }
                }
              }
            }

            // if there is no text defined for action
            if (!isTextDefined) {
              var chromeBarTheme = controller.isInChromeBar();
              var image = anchorNode.attribute('image');

              // case where we case use name instead of text
              var nameAllowed = chromeBarTheme ||
                (anchorNode.getTag() === "Action" && !image) ||
                (anchorNode.getTag() === "Menu" && !image) ||
                (anchorNode.getTag() === "MenuAction" && !image) ||
                (anchorNode.getTag() === "TableAction");

              if (nameAllowed) { // no text we use name attribute
                text = anchorNode.attribute('name');
              }
            }

            var accelerator = anchorNode.attribute('acceleratorName');
            if (accelerator && widget.setComment) {
              widget.setComment(accelerator);
            }

            //remove first occurence of & symbol (quick shortcut not available in webclient)
            text = text ? text.toString().replace(/&(.)/g, "$1") : "";

            if (widget.setText) {
              widget.setText(text);
            }
            if (widget.setActionTitle) {
              widget.setActionTitle(text);
            }

            var contextMenuAttribute = anchorNode.attribute('contextMenu');
            if (anchorNode.getTag() === "Action" && (contextMenuAttribute === 'yes' || contextMenuAttribute === 'auto')) {
              // update contextmenu corresponding action
              var contextMenuWidget = widget.getApplicationWidget().getContextMenu();
              var hiddenAttr = anchorNode.attribute('hidden');
              contextMenuWidget.updateAction(actionName, text, null, accelerator, {
                hidden: hiddenAttr
              });
            }
          }
        }
      };
    });
  });
