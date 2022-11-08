/// FOURJS_START_COPYRIGHT(D,2017)
/// Property of Four Js*
/// (c) Copyright Four Js 2017, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('ServerHelper',
  function(context, cls) {

    /**
     * Helper for server informations
     * @namespace classes.ServerHelper
     */
    cls.ServerHelper = context.oo.StaticClass(function() {
      return /** @lends classes.ServerHelper */ {
        __name: "ServerHelper",
        verRE: /GAS\/([0-9]+)\.([0-9]+)\.([0-9]+)(-([0-9]+))?/,
        /**
         * is version valid
         * @param ver
         * @return {boolean}
         */
        isValid: function(ver) {
          return this.verRE.test(ver);
        },
        /**
         * compare versions
         * @param a
         * @param b
         * @return {number}
         */
        compare: function(a, b) {
          var pa = this.verRE.exec(a) || [];
          var pb = this.verRE.exec(b) || [];
          for (var i = 0; i < 3; i++) {
            var na = Number(pa[i + 1]);
            var nb = Number(pb[i + 1]);
            if (na > nb) {
              return 1;
            }
            if (nb > na) {
              return -1;
            }
            if (!isNaN(na) && isNaN(nb)) {
              return 1;
            }
            if (isNaN(na) && !isNaN(nb)) {
              return -1;
            }
          }
          return 0;
        }
      };
    });
  });
