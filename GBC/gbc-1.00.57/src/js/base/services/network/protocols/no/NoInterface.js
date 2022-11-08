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

(
  function(context, cls) {

    /**
     *
     * @class NoInterface
     * @memberOf classes
     * @extends classes.ProtocolInterface
     */
    cls.NoInterface = context.oo.Class({
      base: cls.ProtocolInterface
    }, function() {
      return /** @lends classes.NoInterface.prototype */ {
        __name: "NoInterface",
        application: null,
        uaProtocol: null,
        ping: null,
        eventQueue: null,
        eventInterval: null,
        eventIntervalTimeout: 300,
        onFirstGuiReady: null,
        applicationEnding: null,
        taskCount: 0,
        _eventListener: null,
        /**
         * @constructs
         * @param application
         */
        constructor: function(application) {
          this.eventQueue = [];
          this._eventListener = new cls.EventListener();
        },
        start: function() {},
        event: function(events) {
          if (events) {
            if (!Array.isArray(events)) {
              events = [events];
            }
            this.eventQueue = this.eventQueue.concat(events);
            window.clearInterval(this.eventInterval);

            this.eventInterval = window.setInterval(function() {
              if (this.eventQueue.length) {
                this._eventListener.emit("events", this.eventQueue);
                window.clearInterval(this.eventInterval);
              } else {
                window.clearInterval(this.eventInterval);
              }
            }.bind(this), this.eventIntervalTimeout);
          } else {
            window.clearInterval(this.eventInterval);
          }
        },
        newTask: function() {},
        interrupt: function() {},
        close: function() {},
        destroy: function() {},
        waitForNewApp: function(onSuccess, onFailure) {
          onSuccess();
        },

        /**
         * Returns the queued events and clears the event list.
         * @returns {object[]} list of events to send to the VM
         */
        fetchEvents: function() {
          var events = this.eventQueue;
          this.eventQueue = [];
          return events;
        },
        onEvents: function(hook) {
          return this._eventListener.when("events", hook);
        }
      };
    });

  })(gbc, gbc.classes);
