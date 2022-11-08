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

modulum('WindowCloseUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class WindowCloseUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.WindowCloseUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.WindowCloseUIBehavior.prototype */ {
        /** @type {string} */
        __name: "WindowCloseUIBehavior",

        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          if (controller && controller.getWidget()) {
            data.clickHandle = controller.getWidget().when(gbc.constants.widgetEvents.close, this._windowClose.bind(this,
              controller,
              data));
          }
        },

        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.clickHandle) {
            data.clickHandle();
            data.clickHandle = null;
          }
        },

        /**
         *
         * @param controller
         * @param data
         * @private
         */
        _windowClose: function(controller, data) {
          var node = controller.getAnchorNode();
          if (node.getTag() !== "Window") {
            node = node.getAncestor("Window");
          }
          var dialog = node.getActiveDialog();
          if (dialog) {
            var closeActionNodes = dialog.getChildrenWithAttribute(null, "name", "close");
            if (closeActionNodes && closeActionNodes.length > 0) {
              var closeActionNode = closeActionNodes[0];
              controller.getAnchorNode().getApplication().action.execute(closeActionNode.getId());
            }
          }
        }
      };
    });
  });
