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

/**
 * @typedef {Function} Hook
 * @param {classes.Event} event event object
 * @param {Object} src event emitter
 * @param {...any} additional data
 */
/**
 * @typedef {Function} HandleRegistration
 */

modulum('EventListener', ['Event'],
  function(context, cls) {
    //// debug list unregistered listeners
    //  window.reged = {};
    /**
     * A base class to support eventing
     * @class EventListener
     * @memberOf classes
     * @publicdoc Base
     */
    cls.EventListener = context.oo.Class(function() {
      return /** @lends classes.EventListener.prototype */ {
        /**
         * Literal class name.
         * @type {string}
         * @protected
         */
        __name: "EventListener",

        /**
         * Registered events
         * @type {Map.<string, Array<number>>}
         * @protected
         */
        _events: null,

        /**
         * Handlers for asynchroneous calls
         * @type Array<*>
         * @protected
         */
        _asyncHandlers: null,

        /**
         * Indicates if object has been destroyed
         * @type {boolean}
         * @protected
         */
        _destroyed: false,

        /**
         * @constructs
         */
        constructor: function() {
          this._events = new Map();
          this._asyncHandlers = [];
        },

        /**
         * Destroy the object and free memory
         */
        destroy: function() {
          if (!this._destroyed && this._events) {
            this._destroyed = true;
            this._events.clear();
            this._events = null;
            this._clearAllAsyncCalls();
            this._asyncHandlers = null;
          } else {
            context.LogService.warn("Trying to destroy a destroyed Object " + this.__name);
          }
        },

        /**
         * Returns if the node is destroyed
         * @return {boolean} true if node is destroyed
         * @publicdoc
         */
        isDestroyed: function() {
          return this._destroyed;
        },

        /**
         * Emit an event
         * @param {string} type event type to emit
         * @param {...any} arguments - arguments (excluding type) will be set in event.data
         * @publicdoc
         */
        emit: function(type, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
          if (this._events) {
            var handlers = this._events.get(type);
            if (handlers && handlers.length) {
              var event = new cls.Event(type);
              event.data = [arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9];
              var list = handlers.slice(),
                len = list.length;
              for (var i = 0; i < len; i++) {
                var handler = list[i];
                if (handler && !event.cancel) {
                  handler.call(this, event, this, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
                }
              }
            }
          }
        },

        /**
         * Registers a handler for this event type
         * @param {string} type - event type (e.g. "attribute changed")
         * @param {Hook} handler - handler to trigger when the event type is emitted
         * @param {boolean=} once - if true, will only fire once
         * @returns {HandleRegistration} a registration handle (for unbind purpose)
         * @publicdoc
         */
        when: function(type, handler, once) {
          if (this._destroyed) {
            context.LogService.warn("EventListener - Trying to register an event from a destroyed Object: " + type);
            return Function.noop;
          }
          var handlers = this._events.get(type);
          if (!handlers) {
            handlers = [];
            this._events.set(type, handlers);
          }
          var hdlr = handler;
          if (once) {
            hdlr = function(event, src, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
              this._off(type, hdlr);
              handler.call(this, event, src, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
            }.bind(this);
          }
          handlers.push(hdlr);
          return this._off.bind(this, type, hdlr);
        },

        /**
         * Checks if an event handler has been registered for the given type
         * @param {string} type - event type
         * @return {boolean} true if an event handler has been registered for the given type, false otherwise
         */
        hasEventListeners: function(type) {
          if (this._events) {
            var handlers = this._events.get(type);
            return Boolean(handlers) && handlers.length;
          }
          return false;
        },

        /**
         * Removes an event
         * @param {string} type event type to remove
         * @param {number} handler - event handler id
         * @private
         */
        _off: function(type, handler) {
          //// debug list unregistered listeners
          // if (window.reged[type] && window.reged[type][this.__name]) {
          //   window.reged[type][this.__name]--;
          //   if (!window.reged[type][this.__name]) {
          //     delete window.reged[type][this.__name];
          //   }
          //   if (!Object.keys(window.reged[type]).length) {
          //     delete window.reged[type];
          //
          //   }
          // } else {
          //   console.warn("could not _off event", type, this.__name);
          // }
          if (!this._destroyed) {
            var handlers = this._events.get(type);
            if (handlers) {
              var pos = handlers.indexOf(handler);
              if (pos === -1) {
                gbc.error("We are trying to destroy the wrong event listener ! Please check " + this.__name + " " + type +
                  " event listener bindings and definitions in the project and customizations");
              } else {
                handlers.splice(pos, 1);
                if (handlers.length === 0) {
                  this._events.delete(type);
                }
              }
            } else {
              gbc.error(this.__name + " " + type +
                " event listener has already been destroyed previously. We shouldn't try to remove it again. Please check references and calls of this event listener."
              );
            }
          }
        },

        /**
         * Create a handler of timeout
         * @param {function} callback - function to execute after given time
         * @param {number} time - time in ms before execution
         * @return {number} - handler
         * @protected
         */
        _registerTimeout: function(callback, time) {
          var timeout = {
            type: "timeout"
          };
          this._asyncHandlers.push(timeout);
          var id = window.setTimeout(function() {
            this._asyncHandlers.remove(timeout);
            callback();
          }.bind(this), time);
          timeout.id = id;
          return id;
        },

        /**
         * Create a handler for requestAnimationFrame
         * @param {function} callback - function to execute after the animation frame
         * @return {number} - handler
         * @protected
         */
        _registerAnimationFrame: function(callback) {
          var requestAnimationFrame = {
            type: "requestAnimationFrame"
          };
          this._asyncHandlers.push(requestAnimationFrame);
          var id = window.requestAnimationFrame(function() {
            this._asyncHandlers.remove(requestAnimationFrame);
            callback();
          }.bind(this));
          requestAnimationFrame.id = id;

          return id;
        },

        _clearTimeout: function(id) {
          if (this._asyncHandlers) {
            this._asyncHandlers.removeMatching(function(handler) {
              return handler.type === "timeout" && handler.id === id;
            });
          }
          window.clearTimeout(id);
        },

        _clearAnimationFrame: function(id) {
          if (this._asyncHandlers) {
            this._asyncHandlers.removeMatching(function(handler) {
              return handler.type === "requestAnimationFrame" && handler.id === id;
            });
          }
          window.cancelAnimationFrame(id);
        },

        /**
         * Clear all asynchroneous calls
         * @private
         */
        _clearAllAsyncCalls: function() {
          if (this._asyncHandlers && this._asyncHandlers.length > 0) {
            this._asyncHandlers.forEach(function(handler) {
              if (handler.type === "timeout") {
                window.clearTimeout(handler.id);
              }
              if (handler.type === "requestAnimationFrame") {
                window.cancelAnimationFrame(handler.id);
              }
            });
            this._asyncHandlers = [];
          }
        },
      };
    });
  });
