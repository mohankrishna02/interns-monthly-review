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

modulum('GridDimensionSlot',
  function(context, cls) {
    /**
     *
     * @class GridDimensionSlot
     * @memberOf classes
     */
    cls.GridDimensionSlot = context.oo.Class(function() {
      return /** @lends classes.GridDimensionSlot.prototype */ {
        __name: "GridDimensionSlot",

        /**
         * handle registration for theme change
         * @type {HandleRegistration}
         */
        _themeWatcher: null,

        /**
         * default minimal gap to apply before this slot
         * @type {number}
         */
        defaultMinimalBeforeGap: 0,

        /**
         * default minimal gap to apply after this slot
         * @type {number}
         */
        defaultMinimalAfterGap: 0,

        /**
         * starting position of the slot
         * @type {number}
         */
        position: 0,

        /**
         * slot size
         * @type {number}
         */
        size: 0,

        /**
         * Desired slot size (calculated in pixels from raw width/height hint)
         * @type {number}
         */
        desiredMinimalSize: 0,

        /**
         * Minimal slot size
         * @type {number}
         */
        minSize: 0,

        /**
         * Maximal slot size
         * @type {number}
         */
        maxSize: 0,

        /**
         * Preferred slot size
         * @type {number}
         */
        hintSize: 0,

        /**
         * Owner
         * @type {classes.GridDimensionManager}
         */
        dimensionManager: null,

        /**
         * minimal gap to apply before this slot
         * @type {number}
         */
        minimalBeforeGap: 0,

        /**
         * minimal gap to apply after this slot
         * @type {number}
         */
        minimalAfterGap: 0,

        /**
         * extra gap to apply before this slot
         * @type {number}
         */
        extraBeforeGap: 0,

        /**
         * extra gap to apply after this slot
         * @type {number}
         */
        extraAfterGap: 0,

        /**
         * is this slot stretchable?
         * @type {boolean}
         */
        stretchable: false,

        /**
         * is this slot opportunistic stretchable?
         * (e.g. will only stretch if some other slot sharing dimension elements stretches)
         * @type {boolean}
         */
        opportunisticStretchable: false,

        /**
         * is this slot displayed?
         * @type {boolean}
         */
        displayed: true,
        /**
         * @constructs
         * @param {number} position the position
         * @param {number} size the size
         */
        constructor: function(position, size) {
          this.position = position;
          this.size = size;
          this.defaultMinimalAfterGap = context.ThemeService.getValue("theme-grid-inner-gutter");
          this.minimalAfterGap = context.ThemeService.getValue("theme-grid-inner-gutter");
        },

        /**
         * reset the slot
         * @param {number} position the new position
         * @param {number} size the new size
         * @return {classes.GridDimensionSlot} this
         */
        reset: function(position, size) {
          this.position = position;
          this.size = size;
          return this;
        },

        /**
         * get the first position of the slot
         * @return {number} the first position of the slot
         */
        getPosition: function() {
          return this.position;
        },
        /**
         * get the last position of the slot
         * @return {number} the last position of the slot
         */
        getLastPosition: function() {
          return this.position + this.size - 1;
        },

        /**
         * get the size of the slot
         * @return {number} the size of the slot
         */
        getSize: function() {
          return this.size;
        },

        /**
         * set the desired minimal size
         * @param {number} desiredMinimalSize calculated in pixels from raw width/height hint
         */
        setDesiredMinimalSize: function(desiredMinimalSize) {
          this.desiredMinimalSize = desiredMinimalSize || 0;
        },

        /**
         * Set the slot as stretchable
         * @param stretchable stretchable value
         */
        setStretchable: function(stretchable) {
          this.stretchable = stretchable;
        },

        /**
         * Set the slot as opportunistic stretchable
         * @param stretchable stretchable value
         */
        setOpportunisticStretchable: function(stretchable) {
          this.opportunisticStretchable = stretchable;
        },

        /**
         * Set maximal size
         * @param maxSize maximal size
         */
        setMaxSize: function(maxSize) {
          this.maxSize = maxSize;
        },

        /**
         * Set minimal size
         * @param minSize minimal size
         */
        setMinSize: function(minSize) {
          this.minSize = minSize;
        },

        /**
         * Set preferred size
         * @param hintSize preferred size
         */
        setHintSize: function(hintSize) {
          this.hintSize = hintSize;
        },

        /**
         * Set displayed state
         * @param displayed displayed state
         */
        setDisplayed: function(displayed) {
          this.displayed = displayed;
        },

        /**
         * set minimum gap before the slot
         * @param {number} value the minimum gap before the slot
         */
        setMinimumBeforeGap: function(value) {
          if (Object.isNumber(value)) {
            this.minimalBeforeGap = value;
          } else {
            this.minimalBeforeGap = this.defaultMinimalBeforeGap;
          }
        },

        /**
         * set minimum gap after the slot
         * @param {number} value the minimum gap after the slot
         */
        setMinimumAfterGap: function(value) {
          if (Object.isNumber(value)) {
            this.minimalAfterGap = value;
          } else {
            this.minimalAfterGap = this.defaultMinimalAfterGap;
          }
        },
        /**
         * attach to dimension manager
         * @param {classes.GridDimensionManager} dimensionManager dimension manager
         */
        attach: function(dimensionManager) {
          this.dimensionManager = dimensionManager;
          if (this._themeWatcher) {
            this._themeWatcher();
          }
          this._themeWatcher = context.ThemeService.whenThemeChanged(function() {
            this.defaultMinimalAfterGap = context.ThemeService.getValue("theme-grid-inner-gutter");
            this.minimalAfterGap = context.ThemeService.getValue("theme-grid-inner-gutter");
          }.bind(this));
        },

        /**
         * detach from dimension manager
         */
        detach: function() {
          if (this._themeWatcher) {
            this._themeWatcher();
            this._themeWatcher = null;
          }
          this.dimensionManager = null;
        },

        /**
         * destroy
         */
        destroy: function() {
          if (this._themeWatcher) {
            this._themeWatcher();
            this._themeWatcher = null;
          }
          this.dimensionManager = null;
        }
      };
    });
  });
