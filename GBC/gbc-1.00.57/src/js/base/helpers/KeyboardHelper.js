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

modulum('KeyboardHelper',
  function(context, cls) {

    /**
     * Helper functions for keyboard.
     * @namespace classes.KeyboardHelper
     */
    cls.KeyboardHelper = context.oo.StaticClass(function() {
      return /** @lends classes.KeyboardHelper */ {
        __name: "KeyboardHelper",

        /**
         *
         * @param sequence
         * @return {boolean}
         */
        isModifier: function(sequence) {
          return ["ctrl", "shift", "alt", "meta"].indexOf(sequence) !== -1;
        },

        /**
         *
         * @param {string} keyString - string of the key
         * @return {boolean}
         */
        isSpecialCommand: function(keyString) {
          var result = ["home", "end", "left", "right", "up", "down", "del", "backspace"].contains(keyString);
          result = result || (keyString.startsWith("ctrl+") || keyString.startsWith("meta+")) && keyString.indexOf("alt") === -1;
          return result;
        },

        /**
         *
         * @param char
         * @return {boolean}
         */
        isDecimal: function(char) {
          return /^[,.+\-0-9]+$/.test(char);
        },
        /**
         *
         * @param char
         * @return {boolean}
         */
        isNumeric: function(char) {
          return /^\d+$/.test(char);
        },

        /**
         * Check if a string length is equal to 1
         * @param {string} str
         * @returns {boolean}
         */
        isChar: function(str) {
          return str.length === 1;
        },
        /**
         *
         * @param char
         * @return {boolean}
         */
        isLetter: function(char) {
          return /^[A-Za-z\u00C0-\u017F]+$/.test(char); // alphabetic characters + special accent chars
        },

        /**
         * Validate new number with typed char at specified position
         * @param initialValue
         * @param position
         * @param typedChar
         * @param min
         * @param max
         * @returns {boolean}
         */
        validateNumber: function(initialValue, position, typedChar, min, max) {
          var newVal = "";
          if (position === 0) {
            newVal = typedChar + initialValue;
          } else {
            newVal = initialValue.substr(0, position) + typedChar + initialValue.substr(position);
          }
          if (newVal === '-' || newVal === '+') {
            return true;
          } else {
            // TODO what happens if newVal contains ',' shall we not replace ',' by '.' ?
            var newNumber = parseInt(newVal, 10);
            return !isNaN(newVal) && (!max || newNumber <= max);
          }
        },

        /**
         * Convert VM bindings to key combination that we can interpret in a browser
         * @param {string} bindName - vm key to convert to dom key
         * @returns {string} browser key combination
         */
        convertVMKeyToBrowserKey: function(bindName) {
          var key = bindName.toString().toLowerCase();
          if (key === "return") {
            return "enter";
          }
          key = key.replace("prior", "pageup");
          key = key.replace("next", "pagedown");
          key = key.replace("-", "+");
          key = key.replace("control", "mod"); //handle mac keyboard as well
          return key;
        },

        /**
         * Transform key to vmKey
         * @param {string} bindName browserKey
         * @returns {string} vmKey
         */
        convertBrowserKeyToVMKey: function(bindName) {
          var key = (bindName || "");
          key = key.toLowerCase();
          key = key.replace("pageup", "prior");
          key = key.replace("pagedown", "next");
          // Special case where the accelerator is '+'
          if (key.length !== 1) {
            key = key.replace(/\+/g, '-');
          }
          key = key.replace("ctrl", "control");
          key = key.replace("esc", "escape");
          key = key.replace("mod", "control"); //handle mac keyboard as well
          key = key.replace("ins", "insert");
          return key;
        }
      };
    });
  });
