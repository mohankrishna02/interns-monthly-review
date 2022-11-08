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

/**
 * Return true if mobile browser, false otherwise
 * @returns bool if the browser is mobile
 */
/* jshint ignore:start */
window.isMobile = function() {
  var testExp = new RegExp('Android|iPhone|iPad|iPod|GMI|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile|webOS', 'i');
  // window.orientation works well but is deprecated. So we use additional check.
  return typeof window.orientation !== "undefined" || testExp.test(navigator.userAgent) === true;
};

window.isPhone = function() {
  if (window.isMobile()) {
    return Math.min(window.screen.width, window.screen.height) < 768;
  }
  return false;
};

window.isTablet = function() {
  if (window.isMobile()) {
    return Math.min(window.screen.width, window.screen.height) >= 768;
  }
  return false;
};

window.isAndroid = function() {
  var testExp = new RegExp('Android', 'i');
  // window.orientation works well but is deprecated. So we use additional check.
  return typeof window.orientation !== "undefined" && testExp.test(navigator.userAgent) === true;
};

window.isIOS = function() {
  var testExp = new RegExp('iPhone|iPad|iPod|GMI', 'i');
  // window.orientation works well but is deprecated. So we use additional check.
  return typeof window.orientation !== "undefined" && testExp.test(navigator.userAgent) === true;
};

window.isTouchDevice = function() {
  return "ontouchstart" in document.documentElement || 'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
};

/* jshint ignore:end */
window.offset = function(elt) {
  var rect = elt[0].getBoundingClientRect();
  return {
    left: Math.round(rect.left),
    top: Math.round(rect.top),
    centerX: Math.round(rect.left + rect.width / 2),
    centerY: Math.round(rect.top + rect.height / 2)
  };
};

/**
 * Check if capslock is on
 * @param {domEvent} e - event emitted on keydown
 * @return {boolean} true if capsLock is on, false otherwise
 */
window.isCapslock = function(e) {
  if (e.which === 20) {
    // toggle capsLock state when the key is CapsLock
    this._capsLock = !this._capsLock;
  } else if (e && e.getModifierState) {
    // Otherwise get the caps modifier of the key
    this._capsLock = e.getModifierState("CapsLock") || (e.which === 20 && !e.getModifierState("CapsLock"));
  }
  return this._capsLock;
};

/**
 * Test if a string is a valid URL
 *
 * @returns {boolean}
 */
window.isValidURL = function(str) {
  var pattern = new RegExp("((http|https)(:\/\/))?([a-zA-Z0-9]+[.]){2}[a-zA-z0-9]+(\/[a-zA-Z0-9]+)*\/?", "i");
  return pattern.test(str);
};

/**
 * Check if url has a parameter with corresponding value
 * @param {string} url - url to check parameter on
 * @param {string} param - parameter
 * @param {string} value - value of parameter
 * @returns {boolean} true if parameter with corresponding value has been found in url
 */
window.hasParameterValue = function(url, param, value) {
  var queryString = (param + "=" + value).toLowerCase();
  // extract url parameters only
  var start = url.lastIndexOf("?") + 1;
  var end = url.lastIndexOf("#"); // manage optional hash section located at the end of the url
  if (end < start) {
    end = url.length;
  }
  var variables = url.substring(start, end).toLowerCase().split("&"); // get array of parameters
  for (var i = 0; i < variables.length; i++) {
    if (variables[i] === queryString) {
      return true;
    }
  }
  return false;
};

/**
 * Check if url has the parameter set as active (1 value)
 * @param {string?} url - optional. If unset, we look by default for current browser url
 * @param {string} param - parameter name to check
 * @returns {boolean} true if parameter is set and enabled in url
 */
window.isURLParameterEnabled = function(url, param) {
  if (param === undefined) {
    param = url;
    url = window.location.search;
  }
  return window.hasParameterValue(url, param, "1");
};

/**
 * Check if url has the parameter set as inactive (0 value)
 * @param {string?} url - optional. If unset, we look by default for current browser url
 * @param {string} param - parameter name to check
 * @returns {boolean} true if parameter is set and disabled in url
 */
window.isURLParameterDisabled = function(url, param) {
  if (param === undefined) {
    param = url;
    url = window.location.search;
  }
  return window.hasParameterValue(url, param, "0");
};

window.isOrientationImplemented = typeof window.orientation !== "undefined";

(function(window) {
  window.waitMax = function(timeout, trigger, event, fallback) {
    var time = 0;
    var itv = window.setInterval(function() {
      if (trigger()) {
        window.clearInterval(itv);
        event();
      } else {
        time += 50;
        if (time > timeout) {
          window.clearInterval(itv);
          (fallback || event)();
        }
      }
    }, 50);
  };
})(window);
(function() {
  window.browserInfo = {
    isFirefox: false,
    isEdge: false,
    isIE: false,
    isChrome: false,
    isOpera: false,
    isSafari: false,
    isAndroid: false,
    isIOS: false
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
  if (window.isAndroid()) {
    window.browserInfo.isAndroid = true;
  }
  if (window.isIOS()) {
    window.browserInfo.isIOS = true;
  }
})();

// Compute ScrollBar size
(function() {
  var div = document.createElement('div');
  div.style.width = "50px";
  div.style.height = "50px";
  div.style.overflowY = "scroll";
  div.style.position = "absolute";
  div.style.top = "-200px";
  div.style.left = "-200px";
  div.innerHTML = '<div style="height:100px;width:100%"></div>';

  document.body.appendChild(div);
  var w1 = div.offsetWidth;
  var w2 = div.children[0].offsetWidth;
  document.body.removeChild(div);

  window.scrollBarSize = w1 - w2;
})();

/**
 * Convert image to base64
 * @param {String} src
 * @param {Function} callback
 * @param {String} outputFormat - image/png, image/jpeg
 */
window.toDataURL = function(src, callback, outputFormat) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    // Resize the canvas to the original image dimensions
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
    canvas = null;
  };
  img.src = src;
  // Make sure the load event fires for cached images too
  if (img.complete || img.complete === undefined) {
    // Flush cache
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    // Try again
    img.src = src;
  }
};
