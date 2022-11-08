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

modulum('ScrollBarWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Thin ScrollBar Widget.
     * @class ScrollBarWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.ScrollBarWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.ScrollBarWidget.prototype */ {
        __name: "ScrollBarWidget",
        _scrollArea: null,
        _totalHeight: 0,
        _thumbHeight: 0,
        _displayTime: 1, // default as defined in genero doc
        _displayTimer: null,
        _mouseDown: false,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._thumbElement = this._element.querySelector(".thumb");

          var dragDropManager = this._dragDropManager.bind(this);
          this._element.on('mousedown.scrollBarWidget', dragDropManager);
          this._element.on('touchstart.scrollBarWidget', dragDropManager);

          this._element.on("mouseover.scrollBarWidget", this._mouseMove.bind(this));
          this._thumbElement.on("mouseover.scrollBarWidget", this._mouseMove.bind(this));
          this._element.on("mouseleave.scrollBarWidget", this._mouseLeave.bind(this));
          this._thumbElement.on("mouseleave.scrollBarWidget", this._mouseLeave.bind(this));
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.LeafLayoutEngine(this);
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._onDrop();
          this._element.off("mousedown.scrollBarWidget");
          this._element.off("touchstart.scrollBarWidget");

          this._element.off("mouseover.scrollBarWidget");
          this._thumbElement.off("mouseover.scrollBarWidget");
          this._element.off("mouseleave.scrollBarWidget");
          this._thumbElement.off("mouseleave.scrollBarWidget");
          $super.destroy.call(this);
        },

        /**
         * Define the thumb height
         * @param {Number} height - total height in px
         * @private
         */
        _setThumbHeight: function(height) {
          this._thumbHeight = height;
          this._thumbElement.style.height = height + "px";
        },

        /**
         * Define the thumb position
         * @param {Number} top - distance from top in px
         * @private
         */
        _setThumbPosition: function(top) {
          // Keep thumb into view
          var max = this._element.clientHeight - this._thumbHeight;
          top = top >= 0 && top < max ? top : top >= max ? max : 0;
          this._thumbElement.style.top = top + "px";
        },

        /**
         * Handler called when the mouse is mooving over the scrollbar
         * @private
         */
        _mouseMove: function() {
          this.display(true);
        },

        /**
         * Handler called when the mouse is leaving the scrollbar
         * @private
         */
        _mouseLeave: function() {
          if (this._displayTime > 0) {
            this.display(false);
          }
        },

        /**
         * Once you start dragging the scrollbar
         * @param ctx
         * @returns {boolean}
         * @private
         */
        _dragDropManager: function(ctx) {
          this._element.classList.add('ss-grabbed');
          document.body.classList.add('ss-grabbed');

          var drag = this._onDrag.bind(this);
          var drop = this._onDrop.bind(this);

          document.body.on('mousemove.scrollBarWidget', drag);
          document.body.on('mouseup.scrollBarWidget', drop);
          document.body.on('touchmove.scrollBarWidget', drag);
          document.body.on('touchend.scrollBarWidget', drop);

          return false;
        },

        /**
         * Scrollbar moving
         * @param e
         * @private
         */
        _onDrag: function(e) {
          this.afterDomMutator(function() {
            e = e.touches ? e.touches[0] : e;
            this._mouseDown = true;
            var newPos = e.pageY - this._element.getClientRects()[0].top - (this._thumbHeight / 2);
            this._setThumbPosition(newPos);

            var size = this._size;
            var pageSize = this._pageSize;
            var thumbTop = parseInt(this._thumbElement.style.top, 10);
            // Take thumb height into account
            var total = parseInt(this._element.clientHeight - this._thumbHeight, 10);
            var thumbRatio = ((thumbTop) / (total));

            // offset should be >= 0
            var maxOffset = (size - pageSize) < 0 ? 0 : size - pageSize;

            //need to update the VM position as well
            var requestedOffset = parseInt(maxOffset * thumbRatio, 10);
            if (requestedOffset >= 0) {
              e.forceOffset = requestedOffset;
              this._scrollArea.emit(context.constants.widgetEvents.scroll, e);
            }
          }.bind(this));
        },

        /**
         * Stop dragging the scrollbar
         * @private
         */
        _onDrop: function() {
          this._mouseDown = false;
          this._element.classList.remove('ss-grabbed');
          document.body.classList.remove('ss-grabbed');
          document.body.off('mousemove.scrollBarWidget');
          document.body.off('mouseup.scrollBarWidget');
          document.body.off('touchmove.scrollBarWidget');
          document.body.off('touchend.scrollBarWidget');
        },

        /**
         * Set delay before hiding the scrollBar
         * @param {number} delay in second
         */
        setDisplayTime: function(delay) {
          this._displayTime = delay;
        },

        /**
         * Show or hide the scrollBar
         * @param {boolean} displayed true:visible, false: hidden
         * @param {boolean=} instant force the delay to 0 if true
         */
        display: function(displayed, instant) {
          if (this._displayTime < 0) {
            this.addClass("thinScrollbar-vanished");
            displayed = false;
          }

          var delay = instant ? 0 : this._displayTime ? this._displayTime : 0;
          if (!displayed) {
            this._displayTimer = this._registerTimeout(function() {
              this._displayTimer = null;
              if (this.isEnabled()) { // Do not vanish if not enabled
                this.addClass("thinScrollbar-vanished");
              }
            }.bind(this), delay * 1000);
          } else {
            if (this._displayTimer) {
              this._clearTimeout(this._displayTimer);
              this._displayTimer = null;
            }
            this.removeClass("thinScrollbar-vanished");
          }
        },

        /**
         * Define the linked scrollArea
         * @param {widget} widget
         */
        setScrollArea: function(widget) {
          this._scrollArea = widget;
        },

        /**
         * Total height of the scrollArea
         * @param {number} height in pixels
         */
        setTotalHeight: function(height) {
          this._totalHeight = height;
        },

        /**
         * Set the line height used for calculations
         * @param {Number} lineHeight
         */
        setLineHeight: function(lineHeight) {
          this._lineHeight = lineHeight;
          this._setThumbHeight(lineHeight);
        },

        /**
         * Set the total of element in scroll (linked to scrollArea)
         * @param {number} size
         */
        setSize: function(size) {
          this._size = size;
        },

        /**
         * Set the number of element in scroll Page (linked to scrollArea)
         * @param {number} pageSize
         */
        setPageSize: function(pageSize) {
          this._pageSize = pageSize;
        },

        /**
         * Set the current offset (linked to scrollArea)
         * @param {number} offset
         */
        setOffset: function(offset) {
          this.display(true);
          this._offset = offset;
          if (this._lineHeight) {
            var maxPos = this._element.clientHeight - this._thumbHeight;
            var maxOffset = this._size - this._pageSize;
            var pos = (offset * maxPos) / maxOffset;
            this._setThumbPosition(pos);
          }
          if (this._displayTime > 0) {
            this.display(false);
          }
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ScrollBar', cls.ScrollBarWidget);
  });
