/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

/*jshint -W121 */
Event.prototype.preventCancelableDefault = function() {
  if (typeof this.cancelable !== 'boolean' || this.cancelable) {
    // The event can be canceled, so we do so.
    this.preventDefault();
  } else {
    // The event cannot be canceled, so it is not safe
    // to call preventDefault() on it.
    console.warn("Event couldn't be canceled");
    //console.dir(this);
  }
};

// TODO should be gbcPreventDefault
Event.prototype.gbcDontPreventDefault = null;

// When an event is not created by GBC (ex for Webcomponents) some functions must be defined in the event.
/*jshint -W121 */
Event.prototype.normalizeEventForGBC = function(event) {
  if (!event.preventCancelableDefault) {
    event.preventCancelableDefault = Event.prototype.preventCancelableDefault;
  }
};
