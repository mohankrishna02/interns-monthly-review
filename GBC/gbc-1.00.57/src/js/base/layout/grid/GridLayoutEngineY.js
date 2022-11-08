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

modulum('GridLayoutEngineY',
  function(context, cls) {
    /**
     * @class GridLayoutEngineY
     * @memberOf classes
     */
    cls.GridLayoutEngineY = context.oo.Class(
      /** @lends classes.GridLayoutEngineY.prototype */
      {
        __name: "GridLayoutEngineY",
        /**
         * @type {classes.WidgetBase}
         */
        _widget: null,

        /**
         * @type classes.GridDimensionManager
         */
        dimensionManager: null,

        /**
         *
         * @param {classes.WidgetBase} widget
         */
        constructor: function(widget) {
          this._widget = widget;
          this.dimensionManager = new cls.GridDimensionManager();
        },
        destroy: function() {
          this.dimensionManager.destroy();
          this.dimensionManager = null;
          this._widget = null;
        },

        /**
         *
         * @param {classes.GridDimensionSlot} slot
         * @returns {classes.GridDimensionSlot} the same slot
         */
        registerSlot: function(slot) {
          this.dimensionManager.addSlot(slot);
          return slot;
        },

        /**
         *
         * @param {classes.GridDimensionSlot} slot
         */
        unregisterSlot: function(slot) {
          return this.dimensionManager.removeSlot(slot);
        },

        setStretchable: function(stretchable) {
          this.dimensionManager.setStretchable(stretchable);
        },

        /**
         *
         * @param {number} heightToDistribute
         * @returns {boolean}
         */
        doStretch: function(heightToDistribute) {
          return this.dimensionManager.updateBonusSize(heightToDistribute);
        },

        /**
         *
         * @param {number} heightToRemove
         * @returns {boolean}
         */
        doShrink: function(heightToRemove) {
          return this.dimensionManager.updateMalusSize(heightToRemove);
        },

        /**
         *
         * @returns {number} the calculated size
         */
        adjustMeasure: function() {
          this.dimensionManager.updateGaps();
          this.dimensionManager.updateIntrinsicSizes();
          return this.dimensionManager.getCalculatedSize();
        },

        adjustStretchability: function() {
          this.dimensionManager.updateStretchability();
        },

        getHintSize: function() {
          return this.dimensionManager.getHintSize(null, null, true, true);
        },

        getMaxSize: function() {
          return this.dimensionManager.getMaxSize(null, null, true, true);
        },
        getMinSize: function() {
          return this.dimensionManager.getMinSize(null, null, true, true);
        },

        getCalculatedSize: function() {
          return this.dimensionManager.getCalculatedSize();
        },

        /**
         *
         * @param {classes.GridDimensionSlot} slot
         */
        adjustAvailableMeasure: function(slot) {
          return this.dimensionManager.getCalculatedSize(slot.getPosition(), slot.getLastPosition(), false, false);
        },

        applyStyles: function(styleRules, prefix) {
          var rendering = this.dimensionManager.render();
          this.applyRegularStyles(rendering, styleRules, prefix);
        },

        applyRegularStyles: function(rendering, styleRules, prefix) {
          for (var regularIndex = 0; regularIndex < rendering.regularPositions.length; regularIndex++) {
            var position = rendering.regularPositions[regularIndex];
            var positionInfo = rendering.regular[position];
            styleRules[prefix + "y_" + position] = {
              top: cls.Size.cachedPxImportant(positionInfo.position)
            };
            styleRules[prefix + "y_" + position + ".g_gridChildrenInParent"] = {
              top: cls.Size.cachedPxImportant(positionInfo.position)
            };
            styleRules[prefix + "y_" + position + ".g_childOfGridWithGridChildrenInParent"] = {
              top: cls.Size.cachedPxImportant(positionInfo.position)
            };
            styleRules[prefix + "y_" + position + ".g_decoratingElement"] = {
              top: cls.Size.cachedPxImportant(positionInfo.position)
            };
            styleRules[prefix + "y_" + position + ".g_gridChildrenInParentChild"] = {
              top: cls.Size.cachedPxImportant(positionInfo.position + positionInfo.beforeGap)
            };
            for (var regularLengthIndex = 0; regularLengthIndex < positionInfo.regularLengths.length; regularLengthIndex++) {
              var length = positionInfo.regularLengths[regularLengthIndex];
              var size = positionInfo.lengths[length];
              styleRules[prefix + "h_" + position + "_" + length] = {
                height: cls.Size.cachedPxImportant(size)
              };
              styleRules[prefix + "h_" + position + "_" + length + ".g_gridChildrenInParent"] = {
                height: cls.Size.cachedPxImportant(positionInfo.lengthsWithGaps[length])
              };
              styleRules[prefix + "h_" + position + "_" + length + ".g_childOfGridWithGridChildrenInParent"] = {
                height: cls.Size.cachedPxImportant(positionInfo.lengthsWithGaps[length])
              };
              styleRules[prefix + "h_" + position + "_" + length + ".g_decoratingElement"] = {
                height: cls.Size.cachedPxImportant(positionInfo.lengthsWithGaps[length])
              };
              styleRules[prefix + "h_" + position + "_" + length + ".g_gridChildrenInParentChild"] = {
                height: cls.Size.cachedPxImportant(positionInfo.lengths[length])
              };
            }
          }
        }
      });
  });
