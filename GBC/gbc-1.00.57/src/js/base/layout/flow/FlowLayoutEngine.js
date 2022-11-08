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

modulum('FlowLayoutEngine', ['LayoutEngineBase'],
  function(context, cls) {

    /**
     * Layout engine for container that will flow items in continuous dropdown
     * Note that it should be applied to WidgetGroupBase widgets only
     * @class FlowLayoutEngine
     * @memberOf classes
     * @extends classes.LayoutEngineBase
     */
    cls.FlowLayoutEngine = context.oo.Class(cls.LayoutEngineBase, function($super) {
      return /** @lends classes.FlowLayoutEngine.prototype */ {
        __name: "FlowLayoutEngine",

        /** @type {Number} */
        _childrenWidth: 0,

        /** @type {Number} */
        _containerWidth: 0,

        /** @type {classes.FlowDecoratorWidget} **/
        _flowDecoratorWidget: null,

        /**
         * Define the widget used for flowing (usually 3dots)
         * @param {classes.FlowDecoratorWidget} flowDecoratorWidget
         */
        setFlowDecoratorWidget: function(flowDecoratorWidget) {
          this._flowDecoratorWidget = flowDecoratorWidget;
        },

        /**
         * Get the widget used for flowing
         * @return {classes.FlowDecoratorWidget}
         */
        getFlowDecoratorWidget: function() {
          return this._flowDecoratorWidget;
        },

        /**
         * @inheritDoc
         */
        notifyLayoutApplied: function() {
          $super.notifyLayoutApplied.call(this);

          this._registerAnimationFrame(function() {
            this._registerAnimationFrame(function() {
              if (this._needRefresh()) { // No need to refresh everytime
                if (this._throttle) {
                  window.clearTimeout(this._throttle);
                }
                this._throttle = this._registerTimeout(function() {
                  this._refresh();
                  this._throttle = null;
                }.bind(this), 30);
              }
            }.bind(this));
          }.bind(this));
        },

        /**
         * Refresh the flowing items
         * @private
         */
        _refresh: function() {
          var containerWidth = this.getContainerWidth();
          var childrenTotalWidth = this.getChildrenWidth() + this.getFlowingChildrenWidth();
          // If the children width is more than the container width, we need to flow some children
          this._flowItems(childrenTotalWidth > containerWidth);
        },

        /**
         * Flow or unflow items
         * @param {Boolean} flow - true to flow items if necessary, false to unflow them
         * @private
         */
        _flowItems: function(flow) {
          var widget = this._widget;
          var flowDecoratorWidget = this.getFlowDecoratorWidget();
          var childrenWidth = this.getChildrenWidth();
          var containerWidth = this.getContainerWidth();

          flowDecoratorWidget.enable(flow);
          // Flow items after size calculation: add to the dropdown
          var currentChildrenWidth = this.getChildrenWidth(),
            children = null,
            currentChildWidth = 0,
            i = 0;
          if (containerWidth > childrenWidth) {
            children = flowDecoratorWidget.getFlowingChildren();
            currentChildWidth = children.length && children[i].getLayoutInformation().getRawMeasure().getWidth();
            while (i < children.length && (currentChildrenWidth + currentChildWidth) < containerWidth) {
              flowDecoratorWidget.flowChild(children[i], false); // unflow this child
              currentChildrenWidth += currentChildWidth;
              i++;
              currentChildWidth = children[i] && children[i].getLayoutInformation().getRawMeasure().getWidth();
            }
          } else {
            children = widget.getChildren().slice(0);
            i = children.length - 1;
            while (i >= 0 && currentChildrenWidth > containerWidth) {
              flowDecoratorWidget.flowChild(children[i], true); // flow this child
              currentChildrenWidth -= children[i].getLayoutInformation().getRawMeasure().getWidth();
              i--;
            }
          }
        },

        /**
         * Check if refresh is necessary
         * @return {boolean} true if need a refresh, false otherwise
         * @private
         */
        _needRefresh: function() {
          var currentChildrenWidth = this.getChildrenWidth() + this.getFlowingChildrenWidth();
          var currentContainerWidth = this.getContainerWidth();

          // No need to refresh if either of container and/or children total width did not change
          if (this._childrenWidth !== currentChildrenWidth || this._containerWidth !== currentContainerWidth) {
            // If changed, update those values
            this._childrenWidth = currentChildrenWidth;
            this._containerWidth = currentContainerWidth;
            return true;
          } else {
            return false;
          }
        },

        /**
         * Calculate the total width of the children
         * @return {*}
         */
        getChildrenWidth: function() {
          return this._widget.getChildren().slice(1).reduce(function(prev, child) {
            return prev + child.getLayoutInformation().getRawMeasure().getWidth();
          }, 0);
        },

        /**
         * Calculate the total width of the children
         * @return {*}
         */
        getFlowingChildrenWidth: function() {
          return this._widget.getFlowDecoratorWidget().getFlowingChildren().reduce(function(prev, child) {
            return prev + child.getLayoutInformation().getRawMeasure().getWidth();
          }, 0);
        },

        /**
         * Calculate the container Width, take the 3dots icon into account
         * @return {number}
         */
        getContainerWidth: function() {
          // Modal case: get the previously set toolbar width
          if (this._widget.getWindowWidget() && this._widget.getWindowWidget().isModal) {
            return this._widget.getFormWidget().getLayoutInformation().getToolbarAllocatedWidth() - this._widget
              .getDecoratorWidth();
          }
          return this._widget.getFormWidget().getLayoutInformation().getRawMeasure().getWidth() - this._widget.getDecoratorWidth();
        },

      };
    });
  });
