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

modulum('ScrollVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class ScrollVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.ScrollVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.ScrollVMBehavior.prototype */ {
        __name: "ScrollVMBehavior",

        watchedAttributes: {
          anchor: ['offset', 'size', 'pageSize']
        },
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var node = controller.getAnchorNode();
          var widget = controller.getWidget();
          if (widget && widget.setPageSize && widget.setSize) {
            controller.requestOffsetPending = false;
            var pageSize = node.attribute('pageSize');
            var size = node.attribute('size');
            var offset = node.attribute('offset');
            widget.setOffset(offset);
            widget.setSize(size);
            widget.setPageSize(pageSize);
            widget.setTotalHeight((widget.getRowHeight ? widget.getRowHeight() : widget._lineHeight) * size);
            if (widget.refreshScroll) {
              widget.refreshScroll();
            }

            if (data.onScrollHandler) {
              data.onScrollHandler();
              data.onScrollHandler = null;
            }
            var layoutService = node.getApplication().layout;
            data.onScrollHandler = layoutService.afterLayout(function() {
              widget.setPageSize(pageSize, true);
              // Beware setPageSize function change the value of widget._lineHeight !!!!
              widget.setTotalHeight((widget.getRowHeight ? widget.getRowHeight() : widget._lineHeight) * size);
              widget.setSize(size);

              // update scrollarea & scroller height & refresh scrollWidget
              if (widget.refreshScroll) {
                widget.refreshScroll();
              }
              layoutService.prepareApplyLayout(widget);

              if (data.onScrollHandler) {
                data.onScrollHandler();
                data.onScrollHandler = null;
              }
            });
          }
        },
        /**
         * @inheritDoc
         */
        _detach: function(controller, data) {
          if (data.onScrollHandler) {
            data.onScrollHandler();
            data.onScrollHandler = null;
          }
        }
      };
    });
  });
