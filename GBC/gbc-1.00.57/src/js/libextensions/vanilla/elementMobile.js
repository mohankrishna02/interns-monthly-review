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
(function() {

  /**
   * Handle double tap events
   * @param {string} context gives a namespace to the event
   * @param {Function=} callback
   */
  Element.prototype.onDoubleTap = function(context, callback) {
    if (window.isTouchDevice()) {
      var lastTap = 0;
      this.on('touchstart.doubleTap_' + context, function(eventstart) {
        this.off('touchend.doubleTap_' + context);
        if (eventstart.touches.length <= 1) {
          this.on('touchend.doubleTap_' + context, function(event) {
            var currentTime = new Date().getTime();
            var tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
              // Double Tapped
              callback(event);
              event.preventCancelableDefault();
            }
            lastTap = currentTime;
          });
        }
      });
    }
    return this;
  };

  /**
   * Unregister doubleTap event
   * @param {string} context : namespace of the event to unregister
   */
  Element.prototype.offDoubleTap = function(context) {
    if (window.isTouchDevice()) {
      this.off("touchend.doubleTap_" + context);
    }
  };

  /**
   * Handle swipe events
   * @param {string} context gives a namespace to the event
   * @param {Function} swipeCallback function executed after each successful swipe
   * @param {Object} options
   * @param {Array} options.direction : give direction to listen to: ['left', 'right', 'up', 'down']. By default we will listen to all.
   * @param {number=} options.velocity : minimum velocity (px/ms) that gesture has to obtain to execute callback. Default value is 0.2.
   * @param {number=} options.distance : fraction of swiped distance over element. If swiped distance if higher that provided value
   *      we will always generate a successful swipe even if velocity was very low. Default value is 0.1. (0.1 = 10% of element size as swipe)
   * @param {boolean=} options.debounce : true/false to limit the touchmove call. False by default.
   * @param {Element|Array<Element>} [options.ignore] : if event target of swipe start is one of or a child of one of the given element(s),
   *      we don't consider this move as a swipe
   * @param {Function=} options.startCallback : callback executed on each touchstart/mousedown action. Null by default.
   * @param {Function=} options.moveCallback : callback executed during touchmove/mousemove actions. Take note that this callback will be raised massively and may induce performance issues. Null by default.
   * @param {Function=} options.endCallback : callback executed after each touchend/mouseup action. Null by default.
   */
  Element.prototype.onSwipe = function(context, swipeCallback, options) {
    options = (typeof options === "object") ? options : {};

    // watched swipe directions
    var direction = options.direction ? options.direction : ["left", "right", "up", "down"];
    var watchedDirection = {};
    for (var i = 0; i < direction.length; i++) {
      watchedDirection[direction[i]] = true;
    }
    var _touchStartX = null;
    var _touchStartY = null;
    var _touchStartTime = null;

    var unifyTouchEvent = function(evt) {
      return evt.changedTouches ? evt.changedTouches[0] : evt;
    };

    /** Touch/Mouse Events **/
    // touch/mouse up event callback
    var endSwipe = function(evt) {
      if (!evt.touches || evt.touches.length === 0) { // we don't manage multiples touch

        // on touch/mouse release unbind move/up events
        this.off('mouseup.swipe_' + context);
        this.off('touchend.swipe_' + context);
        this.off('mouseleave.swipe_' + context);
        this.off('touchleave.swipe_' + context);
        if (options.moveCallback) {
          this.off('mousemove.swipe_' + context);
          this.off('touchmove.swipe_' + context);
        }

        var swipedVelocity = 0;
        var swipedFraction = 0;

        if (_touchStartX && _touchStartY && evt) {
          // swipe direction, distance and velocity calculation
          var xUp = unifyTouchEvent(evt).clientX;
          var yUp = unifyTouchEvent(evt).clientY;
          var xDiff = _touchStartX - xUp;
          var yDiff = _touchStartY - yUp;
          var xIndex = Math.sign(xDiff);
          var yIndex = Math.sign(yDiff);

          // Get most significant direction
          var absXMove = Math.abs(xDiff);
          var absYMove = Math.abs(yDiff);
          var isXSwipe = absXMove > absYMove;
          var maxMove = Math.max(absXMove, absYMove);
          if (maxMove > 15) { // exclude micro gestures and clicks from calculation
            var totalDistance = isXSwipe ? this.clientWidth : this.clientHeight;
            swipedFraction = (maxMove / totalDistance).toFixed(2);
          } else if (maxMove > 0) {
            swipedFraction = 0.05;
          }

          var duration = new Date().getTime() - _touchStartTime;
          var velocity = options.velocity ? options.velocity : 0.2;
          var distanceToSwipe = options.distance ? options.distance : 0.1;
          swipedVelocity = maxMove / duration;

          // swipe if minimum velocity of gesture (distance/duration of swipe) or swiped 50% of viewport width
          if (swipedVelocity >= velocity || swipedFraction > distanceToSwipe) {
            swipedFraction = 1 - swipedFraction;
            if (isXSwipe) {
              if (xIndex > 0) {
                /* left swipe */
                if (watchedDirection.left) {
                  swipeCallback("left");
                }
              } else {
                if (watchedDirection.right) {
                  swipeCallback("right");
                }
              }
            } else {
              if (yIndex > 0) {
                if (watchedDirection.up) {
                  swipeCallback("up");
                }
              } else {
                if (watchedDirection.down) {
                  swipeCallback("down");
                }
              }
            }
          }
        }

        if (options.endCallback) {
          options.endCallback(evt, swipedVelocity, swipedFraction);
        }

        // reset values
        _touchStartX = null;
        _touchStartY = null;
        _touchStartTime = null;
      }
    };

    this.offSwipe(context);

    var endHandler = endSwipe;
    // touch/mouse down event callback
    var startSwipe = function(evt) {
      if (options.ignore) {
        if (!Array.isArray(options.ignore)) {
          options.ignore = [options.ignore];
        }
        if (options.ignore.find(function(item) {
            return evt.target && evt.target.isElementOrChildOf(item);
          })) {
          return;
        }
      }
      if (evt.ctrlKey === false && (!evt.touches || evt.touches.length === 1)) {
        // do not swipe if CTRL key pressed and do not add additional bindings if multiple fingers
        if (evt.cancelable) { // prevent text selection
          evt.preventDefault();
        }

        this.on('mouseup.swipe_' + context, endHandler);
        this.on('touchend.swipe_' + context, endHandler);
        this.on('mouseleave.swipe_' + context, endHandler);
        this.on('touchleave.swipe_' + context, endHandler);

        if (options.moveCallback) {
          // touch/mouse move callback
          var moveHandler = function(evt) {
            if (evt.cancelable) { // to avoid browser back native
              evt.preventDefault();
            }
            options.moveCallback(evt, _touchStartX, _touchStartY);
          };
          this.on('mousemove.swipe_' + context, moveHandler);
          this.on('touchmove.swipe_' + context, moveHandler);
        }

        _touchStartX = unifyTouchEvent(evt).clientX;
        _touchStartY = unifyTouchEvent(evt).clientY;
        _touchStartTime = new Date().getTime();
        if (options.startCallback) {
          options.startCallback(evt);
        }
      }
    };

    var startHandler = startSwipe;
    if (options.debounce) {
      startHandler = startSwipe.debounce().bind(this);
      endHandler = endSwipe.debounce().bind(this);
    }
    this.on('mousedown.swipe_' + context, startHandler);
    this.on('touchstart.swipe_' + context, startHandler);
  };

  /**
   * Unregister swipe event
   * @param {string} context : namespace of the event to unregister
   */
  Element.prototype.offSwipe = function(context) {
    this.off('mousemove.swipe_' + context);
    this.off('touchmove.swipe_' + context);
    this.off('mousedown.swipe_' + context);
    this.off('touchstart.swipe_' + context);
    this.off('mouseup.swipe_' + context);
    this.off('touchend.swipe_' + context);
    this.off('mouseleave.swipe_' + context);
    this.off('touchleave.swipe_' + context);
  };

  /**
   * Handle long touch events
   * @param {string} context gives a namespace to the event
   * @param {Function=} callback
   * @param {Object} options
   *    touchDuration : define the duration before triggering the callback
   */
  Element.prototype.onLongTouch = function(context, callback, options) {
    if (window.isTouchDevice()) {
      var touchDuration = (options && options.touchDuration) || 500;
      var preventDefault = (options && options.preventDefault) || true; // TODO Wrong it is always true
      var timer = null;

      this.on('touchstart.longTouch_' + context, function(event) {
        if (preventDefault) {
          event.preventCancelableDefault();
        }
        timer = setTimeout(function() {
          callback(event);
        }.bind(this), touchDuration);
      });

      this.on('touchend.longTouch_' + context, function() {
        if (timer) {
          clearTimeout(timer);
        }
      });
    }
    return this;
  };

  /**
   * Unregister longTouch event
   * @param {string} context : namespace of the event to unregister
   */
  Element.prototype.offLongTouch = function(context) {
    if (window.isTouchDevice()) {
      this.off("touchstart.longTouch_" + context);
      this.off("touchend.longTouch_" + context);
    }
  };

})();
