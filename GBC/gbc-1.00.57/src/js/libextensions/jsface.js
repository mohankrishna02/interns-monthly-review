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

(function(context) {
  var nativeJsface = context.jsface;
  var noop = function() {};

  /**
   * @typedef {Function} ClassFunctor
   * @param {Object.<string, function|*>} $super
   */

  /**
   * ### __jsface override__
   * adds some new features:
   *
   * * introduce $super keyword
   * * ability to declare mixins in class definition
   *
   * See {@link augmentedFace.Class} to create classes
   * @namespace window.augmentedFace
   */
  context.augmentedFace = /** @lends window.augmentedFace */ {
    /**
     * Creates a class
     * @example
     * // Simple class, no inheritance
     * var MyClass = augmentedFace.Class({
     *   myMethod : function(){
     *     this.myMember = 1;
     *   }
     * });
     * @example
     * // Simple class, inherits from MyClass, overrides myMethod
     * augmentedFace.Class(MyClass, {
     *   myMethod : function(){
     *     this.myMember = 2;
     *   }
     * });
     * @example
     * // Simple class, inherits from MyClass, calls superclass' myMethod
     * augmentedFace.Class(MyClass, function($super){
     *   return {
     *     myMethod : function(){
     *       this.myMember = 2;
     *     }
     *   };
     * });
     * @method Class
     * @param {ClassFunctor|Object|number} [params]
     * if *params* is omitted, the defined class will not have a superclass
     * @param {ClassFunctor|Object|number} api
     * if *api* is omitted, the *params* parameter will be used as api description
     * The *api* parameter can be:
     * * an object, describing the different members of the class
     * * a function, that will return an object as above desciption, but with the ability to inject *$super* accessor
     * @param {?boolean=} _checkMembers internal flag
     * @returns {Function} the constructed class
     */
    Class: function(params, api, _checkMembers) {
      var parent = 0,
        inheritance = [],
        ascendance = [];
      if (!api) {
        api = params;
        params = 0;
      }
      switch (typeof params) {
        case "function":
          parent = params;
          break;
        case "object":
          parent = params.base || 0;
          break;
        default:
          break;
      }

      var $super = {
        constructor: parent || noop
      };

      if (parent) {
        var memberKeys = Object.keys(parent.prototype);
        for (var k = 0; k < memberKeys.length; k++) {
          var methodName = memberKeys[k];
          var method = parent.prototype[methodName];
          if (typeof method === "function") {
            $super[methodName] = method;
          } else if (methodName === "__name") {
            $super.__name = method;
          } else if (methodName === "__ascendance") {
            ascendance = method.slice();
          } else if (methodName === "__inheritance") {
            inheritance = method.slice();
            inheritance.push($super.__name);
          }
        }
      }

      api = (typeof api === "function" ? api($super) : api) || {};
      if (!api.__name && ascendance.indexOf("WidgetBase") >= 0) {
        throw api;
      }
      if (!api.__virtual) {
        ascendance.push(api.__name);
      }
      if (ascendance.indexOf("WidgetBase") >= 0) {
        this._widgetSpecificApi(api, ascendance);
      }
      api.__inheritance = inheritance;
      api.isInstanceOf = function(type) {
        return Boolean(type) &&
          Boolean(type.prototype) &&
          type.prototype.__name === this.__name ||
          this.__inheritance.indexOf(type.prototype.__name) >= 0;
      };
      if (!api.hasOwnProperty("constructor")) {
        api.constructor =
          function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            $super.constructor.call(this, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
          };
      }
      if (_checkMembers !== false) {
        this._checkMembers(api);
      }

      return nativeJsface.Class(parent, api);
    },
    _widgetSpecificApi: function(api, ascendance) {
      if (api.__ignoreInheritance) {
        api.__ascendance = ["WidgetBase"];
        if (!api.__virtual) {
          api.__ascendance.push(api.__name);
        }
      } else {
        api.__ascendance = ascendance;
      }
      api.__ascendanceClasses = ascendance.map(function(item) {
        return "gbc_" + item;
      }).join(" ");
    },
    _checkMembers: function(api) {
      Object.keys(api).forEach(function(mk) {
        switch (mk) {
          case "__inheritance":
          case "__ascendance":
          case "usedStyleAttributes":
          case "__dataContentPlaceholderSelector":
          case "watchedAttributes":
          case "$static":
            return;
          default:
            break;
        }
        switch (typeof api[mk]) {
          case "function":
          case "string":
          case "number":
          case "boolean":
            return;
          case "object":
            if (api[mk] === null) {
              return;
            }
            break;
          default:
            break;
        }
        console.warn("class definition issue, member seems shared", api.__name, mk, typeof api[mk]);
      });
    },

    /**
     * Creates a single instance of a class
     * @method Singleton
     * @param {ClassFunctor|Object|number} [params]
     * if *params* is omitted, the defined class will not have a superclass
     * @param {ClassFunctor|Object|number} api
     * if *api* is omitted, the *params* parameter will be used as api description
     * The *api* parameter can be:
     *
     * * an object, describing the different members of the class
     * * a function, that will return an object as above desciption, but with the ability to inject *$super* accessor
     * @returns {*} the constructed instance
     */
    Singleton: function(params, api) {
      var SingletonClass = this.Class(params, api, false);
      SingletonClass.prototype.__unique = true;
      return new SingletonClass();
    },

    /**
     * Creates a static class. Should not be instantiated
     * @method StaticClass
     * @param {ClassFunctor|Object|number} [params]
     * if *params* is omitted, the defined class will not have a superclass
     * @param {ClassFunctor|Object|number} api
     * if *api* is omitted, the *params* parameter will be used as api description
     * The *api* parameter can be:
     * * an object, describing the different members of the class
     * * a function, that will return an object as above desciption, but with the ability to inject *$super* accessor
     * @returns {*} the constructed class
     */
    StaticClass: function(params, api) {
      if (!api) {
        api = params;
        params = 0;
      }
      if (api) {
        if (typeof api === "function") {
          var originalApi = api;
          api = function($super) {
            var result = originalApi($super);
            if (result) {
              result.$singleton = true;
            }
            return result;
          };
        } else {
          api.$singleton = true;
        }
      }
      return this.Class(params, api, false);
    }
  };
})(window);
