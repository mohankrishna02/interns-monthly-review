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

modulum('GridDimensionManager',
  function(context, cls) {
    /**
     * Determine one dimension unit of a grid (e.g. column or line)
     * @class GridDimensionElement
     * @memberOf classes
     */
    cls.GridDimensionElement = context.oo.Class(function() {
      return /** @lends classes.GridDimensionElement.prototype */ {
        __name: "GridDimensionElement",
        /**
         * the position of this dimensionElement
         * @type {number}
         */
        position: 0,

        /**
         * Minimal mandatory size (without gaps) of this dimensionElement
         * @type {number}
         */
        intrinsicSize: 0,

        /**
         * Preferred size (without gaps) of this dimensionElement
         * @type {number}
         */
        hintSize: 0,

        /**
         * Miximal size (without gaps) of this dimensionElement
         * @type {number}
         */
        maxSize: 0,

        /**
         * Minimal size (without gaps) of this dimensionElement
         * @type {number}
         */
        minSize: 0,

        /**
         * Maximum bonus to apply to this dimensionElement
         * @type {number}
         */
        maxBonus: 0,

        /**
         * Maximum malus to apply to this dimensionElement
         * @type {number}
         */
        maxMalus: 0,

        /**
         * Minimal size of gap before this dimensionElement
         * @type {number}
         */
        minimalBeforeGap: 0,
        /**
         * Minimal size of gap after this dimensionElement
         * @type {number}
         */
        minimalAfterGap: 0,
        /**
         * Size amount that is eventually added to the intrinsicSize
         * @type {number}
         */
        bonusSize: 0,
        /**
         * Actual size of gap before this dimensionElement
         * @type {number}
         */
        beforeGap: 0,
        /**
         * Actual size of gap after this dimensionElement
         * @type {number}
         */
        afterGap: 0,
        /**
         * list of slots that starts on this dimensionElement
         * @type {classes.GridDimensionSlot[]}
         */
        slots: null,
        /**
         * Actual extra size of gap before this dimensionElement
         * @type {number}
         */
        extraBeforeGap: 0,
        /**
         * Actual extra size of gap after this dimensionElement
         * @type {number}
         */
        extraAfterGap: 0,
        /**
         * Incremental index to count number of unstretchable slots on this dimensionElement
         * @type {number}
         */
        unstretchable: 0,
        /**
         * Whether os not this dimensionElement is stretchable (i.e. one of its slots is)
         * @type {boolean}
         */
        stretchable: false,

        /**
         * @constructs
         * @param {number} position position of this dimensionElement
         */
        constructor: function(position) {
          this.position = position;
          this.slots = [];
        },
        /**
         * reset all information of this dimensionElement
         * @param {boolean} [swipeGaps] true to swipe gaps
         * @param {boolean} [resetIntrinsicSize] true to reset intrinsic size
         */
        resetSize: function(swipeGaps, resetIntrinsicSize) {
          this.unstretchable = 0;
          this.stretchable = false;
          this.bonusSize = 0;
          this.maxBonus = 0;
          this.maxMalus = 0;
          if (resetIntrinsicSize) {
            this.intrinsicSize = 0;
            this.hintSize = 0;
            this.maxSize = 0;
            this.minSize = 0;
          }
          if (swipeGaps) {
            this.resetGaps();
            this.updateGaps();
          }
        },
        /**
         * reset gaps
         */
        resetGaps: function() {
          this.beforeGap = 0;
          this.minimalBeforeGap = 0;
          this.afterGap = 0;
          this.minimalAfterGap = 0;
        },
        /**
         * Find out whether or not grid would render
         * @return {boolean} true if will render
         * @private
         */
        _shouldRender: function() {
          var i = 0,
            len = this.slots.length;
          for (; i < len; i++) {
            if (this.slots[i].displayed) {
              return true;
            }
          }
          return false;
        },

        /**
         * Get the total gap before this dimensionElement
         * @return {number} the total gap before this dimensionElement
         */
        getBeforeGap: function() {
          return this._shouldRender() ? this.beforeGap + this.extraBeforeGap : 0;
        },

        /**
         * Get the total gap after this dimensionElement
         * @return {number} the total gap after this dimensionElement
         */
        getAfterGap: function() {
          return this._shouldRender() ? this.afterGap + this.extraAfterGap : 0;
        },
        /**
         * Get the computed total size of this dimensionElement
         * @param {boolean} [withBeforeGap] add total before gap
         * @param {boolean} [withAfterGap] add total after gap
         * @return {number} the computed total size of this dimensionElement
         */
        getSize: function(withBeforeGap, withAfterGap) {
          return this.intrinsicSize + this.bonusSize + (withBeforeGap ? this.beforeGap + this.extraBeforeGap : 0) + (
            withAfterGap ? this.afterGap + this.extraAfterGap : 0);
        },

        /**
         * attach a slot to this dimensionElement
         * @param {classes.GridDimensionSlot} slot slot to attach
         */
        attach: function(slot) {
          var insertIndex = 0,
            size = this.slots.length,
            slotSize = slot.getSize();
          for (; insertIndex < size && this.slots[insertIndex].getSize() < slotSize;) {
            insertIndex++;
          }
          this.slots.add(slot, insertIndex);
          this.updateGaps();
        },

        /**
         * detach a slot from this dimensionElement
         * @param {classes.GridDimensionSlot} slot slot to detach
         */
        detach: function(slot) {
          var index = this.slots.indexOf(slot);
          if (index >= 0) {
            this.slots.splice(index, 1);
          }
          this.updateGaps();
        },

        /**
         * update the gaps depending on attached slots
         */
        updateGaps: function() {
          this.resetGaps();
          this.extraBeforeGap = 0;
          this.extraAfterGap = 0;
          var i = 0,
            len = this.slots.length;
          for (; i < len; i++) {
            var slot = this.slots[i];
            if (slot.displayed && slot.getPosition() === this.position) {
              this.extraBeforeGap = Math.max(this.extraBeforeGap, slot.extraBeforeGap);
              this.beforeGap = this.minimalBeforeGap = Math.max(this.minimalBeforeGap, slot.minimalBeforeGap);
            }
            if (slot.displayed && slot.getLastPosition() === this.position) {
              this.extraAfterGap = Math.max(this.extraAfterGap, slot.extraAfterGap);
              this.afterGap = this.minimalAfterGap = Math.max(this.minimalAfterGap, slot.minimalAfterGap);
            }
          }
        },

        /**
         * adjust the intrinsic size given a new size
         * @param size new size to manage
         */
        adjustIntrinsicSize: function(size) {
          this.intrinsicSize = Math.max(this.intrinsicSize, size);
        },

        /**
         * adjust the preferred size given a new size
         * @param size new size to manage
         */
        adjustHintSize: function(size) {
          this.hintSize = Math.max(this.hintSize, size);
        },

        /**
         * adjust the maximal size given a new size
         * @param size new size to manage
         */
        adjustMaxSize: function(size) {
          if (this.maxSize !== cls.Size.maximal) {
            this.maxSize = size === cls.Size.maximal || this.maxSize === 0 ? size : Math.min(this.maxSize, size);
          }
        },

        /**
         * adjust the minimal size given a new size
         * @param size new size to manage
         */
        adjustMinSize: function(size) {
          this.minSize = Math.max(this.minSize, size);
        },

        /**
         * destroy all slots
         */
        destroy: function() {
          while (this.slots.length) {
            this.slots.pop().destroy();
          }
        }
      };
    });
  });
