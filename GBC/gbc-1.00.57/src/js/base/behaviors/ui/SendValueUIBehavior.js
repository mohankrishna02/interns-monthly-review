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

modulum('SendValueUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * Behavior controlling the widget's visibility
     * @class SendValueUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.SendValueUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.SendValueUIBehavior.prototype */ {
        __name: "SendValueUIBehavior",
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          if (controller && controller.getWidget()) {
            data.changeHandle = controller.getWidget().when(context.constants.widgetEvents.change, this._onChange.bind(this,
              controller, data));
          }
        },
        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.changeHandle) {
            data.changeHandle();
            data.changeHandle = null;
          }
        },

        /**
         * Method called when the widget emits a 'changed' event. Its mission is to send value and eventually cursors to VM
         * @param {classes.ValueContainerControllerBase} controller - widget controller
         * @param {object} data - dom event data
         * @param {object} event - dom event
         * @param {HTMLElement} sender - source element
         * @param {boolean} doNotSendValue - by default we send value to VM. If set to true, we don't send value to VM
         * @param {boolean} sendCursors - by default we don't send cursors with value to VM (this is managed by typeahead)
         * @private
         */
        _onChange: function(controller, data, event, sender, doNotSendValue, sendCursors) {
          var widget = controller.getWidget();
          var anchorNode = controller.getAnchorNode();
          var window = anchorNode.getAncestor("Window");
          var dialog = window.getActiveDialog();
          if (dialog) {
            var dialogTouchedNode = dialog.getFirstChildWithAttribute('Action', 'name', 'dialogtouched');
            if (dialogTouchedNode && dialogTouchedNode.attribute('active') === 1) {
              // Force the widget value to be sent in dialogtouched
              anchorNode.getApplication().action.execute(dialogTouchedNode.getId(), anchorNode, {
                sendValue: true
              });
            } else {
              var containerNode = controller.getNodeBindings().container;
              if (!containerNode.isAttributePresent("active") || containerNode.attribute("active") === 1) {
                var decorationNode = controller.getNodeBindings().decorator;
                if (decorationNode) {
                  var completerNode = decorationNode.getFirstChild();
                  if ((completerNode && completerNode.getTag() === "Completer") || sendCursors) {
                    // The item has a completer, send all keys
                    controller.sendWidgetCursors();
                    controller.sendWidgetValue();
                    return; // return to not send value twice
                  }
                }
                if (!doNotSendValue) {
                  controller.sendWidgetValue();
                }
              }
            }
          }
        }
      };
    });
  });
