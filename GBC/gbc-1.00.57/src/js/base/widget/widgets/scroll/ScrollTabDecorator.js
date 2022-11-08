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

modulum('ScrollTabDecorator',
  function(context, cls) {
    /**
     * Add scroll tab mechanism to widget elements
     * @class ScrollTabDecorator
     * @memberOf classes
     */
    cls.ScrollTabDecorator = context.oo.Class(function($super) {
      return /** @lends classes.ScrollTabDecorator.prototype */ {
        __name: "ScrollTabDecorator",

        _tabsHost: null,
        _tabsTitlesBar: null,
        _tabsTitlesHost: null,
        _tabsTitlesElement: null,
        _previousScroller: null,
        _nextScroller: null,
        _leftScrollInterval: null,
        _rightScrollInterval: null,
        _offsetPos: "offsetLeft",
        _offsetSize: "offsetWidth",
        _scrollPos: "scrollLeft",
        _scrollStep: 6,
        _scrollToId: 0,
        _refreshScrollersId: 0,

        _position: "top",
        _scrollerPosition: 0,

        _scrollSpeed: 10,
        _scrollClickOnly: false,
        _mouseDownStatus: false,

        /**
         * Initializes the scrollTab object. You need to provide a widget instance which will be instrumented
         * @param widget the widget to handle
         */
        constructor: function(widget) {
          $super.constructor.call(this);
          this._widget = widget;

          if (window.isMobile()) {
            this._widget.addClass("compact");
          }

          this._tabsHost = this._widget.getElement().getElementsByClassName("mt-tabs")[0];
          this._tabsTitlesBar = this._widget.getElement().getElementsByClassName("mt-tab-titles-bar")[0];
          this._tabsTitlesHost = this._widget.getElement().getElementsByClassName("mt-tab-titles")[0];
          this._tabsTitlesElement = this._widget.getElement().getElementsByClassName("mt-tab-titles-container")[0];
          this._previousScroller = this._widget.getElement().getElementsByClassName("mt-tab-previous")[0];
          this._nextScroller = this._widget.getElement().getElementsByClassName("mt-tab-next")[0];

          this._widget.getElement().on("mouseover.FolderWidget", function() {
            this.refreshScrollers();
            this._widget.getElement().off("mouseover.FolderWidget");
          }.bind(this));

          this._previousScroller
            .on("mouseover.FolderWidget", this._beginScrollTabsLeft.bind(this))
            .on("mousedown.FolderWidget", this._beginScrollTabsLeft.bind(this))
            .on("mouseout.FolderWidget", this._endScrollTabsLeft.bind(this))
            .on("mouseup.FolderWidget", this._endScrollTabsLeft.bind(this));

          this._nextScroller
            .on("mouseover.FolderWidget", this._beginScrollTabsRight.bind(this))
            .on("mousedown.FolderWidget", this._beginScrollTabsRight.bind(this))
            .on("mouseup.FolderWidget", this._endScrollTabsRight.bind(this))
            .on("mouseout.FolderWidget", this._endScrollTabsRight.bind(this));

          if (window.isTouchDevice()) {
            if (this._tabsTitlesBar) {
              this._tabsTitlesBar.on("touchstart.scrolltab", this._startTouchScroll.bind(this));
              this._tabsTitlesBar.on("touchend.scrolltab", this._endTouchScroll.bind(this));
              this._tabsTitlesBar.on("touchmove.scrolltab", this._touchMove.bind(this));
            } else if (this._tabsTitlesElement) {
              this._tabsTitlesElement.on("touchstart.scrolltab", this._startTouchScroll.bind(this));
              this._tabsTitlesElement.on("touchend.scrolltab", this._endTouchScroll.bind(this));
              this._tabsTitlesElement.on("touchmove.scrolltab", this._touchMove.bind(this));
            }
          }
          this._scrollSpeed = parseInt(context.ThemeService.getValue("theme-scrollers-speed"), 10);
          this._scrollClickOnly = context.ThemeService.getValue("theme-scrollers-clickonly");
          this._scrollClickOnly = this._scrollClickOnly === true || this._scrollClickOnly === "true";

        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._widget.getElement().off("mouseover.FolderWidget");

          this._previousScroller.off("mouseover.FolderWidget");
          this._previousScroller.off("mousedown.FolderWidget");
          this._previousScroller.off("mouseout.FolderWidget");
          this._previousScroller.off("mouseup.FolderWidget");
          this._nextScroller.off("mouseover.FolderWidget");
          this._nextScroller.off("mousedown.FolderWidget");
          this._nextScroller.off("mouseup.FolderWidget");
          this._nextScroller.off("mouseout.FolderWidget");

          if (this._scrollToId) {
            window.cancelAnimationFrame(this._scrollToId);
            this._scrollToId = 0;
          }
          if (this._refreshScrollersId) {
            window.cancelAnimationFrame(this._refreshScrollersId);
            this._refreshScrollersId = 0;
          }

          this._endScrollTabsLeft();
          this._endScrollTabsRight();

          if (window.isTouchDevice()) {
            if (this._tabsTitlesBar) {
              this._tabsTitlesBar.off("touchstart.scrolltab");
              this._tabsTitlesBar.off("touchend.scrolltab");
              this._tabsTitlesBar.off("touchmove.scrolltab");
            }
            if (this._tabsTitlesElement) {
              this._tabsTitlesElement.off("touchstart.scrolltab");
              this._tabsTitlesElement.off("touchend.scrolltab");
              this._tabsTitlesElement.off("touchmove.scrolltab");
            }
          }
          this._tabsHost = null;
          this._tabsTitlesBar = null;
          this._tabsTitlesHost = null;
          this._tabsTitlesElement = null;
          this._previousScroller = null;
          this._nextScroller = null;
          this._widget = null;
        },

        /**
         * Method to scroll titles to the Left
         * @param event
         * @private
         */
        _beginScrollTabsLeft: function(event) {

          // If click only, quit if event is not a click
          if (this._scrollClickOnly && event.type !== "mousedown") {
            event.preventCancelableDefault();
            event.stopImmediatePropagation();
            event.stopPropagation();
            return;
          }

          // Do the actual scrolling to the left
          var scrollLeft = function(st) {
            var scroll = st._tabsTitlesHost[st._scrollPos];
            if (scroll > 0) {
              st._tabsTitlesHost[st._scrollPos] = scroll = scroll - st._scrollStep;
            }
            if (scroll <= 0) {
              st._previousScroller.removeClass("overflown-previous");
              st._endScrollTabsLeft();
            } else {
              st._previousScroller.addClass("overflown-previous");
            }
            st._nextScroller.toggleClass("overflown-next",
              scroll + st._tabsTitlesHost[st._offsetSize] < st._tabsTitlesElement[st._offsetSize]
            );
          };

          scrollLeft(this);

          // If we keep mouse over the scroller (or clicked), continue scrolling according to the speed
          if (!this._leftScrollInterval) {
            this._leftScrollInterval = window.setInterval(function() {
              scrollLeft(this);
            }.bind(this), this._scrollSpeed);
          }
        },

        /**
         * Clear the scrolling to the left
         * @private
         */
        _endScrollTabsLeft: function() {
          if (this._leftScrollInterval) {
            window.clearInterval(this._leftScrollInterval);
            this._leftScrollInterval = null;
          }
        },

        /**
         * Method to scroll titles to the Right
         * @param event
         * @private
         */
        _beginScrollTabsRight: function(event) {

          if (this._scrollClickOnly && event.type !== "mousedown") {
            event.preventCancelableDefault();
            event.stopImmediatePropagation();
            event.stopPropagation();
            return;
          }

          // Do the actual scrolling to the right
          var scrollRight = function(st) {
            var scroll = st._tabsTitlesHost[st._scrollPos],
              now;
            st._tabsTitlesHost[st._scrollPos] = scroll + st._scrollStep;
            if ((now = st._tabsTitlesHost[st._scrollPos]) <= scroll) {
              st._nextScroller.removeClass("overflown-next");
              st._endScrollTabsRight();
            } else {
              st._nextScroller.addClass("overflown-next");
            }
            st._previousScroller.toggleClass("overflown-previous", now > 0);
          };

          scrollRight(this);

          // If we keep mouse over the scroller (or clicked), continue scrolling according to the speed
          if (!this._rightScrollInterval) {
            this._rightScrollInterval = window.setInterval(function() {
              scrollRight(this);
            }.bind(this), this._scrollSpeed);
          }
        },

        /**
         * Clear the scrolling to the right
         * @private
         */
        _endScrollTabsRight: function() {
          if (this._rightScrollInterval) {
            window.clearInterval(this._rightScrollInterval);
            this._rightScrollInterval = null;
          }
        },

        /**
         * Ensure the display state of the scrolling arrows
         */
        refreshScrollers: function() {
          if (this._refreshScrollersId) {
            window.cancelAnimationFrame(this._refreshScrollersId);
          }
          this._refreshScrollersId = window.requestAnimationFrame(function() {
            this._refreshScrollersId = 0;
            if (this._tabsTitlesHost) {
              var scroll = this._tabsTitlesHost[this._scrollPos];
              this._nextScroller.toggleClass("overflown-next",
                scroll + this._tabsTitlesHost[this._offsetSize] < this._tabsTitlesElement[this._offsetSize]
              );
              this._previousScroller.toggleClass("overflown-previous", scroll > 0);
            }
          }.bind(this));
        },

        /**
         * Display or not the scrollers
         * @param display
         */
        showScroller: function(display) {
          if (display) {
            this._previousScroller.removeClass("vanished");
            this._nextScroller.removeClass("vanished");
          } else {
            this._previousScroller.addClass("vanished");
            this._nextScroller.addClass("vanished");
          }
        },

        /**
         * Scroll the title bar to see the given element
         * @param {classes.PageWidget} element
         */
        scrollTo: function(element) {
          if (this._scrollToId) {
            window.cancelAnimationFrame(this._scrollToId);
          }
          this._scrollToId = window.requestAnimationFrame(function() {
            this._scrollToId = 0;
            if (element) {
              var scroll = this._tabsTitlesHost[this._scrollPos];
              var titleLeft = element[this._offsetPos],
                titleWidth = element[this._offsetSize],
                hostWidth = this._tabsTitlesHost[this._offsetSize],
                deltaLeft = titleLeft - scroll;
              if ((deltaLeft) < 0 || (deltaLeft + titleWidth) > hostWidth) {
                this._tabsTitlesHost[this._scrollPos] = titleLeft;
              }
            }
            this.refreshScrollers();
          }.bind(this));
        },

        /**
         *
         * @param position
         * @private
         */
        _updateOffset: function(position) {
          switch (position) {
            case "top":
            case "bottom":
              this._offsetPos = "offsetLeft";
              this._offsetSize = "offsetWidth";
              this._scrollPos = "scrollLeft";
              this._scrollStep = 6;
              break;
            case "left":
            case "right":
              this._offsetPos = "offsetTop";
              this._offsetSize = "offsetHeight";
              this._scrollPos = "scrollTop";
              this._scrollStep = 2;
              break;
          }
        },

        /**
         * Set the tabs position
         * @param {string} tag - tag of the item
         * @param {string} position - could be top, right, bottom or left
         * @publicdoc
         */
        updatePosition: function(tag, position) {
          this._position = position;
          if (this._tabsHost) {
            this._tabsHost.setAttribute(tag, position);
          }
          if (this._tabsTitlesBar) {
            this._tabsTitlesBar.setAttribute(tag, position);
          }
          if (this._tabsTitlesHost) {
            this._tabsTitlesHost.setAttribute(tag, position);
          }
          if (this._tabsTitlesElement) {
            this._tabsTitlesElement.setAttribute(tag, position);
          }
          if (this._previousScroller) {
            this._previousScroller.setAttribute(tag, position);
          }
          if (this._nextScroller) {
            this._nextScroller.setAttribute(tag, position);
          }

          this._updateOffset(position);
        },

        /**
         Touch / Mobile specific methods
         **/

        /**
         * Handler when a finger touches the screen
         * @param evt
         * @private
         */
        _startTouchScroll: function(evt) {
          var styleAttr = ["top", "bottom"].indexOf(this._position) >= 0 ? "scrollLeft" : "scrollTop";
          this._scrollTouching = true;
          this._scrollTouchingPos = evt.changedTouches[0];
          this._scrollerPosition = this._tabsTitlesHost[styleAttr];
          this._nextScroller.addClass("overflown-next");
          this._previousScroller.addClass("overflown-previous");
          this._preventContainerScrolling(true);
        },

        /**
         * Handler when a finger stop touching the screen
         * @private
         */
        _endTouchScroll: function() {
          this._scrollTouching = false;
          this._scrollTouchingPos = null;
          this._preventContainerScrolling(false);
          this.refreshScrollers();
        },

        /**
         * Moves the scroller as the finger moves on touchscreen
         * @param evt
         * @private
         */
        _touchMove: function(evt) {
          var styleAttr = ["top", "bottom"].indexOf(this._position) >= 0 ? "scrollLeft" : "scrollTop";
          var rectAttr = ["top", "bottom"].indexOf(this._position) >= 0 ? "clientX" : "clientY";
          if (this._scrollTouching) {
            // move to current tabs position minus the drift from touch start to touch current pos
            this._tabsTitlesHost[styleAttr] = this._scrollerPosition - (evt.changedTouches[0][rectAttr] - this._scrollTouchingPos[
              rectAttr]);
          }
        },

        /**
         * Prevent the container to scroll while doing touch to scroll the tab-titles
         * @param {Boolean} prevent - true to prevent it, false otherwise
         * @private
         */
        _preventContainerScrolling: function(prevent) {
          var form = this._widget.getFormWidget();
          if (form) {
            form.getContainerElement().toggleClass("prevent-touch-scroll", prevent);
          }
        }

      };
    });
  });
