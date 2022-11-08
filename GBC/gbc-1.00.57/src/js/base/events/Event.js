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

modulum('Event',
  function(context, cls) {
    /**
     * Creates an Event object given a type
     * A property bag used in eventing system
     * @class Event
     * @memberOf classes
     * @publicdoc Base
     */
    cls.Event = context.oo.Class( /** @lends classes.Event.prototype */ {
      __name: "Event",
      cancel: false,
      type: null,
      /**
       * @constructs
       * @param {string} type the event type : actionEvent, configureEvent, keyEvent, functionCallEvent, dragDropEvent, or rowSelectionEvent
       */
      constructor: function(type) {
        this.type = type;
      }
    });
  });
