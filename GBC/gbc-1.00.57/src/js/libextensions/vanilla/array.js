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

/*jshint -W121 */
Array.prototype.remove = function(item) {
  var i;
  while ((i = this.indexOf(item)) >= 0) {
    this.splice(i, 1);
  }
  return this;
};

/*jshint -W121 */
Array.prototype.removeMatching = function(fn) {
  var i = 0;
  if (fn instanceof Function) {
    while (i < this.length) {
      if (fn(this[i])) {
        this.splice(i, 1);
      } else {
        i++;
      }
    }
  }
  return this;
};

/*jshint -W121 */
Array.prototype.removeAt = function(index) {
  if (index > -1) {
    this.splice(index, 1);
  }
  return this;
};

/*jshint -W121 */
Array.prototype.insert = function(item, index) {
  if (index > -1) {
    this.splice(index, 0, item);
  }
  return this;
};

/*jshint -W121 */
Array.prototype.flatten = function() {
  return this.reduce(function(flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? toFlatten.flatten() : toFlatten);
  }, []);
};

/*jshint -W121 */
Array.prototype.add = function(toAdd, index) {
  this.splice(index, 0, toAdd);
};

if (!Array.prototype.find) {
  /*jshint -W121 */
  Array.prototype.find = function(fn) {
    var i = 0,
      len = this.length;
    for (; i < len; i++) {
      if (fn(this[i], i, this)) {
        return this[i];
      }
    }
    return null;
  };
}
if (!Array.prototype.findIndex) {
  /*jshint -W121 */
  Array.prototype.findIndex = function(fn) {
    var i = 0,
      len = this.length;
    for (; i < len; i++) {
      if (fn(this[i])) {
        return i;
      }
    }
    return -1;
  };
}
if (!Array.prototype.contains) {
  /*jshint -W121 */
  Array.prototype.contains = function(element) {
    return this.indexOf(element) >= 0;
  };
}
if (!Array.from) {
  /*jshint -W121 */
  Array.from = function(arr) {
    return Array.prototype.slice.call(arr, 0);
  };
}
