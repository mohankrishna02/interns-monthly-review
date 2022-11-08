/// FOURJS_START_COPYRIGHT(D,2016)
/// Property of Four Js*
/// (c) Copyright Four Js 2016, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

/**
 * swaps key/values
 *
 * @param {Object} obj the source object
 * @returns {Object} a newly created object that represents the swapped object
 */
Object.swap = function(obj) {
  var result = {};
  if (obj) {
    for (var property in obj) {
      if (obj.hasOwnProperty(property)) {
        result[obj[property]] = property;
      }
    }
  }
  return result;
};

Object.isString = function(obj) {
  return typeof obj === "string";
};
Object.isNumber = function(obj) {
  return typeof obj === "number";
};
Object.isFunction = function(obj) {
  return typeof obj === "function";
};
Object.isBoolean = function(obj) {
  return obj === true || obj === false;
};

Object.isNaN = function(i) {
  return window.isNaN(i);
};

if (!Object.values) {
  /**
   * IE11 Polyfill
   * @param obj
   * @returns {Array} Array of values
   */
  Object.values = function(obj) {
    return Object.keys(obj).map(function(e) {
      return obj[e];
    });
  };
}

/*
 Object.merge = function(target, source) {
 var keys = Object.keys(source),
 l = keys.length;
 for (var i = 0; i < l; i++) {
 target[keys[i]] = source[keys[i]];
 }
 return target;
 };
 Object.clone = function(obj) {
 return Object.merge({}, obj);
 };
 Object.map = function(obj, map) {
 var result = {},
 keys = Object.keys(obj),
 l = keys.length;
 for (var i = 0; i < l; i++) {
 result[keys[i]] = map(keys[i], obj[keys[i]]);
 }
 return result;
 };*/
