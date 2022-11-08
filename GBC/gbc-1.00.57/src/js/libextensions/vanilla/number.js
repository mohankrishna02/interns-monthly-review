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

/*
 ** Function decodeInteger
 **
 ** Decode an integer in Big-Endian binary notation
 ** and store it into a JavaScript native integer.
 **
 ** Truncate the value parameter if longer than 4 bytes.
 **
 ** String value: the integer in BE binary notation
 ** returns int: the integer in JavaScript native integer
 */
Number.decodeInteger = function(value) {
  if (value.length > 4) {
    value = value.substring(0, 4);
  }
  var ret = "";
  for (var i = 0; i < value.length; ++i) {
    var hex = value.charCodeAt(i).toString(16);
    if (hex.length < 2) {
      hex = "0" + hex;
    }
    ret += hex;
  }
  value = parseInt(ret, 16);
  return value;
};

/*
 ** Function encodeInteger
 **
 ** Encode a JavaScript native integer and store it
 ** into an integer in Big-Endian binary notation.
 **
 ** Truncate the value parameter if longer than 4 bytes.
 ** (the VM protocol's header only handles 4 bytes integer)
 **
 ** int value: the integer in JavaScript native integer
 ** returns String: the integer in BE binary notation
 */
Number.encodeInteger = function(value) {
  value = value.toString(16);
  if (value.length > 8) {
    value = value.substring(value.length - 8, value.length);
  } else if (value.length < 8) {
    while (value.length < 8) {
      value = "0" + value;
    }
  }
  var valueArr = value.match(/.{2}/g);
  for (var i = 0; i < valueArr.length; ++i) {
    valueArr[i] = String.fromCharCode(parseInt(valueArr[i], 16));
  }
  value = valueArr.join("");
  return value;
};

Number.isNaN = Number.isNaN || window.isNaN;

/*jshint -W121 */
Number.prototype.pad = function(total) {
  var len = total - this.toString().length,
    result = [];
  for (var i = 0; i < len; i++) {
    result[i] = "0";
  }
  result[i] = this;
  return result.join("");
};

Number.compare = function(a, b) {
  if (a === b) {
    return 0;
  }
  if (a < b) {
    return -1;
  }
  return 1;
};
