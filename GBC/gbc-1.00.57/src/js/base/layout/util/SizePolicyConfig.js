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

modulum("SizePolicyConfig", ["SizePolicy"],
  function(context, cls) {
    /**
     * Size Policy Config
     * @class SizePolicyConfig
     * @memberOf classes
     */
    cls.SizePolicyConfig = context.oo.Class(function() {
      return /** @lends classes.SizePolicyConfig.prototype */ {
        __name: "SizePolicyConfig",

        /**
         * @type {classes.SizePolicy}
         */
        fixed: null,
        /**
         * @type {classes.SizePolicy}
         */
        initial: null,
        /**
         * @type {classes.SizePolicy}
         */
        dynamic: null,
        /**
         * @type {string}
         */
        mode: "initial",
        _defaultMode: "initial",
        /**
         * @type {boolean}
         */
        measured: false,
        /**
         *
         */
        constructor: function() {
          this.reset();
        },
        reset: function() {
          this.fixed = cls.SizePolicy.Fixed();
          this.initial = cls.SizePolicy.Initial();
          this.dynamic = cls.SizePolicy.Dynamic();
        },
        needMeasure: function() {
          var status = this.getMode();
          if (status.isFixed()) {
            return !this.measured;
          }
          return !status.isInitialized() || !this.measured;
        },
        setMeasured: function() {
          this.measured = true;
        },
        /**
         * @returns {classes.SizePolicy}
         */
        getMode: function() {
          return this[this.mode] || this.initial;
        },
        /**
         *
         * @param {string} mode
         */
        setMode: function(mode) {
          this.mode = mode || this._defaultMode;
        },

        isInitial: function() {
          return this.mode === "initial";
        },

        isDynamic: function() {
          return this.mode === "dynamic";
        },

        isFixed: function() {
          return this.mode === "fixed";
        }
      };
    });
  });
