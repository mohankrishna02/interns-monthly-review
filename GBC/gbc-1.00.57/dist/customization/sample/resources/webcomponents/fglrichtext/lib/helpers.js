/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2019. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
///
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

/**
 * Browser information
 */
(function() {
  window.browserInfo = {
    isFirefox: false,
    isEdge: false,
    isIE: false,
    isChrome: false,
    isOpera: false,
    isSafari: false
  };

  var sUsrAg = window.navigator.userAgent;

  if (sUsrAg.indexOf("Edge") > -1) {
    window.browserInfo.isEdge = true;
  } else if (sUsrAg.indexOf("Chrome") > -1) {
    window.browserInfo.isChrome = true;
  } else if (sUsrAg.indexOf("Safari") > -1) {
    window.browserInfo.isSafari = true;
  } else if (sUsrAg.indexOf("Opera") > -1) {
    window.browserInfo.isOpera = true;
  } else if (sUsrAg.indexOf("Firefox") > -1) {
    window.browserInfo.isFirefox = true;
  } else if (sUsrAg.indexOf("MSIE") > -1 || sUsrAg.indexOf("Trident") > -1) {
    window.browserInfo.isIE = true;
  }
})();

/**
 * Check if an element has a class
 * @param {string} cssClass - class to check
 * @return {boolean} - true if element has the given class, false otherwise
 */
Element.prototype.hasClass = function(cssClass) {
  if ((window.browserInfo.isIE || window.browserInfo.isEdge) && this instanceof SVGElement) {
    return (this.getAttribute("class") || "").split(" ").indexOf(cssClass) >= 0;
  } else {
    return this.classList.contains(cssClass);
  }
};

/**
 * Generate an array of pixel size between two bounds
 * @param {Number} from - left bound
 * @param {Number} to - right bound
 * @return {Array} - The array of pixels: ['1px', '2px', ...]
 */
function generateFontSizes(from,to) {
  var list=[];
  for(var i=from;i<=to;i++){
    list.push(i+"px");
  }
  return list;
}

var classedEventRE = /([^.]+)+(\..+)?/;

/**
 * Add event to an element
 * @param {string} type - domEvent, like click, wheel etc.
 * @param {string=} subFilter - use a sub-element instead of this
 * @param {Function} callback - return
 */
Element.prototype.on = function(type, subFilter, callback) {
  this._registeredEvents = this._registeredEvents || {};
  var supportsPassiveEvents = !window.browserInfo.isIE && !window.browserInfo.isEdge;
  var t = classedEventRE.exec(type || ""),
      event = t && t[1],
      passive = (event === "wheel" || event === "touchstart" || event === "touchmove") && supportsPassiveEvents,
      eventClass = t && t[2];
  if (!!event) {
    var registered = (this._registeredEvents[event] = this._registeredEvents[event] || {
      __default: []
    });
    var cb;
    if (!callback) {
      cb = subFilter;
    } else {
      cb = function(ev) {
        if (!subFilter || this.querySelectorAll(subFilter).contains(ev.target) ||
            this.querySelectorAll(subFilter + " *").contains(ev.target)) {
          callback(ev);
        }
      }.bind(this);
    }
    (registered[eventClass || "__default"] = registered[eventClass || "__default"] || []).push(cb);
    this.addEventListener(event, cb, passive ? {
      passive: true
    } : false);
  }
  return this;
};

/**
 * Unegister event to an element
 * @param {string} type - name of the event to unsubscribe
 */
Element.prototype.off = function(type) {
  this._registeredEvents = this._registeredEvents || {};
  var t = classedEventRE.exec(type || "") || [],
      event = t[1],
      eventClass = t[2];
  if (!!event) {
    var registered = this._registeredEvents[event];
    if (!!eventClass) {
      if (!!registered && !!registered[eventClass]) {
        while (registered[eventClass].length) {
          this.removeEventListener(event, registered[eventClass].pop());
        }
      }
    } else {
      var keys = Object.keys(registered);
      for (var i = 0; i < keys.length; i++) {
        while (registered[keys[i]].length) {
          this.removeEventListener(event, registered[keys[i]].pop());
        }
      }
    }
  }
  return this;
};

/**
 * Generate a pseudo-unique id for each richtext
 * @return {string} : the uuid
 */
function uuid() {
  return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


/**
 * Normalize key
 * @param {string} key
 * @returns {string}
 */
var normalizeKey = function (key) {
  var normalizedKey = key.toLowerCase();

  if (normalizedKey.indexOf("up")>=0){
    normalizedKey = "up";
  }
  else if (normalizedKey.indexOf("down")>=0){
    normalizedKey = "down";
  }
  else if (normalizedKey.indexOf("left")>=0){
    normalizedKey = "left";
  }
  else if (normalizedKey.indexOf("right")>=0){
    normalizedKey = "right";
  }

  return normalizedKey;
};

/**
 * Get the combination of keys (modifiers included) being typed
 * @param event
 * @returns {string} returns normalized keys combination
 */
var translateKeys= function(event) {
  var ctrlKey = event.ctrlKey;
  var altKey = event.altKey;
  var shiftKey = event.shiftKey;
  var metaKey = event.metaKey;
  var keys = "";
  if (metaKey) {
    keys += "meta";
  }
  // use that order : ctrl+shift+alt
  if (ctrlKey) {
    if (keys.length !== 0) {
      keys += '+';
    }
    keys += "ctrl";
  }
  if (altKey) {
    if (keys.length !== 0) {
      keys += '+';
    }
    keys += "alt";
  }
  if (shiftKey) {
    if (keys.length !== 0) {
      keys += '+';
    }
    keys += "shift";
  }

  //Check if key is a basic modifier (ctrl, shift, alt)
  if(['shift', 'ctrl', 'alt', 'meta', 'dead'].indexOf(event.key.toLowerCase())<0){
    if (keys.length !== 0) {
      keys += '+';
    }
    keys += normalizeKey(event.key);//normalizedKey
  }

  return keys.toLowerCase(); // return any combi in lowercase
};


/**
 * Copy an object like Object.assign, but IE compliant
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
var copyObject = function (target, varArg1, varArg2) {
  if (varArg2 === void 0) { varArg2 = null; }
  if (target === null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  var to = Object(target);
  for (var index = 1; index < arguments.length; index++) {
    var nextSource = arguments[index];
    if (nextSource !== null) {
      for (var nextKey in nextSource) {
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
  }
  return to;
};