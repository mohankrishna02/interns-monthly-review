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

modulum('OnActionUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class OnActionUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.OnActionUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.OnActionUIBehavior.prototype */ {
        /** @type {string} */
        __name: "OnActionUIBehavior",
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          if (controller && controller.getWidget()) {
            data.actionHandle = controller.getWidget().when(cls.WebComponentWidget.actionEvent, this._onAction.bind(this,
              controller,
              data));
          }
        },
        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.actionHandle) {
            data.actionHandle();
            data.actionHandle = null;
          }
        },
        /**
         * Creates an action event and sends it to the VM
         * @private
         */
        _onAction: function(controller, data, event, src, actionName) {
          var node = controller.getAnchorNode();
          node.getApplication().typeahead.startGroupCommand();

          var widget = node.getWidget();
          var widgetValue = widget.getValue();

          // Pass the Webcomponent node to ensure its value is flushed
          node.getApplication().typeahead.value(node, widgetValue);
          // No node given here since we don't know the action node yet (only the action name)
          node.getApplication().typeahead.action(null, {
            actionName: actionName
          });

          node.getApplication().typeahead.finishGroupCommand();

        }
      };
    });
  });
