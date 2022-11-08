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

// jshint ignore:start
String.prototype.getBytesCount = function() {
  var log = Math.log(256);
  var total = 0;
  for (var i = 0; i < this.length; i++) {
    var charCode = this.charCodeAt(i);
    total += Math.ceil(Math.log(charCode) / log);
  }
  return total;
};

// Replace char at index
String.prototype.replaceAt = function(index, character) {
  return this.substr(0, index) + character + this.substr(index + character.length);
};
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(search, this_len) {
    if (this_len === undefined || this_len > this.length) {
      this_len = this.length;
    }
    return this.substring(this_len - search.length, this_len) === search;
  };
}

if (!String.prototype.trim) {
  String.prototype.trim = function() {
    return this.replace(/^\s+/, "").replace(/\s+$/, "");
  };
}

String.prototype.capitalize = function() {
  return this.substr(0, 1).toUpperCase() + this.substr(1).toLowerCase();
};

if (!String.prototype.repeat) {
  String.prototype.repeat = function(count) {
    var total = Math.floor(Number(count));
    if (total > 0) {
      return new Array(total + 1).join(this);
    } else {
      return "";
    }
  };
}

var ESC_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

// escape most problematic html chars from the string
String.prototype.escapeHTML = function() {
  return this.replace(/[&<>'"]/g, function(c) {
    return ESC_MAP[c];
  });
};

// jshint ignore:end
