/// FOURJS_START_COPYRIGHT(D,2014)
/// Property of Four Js*
/// (c) Copyright Four Js 2014, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('ControllerFactory', ['Factory'],
  function(context, cls) {
    /**
     * @namespace classes.ControllerFactory
     */
    cls.ControllerFactory = context.oo.StaticClass(function() {
      /**
       *
       * @type {classes.Factory}
       */
      var factory = new cls.Factory("Controller");
      return /** @lends classes.ControllerFactory */ {
        /**
         *
         * @param {string} id
         * @param {Function} constructor
         */
        register: function(id, constructor) {
          factory.register(id, constructor);
        },
        /**
         *
         * @param {string} id
         */
        unregister: function(id) {
          factory.unregister(id);
        },
        /**
         *
         * @param {string} id
         * @returns {classes.ControllerBase}
         */
        create: function(id, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
          return factory.create(id, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
        }
      };
    });
  });
