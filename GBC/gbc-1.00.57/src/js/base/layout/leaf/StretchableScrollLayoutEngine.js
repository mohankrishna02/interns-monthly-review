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

modulum('StretchableScrollLayoutEngine', ['LayoutEngineBase'],
  function(context, cls) {
    /**
     * @class StretchableScrollLayoutEngine
     * @memberOf classes
     * @extends classes.LayoutEngineBase
     */
    cls.StretchableScrollLayoutEngine = context.oo.Class(cls.LeafLayoutEngine, function($super) {
      return /** @lends classes.StretchableScrollLayoutEngine.prototype */ {
        __name: "StretchableScrollLayoutEngine",

        /**
         * @inheritDoc
         */
        getRenderableChildren: function() {
          return this._widget && this._widget.getChildren && this._widget.getChildren() || [];
        },

        /**
         * @inheritDoc
         */
        measureDecoration: function() {
          $super.measureDecoration.call(this);
          var paginationWidget = this._widget.getPaginationWidget ? this._widget.getPaginationWidget() : null;
          var paginationHeight = paginationWidget ? paginationWidget.getElement().getBoundingClientRect().height : 0;
          var layoutInfo = this._widget.getLayoutInformation();
          layoutInfo.setDecorating(window.scrollBarSize, paginationHeight + window.scrollBarSize);
        },

        /**
         * @inheritDoc
         */
        measure: function() {
          $super.measure.call(this);

          if (!this._widget._firstPageSize) {
            this._widget._firstPageSize = this._widget._pageSize;
          }
        },

        /**
         * @inheritDoc
         */
        adjustMeasure: function() {
          var layoutInfo = this._widget.getLayoutInformation();
          var children = this.getRenderableChildren();
          var decorationHeight = layoutInfo.getDecorating().getHeight(true);

          if (children.length > 0) {
            var childMinimal = children[0].getLayoutInformation().getMinimal();
            var isNoSizableWindow = this._widget.getWindowWidget() && (this._widget.getWindowWidget().getLayoutInformation()
              .isSizable() ===
              false);

            // if window sizable=false --> height of stretchable scrollgrid must be fixed to initialPageSize (if any)
            if (isNoSizableWindow) {
              var rowHeight = childMinimal.getHeight(); // this._widget.getRowHeight();

              var preferredPageSize = this._widget._firstPageSize ? Math.max(this._widget._firstPageSize, 1) : 1;
              var minHeight = preferredPageSize * rowHeight + layoutInfo.getDecorating().getHeight();
              layoutInfo.getMinimal().setHeight(minHeight);
              layoutInfo.getMeasured().setHeight(minHeight);
              layoutInfo.getMaximal().setHeight(minHeight);
            }

            layoutInfo.getMinimal().setWidth(Math.max(layoutInfo.getMinimal().getWidth(true), childMinimal.getWidth(true) +
              layoutInfo.getDecorating().getWidth()));
          } else {
            layoutInfo.setMinimal(0, decorationHeight);
          }
          var sizeX = layoutInfo.getMinimal().getWidth(true);
          var sizeY = layoutInfo.getMinimal().getHeight(true);
          layoutInfo.setPreferred(sizeX, sizeY);
          layoutInfo.setMeasured(sizeX, sizeY);
        }
      };
    });
  });
