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

modulum('StartMenuPositionUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * Behavior controlling the switch of widget by controller
     * @class StartMenuPositionUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.StartMenuPositionUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.StartMenuPositionUIBehavior.prototype */ {
        __name: "StartMenuPositionUIBehavior",

        usedStyleAttributes: ["startMenuPosition"],
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (widget) {
            data.startMenuPositionHandle = widget.when(cls.UserInterfaceWidget.startMenuPosition, this._onStartMenuPositionChanged
              .bind(
                this, controller, data));
          }
        },
        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.startMenuPositionHandle) {
            data.startMenuPositionHandle();
            data.startMenuPositionHandle = null;
          }
        },
        /**
         *
         * @param controller
         * @param data
         * @param {Object} event - DOM event
         * @param sender
         * @param windowIdRef
         * @private
         */
        _onStartMenuPositionChanged: function(controller, data, event, sender, windowIdRef) {
          var app = controller.getAnchorNode().getApplication();
          var uiNode = app.uiNode();
          var startMenu = uiNode.getFirstChild('StartMenu');
          if (startMenu) {
            var windowNode = app.getNode(windowIdRef);
            if (windowNode) {
              var kind = windowNode.getStyleAttribute('startMenuPosition');
              if (kind) {
                startMenu.getController().changeWidgetKind(kind);
              }
            }
          }
        }
      };
    });
  });
