/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('WebComponentKeyboardUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * Behavior used to delegates keyboard keydowns from webcomponents to the GBC
     * @class WebComponentKeyboardUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.WebComponentKeyboardUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.WebComponentKeyboardUIBehavior.prototype */ {
        __name: "WebComponentKeyboardUIBehavior",

        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (widget) {
            data.keyboardListener = widget.when(context.constants.widgetEvents.webcomponentKeyDown, this._onWebcomponentKeyDown
              .bind(
                this, controller));
          }
        },

        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.keyboardListener) {
            data.keyboardListener();
            data.keyboardListener = null;
          }
        },

        /**
         * Handler for webcomponent key down
         * @param {classes.ControllerBase} controller
         * @param {Object} event - event
         * @param {classes.EventListener} src
         * @param {KeyboardEvent} domEvent
         * @private
         */
        _onWebcomponentKeyDown: function(controller, event, src, domEvent) {
          var anchor = controller.getAnchorNode();
          var app = anchor.getApplication();
          Event.prototype.normalizeEventForGBC(domEvent);
          app.keyboard._onKeyDown(domEvent);
        }
      };
    });
  });
