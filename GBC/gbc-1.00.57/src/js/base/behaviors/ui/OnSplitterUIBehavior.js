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

modulum('OnSplitterUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class OnSplitterUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.OnSplitterUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.OnSplitterUIBehavior.prototype */ {
        /** @type {string} */
        __name: "OnSplitterUIBehavior",
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (widget) {
            data.splitterHandle = widget.when(context.constants.widgetEvents.splitter, this._onSplitter.bind(this,
              controller,
              data));
          }

        },
        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.splitterHandle) {
            data.splitterHandle();
            data.splitterHandle = null;
          }
        },

        /**
         *
         * @param controller
         * @param data
         * @private
         */
        _onSplitter: function(controller, data) {
          controller.getWidget().getLayoutEngine().invalidateAllocatedSpace();
          controller.getAnchorNode().getApplication().layout.refreshLayout();
        }
      };
    });
  });
