/// FOURJS_START_COPYRIGHT(D,2015)
/// Property of Four Js*
/// (c) Copyright Four Js 2015, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('OnLayoutPagedUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class OnLayoutPagedUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.OnLayoutPagedUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.OnLayoutPagedUIBehavior.prototype */ {
        /** @type {string} */
        __name: "OnLayoutPagedUIBehavior",
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          var node = controller.getAnchorNode();
          data.afterLayoutHandler = node.getApplication().layout.afterLayout(this._onLayout.bind(this, controller, data));
        },
        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.afterLayoutHandler) {
            data.afterLayoutHandler();
            data.afterLayoutHandler = null;
          }
        },

        /**
         * On layout widget event: send new page size to vm
         * @private
         */
        _onLayout: function(controller, data) {
          var node = controller.getAnchorNode();
          var pageSize = node.attribute('pageSize');

          var widget = controller.getWidget();
          var app = node.getApplication();

          if (app) {
            var dataAreaWidth = widget.getDataAreaWidth();
            var dataAreaHeight = widget.getDataAreaHeight();

            var isVisible = widget.isElementInDOM() && widget.isVisibleRecursively();
            isVisible = isVisible && !isNaN(dataAreaHeight) && !isNaN(dataAreaWidth) && dataAreaHeight > 0 && dataAreaWidth > 0;
            // if widget is in a page which is not visible it is not necessary to send a pageSize
            if (isVisible) {
              var rowWidth = widget.getRowWidth();
              var rowHeight = widget.getRowHeight();

              var newPageSize = 1;
              if (rowHeight !== 0 && rowWidth !== 0) {
                var gutter = context.ThemeService.getValue("theme-grid-inner-gutter");
                var margin = context.ThemeService.getValue("theme-margin-ratio") * 8; // Account for margin around each item
                // for small screens minimum should be 1
                var lines = Math.floor(dataAreaHeight / (rowHeight + (margin * 2 + gutter * 2))) || 1;
                var cols = Math.floor(dataAreaWidth / (rowWidth + 2 * margin)) || 1; // for small screens minimum should be 1
                newPageSize = lines * cols;
              }

              if (app.isIdle() && app.typeahead.hasFinished() && newPageSize !== data.requestedPageSize && (pageSize !==
                  newPageSize)) {
                var event = new cls.VMConfigureEvent(node.getId(), {
                  pageSize: newPageSize,
                  bufferSize: newPageSize
                });
                app.typeahead.event(event, node);
                data.requestedPageSize = newPageSize;
                event = new cls.VMConfigureEvent(node.getId(), {
                  offset: Math.floor(node.attribute('offset') / newPageSize) * newPageSize
                });
                app.typeahead.event(event, node);
              }
            }
          }
        }
      };
    });
  });
