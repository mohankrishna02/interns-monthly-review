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

modulum('ScrollAreaWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * ScrollArea Widget.
     * Use to catch scrolling event and forward them to a Matrix
     * @class ScrollAreaWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.ScrollAreaWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.ScrollAreaWidget.prototype */ {
        __name: "ScrollAreaWidget",

        _size: 0,
        _pageSize: 0,
        _lineHeight: 15,

        _totalHeight: 0,

        //ThinScroll vars
        _displayTime: null,
        _mouseIsOver: false,
        _thinTimer: null,
        _scrollbar: null,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);

          this._element.on("wheel.ScrollAreaWidget", this._onWheel.bind(this));

          var body = document.getElementsByTagName("body")[0];
          // Using getRootClassName() to qualify event for easier removal on destroy, since we bind it on 'body'
          body.on("touchstart.ScrollAreaWidget." + this.getRootClassName(), this._onTouchStart.bind(this));
          body.on("touchend.ScrollAreaWidget." + this.getRootClassName(), this._onTouchEnd.bind(this));
          body.on("touchmove.ScrollAreaWidget." + this.getRootClassName(), this._onTouchMove.bind(this));

          this._scrollbar = cls.WidgetFactory.createWidget("ScrollBar", this.getBuildParameters());
          this._scrollbar.display(true);
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._element.off("wheel.ScrollAreaWidget");

          var body = document.getElementsByTagName("body")[0];
          body.off("touchstart.ScrollAreaWidget." + this.getRootClassName());
          body.off("touchend.ScrollAreaWidget." + this.getRootClassName());
          body.off("touchmove.ScrollAreaWidget." + this.getRootClassName());

          this._scrollbar.destroy();
          $super.destroy.call(this);
        },

        /**
         * On wheel handler
         * @param {UIEvent} event
         * @private
         */
        _onWheel: function(event) {
          this.emit(context.constants.widgetEvents.mousewheel, event);
          //event.preventCancelableDefault(); // Not allowed since passive:true
          event.stopPropagation();
          event.stopImmediatePropagation();
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {

          var gridElement = this._element.parent("g_GridElement");
          // Hide the scrollArea layer
          gridElement.addClass("hidden");
          // Create a click event that will be triggered to the div beyond
          var target = document.elementFromPoint(domEvent.clientX, domEvent.clientY);
          // Focus event is needed to trigger a VM focus request (InputArray)
          var event = document.createEvent('HTMLEvents');
          event.initEvent('focus', true, false);
          target.dispatchEvent(event);
          // Click event is needed to trigger a VM row selection event (DisplayArray)
          event = document.createEvent('HTMLEvents');
          event.initEvent('click', true, false);
          target.dispatchEvent(event);
          // Show back the scrollArea layer
          gridElement.removeClass("hidden");

          return false;
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.LeafLayoutEngine(this);
          this._layoutEngine._shouldFillHeight = true;
          this.getLayoutInformation()._extraGap = {
            afterX: window.scrollBarSize
          };

          if (this._scrollbar) {
            // position scrollbar according to scrollarea widget
            this._layoutInformation.onGridInfoChanged(function() {
              var scrollAreaLayoutInfo = this.getLayoutInformation();
              var scrollBarLayoutInfo = this._scrollbar.getLayoutInformation();
              scrollBarLayoutInfo.setGridX(scrollAreaLayoutInfo.getGridX() + scrollAreaLayoutInfo.getGridWidth() - 1);
              scrollBarLayoutInfo.setGridY(scrollAreaLayoutInfo.getGridY());
              scrollBarLayoutInfo.setGridWidth(1);
              scrollBarLayoutInfo.setGridHeight(scrollAreaLayoutInfo.getGridHeight());
            }.bind(this));

          }
        },

        /**
         * Handler called when start to touch the screen
         * @param {UIEvent} event - dom touch event
         * @private
         */
        _onTouchStart: function(event) {
          if (this.isTouchEventInScrollArea(event)) {
            this.emit(context.constants.widgetEvents.touchStart, event);
          }
        },

        /**
         * Handler called when stop touching the screen
         * @param {UIEvent} event - dom touch event
         * @private
         */
        _onTouchEnd: function(event) {
          this.emit(context.constants.widgetEvents.touchEnd, event);
        },

        /**
         * Handler called on moving finger on screen
         * @param {UIEvent} event - dom touch event
         * @private
         */
        _onTouchMove: function(event) {
          if (this.isTouchEventInScrollArea(event)) {
            this.emit(context.constants.widgetEvents.touchMove, event);
          }
        },

        /**
         * Check if the given event is located in the scroll area
         * Note that scrollbar is removed from the scrolling area
         * @param {UIEvent} event - dom touch event
         * @return {boolean}
         */
        isTouchEventInScrollArea: function(event) {
          var rect = this._element.getBoundingClientRect();
          var sbRect = this._scrollbar.getElement().getBoundingClientRect();
          return event.touches[0].clientY > rect.top &&
            event.touches[0].clientY < rect.top + rect.height &&
            event.touches[0].clientX > rect.left &&
            event.touches[0].clientX < rect.left + rect.width - sbRect.width;
        },

        /**
         * Get the scroll Widget
         * @return {classes.ScrollAreaWidget}
         */
        getScrollWidget: function() {
          return this;
        },

        /**
         * @inheritDoc
         */
        setParentWidget: function(widget, options) {
          $super.setParentWidget.call(this, widget, options);
          if (this._scrollbar && widget) {
            widget.addChildWidget(this._scrollbar);
            this._scrollbar.setScrollArea(this);
          }
        },

        /**
         * Define the total size of the scrollArea
         * @param size
         */
        setSize: function(size) {
          if (size !== this._size) {
            this._size = size;
            this.setTotalHeight(this._lineHeight * this._size);
            if (this._scrollbar) {
              this._scrollbar.setSize(size);
            }
          }
        },

        /**
         * Define the page size of the scrollArea
         * @param pageSize
         * @param {boolean} force
         */
        setPageSize: function(pageSize, force) {
          if (this._pageSize !== pageSize || force) {
            this._pageSize = pageSize;
            var lineHeight = this._element.clientHeight / pageSize;
            this.setLineHeight(lineHeight);
            if (this._scrollbar) {
              this._scrollbar.setPageSize(pageSize);
            }
          }
        },

        /**
         * Set the offset of the scrollArea
         * @param offset
         */
        setOffset: function(offset) {
          this._offset = offset;
          if (this._scrollbar) {
            this._scrollbar.setOffset(offset);
          }
        },

        /**
         * Set the line height
         * @param lineHeight
         */
        setLineHeight: function(lineHeight) {
          this._lineHeight = lineHeight;
          if (this._scrollbar) {
            this._scrollbar.setLineHeight(lineHeight);
          }
        },

        /**
         * Will set the total height of the scrollArea
         * @param {number} height total
         */
        setTotalHeight: function(height) {
          if (!this.isEnabled()) {
            height = 0;
          }
          this.setStyle(".spacer", {
            "height": Math.max(0, height) + "px"
          });
          this._totalHeight = Math.max(0, height);
          if (this._scrollbar) {
            this._scrollbar.setTotalHeight(this._totalHeight);
          }
        },

        /**
         * Defines the scroll area to use thinscrollbar
         * @param {number} displayTime - in second, how long the scrollbar is displayed 0 is always visible, -1 is never
         */
        setThinScrollbar: function(displayTime) {
          this.getLayoutInformation()._extraGap = {
            afterX: 0
          };

          this.addClass("thinScrollBar");
          // get grid parent
          this._displayTime = displayTime;
          this._scrollbar.setDisplayTime(displayTime);
        },

        /**
         * Defines the enabled status of the widget
         * @param {boolean} enabled true if the widget allows user interaction, false otherwise.
         * @publicdoc
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          this._scrollbar.setEnabled(enabled);
        }

      };
    });
    cls.WidgetFactory.registerBuilder('ScrollArea', cls.ScrollAreaWidget);
  });
