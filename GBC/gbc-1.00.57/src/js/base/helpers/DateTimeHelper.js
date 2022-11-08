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

modulum('DateTimeHelper',
  function(context, cls) {

    /**
     * Helpers for time related widgets.
     * @namespace classes.DateTimeHelper
     */
    cls.DateTimeHelper = context.oo.StaticClass(function() {
      return /** @lends classes.DateTimeHelper */ {
        __name: "DateTimeHelper",

        /**
         * Transform Informix DBDATE Format (ex : MDY4/) to traditional format
         * @param dbformat
         */
        parseDbDateFormat: function(dbformat) {
          // supported DBDATE separators are '-', '/', '.' and '0'. Default is '/'. '0' means no separator
          var sep = dbformat.match(/[.\/\-0]/) || '/';
          sep = sep.toString();
          if (sep === '0') {
            sep = "";
          }
          var format = "";
          for (var i = 0; i < 4; i++) {
            var c = dbformat[i];
            // add separator & duplicate char if 'D' or 'M'. if 'Y', multiply by its next number.
            format += (i !== 0 ? sep : "") + new Array((c === "Y" ? ~~dbformat[++i] : 2) + 1).join(c);
          }
          return format;
        },

        /**
         * Convert Date time to Locale format
         * @param datetimestring
         * @param format
         * @return {*}
         */
        toDbDateFormat: function(datetimestring, format) {
          // Deprecated by MomentJs but needed for Safari. Using new Date('ISO string') raise invalid date on Safari.
          var localDateTime = context.moment(datetimestring);
          // Date object may be valid under Chrome and invalid for other browsers with incomplete date values such as "dd mm" format
          if (localDateTime.isValid()) {
            return localDateTime.format(format);
          } else {
            return datetimestring;
          }
        },

        /**
         * Convert Date time to ISO format
         * @param datetimestring
         * @param format
         * @returns {*|string}
         */
        toISOFormat: function(datetimestring, format) {
          var currentISODateTime = "";
          if (datetimestring) {
            var d = context.moment(datetimestring, format);
            if (!d.isValid()) {
              return datetimestring;
            }
            var hasSec = Boolean(~format.toLowerCase().indexOf("s"));
            currentISODateTime = d.format("YYYY-MM-DD " + (hasSec ? "HH:mm:ss" : "HH:mm"));
          }
          return currentISODateTime;
        },

        /**
         * Convert Date time to Locale format
         * @param datetimestring
         * @param seconds
         * @returns {string}
         */
        toLocaleFormat: function(datetimestring, seconds) {
          var localDateTime = context.moment(datetimestring);
          if (localDateTime.isValid()) {
            return localDateTime.format("L") + " " + localDateTime.format((seconds ? "LTS" : "LT"));
          } else {
            return datetimestring;
          }
        },

        /**
         * Get client locale format
         * @param seconds
         * @returns {string}
         */
        getLocaleFormat: function(seconds) {
          var localData = context.moment.localeData();
          return localData.longDateFormat("L") + " " + localData.longDateFormat((seconds ? "LTS" : "LT"));
        },

        /**
         * Get client locale format
         * @param seconds
         * @returns {string}
         */
        getISOFormat: function(seconds) {
          return "YYYY-MM-DD HH:mm" + (seconds ? ":ss" : "");
        },

        /**
         * Builds a time fragment handling object.
         * Ex: For minutes: group(60) increments from 0 to 59 and wraps.
         * @param {number} highLimit upper limit
         * @returns {{fromText: Function, increaseValue: Function, decreaseValue: Function, getText: Function}}
         */
        timeFragment: function(highLimit) {
          var limit = highLimit;
          var maxChars = String(highLimit).length;
          var value = 0;
          return {
            /**
             * @param {string} text
             * @param {boolean} force
             * @ignore
             * @returns {boolean}
             */
            fromText: function(text, force) {
              if (!text) {
                return false;
              }
              var isComplete = true;
              var intValue = parseInt(text, 10);

              if (isNaN(intValue)) {
                value = 0;
              } else {
                if (text.length > maxChars) {
                  value = limit - 1;
                } else if (text.length === maxChars) {
                  if (intValue >= limit) {
                    value = limit - 1;
                  } else {
                    value = intValue;
                  }
                } else {
                  /*if ((intValue * 10) >= limit || force) {
                    value = intValue;
                  } else {*/
                  isComplete = false;
                  //}
                }

              }
              return isComplete;
            },
            /**
             * @ignore
             * @returns {boolean} true if the value has wrapped.
             */
            increaseValue: function() {
              if ((value + 1) === limit) {
                value = 0;
                return true;
              } else {
                value++;
                return false;
              }
            },
            /**
             * @ignore
             * @returns {boolean} true if the value has wrapped
             */
            decreaseValue: function() {
              if (value === 0) {
                value = limit - 1;
                return true;
              } else {
                value--;
                return false;
              }
            },
            /**
             * @ignore
             * @returns {string} the current value
             */
            getText: function() {
              return value.pad(2);
            }
          };
        },

        /**
         * Convert traditional year of date to Ming guo year format
         * @param {string} datestring
         * @returns {string} return ming guo year
         */
        mingGuoToGregorianYears: function(datestring) {
          var str = datestring.match(/\d{3}/);
          if (str) {
            var year = str.toString();
            return datestring.replace(year, "" + (~~year + 1911));
          } else {
            return datestring;
          }
        },

        gregorianToMingGuoYears: function(date) {
          return date.getFullYear() - 1911;
        }
      };
    });
  });
