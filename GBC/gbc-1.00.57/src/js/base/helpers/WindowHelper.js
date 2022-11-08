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

modulum('WindowHelper',
  function(context, cls) {

    /**
     * Helper to use Window
     * @namespace classes.WindowHelper
     */
    cls.WindowHelper = context.oo.StaticClass(function() {
      return /** @lends classes.WindowHelper */ {
        __name: "WindowHelper",
        _opened: [],
        /**
         * open browser window
         * @param url
         * @param once
         * @return {Window}
         */
        openWindow: function(url, once) {
          if (once) {
            if (this._opened.indexOf(url) >= 0) {
              return null;
            }
            this._opened.push(url);
          }
          return window.open(url);
        },
        /**
         * close browser window
         */
        closeWindow: function() {
          window.close();
        }
      };
    });
  });
