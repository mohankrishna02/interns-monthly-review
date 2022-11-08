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

modulum('ScrollOffsetUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * Dataset scroll behavior. Moves the dataset directly to the requested offset
     * @class ScrollOffsetUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.ScrollOffsetUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.ScrollOffsetUIBehavior.prototype */ {
        __name: "ScrollOffsetUIBehavior",

        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          data.scrollHandle = widget.when(context.constants.widgetEvents.offset, this._onScrollOffset.bind(this, controller, data));
        },

        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.scrollHandle) {
            data.scrollHandle();
            data.scrollHandle = null;
          }
        },

        /**
         * Send the requested scroll offset to the VM
         * @param controller Widget controller
         * @param data Behavior data
         * @param event source event
         * @private
         */
        _onScrollOffset: function(controller, data, event) {
          var offset = event.data[0];
          var node = controller.getAnchorNode();
          node.getApplication().typeahead.scroll(node, offset);
        }
      };
    });
  });
