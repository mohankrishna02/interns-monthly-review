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

modulum('OnClickUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class OnClickUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.OnClickUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.OnClickUIBehavior.prototype */ {
        /** @type {string} */
        __name: "OnClickUIBehavior",
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          if (controller && controller.getWidget()) {
            data.clickHandle = controller.getWidget().when(gbc.constants.widgetEvents.click, this._onClick.bind(this, controller,
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
         * Creates an action command
         */
        _onClick: function(controller, data, gbcEvent, element, domEvent, actionOnly) {
          var bindings = controller.getNodeBindings();
          var app = bindings.anchor.getApplication();
          var actionNode = bindings.decorator ? bindings.decorator : bindings.anchor;

          var options = {};
          if (!actionOnly) {
            options.sendValue = true;
          }

          app.action.execute(actionNode.getId(), null, options);
        }
      };
    });
  });
