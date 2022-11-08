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

modulum('Factory', ['LogService'],
  function(context, cls) {
    /**
     * @memberOf classes
     * @class Factory
     * @template T
     * @memberOf classes
     */
    cls.Factory = context.oo.Class(function() {
      return /** @lends classes.Factory.prototype */ {
        __name: "Factory",
        _default: null,
        _fabrics: null,
        _topic: "",
        /**
         * @constructs
         * @param {string} topic
         * @param {?function=} defaultConstructor
         */
        constructor: function(topic, defaultConstructor) {
          this._topic = topic;
          this._default = defaultConstructor || null;
          this._fabrics = {};
        },
        /**
         *
         * @param {?function=} constructor
         */
        setDefault: function(constructor) {
          this._default = constructor;
        },
        /**
         *
         * @param {string} id
         * @param {function} constructor
         */
        register: function(id, constructor) {
          if (this._fabrics[id]) {
            context.LogService.debug("Factory (" + this._topic + ") already registered : " + id);
          }
          if (typeof(constructor) === "function") {
            this._fabrics[id] = constructor;
          }
        },
        /**
         *
         * @param {string} id
         */
        unregister: function(id) {
          this._fabrics[id] = null;
        },
        /**
         *
         * @param {string} id
         */
        has: function(id) {
          return Boolean(this._fabrics[id]);
        },
        /**
         *
         * @param {string} id
         * @returns {T}
         */
        create: function(id, arg1, arg2, arg3, arg4, arg5) {
          var Fabric = this._fabrics[id] || this._default;
          if (Fabric) {
            return new Fabric(arg1, arg2, arg3, arg4, arg5);
          }
          context.LogService.debug("Factory (" + this._topic + ") not found : " + id);
          return null;
        }
      };
    });
  });
