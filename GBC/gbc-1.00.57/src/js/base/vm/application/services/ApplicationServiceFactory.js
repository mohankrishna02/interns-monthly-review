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

modulum('ApplicationServiceFactory', ['Factory'],

  function(context, cls) {
    /**
     * @namespace classes.ApplicationServiceFactory
     */
    cls.ApplicationServiceFactory = context.oo.StaticClass(function() {
      var factory = new cls.Factory("Application Service");
      return /** @lends classes.ApplicationServiceFactory */ {
        /**
         *
         * @param {string} type
         * @param {Function} constructor
         */
        register: function(type, constructor) {
          factory.register(type, constructor);
        },
        /**
         *
         * @param {string} type
         */
        unregister: function(type) {
          factory.unregister(type);
        },
        /**
         *
         * @param {string} type
         * @param {...args} args
         * @returns {classes.ApplicationServiceBase}
         */
        create: function(type, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
          return factory.create(type, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
        }
      };
    });
  });
