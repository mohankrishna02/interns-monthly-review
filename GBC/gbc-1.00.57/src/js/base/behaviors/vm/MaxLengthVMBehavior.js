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

modulum('MaxLengthVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class MaxLengthVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.MaxLengthVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.MaxLengthVMBehavior.prototype */ {
        __name: "MaxLengthVMBehavior",

        watchedAttributes: {
          decorator: ['maxLength', 'autoNext', 'picture']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setMaxLength) {
            var decoratorNode = controller.getNodeBindings().decorator;
            var maxLength = null;
            if (decoratorNode.isAttributeSetByVM('maxLength')) {
              maxLength = decoratorNode.attribute('maxLength');
              if (maxLength === 0) {
                // 0 means 'disable maxLength'
                maxLength = null;
              }
            }

            if (decoratorNode.isAttributeSetByVM('autoNext') && decoratorNode.attribute('autoNext') === 1) {
              if (data.nextFieldHandler) {
                data.nextFieldHandler();
              }
              data.nextFieldHandler = widget.when(context.constants.widgetEvents.keyUp, this._onkeyUp.bind(this, controller, data));
            }

            widget.setMaxLength(maxLength);
          }
        },

        _detach: function(controller, data) {
          if (data.nextFieldHandler) {
            data.nextFieldHandler();
            data.nextFieldHandler = null;
          }
        },

        _onkeyUp: function(controller, data, e) {
          var inputElement = controller.getWidget().getInputElement();
          if (inputElement) {
            var decoratorNode = controller.getNodeBindings().decorator;
            var maxLength = 0;
            if (decoratorNode.isAttributeSetByVM('maxLength')) {
              maxLength = decoratorNode.attribute('maxLength');
              if (maxLength === 0) {
                // 0 means 'disable maxLength'
                return;
              }
            } else {
              maxLength = decoratorNode.attribute('width');
            }
            var valueLength = inputElement.value ? inputElement.value.length : 0;
            var endReached = inputElement.selectionStart === inputElement.selectionEnd &&
              inputElement.selectionEnd + 1 >= maxLength &&
              inputElement.selectionStart + 1 >= maxLength;

            //Do nothing if arrow left/right: return
            var key = cls.KeyboardApplicationService.keymap[e.data[0].which];
            if (key && key !== "space") { // modifiers shouldn't execute nextfield
              return;
            }

            if (valueLength >= maxLength && endReached) {
              if (controller._nodeBindings) {
                controller.getAnchorNode().getApplication().keyboard.processKey("Tab");
              }
            }
          }
        },
      };
    });
  });
