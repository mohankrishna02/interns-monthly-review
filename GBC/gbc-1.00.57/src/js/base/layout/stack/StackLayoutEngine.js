/// FOURJS_START_COPYRIGHT(D,2017)
/// Property of Four Js*
/// (c) Copyright Four Js 2017, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('StackLayoutEngine', ['LeafLayoutEngine'],
  function(context, cls) {
    /**
     * @class StackLayoutEngine
     * @memberOf classes
     * @extends classes.LeafLayoutEngine
     */
    cls.StackLayoutEngine = context.oo.Class(cls.LeafLayoutEngine, function($super) {
      return /** @lends classes.StackLayoutEngine.prototype */ {
        __name: "StackLayoutEngine",
        /**
         * @type {classes.WidgetBase[]}
         */
        _registeredWidgets: null,
        /**
         * set to false to avoid render children
         * @type {boolean}
         */
        _willRenderContent: true,
        /**
         * stylesheet id
         */
        _styleSheetId: null,

        /**
         * @inheritDoc
         * @constructs
         */
        constructor: function(widget) {
          $super.constructor.call(this, widget);
          this._registeredWidgets = [];
          this._styleSheetId = "stackLayout_" + this._widget.getUniqueIdentifier();
        },
        /**
         * @inheritDoc
         */
        destroy: function() {
          for (var i = this._registeredWidgets.length - 1; i > -1; i--) {
            var wi = this._registeredWidgets[i];
            this.unregisterChild(wi);
          }
          this._registeredWidgets.length = 0;
          $super.destroy.call(this);
        },

        /**
         * whether or not to render content
         * @return {boolean}  true if content has to be rendered
         */
        willRenderContent: function() {
          var parentEngine = this._widget && this._widget.getParentWidget() &&
            this._widget.getParentWidget().isInstanceOf(cls.GroupWidget) &&
            this._widget.getParentWidget().getLayoutEngine(),
            hasWillRenderContent = parentEngine && parentEngine.willRenderContent;
          return this._willRenderContent && (!hasWillRenderContent || parentEngine.willRenderContent());
        },

        /**
         * @inheritDoc
         */
        getRenderableChildren: function() {
          return this.willRenderContent() && this._registeredWidgets || [];
        },

        /**
         * @inheritDoc
         * @param {classes.WidgetBase} widget child widget
         * @param {number} position the wanted position
         */
        registerChild: function(widget, position) {
          if (this._registeredWidgets.indexOf(widget) < 0) {
            this._registeredWidgets.splice(position * 2, 0, widget.getLayoutInformation()._stackLabel, widget);
          }
        },

        /**
         * @inheritDoc
         */
        unregisterChild: function(widget) {
          this._registeredWidgets.remove(widget.getLayoutInformation()._stackLabel);
          this._registeredWidgets.remove(widget);
        },

        /**
         * @inheritDoc
         */
        prepareMeasure: function() {
          var parent = this._widget.getParentWidget(),
            foundStack = false;
          while (!foundStack && parent) {
            foundStack = Boolean(parent.getLayoutEngine()) && parent.getLayoutEngine().isInstanceOf(cls.StackLayoutEngine);
            parent = parent.getParentWidget();
          }
          this._isTopStack = !foundStack;
        },

        /**
         * @inheritDoc
         */
        prepareAdjustments: function() {
          var children = this.getRenderableChildren();
          for (var i = 1; i < children.length; i += 2) {
            children[i - 1].setHidden(children[i].isHidden());
          }
        },

        /**
         * @inheritDoc
         */
        measureDecoration: function() {
          var element = this._widget.getElement(),
            container = this._widget.getContainerElement();
          this._getLayoutInfo().setDecorating(
            element.clientWidth - container.clientWidth,
            element.clientHeight - container.clientHeight
          );
          this._getLayoutInfo().setDecoratingOffset(
            container.offsetLeft - element.offsetLeft,
            container.offsetTop - element.offsetTop
          );
        },

        /**
         * @inheritDoc
         */
        adjustMeasure: function() {
          var layoutInfo = this._widget.getLayoutInformation();
          var children = this.getRenderableChildren();
          var minX = 0,
            minY = 0,
            preferredX = 0,
            preferredY = 0;

          this._visibleChildren = 0;
          for (var i = 0; i < children.length; i++) {
            if (children[i].isVisible() && this.willRenderContent()) {
              if (!children[i].isInstanceOf(cls.StackLabelWidget)) {
                this._visibleChildren++;
              }
              var childInfo = children[i].getLayoutInformation();
              var childHeight = Math.max(childInfo.getMinimal().getHeight(true), childInfo.getPreferred().getHeight(true));
              minX = Math.max(minX, childInfo.getMinimal().getWidth(true));
              minY += childHeight;
              preferredX = Math.max(preferredX, childInfo.getPreferred().getWidth(true));
              preferredY += childHeight;
            }
          }
          minX += layoutInfo.getDecorating().getWidth(true);
          minY += layoutInfo.getDecorating().getHeight(true);
          preferredX += layoutInfo.getDecorating().getWidth(true);
          preferredY += layoutInfo.getDecorating().getHeight(true);
          layoutInfo.setMinimal(minX, minY);
          layoutInfo.setMeasured(minX, minY);

          layoutInfo.setPreferred(preferredX, preferredY);
        },

        /**
         * @inheritDoc
         */
        prepareApplyLayout: function(layoutApplicationService) {
          var children = this.getRenderableChildren();
          var layoutInfo = this._widget.getLayoutInformation(),
            childInfo, i;
          var childrenWidth = layoutInfo.getAvailable().getWidth(true) - layoutInfo.getDecorating().getWidth(true);
          var minChildrenWidth = 0,
            columns = 1,
            maxHeight = 0,
            currentItemHeight = 0,
            currentLineHeight = 0;
          if (this._isTopStack) {
            minChildrenWidth = layoutInfo.getMinimal().getWidth(true);
            columns = Math.min(Math.floor(this._visibleChildren), Math.floor(childrenWidth / minChildrenWidth));
            if (columns > 1) {
              childrenWidth = childrenWidth / columns;
            }
            if (children.length === 2) {
              this._shouldStretch = true;
            }
          }
          for (i = 0; i < children.length; i++) {
            childInfo = children[i].getLayoutInformation();
            childInfo.getMaximal().setWidth(layoutInfo.getAvailable().getWidth(true));
            var childHeight = Math.max(childInfo.getMinimal().getHeight(true), childInfo.getPreferred().getHeight(true));
            if (layoutApplicationService && childInfo._keepRatio) {
              layoutApplicationService.activateBackLayout();
              childHeight = childInfo.getMaximal().getWidth() * childInfo._sizeRatio;
              childInfo.getMinimal().setHeight(childHeight);
              childInfo.getMeasured().setHeight(childHeight);
              childInfo.getMaximal().setHeight(childHeight);
            }
            if (i % (columns * 2) === 0) {
              maxHeight += currentLineHeight;
              currentLineHeight = 0;
            }
            currentItemHeight += childHeight;
            if (i % 2 === 1) {
              if (this._shouldStretch && childInfo.shouldFillStack) {
                var labelHeight = currentItemHeight - childHeight;
                childHeight = layoutInfo.getAvailable().getHeight(true) - labelHeight;
              }
              currentLineHeight = Math.max(currentLineHeight, currentItemHeight);
              currentItemHeight = 0;
            }
            childInfo.setAvailable(childrenWidth, childHeight);
            childInfo.setAllocated(childrenWidth, childHeight);

            this._styleRules[".g_measured #w_" + children[i].getUniqueIdentifier() + ".g_measureable"] = {
              "height": childHeight + "px",
              "width": childrenWidth + "px"
            };
          }
          maxHeight += currentLineHeight;
          layoutInfo.setAllocated(layoutInfo.getAvailable().getWidth(true), maxHeight);

        },

        /**
         * @inheritDoc
         */
        applyLayout: function() {
          context.styler.appendStyleSheet(this._styleRules, this._styleSheetId, true, this.getLayoutSheetId());
        }
      };
    });
  });
