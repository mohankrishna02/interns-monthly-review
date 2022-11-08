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

modulum('OnLayoutUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class OnLayoutUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.OnLayoutUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.OnLayoutUIBehavior.prototype */ {
        /** @type {string} */
        __name: "OnLayoutUIBehavior",
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
          var bufferSize = node.attribute('bufferSize');

          var widget = controller.getWidget();

          var isVisible = widget.isPageVisible ? widget.isPageVisible() : true;
          isVisible = isVisible && widget.isElementInDOM() && widget.isVisibleRecursively();
          // if widget is in a page which is not visible it is not necessary to send a pageSize
          if (isVisible && widget.getDataAreaHeight && widget.getRowHeight) {
            var dataAreaHeight = widget.getDataAreaHeight();
            if (!isNaN(dataAreaHeight)) {
              var rowHeight = widget.getRowHeight();

              var newPageSize = Math.floor(dataAreaHeight / rowHeight);
              newPageSize = Number.isNaN(newPageSize) ? 1 : Math.max(newPageSize, 1);

              var newBufferSize = newPageSize + 1;

              var app = node.getApplication();
              if (app) {
                if (app.isIdle() && !app.typeahead.hasPendingFunctionCallResultCommands(true) && newPageSize !== data
                  .requestedPageSize && (pageSize !==
                    newPageSize ||
                    bufferSize !== newBufferSize)) {

                  var event = new cls.VMConfigureEvent(node.getId(), {
                    pageSize: newPageSize,
                    bufferSize: newBufferSize
                  });

                  // fix illegal offset because of FGL-4900 (code can be removed when dvm bug fixed)
                  var size = node.attribute('size');
                  var offset = node.attribute('offset');
                  if (newPageSize + offset > size) { // newPageSize + offset > size (illegal offset)
                    event.attributes.offset = Math.max(size - newPageSize, 0); // correct offset
                  }

                  app.typeahead.event(event, node);
                  data.requestedPageSize = newPageSize;
                }
              }
            }
          }
        }
      };
    });
  });
