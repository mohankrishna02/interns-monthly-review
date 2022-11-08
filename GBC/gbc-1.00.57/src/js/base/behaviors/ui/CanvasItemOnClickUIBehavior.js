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

modulum('CanvasItemOnClickUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class CanvasItemOnClickUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.CanvasItemOnClickUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.CanvasItemOnClickUIBehavior.prototype */ {
        /** @type {string} */
        __name: "CanvasItemOnClickUIBehavior",

        anchor: ['acceleratorKey1', 'acceleratorKey3'],
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          if (controller && controller.getWidget()) {
            data.clickHandle = controller.getWidget().when(gbc.constants.widgetEvents.click, this._onClick.bind(this, controller,
              false));
            data.rightClickHandle = controller.getWidget().when(gbc.constants.widgetEvents.rightClick, this._onClick.bind(this,
              controller, true));
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
          if (data.rightClickHandle) {
            data.rightClickHandle();
            data.rightClickHandle = null;
          }
        },
        /**
         * @inheritDoc
         */
        _apply: function(controller) {
          var anchorNode = controller.getAnchorNode();
          if (!anchorNode.attribute('acceleratorKey1') && !anchorNode.attribute('acceleratorKey3')) {
            controller.getWidget().addClass("gbc_noPointerEvents");
          }
        },
        /**
         *
         * @param controller
         * @param isRightClick
         * @private
         */
        _onClick: function(controller, isRightClick) {
          var anchorNode = controller.getAnchorNode();

          var acceleratorKey = null;
          if (!isRightClick) {
            acceleratorKey = anchorNode.attribute('acceleratorKey1');
            // Left mouse button
          } else {
            // Right mouse button
            acceleratorKey = anchorNode.attribute('acceleratorKey3');
          }
          if (acceleratorKey) {
            var app = anchorNode.getApplication();
            var vmEvent = new cls.VMKeyEvent(acceleratorKey, anchorNode.getId());
            app.typeahead.event(vmEvent, anchorNode);
          }
        }
      };
    });
  }
);
