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

modulum('GroupLayoutEngine', ['GridLayoutEngine'],
  function(context, cls) {
    /**
     * @class GroupLayoutEngine
     * @memberOf classes
     * @extends classes.GridLayoutEngine
     */
    cls.GroupLayoutEngine = context.oo.Class(cls.GridLayoutEngine, function($super) {
      return /** @lends classes.GroupLayoutEngine.prototype */ {
        __name: "GroupLayoutEngine",

        _titleWidth: 0,

        /**
         * @inheritDoc
         */
        measure: function(invalidation) {
          $super.measure.call(this);
          if (this._widget._title.getLayoutEngine().isInvalidatedMeasure(invalidation)) {
            this._titleWidth = this._widget._title.getElement().clientWidth + this._getLayoutInfo().getDecorating().getWidth(true);
          }
        },

        /**
         * @inheritDoc
         */
        adjustMeasure: function() {
          $super.adjustMeasure.call(this);
          if (this.willRenderContent() && this._widget && this._widget.getParentWidget() &&
            !this._widget.getParentWidget().isInstanceOf(cls.BoxWidget) &&
            this._widget.getParentWidget().getChildren().length === 1) {
            this._getLayoutInfo().setMaximal(null, null);
          }
          if (!this.willRenderContent()) {
            this._getLayoutInfo().setMaximal(
              this._getLayoutInfo().getMeasured().getWidth(true),
              this._getLayoutInfo().getMeasured().getHeight(true)
            );
          }
          var layoutInfo = this._getLayoutInfo();
          var minimal = layoutInfo.getMinimal().getWidth(true);
          layoutInfo.getMinimal().setWidth(Math.max(this._titleWidth, minimal));
        },

        /**
         * @inheritDoc
         */
        adjustStretchability: function() {
          $super.adjustStretchability.call(this);
          var layoutInfo = this._widget.getLayoutInformation();
          layoutInfo.getStretched().setOpportunisticX(true);
          layoutInfo.getStretched().setOpportunisticY(true);
        },

        /**
         * @inheritDoc
         */
        prepareApplyLayout: function() {
          var layoutInfo = this._widget.getLayoutInformation();
          var allocatedW = layoutInfo.getAllocated().getWidth(true);
          var allocatedH = layoutInfo.getAllocated().getHeight(true);
          $super.prepareApplyLayout.call(this);

          if (this.willRenderContent()) {
            var visibleChildren = this.getRenderableChildren().filter(function(item) {
              return item && item.isHidden && !item.isHidden();
            });
            if (visibleChildren.length === 1 && (visibleChildren[0] instanceof cls.VBoxWidget)) {
              visibleChildren[0].getLayoutInformation().getAvailable().setWidth(
                layoutInfo.getAvailable().getWidth() - layoutInfo.getDecorating().getWidth(true));
            }
          }

          if (!this._widget._isGridChildrenInParent) {
            layoutInfo.setAllocated(
              Math.max(
                Math.min(
                  Math.max(this._xspace.getCalculatedSize() + layoutInfo.getDecorating().getWidth(true), allocatedW),
                  layoutInfo.getAvailable().getWidth(true)
                ),
                layoutInfo.getMinimal().getWidth(true)
              ),
              this.willRenderContent() ?
              Math.max(
                Math.min(
                  Math.max(this._yspace.getCalculatedSize() + layoutInfo.getDecorating().getHeight(true), allocatedH),
                  layoutInfo.getAvailable().getHeight(true)
                ),
                layoutInfo.getMinimal().getHeight(true)
              ) :
              layoutInfo.getMinimal().getHeight(true)
            );
          }

          if (this._widget && this._widget.getParentWidget() && this._widget.getParentWidget().isInstanceOf(cls.FormWidget)) {
            layoutInfo.setAllocated(
              Math.max(
                layoutInfo.getAvailable().getWidth(true),
                layoutInfo.getMinimal().getWidth(true)
              ),
              this.willRenderContent() ?
              Math.max(
                layoutInfo.getAvailable().getHeight(true),
                layoutInfo.getMinimal().getHeight(true)
              ) :
              layoutInfo.getMinimal().getHeight(true)
            );
            this._styleRules[".g_measured #w_" + this._widget.getUniqueIdentifier() + ".g_measureable"] = {
              "height": layoutInfo.getAllocated().getHeight() + "px !important",
              "width": layoutInfo.getAllocated().getWidth() + "px !important"
            };
          }
        },

        /**
         * @inheritDoc
         */
        updateInvalidated: function(invalidation) {
          $super.updateInvalidated.call(this, invalidation);
          this._widget._title.getLayoutEngine().updateInvalidated(invalidation);
        }
      };
    });
  });
