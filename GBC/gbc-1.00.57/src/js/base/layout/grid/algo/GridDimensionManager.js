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
     *
     * slots:             [       ]   [           ]
     * elements (unit): |_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|
     * @class GridDimensionManager
     * @memberOf classes
     */
    cls.GridDimensionManager = context.oo.Class(function() {
      return /** @lends classes.GridDimensionManager.prototype */ {
        __name: "GridDimensionManager",

        /**
         * handle registration for theme change
         * @type {HandleRegistration}
         */
        _themeWatcher: null,

        /**
         * dimension elements
         * @type {classes.GridDimensionElement[]}
         */
        dimensionElements: null,

        /**
         * gutter size (minimal space between elements)
         * @type {number}
         */
        _gutterSize: 0,

        /**
         * empty element size
         * @type {number}
         */
        _emptyElementSize: 0,

        /**
         * will force uniform distribution while stretching
         * @type {boolean}
         */
        _uniformDistribution: false,

        /**
         * slots
         * @type {classes.GridDimensionSlot[]}
         */
        slots: null,

        /**
         * dimension size
         * @type {number}
         */
        _size: 0,

        /**
         * is dimension meant to stretch
         * @type {boolean}
         */
        stretchable: false,

        /**
         * @constructs
         * @param {?boolean} [uniformDistribution] will force uniform distribution while stretching
         */
        constructor: function(uniformDistribution) {
          this._uniformDistribution = Boolean(uniformDistribution);
          this._gutterSize = context.ThemeService.getValue("theme-grid-inner-gutter");
          this._themeWatcher = context.ThemeService.whenThemeChanged(function() {
            this._gutterSize = context.ThemeService.getValue("theme-grid-inner-gutter");
          }.bind(this));
          this.slots = [];
          this.dimensionElements = [];
        },

        /**
         * get the dimension size
         * @return {number} the dimension size
         */
        getSize: function() {
          return this._size;
        },

        /**
         * Get the computed preferred size
         * @param {number} [from] from position (or start)
         * @param {number} [to] to position (or end)
         * @param {boolean} [includeFirstBeforeGap] true to include first before gap
         * @param {boolean} [includeLastAfterGap] true to include last after gap
         * @return {number} the computed preferred size
         */
        getHintSize: function(from, to, includeFirstBeforeGap, includeLastAfterGap) {
          from = Object.isNumber(from) ? from : 0;
          to = Object.isNumber(to) ? to : this._size - 1;
          includeFirstBeforeGap = includeFirstBeforeGap !== false;
          includeLastAfterGap = includeLastAfterGap !== false;

          var total = 0;
          var totalGaps = 0;
          for (var i = from; i <= to; i++) {
            total += this.dimensionElements[i].hintSize;
            totalGaps +=
              ((i !== from || includeFirstBeforeGap) ? this.dimensionElements[i].getBeforeGap() : 0) +
              ((i !== to || includeLastAfterGap) ? this.dimensionElements[i].getAfterGap() : 0);
          }
          if (!total) {
            if (this.getMaxSize() === cls.Size.maximal) {
              total = totalGaps;
            }
          } else {
            total += totalGaps;
          }
          if (includeLastAfterGap && from === 0 && to === (this._size - 1) && total > this._gutterSize) {
            total -= this._gutterSize;
          }
          return total;
        },

        /**
         * Get the computed maximum size
         * @param {number} [from] from position (or start)
         * @param {number} [to] to position (or end)
         * @param {boolean} [includeFirstBeforeGap] true to include first before gap
         * @param {boolean} [includeLastAfterGap] true to include last after gap
         * @return {number} the computed maximum size
         */
        getMaxSize: function(from, to, includeFirstBeforeGap, includeLastAfterGap) {
          from = Object.isNumber(from) ? from : 0;
          to = Object.isNumber(to) ? to : this._size - 1;
          includeFirstBeforeGap = includeFirstBeforeGap !== false;
          includeLastAfterGap = includeLastAfterGap !== false;

          var total = 0;
          for (var i = from; i <= to; i++) {
            total += this.dimensionElements[i].maxSize +
              ((i !== from || includeFirstBeforeGap) ? this.dimensionElements[i].getBeforeGap() : 0) +
              ((i !== to || includeLastAfterGap) ? this.dimensionElements[i].getAfterGap() : 0);
          }
          if (includeLastAfterGap && from === 0 && to === (this._size - 1) && total > this._gutterSize) {
            total -= this._gutterSize;
          }
          return total;
        },

        /**
         * Get the computed minimum size
         * @param {number} [from] from position (or start)
         * @param {number} [to] to position (or end)
         * @param {boolean} [includeFirstBeforeGap] true to include first before gap
         * @param {boolean} [includeLastAfterGap] true to include last after gap
         * @return {number} the computed minimum size
         */
        getMinSize: function(from, to, includeFirstBeforeGap, includeLastAfterGap) {
          from = Object.isNumber(from) ? from : 0;
          to = Object.isNumber(to) ? to : this._size - 1;
          includeFirstBeforeGap = includeFirstBeforeGap !== false;
          includeLastAfterGap = includeLastAfterGap !== false;

          var total = 0;
          for (var i = from; i <= to; i++) {
            total += this.dimensionElements[i].minSize +
              ((i !== from || includeFirstBeforeGap) ? this.dimensionElements[i].getBeforeGap() : 0) +
              ((i !== to || includeLastAfterGap) ? this.dimensionElements[i].getAfterGap() : 0);
          }
          if (includeLastAfterGap && from === 0 && to === (this._size - 1) && total > this._gutterSize) {
            total -= this._gutterSize;
          }
          return Number.isNaN(total) ? 0 : total;
        },
        /**
         * Get the computed size
         * @param {number} [from] from position (or start)
         * @param {number} [to] to position (or end)
         * @param {boolean} [includeFirstBeforeGap] true to include first before gap
         * @param {boolean} [includeLastAfterGap] true to include last after gap
         * @return {number} the computed size
         */
        getCalculatedSize: function(from, to, includeFirstBeforeGap, includeLastAfterGap) {
          from = Object.isNumber(from) ? from : 0;
          to = Object.isNumber(to) ? to : this._size - 1;
          includeFirstBeforeGap = includeFirstBeforeGap !== false;
          includeLastAfterGap = includeLastAfterGap !== false;

          var total = 0;
          for (var i = from; i <= to; i++) {
            total +=
              ((i !== from || includeFirstBeforeGap) ? this.dimensionElements[i].getBeforeGap() : 0) +
              ((this.dimensionElements[i].intrinsicSize + this.dimensionElements[i].bonusSize) || this._emptyElementSize) +
              ((i !== to || includeLastAfterGap) ? this.dimensionElements[i].getAfterGap() : 0);
          }
          if (includeLastAfterGap && from === 0 && to === (this._size - 1) && total > this._gutterSize) {
            total -= this._gutterSize;
          }
          return total;
        },

        /**
         * set a new dimension size
         * @param {number} newSize the new size
         * @param {boolean} [destroyDimensionElements] destroy current dimension elements
         */
        setSize: function(newSize, destroyDimensionElements) {
          var size = this._size;
          if (newSize > size) {
            for (var addingIndex = this.dimensionElements.length; addingIndex < newSize; addingIndex++) {
              this.dimensionElements[addingIndex] = new cls.GridDimensionElement(addingIndex);
            }
          }
          if (destroyDimensionElements) {
            for (var i = newSize; i < this.dimensionElements.length; i++) {
              this.dimensionElements[i].destroy();
            }
            this.dimensionElements.length = newSize;
          }
          this._size = newSize;
        },

        /**
         * Ensure given size
         * @param {number} size the size to ensure
         */
        ensureSize: function(size) {
          if (this.getSize() < size) {
            this.setSize(size);
          }
        },

        /**
         * Set the dimension as stretchable
         * @param stretchable the stretchable state
         */
        setStretchable: function(stretchable) {
          this.stretchable = stretchable;
        },

        /**
         * reset elements
         * @param {boolean} [swipeGaps] true to swipe gaps
         * @param {boolean} [resetIntrinsicSizes] true to reset intrinsic sizes
         */
        resetDimensionSizes: function(swipeGaps, resetIntrinsicSizes) {
          var size = this.getSize();
          for (var i = 0; i < size; i++) {
            this.dimensionElements[i].resetSize(swipeGaps, resetIntrinsicSizes);
          }
        },

        /**
         * Add slot usage on the dimension
         * @param {classes.GridDimensionSlot} slot
         */
        addSlot: function(slot) {
          this.ensureSize(slot.getLastPosition() + 1);
          var insertIndex = 0,
            size = this.slots.length;
          for (; insertIndex < size && this.slots[insertIndex].getPosition() < slot.getPosition();) {
            insertIndex++;
          }
          for (; insertIndex < size && this.slots[insertIndex].getSize() < slot.getSize();) {
            insertIndex++;
          }
          this.slots.add(slot, insertIndex);
          slot.attach(this);
          for (var i = slot.getPosition(); i <= slot.getLastPosition(); i++) {
            this.dimensionElements[i].attach(slot);
          }
        },
        /**
         * Remove slot usage on the dimension
         * @param {classes.GridDimensionSlot} slot
         */
        removeSlot: function(slot) {
          for (var i = slot.getPosition(); i <= slot.getLastPosition(); i++) {
            this.dimensionElements[i].detach(slot);
          }
          slot.detach();
          var index = this.slots.indexOf(slot);
          if (index >= 0) {
            this.slots.splice(index, 1);
          }
          return slot;
        },

        /**
         * update gaps of all elements
         */
        updateGaps: function() {
          var size = this.getSize();
          for (var i = 0; i < size; i++) {
            this.dimensionElements[i].updateGaps();
          }
        },
        /**
         * compute intrinsic sizes (natural measured sizes)
         */
        updateIntrinsicSizes: function() {
          this.resetDimensionSizes(true, true);
          var size = this.slots.length;
          for (var i = 0; i < size; i++) {
            var slot = this.slots[i],
              slotSize = slot.getSize(),
              pos = slot.getPosition(),
              lastPos = slot.getLastPosition();
            if (slot.displayed) {
              var totalGapSizes = this.getGapSizing(pos, lastPos);
              var elementMaxSize = slot.maxSize / slotSize;
              var elementMinSize = slot.minSize / slotSize;

              var lambdaUnitSize = Math.max((slot.desiredMinimalSize - totalGapSizes) / slotSize, elementMinSize);

              for (var position = pos; position <= lastPos; position++) {
                var dimensionElement = this.dimensionElements[position];
                dimensionElement.adjustMinSize(elementMinSize);
                dimensionElement.adjustMaxSize(elementMaxSize);
                dimensionElement.adjustIntrinsicSize(lambdaUnitSize);
              }
            }
          }
        },
        /**
         * adjust elements stretchability and preferred sizes
         */
        updateStretchability: function() {
          var size = this.slots.length;
          for (var i = 0; i < size; i++) {
            var slot = this.slots[i],
              slotSize = slot.getSize(),
              pos = slot.getPosition(),
              lastPos = slot.getLastPosition();
            if (slot.displayed) {
              var totalGapSizes = this.getGapSizing(pos, lastPos);
              var slotHint = (slot.hintSize - totalGapSizes) / slotSize;
              for (var position = pos; position <= lastPos; position++) {
                var dimensionElement = this.dimensionElements[position];
                if (slot.stretchable) {
                  dimensionElement.adjustHintSize(slotHint);
                  dimensionElement.stretchable = true;
                } else {
                  if (!slot.opportunisticStretchable) {
                    dimensionElement.unstretchable++;
                  }
                }
              }
            }
          }
        },

        /**
         * distribute space to remove to slots (when grid needs to stretch)
         * @param sizeToDistribute the total difference to add
         * @return {boolean}
         */
        updateBonusSize: function(sizeToDistribute) {
          var result = false,
            dimensionElement = null,
            i = 0,
            totalWeights = this._getTotalWeights();
          if (totalWeights > 0) {
            var unstretchable = Number.POSITIVE_INFINITY;
            for (i = 0; i < this._size; i++) {
              dimensionElement = this.dimensionElements[i];
              if (dimensionElement.stretchable) {
                unstretchable = Math.min(unstretchable, dimensionElement.unstretchable);
              }
            }

            var totalLocalWeights = 0,
              stretchableElements = [],
              len;
            for (i = 0; i < this._size; i++) {
              dimensionElement = this.dimensionElements[i];
              if (dimensionElement.stretchable && (this._uniformDistribution || (dimensionElement.unstretchable ===
                  unstretchable))) {
                stretchableElements.push(dimensionElement);
                totalLocalWeights += dimensionElement.intrinsicSize;
                dimensionElement.maxBonus = dimensionElement.maxSize - dimensionElement.intrinsicSize;
              }
            }
            stretchableElements.sort(function(a, b) {
              return a.maxBonus > b.maxBonus ? -1 : (a.maxBonus < b.maxBonus ? 1 : 0);
            });
            len = stretchableElements.length;
            for (i = 0; i < len; i++) {
              dimensionElement = stretchableElements[i];
              var delta = sizeToDistribute * (dimensionElement.intrinsicSize / totalLocalWeights);
              dimensionElement.bonusSize = delta;
              sizeToDistribute -= delta;
              totalLocalWeights -= dimensionElement.intrinsicSize;
              result = true;
            }
          } else {
            if (this.stretchable && this._size > 0) {
              for (var e = 0; e < this._size; e++) {
                dimensionElement = this.dimensionElements[e];
                dimensionElement.bonusSize = sizeToDistribute / this._size;
                result = true;
              }
            }
          }
          return result;
        },

        /**
         * distribute space to remove to slots (when grid needs to shrink)
         * @param sizeToDistribute the total difference to remove
         * @return {boolean}
         */
        updateMalusSize: function(sizeToDistribute) {
          var result = false,
            dimensionElement = null,
            i = 0,
            maxMalus = 0,
            totalWeights = this._getTotalWeights();
          if (totalWeights > 0) {
            var unstretchable = Number.POSITIVE_INFINITY;
            for (i = 0; i < this._size; i++) {
              dimensionElement = this.dimensionElements[i];
              if (dimensionElement.stretchable) {
                unstretchable = Math.min(unstretchable, dimensionElement.unstretchable);
              }
            }

            var totalLocalWeights = 0,
              stretchableElements = [],
              len;
            for (i = 0; i < this._size; i++) {
              dimensionElement = this.dimensionElements[i];
              if (dimensionElement.stretchable && (this._uniformDistribution || (dimensionElement.unstretchable ===
                  unstretchable))) {
                stretchableElements.push(dimensionElement);
                totalLocalWeights += dimensionElement.intrinsicSize;
                dimensionElement.maxMalus = dimensionElement.intrinsicSize - dimensionElement.minSize;
              }
            }
            stretchableElements.sort(function(a, b) {
              return a.maxMalus < b.maxMalus ? -1 : (a.maxMalus > b.maxMalus ? 1 : 0);
            });
            len = stretchableElements.length;
            for (i = 0; i < len; i++) {
              dimensionElement = stretchableElements[i];
              var delta = -sizeToDistribute * (dimensionElement.intrinsicSize / totalLocalWeights);
              if (dimensionElement.maxMalus > delta) {
                dimensionElement.bonusSize = -delta;
                sizeToDistribute += delta;
                totalLocalWeights -= dimensionElement.intrinsicSize;
              } else {
                dimensionElement.bonusSize = -dimensionElement.maxMalus;
                sizeToDistribute += dimensionElement.maxMalus;
                totalLocalWeights -= dimensionElement.intrinsicSize;
              }
              result = true;
            }
          } else {
            if (this.stretchable && this._size > 0) {
              for (var e = 0; e < this._size; e++) {
                dimensionElement = this.dimensionElements[e];
                dimensionElement.bonusSize = sizeToDistribute / this._size;
                maxMalus = dimensionElement.intrinsicSize - dimensionElement.minSize;
                if ((-dimensionElement.bonusSize) > maxMalus) {
                  dimensionElement.bonusSize = -maxMalus;
                }
                result = true;
              }
            }
          }
          return result;
        },

        /**
         * compute all slots positions and sizes to apply to css
         * @return {{regularPositions: Array, regular: {}}}
         */
        render: function() {
          var result = {
            regularPositions: [],
            regular: {}
          };
          for (var i = 0; i < this.slots.length; i++) {
            var slot = this.slots[i];
            if (!result.regular[slot.getPosition()]) {
              result.regularPositions.push(slot.getPosition());
              result.regular[slot.getPosition()] = {
                position: this.getCalculatedSize(0, slot.getPosition() - 1, true, true),
                beforeGap: this.dimensionElements[slot.getPosition()].beforeGap,
                regularLengths: [],
                lengths: {},
                lengthsWithGaps: {}
              };
            }
            if (!Object.isNumber(result.regular[slot.getPosition()].lengths[slot.getSize()])) {
              result.regular[slot.getPosition()].regularLengths.push(slot.getSize());
              result.regular[slot.getPosition()].lengths[slot.getSize()] = this.getCalculatedSize(slot.getPosition(), slot
                .getLastPosition(),
                false, false);
              result.regular[slot.getPosition()].lengthsWithGaps[slot.getSize()] = this.getCalculatedSize(slot.getPosition(),
                slot.getLastPosition(),
                true, true);
            }
          }
          return result;
        },

        /**
         * get the total weight that determines how to distribute space
         * @return {number} the total weight in the dimension
         * @private
         */
        _getTotalWeights: function() {
          var result = 0,
            dimensionElement = null,
            unstretchable = Number.POSITIVE_INFINITY;
          for (var i = 0; i < this._size; i++) {
            dimensionElement = this.dimensionElements[i];
            if (dimensionElement.stretchable) {
              unstretchable = Math.min(unstretchable, dimensionElement.unstretchable);
            }
          }
          for (i = 0; i < this._size; i++) {
            dimensionElement = this.dimensionElements[i];
            if (dimensionElement.stretchable && (this._uniformDistribution || (dimensionElement.unstretchable === unstretchable))) {
              result += dimensionElement.intrinsicSize;
            }
          }
          return result;
        },

        /**
         * Get the computed total gap size
         * @param {number} [from] from position (or start)
         * @param {number} [to] to position (or end)
         * @param {boolean} [includeFirstBeforeGap] true to include first before gap
         * @param {boolean} [includeLastAfterGap] true to include last after gap
         * @return {number} the computed total gap size
         */
        getGapSizing: function(from, to, includeFirstBeforeGap, includeLastAfterGap) {
          var total = 0;
          for (var i = from; i <= to; i++) {
            total +=
              ((i !== from || includeFirstBeforeGap) ? this.dimensionElements[i].getBeforeGap() : 0) +
              ((i !== to || includeLastAfterGap) ? this.dimensionElements[i].getAfterGap() : 0);
          }
          return total;
        },

        /**
         * destroy
         */
        destroy: function() {
          if (this._themeWatcher) {
            this._themeWatcher();
            this._themeWatcher = null;
          }
          this.setSize(0, true);
        }
      };
    });
  });
