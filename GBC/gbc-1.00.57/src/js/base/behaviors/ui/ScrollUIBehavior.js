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

modulum('ScrollUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class ScrollUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.ScrollUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.ScrollUIBehavior.prototype */ {
        __name: "ScrollUIBehavior",

        _throttleTimeout: 180,
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          controller.requestOffsetPending = false;
          var widget = controller.getWidget();
          if (widget) {
            data.scrollHandle = widget.when(context.constants.widgetEvents.scroll, this._onScroll.bind(this, controller, data));

            if (controller.nativeVerticalScroll) {
              widget.getScrollableArea().on('wheel.ScrollUIBehavior', this._preventWhenRequestOffsetPending.bind(this, controller));
              widget.getScrollableArea().on('scroll.ScrollUIBehavior', this._preventWhenRequestOffsetPending.bind(this,
                controller));
            } else { // no need to handle these events if widget use native scrolling
              data.mousewheelHandle = widget.when(context.constants.widgetEvents.mousewheel, this._onMousewheel.bind(this,
                controller,
                data));
              data.touchMoveHandle = widget.when(context.constants.widgetEvents.touchMove, this._onTouchMove.bind(this, controller,
                data));
              data.touchStartHandle = widget.when(context.constants.widgetEvents.touchStart, this._onTouchStart.bind(this,
                controller,
                data));
              data.touchEndHandle = widget.when(context.constants.widgetEvents.touchEnd, this._onTouchEnd.bind(this, controller,
                data));
            }
          }
          data.requestedOffset = null;
        },

        /**
         *
         * @param controller
         * @param {Object} event - DOM event
         * @private
         */
        _preventWhenRequestOffsetPending: function(controller, event) {
          // for perf, prevent default when a requestoffset is pending
          if (controller.requestOffsetPending) {
            event.stopPropagation();
            event.stopImmediatePropagation();
          }
        },
        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.throttleScroll) {
            window.clearTimeout(data.throttleScroll);
            data.throttleScroll = null;
          }

          if (data.scrollHandle) {
            data.scrollHandle();
            data.scrollHandle = null;
          }
          if (data.mousewheelHandle) {
            data.mousewheelHandle();
            data.mousewheelHandle = null;
          }
          if (data.touchMoveHandle) {
            data.touchMoveHandle();
            data.touchMoveHandle = null;
          }
          if (data.touchStartHandle) {
            data.touchStartHandle();
            data.touchStartHandle = null;
          }
          if (data.touchEndHandle) {
            data.touchEndHandle();
            data.touchEndHandle = null;
          }

          var widget = controller.getWidget();
          if (widget && controller.nativeVerticalScroll) {
            widget.getScrollableArea().off('wheel.ScrollUIBehavior');
            widget.getScrollableArea().off('scroll.ScrollUIBehavior');
          }
        },

        /**
         *
         * @param controller
         * @param data
         * @param e
         * @return {boolean}
         * @private
         */
        _onScroll: function(controller, data, e) {
          var widget = controller.getWidget();
          if (!widget.isEnabled()) {
            var event = e.data[0];
            return true;
          } else {
            data.lateEvent = e;
            this._updateScrollData(controller, data);
            var size = controller.getAnchorNode().attribute("size");
            var pageSize = Math.max(controller.getAnchorNode().attribute("pageSize"), 1);

            // if requestedOffset === + or === size send directly offset request, no need to post
            if (data.requestedOffset === 0 || data.requestedOffset === (size - pageSize)) {
              this.requestOffset(controller, data);
            } else {
              this._postRequest(controller, data);
            }

          }
        },

        _updateScrollData: function(controller, data) {
          var scrollData = data.lateEvent;
          var forceOffset = scrollData.data[0].forceOffset; // case of scrollbar widget
          if (forceOffset) {
            data.requestedOffset = forceOffset;
          } else {
            var scrollTop = scrollData.data[0].target.scrollTop;
            var lineHeight = scrollData.data[1] ? scrollData.data[1] : 1; //prevent division by 0
            if (controller.nativeVerticalScroll) {
              data.requestedOffset = Math.floor(scrollTop / lineHeight);
            } else { // case in not the same because if we don't use native scroll, first line is always entirely visible
              data.requestedOffset = Math.round(scrollTop / lineHeight);
            }

            var size = controller.getAnchorNode().attribute("size");
            var pageSize = Math.max(controller.getAnchorNode().attribute("pageSize"), 1);
            // request offset must not be greater than (size - pageSize)
            data.requestedOffset = Math.min(data.requestedOffset, Math.abs(size - pageSize));
          }
        },

        /**
         *
         * @param controller
         * @param data
         * @param e
         * @return {boolean}
         * @private
         */
        _onMousewheel: function(controller, data, e) {
          var widget = controller.getWidget();
          var event = e.data[0];
          if (!widget.isEnabled()) {
            event.stopImmediatePropagation();
            return false;
          } else {
            //event.preventCancelableDefault(); // Not allowed since passive:true
            //throttle events...
            if (data.requestedOffset === null) {
              data.requestedOffset = controller.getAnchorNode().attribute("offset");
            }
            var original = data.requestedOffset;
            var delta = (window.browserInfo.isFirefox ? (53 / 3) : 1) * event.deltaY;

            var size = controller.getAnchorNode().attribute("size");
            var pageSize = Math.max(controller.getAnchorNode().attribute("pageSize"), 1);

            data.requestedOffset += Math.round(delta / 16);
            data.requestedOffset = Math.max(0, Math.min(data.requestedOffset, size - pageSize));

            if (original !== data.requestedOffset) {
              this._postRequest(controller, data);
            }
          }
        },

        /**
         *
         * @param controller
         * @param data
         * @param e
         * @return {boolean}
         * @private
         */
        _onTouchMove: function(controller, data, e) {
          // Don't do anything if the VM offset order is pending
          if (!controller.requestOffsetPending) {
            var widget = controller.getWidget();
            var event = e.data[0];
            if (!widget.isEnabled()) {
              event.stopImmediatePropagation();
              return false;
            } else {
              //throttle events...
              if (data.requestedOffset === null) {
                data.requestedOffset = controller.getAnchorNode().attribute("offset");
              }
              var original = data.requestedOffset;

              if (this._initialTouchPos && event.touches[0]) {
                var deltaY = event.touches[0].clientY;
                var deltaX = event.touches[0].clientX;

                // If scrolling verticaly : continue, horizontaly: do nothing
                if (Math.abs(this._initialTouchPos.x - deltaX) < Math.abs(this._initialTouchPos.y - deltaY)) {
                  var delta = (window.browserInfo.isFirefox ? (53 / 3) : 1) * deltaY;

                  var size = controller.getAnchorNode().attribute("size");
                  var pageSize = Math.max(controller.getAnchorNode().attribute("pageSize"), 1);

                  var move = this._initialTouchPos.y - delta;
                  delta = Math.sign(move) * delta / 8;

                  data.requestedOffset += Math.round(delta / 16);
                  data.requestedOffset = Math.max(0, Math.min(data.requestedOffset, size - pageSize));

                  if (original !== data.requestedOffset) {
                    this._postRequest(controller, data);
                  }
                }
              }
            }
          }

        },

        /**
         *
         * @param controller
         * @param data
         * @param e
         * @private
         */
        _onTouchStart: function(controller, data, e) {
          var event = e.data[0];
          this._initialTouchPos = {
            x: event.touches[0] ? event.touches[0].clientX : 0,
            y: event.touches[0] ? event.touches[0].clientY : 0
          };
        },
        /**
         *
         * @param controller
         * @param data
         * @param e
         * @private
         */
        _onTouchEnd: function(controller, data, e) {
          //this._initialTouchPos = {x:0,y:0};
        },

        /**
         *
         * @param controller
         * @param data
         * @private
         */
        _postRequest: function(controller, data) {
          if (!data.throttleScroll) {
            data.throttleScroll = window.setTimeout(function(controller, data) {
              this.requestOffset(controller, data);
            }.bind(this, controller, data), this._throttleTimeout);
          }
          return this;
        },

        /**
         * Ask the VM for offset
         * @param controller
         * @param data
         */
        requestOffset: function(controller, data) {
          var anchorNode = controller && controller.getAnchorNode();
          if (!anchorNode) {
            return;
          }
          var widget = controller.getWidget();
          if (!widget) {
            return;
          }

          // before requestOffset (clear current throttle timeout)
          window.clearTimeout(data.throttleScroll);
          data.throttleScroll = null;

          // if a request is already pending, post it
          if (controller.requestOffsetPending) {
            this._postRequest(controller, data);
            return;
          }

          if (data.lateEvent) {
            this._updateScrollData(controller, data);
            data.lateEvent = null;
          }

          var typeahead = anchorNode.getApplication() && anchorNode.getApplication().typeahead;
          if (!typeahead.hasFinished()) {
            this._postRequest(controller, data);
            return;
          }

          var node = controller.getAnchorNode();
          var app = node.getApplication();
          if (node.attribute("offset") !== data.requestedOffset) {

            controller.sendWidgetValue();
            if (app.getFocusedVMNode() === node) {
              widget.setFocus();
            }

            controller.requestOffsetPending = true;
            app.typeahead.scroll(node, data.requestedOffset);
            widget.setOffset(data.requestedOffset);
            widget.lastSentOffset = data.requestedOffset;
          }

          data.lateEvent = null;
          data.requestedOffset = null;
        },
      };
    });
  });
