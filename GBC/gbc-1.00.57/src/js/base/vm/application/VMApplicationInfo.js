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
modulum('VMApplicationInfo',
  function(context, cls) {
    /**
     * Stores application general information like VM dialog configuration and parameters.
     * @class VMApplicationInfo
     * @memberOf classes
     */
    cls.VMApplicationInfo = context.oo.Class(function() {
      return /** @lends classes.VMApplicationInfo.prototype */ {
        __name: "VMApplicationInfo",
        /**
         * Application VM dialog mode : 'ua' or 'direct'
         * @type {?string}
         */
        mode: null,
        /**
         * Application identifier
         * @type {?string}
         */
        appId: null,
        /**
         * First front-end identifier (VM dialog)
         * @type {?string}
         */
        frontEndId1: null,
        /**
         * Second front-end identifier (VM dialog)
         * @type {?string}
         */
        frontEndId2: null,
        /**
         * Default time to ping VM (ms)
         * @type {number}
         */
        pingTimeout: 1000,
        /**
         * VM connection info
         * @type {Object}
         */
        connectionInfo: null,
        /**
         * Session identifier in UA dialog
         * @type {?string}
         */
        session: null,
        /**
         * Page number in UA dialog
         * @type {number}
         */
        page: 1,
        /**
         * Aui dialog om order increment
         * @type {number}
         */
        auiOrder: 0,
        /**
         * Default relative path to Web components
         * @type {?string}
         */
        webComponent: null,
        /**
         * User defined relative path to Web components
         * @type {?string}
         */
        webComponentUsrPath: null,
        /**
         * If style browserMultiPage is activated, helps to know where to open the new application
         * @type {boolean}
         */
        inNewWindow: false,
        /**
         *
         * @param {classes.VMApplicationInfo|Object} info - info definition
         */
        constructor: function(info) {
          this.mode = "ua";
          var keys = Object.keys(info);
          for (var k = 0; k < keys.length; k++) {
            this[keys[k]] = info[keys[k]];
          }
          this.ending = null;
        }
      };
    });
  });
