/// FOURJS_START_COPYRIGHT(D,2019)
/// Property of Four Js*
/// (c) Copyright Four Js 2019, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('ContextMenuUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * Handling context menu
     * @class ContextMenuUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.ContextMenuUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.ContextMenuUIBehavior.prototype */ {
        /** @type {string} */
        __name: "ContextMenuUIBehavior",

        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          if (controller && controller.getWidget()) {
            data.contextMenuHandle = controller.getWidget().when(gbc.constants.widgetEvents.contextMenu, this._onContextMenu.bind(
              this, controller, data));
          }
        },

        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.contextMenuHandle) {
            data.contextMenuHandle();
            data.contextMenuHandle = null;
          }
        },

        /**
         * Create a typeahead command to open contextmenu
         * @param controller
         * @param data
         * @private
         */
        _onContextMenu: function(controller, data) {

          var widget = controller.getWidget();
          if (widget && widget.show) {
            var anchorNode = controller.getAnchorNode();
            var app = anchorNode.getApplication();
            app.typeahead.callback(widget.show.bind(widget));
          }
        }
      };
    });
  });
