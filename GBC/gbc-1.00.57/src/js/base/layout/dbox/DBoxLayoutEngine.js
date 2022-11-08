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

modulum('DBoxLayoutEngine', ['LayoutEngineBase'],
  function(context, cls) {
    /**
     * Base laxout engine clarr for HBoxLayoutEngine and VBoxLayoutEngine
     * @class DBoxLayoutEngine
     * @memberOf classes
     * @extends classes.LayoutEngineBase
     */
    cls.DBoxLayoutEngine = context.oo.Class(cls.LayoutEngineBase, function($super) {
      return /** @lends classes.DBoxLayoutEngine.prototype */ {
        __name: "DBoxLayoutEngine",
        /**
         * main measure size getter name
         * @type {?string}
         * @protected
         */
        _mainSizeGetter: null,
        /**
         * main measure size setter name
         * @type {?string}
         * @protected
         */
        _mainSizeSetter: null,
        /**
         * main has measure size getter name
         * @type {?string}
         * @protected
         */
        _mainHasSizeGetter: null,
        /**
         * main stretch info getter name
         * @type {?string}
         * @protected
         */
        _mainStretch: null,
        /**
         * opposite measure size getter name
         * @type {?string}
         * @protected
         */
        _oppositeSizeGetter: null,
        /**
         * opposite measure size setter name
         * @type {?string}
         * @protected
         */
        _oppositeSizeSetter: null,
        /**
         * opposite has measure size getter name
         * @type {?string}
         * @protected
         */
        _oppositeHasSizeGetter: null,
        /**
         * opposite stretch info getter name
         * @type {?string}
         * @protected
         */
        _oppositeStretch: null,
        /**
         * calculated split hints
         * @type {Array<number>}
         */
        _splitHints: null,
        /**
         * reference split hints
         * @type {Array<number>}
         * @protected
         */
        _referenceSplitHints: null,
        /**
         * currenty splitter index
         * @type {?number}
         * @protected
         */
        _currentlySplitting: -1,
        /**
         * flag of whether or not it contains spacers
         * @type {boolean}
         * @protected
         */
        _hasSpacer: false,
        /**
         * registered children widgets
         * @type {classes.WidgetBase[]}
         * @protected
         */
        _registeredWidgets: null,
        /**
         * stylesheet id
         * @protected
         */
        _styleSheetId: null,
        /**
         * @inheritDoc
         * @constructs
         */
        constructor: function(widget) {
          $super.constructor.call(this, widget);
          this._styleSheetId = "boxLayout_" + widget.getUniqueIdentifier();
          this._splitHints = [];
          this._registeredWidgets = [];
          this._referenceSplitHints = [];
        },
        /**
         * @inheritDoc
         */
        destroy: function() {
          for (var i = this._registeredWidgets.length - 1; i > -1; i--) {
            var wi = this._registeredWidgets[i];
            wi.destroy();
            this.unregisterChild(wi);
          }
          this._splitHints = null;
          this._registeredWidgets.length = 0;
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        reset: function(recursive) {
          $super.reset.call(this, recursive);
          this._splitHints = this._referenceSplitHints.slice();
        },

        initSplitHints: function(initial) {
          this._referenceSplitHints = (initial || []).map(function(item) {
            return isNaN(item) ? 0 : item;
          });
        },

        startSplitting: function(splitterIndex) {
          this._currentlySplitting = splitterIndex;
          this._referenceSplitHints = [];
          for (var i = 0; i < this._registeredWidgets.length; i++) {
            var widget = this._registeredWidgets[i];
            if (!(widget instanceof cls.SplitterWidget)) {
              var idx = i / 2;
              this._referenceSplitHints[idx] = this._getAvailableSize(widget, true);
            }
          }
          this._splitHints = this._referenceSplitHints.slice();

        },

        stopSplitting: function() {
          this._referenceSplitHints = this._splitHints;
          this._currentlySplitting = -1;
        },

        splitting: function(delta) {
          var
            widget1 = this._registeredWidgets[this._currentlySplitting * 2],
            widget2 = this._registeredWidgets[(this._currentlySplitting + 1) * 2],
            min1 = this._getMinimalSize(widget1, true) || 1,
            min2 = this._getMinimalSize(widget2, true) || 1;

          for (var i = 0; i < this._registeredWidgets.length; i++) {
            var widget = this._registeredWidgets[i];
            if (!(widget instanceof cls.SplitterWidget)) {
              var idx = i / 2;
              this._splitHints[idx] = this._referenceSplitHints[idx];
            }
          }
          var extra = 0;
          var size1 = this._splitHints[this._currentlySplitting],
            size2 = this._splitHints[this._currentlySplitting + 1];
          if ((size1 + delta) < min1) {
            extra = delta;
            delta = min1 - size1;
            extra -= delta;
          }
          if ((size2 - delta) < min2) {
            extra = delta;
            delta = size2 - min2;
            extra -= delta;
          }
          this._splitHints[this._currentlySplitting] += delta;
          this._splitHints[this._currentlySplitting + 1] -= delta;

          if (extra) {
            var currentIndex, currentMin, currentSize, canReduce;
            if (extra < 0) {
              currentIndex = this._currentlySplitting - 1;
              while (extra && (currentIndex >= 0)) {
                currentMin = this._getMinimalSize(this._registeredWidgets[currentIndex * 2], true) || 1;
                currentSize = this._splitHints[currentIndex];
                canReduce = currentSize - currentMin;
                if (canReduce > 0) {
                  if (-extra < canReduce) {
                    this._splitHints[currentIndex] += extra;
                    this._splitHints[this._currentlySplitting + 1] -= extra;
                    extra = 0;
                  } else {
                    extra += canReduce;
                    this._splitHints[currentIndex] -= canReduce;
                    this._splitHints[this._currentlySplitting + 1] += canReduce;
                  }
                }
                currentIndex--;
              }
            } else {
              currentIndex = this._currentlySplitting + 2;
              while (extra && (currentIndex < this._splitHints.length)) {
                currentMin = this._getMinimalSize(this._registeredWidgets[currentIndex * 2], true) || 1;
                currentSize = this._splitHints[currentIndex];
                canReduce = currentSize - currentMin;
                if (canReduce > 0) {
                  if (extra < canReduce) {
                    this._splitHints[currentIndex] -= extra;
                    this._splitHints[this._currentlySplitting] += extra;
                    extra = 0;
                  } else {
                    extra -= canReduce;
                    this._splitHints[currentIndex] -= canReduce;
                    this._splitHints[this._currentlySplitting] += canReduce;
                  }
                }
                currentIndex++;
              }

            }
          }
        },
        /**
         * @inheritDoc
         * @param {classes.WidgetBase} widget child widget
         * @param {number} position the wanted position
         */
        registerChild: function(widget, position) {
          if (this._registeredWidgets.indexOf(widget) < 0) {
            this._registeredWidgets.splice(position, 0, widget);
          }
        },

        /**
         * @inheritDoc
         */
        unregisterChild: function(widget) {
          this._registeredWidgets.remove(widget);
        },

        /**
         * @inheritDoc
         */
        prepareAdjustments: function() {
          var widgets = this._registeredWidgets;
          for (var i = 0, j = 2; j < widgets.length;) {
            var widget = widgets[i];
            var widget2 = widgets[j];
            var isSpacer1 = widget instanceof cls.SpacerItemWidget,
              isSpacer2 = widget2 instanceof cls.SpacerItemWidget;
            if (widget.isVisible() && widget2.isVisible()) {
              widgets[i + 1].setHidden(isSpacer1 || isSpacer2);
              i += 2;
              j += 2;
            } else if (!widget.isVisible() && widget2.isVisible()) {
              widgets[i + 1].setHidden(true);
              i += 2;
              j += 2;
            } else if (widget.isVisible() && !widget2.isVisible()) {
              widgets[j - 1].setHidden(true);
              j += 2;
            } else {
              widgets[j - 1].setHidden(true);
              i += 2;
              j += 2;
            }
          }
        },
        /**
         * @inheritDoc
         */
        adjustMeasure: function() {
          var widgets = this._registeredWidgets;
          this._hasSpacer = false;
          this._getLayoutInfo().setPreferred(0, 0);
          var layoutInfo = this._getLayoutInfo(),
            position = 0,
            minimal = 0,
            minOppositeSize = 0,
            oppositeSize = 0,
            maxSize = 0,
            maxOppositeSize = 0;
          for (var i = 0; i < widgets.length; i++) {
            var widget = widgets[i];
            if (!widget.isVisible()) {
              continue;
            }
            var hasMaxSize = this._hasMaximalSize(widget),
              hasOppositeMaxSize = this._hasOppositeMaximalSize(widget),
              isSpacer = widget instanceof cls.SpacerItemWidget;
            if (isSpacer) {
              this._hasSpacer = true;
            }

            if (hasMaxSize || isSpacer) {
              maxSize += this._getMaximalSize(widget, true);
            } else {
              maxSize = cls.Size.maximal;
              this._setPreferredSize(this._widget,
                this._getPreferredSize(this._widget, true) +
                this._getPreferredSize(widget, true)
              );
            }
            if (hasOppositeMaxSize) {
              if (maxOppositeSize !== cls.Size.maximal) {
                maxOppositeSize = Math.max(maxOppositeSize, this._getOppositeMaximalSize(widget, true));
              }
            } else {
              maxOppositeSize = cls.Size.maximal;
            }
            var size = this._getMeasuredSize(widget, true),
              minimalSize = this._getMinimalSize(widget, true),
              opposite = this._getOppositeMeasuredSize(widget, true),
              minOpposite = this._getOppositeMinimalSize(widget, true);
            oppositeSize = Math.max(oppositeSize, opposite);
            minOppositeSize = Math.max(minOppositeSize, minOpposite);
            position += Math.max(minimalSize, size);
            minimal += minimalSize;
          }
          this._applyMeasure(position, oppositeSize);
          layoutInfo.getMinimal()[this._mainSizeSetter](minimal);
          layoutInfo.getMinimal()[this._oppositeSizeSetter](minOppositeSize);

          this._setMaximalSize(this._widget, maxSize);
          this._setOppositeMaximalSize(this._widget, maxOppositeSize);
        },

        /**
         * @inheritDoc
         */
        adjustStretchability: function() {
          var layoutInfo = this._getLayoutInfo();
          var oppositeStretch = 0;
          for (var i = 0; i < this._registeredWidgets.length; i++) {
            var widget = this._registeredWidgets[i],
              widgetInfo = widget.getLayoutInformation();
            if (!widget.isVisible()) {
              continue;
            }
            var hasOppositeMaxSize = this._hasOppositeMaximalSize(widget);
            if (widgetInfo.isXStretched() || widgetInfo.isChildrenXStretched()) {
              layoutInfo.addChildrenStretchX(widgetInfo);
            }
            if (widgetInfo.isYStretched() || widgetInfo.isChildrenYStretched()) {
              layoutInfo.addChildrenStretchY(widgetInfo);
            }

            if (!hasOppositeMaxSize) {
              if (oppositeStretch < this._getOppositePreferredSize(widget)) {
                oppositeStretch = this._getOppositePreferredSize(widget);
              }
            }
          }

          if (this._getOppositeMaximalSize() === cls.Size.maximal && oppositeStretch === 0) {
            oppositeStretch = 1;
          }
          if (oppositeStretch > 0) {
            this._setOppositePreferredSize(this._widget, oppositeStretch);
          }

        },

        _prepareApplyWhenSplitting: function(widgets) {
          for (var i = 0; i < widgets.length; i++) {
            var widget = widgets[i];
            if (widget.isVisible()) {
              if (!(widget instanceof cls.SplitterWidget)) {
                this._setAvailableSize(widget, this._splitHints[this._widget.getIndexOfChild(widget)]);
              }
            }
          }
        },

        _prepareApplyWithStretch: function(widgets) {
          var availableSize = this._getAvailableSize(),
            initialFullRatio = 0,
            fullRatio = 0,
            initialStretched = 0,
            stretched = 0,
            ratios = new Map(),
            i, widget, preferred, msize;

          for (i = 0; i < widgets.length; i++) {
            widget = widgets[i];
            if (widget.isVisible()) {
              this._setOppositeAvailableSize(widget, this._getOppositeAvailableSize());
              msize = this._getMinimalSize(widget, true);
              preferred = this._getPreferredSize(widget, true);
              if (this._isStretched(widget) && !widget.isInstanceOf(cls.SplitterWidget)) {
                ratios.set(widget, {
                  widget: widget,
                  preferred: preferred,
                  minimal: msize
                });
                initialFullRatio += preferred;
                fullRatio += preferred;
                initialStretched++;
                stretched++;
              } else {
                // if not stretchable, apply minimal size
                this._setAvailableSize(widget, msize);
                availableSize -= msize;
              }
            }
          }
          var sizableCount = 0,
            reducer = function(ratio, widget, map) {
              ratio.part = initialFullRatio ? (ratio.preferred || 0) / initialFullRatio : initialStretched ? (1 /
                  initialStretched) :
                0;
              ratio.initialDistribution = availableSize * ratio.part;
              if (ratio.initialDistribution <= ratio.minimal) {
                this._setAvailableSize(widget, ratio.minimal);
                availableSize -= ratio.minimal;
                fullRatio -= ratio.preferred;
                stretched--;
                map.delete(widget);
              } else {
                sizableCount++;
              }
            }.bind(this);

          // seeking all stretchables that should strecch smaller than their minimal size
          while (ratios.size !== sizableCount) {
            sizableCount = 0;
            ratios.forEach(reducer);
            initialFullRatio = fullRatio;
            initialStretched = stretched;
          }

          ratios.forEach(function(ratio, widget, map) {
            var part = fullRatio ? (ratio.preferred || 0) / fullRatio : stretched ? (1 / stretched) : 0;
            this._setAvailableSize(widget, availableSize * part);
            map.delete(widget);
          }.bind(this));
        },

        _prepareApplyWithoutStretch: function(widgets) {
          var i, items = [],
            distributedSize = {},
            available = this._getAvailableSize(),
            accumulated = 0,
            currentLevel = 0,
            distibutableLevel = -1;

          for (var it = 0; it < widgets.length; it++) {
            if (!widgets[it].isHidden()) {
              if ((this._hasSpacer && (widgets[it] instanceof cls.SpacerItemWidget)) ||
                (!this._hasSpacer && !(widgets[it] instanceof cls.SplitterWidget))) {
                items.push(widgets[it]);
              } else {
                available -= this._getMeasuredSize(widgets[it], true);
              }
            }
          }

          var count = items.length;

          items.sort(this._sortItems.bind(this));

          while (distibutableLevel === -1 && currentLevel < count) {
            var minimalCurrent = this._getMinimalSize(items[currentLevel], true);
            if (available >= (accumulated + minimalCurrent * (count - currentLevel))) {
              distibutableLevel = currentLevel;
            } else {
              accumulated += minimalCurrent;
              distributedSize[items[currentLevel].getUniqueIdentifier()] = minimalCurrent;
              currentLevel++;
            }
          }
          if (distibutableLevel >= 0) {
            var distributablePart = (available - accumulated) / (count - distibutableLevel);
            for (i = distibutableLevel; i < count; i++) {
              distributedSize[items[i].getUniqueIdentifier()] = distributablePart;
            }
          }
          for (i = 0; i < widgets.length; i++) {
            var widget = widgets[i];
            if (widget.isVisible()) {
              if (distributedSize.hasOwnProperty(widget.getUniqueIdentifier())) {
                this._setAvailableSize(widget, distributedSize[widget.getUniqueIdentifier()]);
              }
              this._setOppositeAvailableSize(widget, this._getOppositeAvailableSize());
            } else {
              this._setAvailableSize(widget, 0);
              this._setOppositeAvailableSize(widget, 0);
            }
          }
        },
        /**
         * @inheritDoc
         */
        prepareApplyLayout: function() {
          var widgets = this._registeredWidgets,
            i, widget, wSize, oppositeWSize,
            position = 0,
            reallyAllocatedSpace = 0,
            stretchablesOnNeed = 0,
            extraSpace = 0;
          if (this._currentlySplitting >= 0) {
            // user is currently splitting
            this._prepareApplyWhenSplitting(widgets);
          } else if ( // box has been previously splitted, keep ratios
            this._referenceSplitHints.length &&
            (this._referenceSplitHints.length === ((widgets.length + 1) / 2))) {
            this._redistributeSplittedSpace(widgets);
          } else if (this._isStretched(this._widget)) {
            // some elements are stretchables
            this._prepareApplyWithStretch(widgets);
          } else {
            // no elements are stretchables
            this._prepareApplyWithoutStretch(widgets);
          }

          for (i = 0; i < widgets.length; i++) {
            widget = widgets[i];
            if (widget.isVisible()) {
              wSize = Math.max(this._getAvailableSize(widget, true), this._getMinimalSize(widget, true));
              reallyAllocatedSpace += wSize;
              if (!wSize) {
                stretchablesOnNeed++;
              }
            }
          }
          if (stretchablesOnNeed) {
            extraSpace =
              (Math.max(this._getAvailableSize(null, true), this._getMinimalSize(null, true)) - reallyAllocatedSpace) /
              stretchablesOnNeed;
          }
          for (i = 0; i < widgets.length; i++) {
            widget = widgets[i];
            if (widget.isVisible()) {
              wSize = Math.max(this._getAvailableSize(widget, true), this._getMinimalSize(widget, true));
              if (!wSize) {
                wSize = extraSpace;
              }
              this._setAllocatedSize(widget, wSize);
              oppositeWSize = this._getOppositeAvailableSize();
              if (!this._getOppositeStretched() || this._getLayoutInfo().willOverflowContainerIfNeeded()) {
                oppositeWSize = Math.max(oppositeWSize, this._getOppositeMinimalSize());
              }
              this._setOppositeAllocatedSize(widget, oppositeWSize);
              this._setOppositeAvailableSize(widget, oppositeWSize);
              this._setItemClass(i, position, wSize);
              position += wSize;
            } else {
              this._setOppositeAllocatedSize(widget, 0);
              this._setOppositeAvailableSize(widget, 0);
              this._setItemClass(i, position, 0);
            }
          }

          var width = Math.max(this._getLayoutInfo().getAvailable().getWidth(true), this._getLayoutInfo().getMinimal().getWidth(
            true));
          var height = Math.max(this._getLayoutInfo().getAvailable().getHeight(true), this._getLayoutInfo().getMinimal().getHeight(
            true));
          this._getLayoutInfo().setAllocated(width, height);

          for (i = 0; i < widgets.length; i++) {
            widget = widgets[i];
            if (widget.isVisible()) {
              this._setItemOppositeClass(i);
              this._setOppositeAllocatedSize(widget, this._getOppositeAllocatedSize());
            } else {
              this._setItemOppositeClass(i);
              this._setOppositeAllocatedSize(widget, 0);
            }
          }
          this._styleRules[".g_measured #w_" + this._widget.getUniqueIdentifier() + ".g_measureable"] = {
            width: this._getLayoutInfo().getAllocated().getWidth() + "px",
            height: this._getLayoutInfo().getAllocated().getHeight() + "px"
          };
        },

        _redistributeSplittedSpace: function(widgets) {
          var i, widget, total = this._getAvailableSize(),
            totalSplitters = 0;
          for (i = 0; i < widgets.length; i++) {
            widget = widgets[i];
            if (widget.isVisible()) {
              if (widget instanceof cls.SplitterWidget) {
                var s = this._getMeasuredSize(widget);
                total -= s;
                totalSplitters += s;
              }
            }
          }
          if (this._getMinimalSize() < (total + totalSplitters)) {
            var sum = this._referenceSplitHints.reduce(function(acc, b, idx) {
                if (idx === 1 && !widgets[0].isVisible()) {
                  acc = 0;
                }
                if (!widgets[idx * 2].isVisible()) {
                  b = 0;
                }
                return acc + b;
              }.bind(this)),
              availableWeight = sum,
              ratioed = this._referenceSplitHints.map(function(a, idx) {
                var relative = total * a / sum,
                  min = this._getMinimalSize(widgets[idx * 2]),
                  delta = relative - min;
                return {
                  weight: a,
                  min: min,
                  size: min,
                  relative: relative,
                  delta: delta,
                  index: idx
                };
              }, this).sort(function(a, b) {
                return a.delta < b.delta ? -1 : a.delta > b.delta ? 1 : 0;
              });
            var pos = 0,
              debt = 0;
            while (pos < ratioed.length) {
              if (ratioed[pos].delta < 0) {
                debt -= ratioed[pos].delta;
                availableWeight -= ratioed[pos].weight;
                pos++;
              } else {
                var weightDebt = debt * ratioed[pos].weight / availableWeight;
                if (weightDebt > ratioed[pos].delta) {
                  ratioed[pos].delta -= weightDebt;
                  debt -= weightDebt;
                } else {
                  debt -= weightDebt;
                  ratioed[pos].delta -= weightDebt;
                  ratioed[pos].size = ratioed[pos].min + ratioed[pos].delta;
                  availableWeight -= ratioed[pos].weight;
                  pos++;
                }
              }
            }
            for (i = 0; i < ratioed.length; i++) {
              widget = widgets[ratioed[i].index * 2];
              if (widget.isVisible()) {
                if (!(widget instanceof cls.SplitterWidget)) {
                  this._setAvailableSize(widget, ratioed[i].size);
                }
              }
            }
          } else {
            for (i = 0; i < widgets.length; i++) {
              widget = widgets[i];
              if (widget.isVisible()) {
                if (!(widget instanceof cls.SplitterWidget)) {
                  this._setAvailableSize(widget, this._getMinimalSize(widget));
                }
              }
            }
          }
          for (i = 0; i < widgets.length; i++) {
            widget = widgets[i];
            if (widget.isVisible()) {
              this._setOppositeAvailableSize(widget, this._getOppositeAvailableSize());
            }
          }
        },
        /**
         * @inheritDoc
         */
        applyLayout: function() {
          context.styler.appendStyleSheet(this._styleRules, this._styleSheetId, true,
            this.getLayoutSheetId());
        },

        /**
         * get main hint size of given widget or owner if none
         * @param {classes.WidgetBase} [widget] the widget
         * @param {boolean} [useFallback] true to get fallback value if needed
         * @returns {number} the size
         * @protected
         */
        _getPreferredSize: function(widget, useFallback) {
          var idx = this._widget.getIndexOfChild(widget);
          if (idx >= 0 && this._splitHints[idx]) {
            return this._splitHints[idx];
          }
          return this._getLayoutInfo(widget).getPreferred()[this._mainSizeGetter](useFallback);
        },
        /**
         * get opposite hint size of given widget or owner if none
         * @param {classes.WidgetBase} [widget] the widget
         * @param {boolean} [useFallback] true to get fallback value if needed
         * @returns {number} the size
         * @protected
         */
        _getOppositePreferredSize: function(widget, useFallback) {
          return this._getLayoutInfo(widget).getPreferred()[this._oppositeSizeGetter](useFallback);
        },

        _setPreferredSize: function(widget, size) {
          return this._getLayoutInfo(widget).getPreferred()[this._mainSizeSetter](size);
        },

        _setOppositePreferredSize: function(widget, size) {
          return this._getLayoutInfo(widget).getPreferred()[this._oppositeSizeSetter](size);
        },

        /**
         * get main allocated size of given widget or owner if none
         * @param {classes.WidgetBase} [widget] the widget
         * @param {boolean} [useFallback] true to get fallback value if needed
         * @returns {number} the size
         * @protected
         */
        _getAllocatedSize: function(widget, useFallback) {
          return this._getLayoutInfo(widget).getAllocated()[this._mainSizeGetter](useFallback);

        },

        /**
         * set main allocated size of given widget or owner if none
         * @param {classes.WidgetBase} widget the widget
         * @param {number} size the size
         * @protected
         */
        _setAllocatedSize: function(widget, size) {
          return this._getLayoutInfo(widget).getAllocated()[this._mainSizeSetter](size);
        },
        /**
         * set main maximal size of given widget or owner if none
         * @param {classes.WidgetBase} widget the widget
         * @param {number} size the size
         * @protected
         */
        _setMaximalSize: function(widget, size) {
          return this._getLayoutInfo(widget).getMaximal()[this._mainSizeSetter](size);
        },
        /**
         * set opposite maximal size of given widget or owner if none
         * @param {classes.WidgetBase} widget the widget
         * @param {number} size the size
         * @protected
         */
        _setOppositeMaximalSize: function(widget, size) {
          return this._getLayoutInfo(widget).getMaximal()[this._oppositeSizeSetter](size);
        },
        /**
         * get main measured size of given widget or owner if none
         * @param {classes.WidgetBase} [widget] the widget
         * @param {boolean} [useFallback] true to get fallback value if needed
         * @returns {number} the size
         * @protected
         */
        _getMeasuredSize: function(widget, useFallback) {
          if (!(widget instanceof cls.SplitterWidget)) {
            var idx = this._widget.getIndexOfChild(widget);
            if (idx >= 0 && this._splitHints[idx]) {
              return this._splitHints[idx];
            }
          }
          return this._getLayoutInfo(widget).getMeasured()[this._mainSizeGetter](useFallback);
        },
        /**
         * get opposite measured size of given widget or owner if none
         * @param {classes.WidgetBase} [widget] the widget
         * @param {boolean} [useFallback] true to get fallback value if needed
         * @returns {number} the size
         * @protected
         */
        _getOppositeMeasuredSize: function(widget, useFallback) {
          return this._getLayoutInfo(widget).getMeasured()[this._oppositeSizeGetter](Boolean(useFallback));
        },
        /**
         * get main minimal size of given widget or owner if none
         * @param {classes.WidgetBase} [widget] the widget
         * @param {boolean} [useFallback] true to get fallback value if needed
         * @returns {number} the size
         * @protected
         */
        _getMinimalSize: function(widget, useFallback) {
          return this._getLayoutInfo(widget).getMinimal()[this._mainSizeGetter](Boolean(useFallback));
        },
        /**
         * get opposite minimal size of given widget or owner if none
         * @param {classes.WidgetBase} [widget] the widget
         * @param {boolean} [useFallback] true to get fallback value if needed
         * @returns {number} the size
         * @protected
         */
        _getOppositeMinimalSize: function(widget, useFallback) {
          return this._getLayoutInfo(widget).getMinimal()[this._oppositeSizeGetter](Boolean(useFallback));
        },
        /**
         * get main maximal size of given widget or owner if none
         * @param {classes.WidgetBase} [widget] the widget
         * @param {boolean} [useFallback] true to get fallback value if needed
         * @returns {number} the size
         * @protected
         */
        _getMaximalSize: function(widget, useFallback) {
          return this._getLayoutInfo(widget).getMaximal()[this._mainSizeGetter](useFallback);
        },
        /**
         * get opposite maximal size of given widget or owner if none
         * @param {classes.WidgetBase} [widget] the widget
         * @param {boolean} [useFallback] true to get fallback value if needed
         * @returns {number} the size
         * @protected
         */
        _getOppositeMaximalSize: function(widget, useFallback) {
          return this._getLayoutInfo(widget).getMaximal()[this._oppositeSizeGetter](useFallback);
        },
        /**
         * test if given widget or owner if none has main maximal size
         * @param {classes.WidgetBase} [widget] the widget
         * @returns {number} the size
         * @protected
         */
        _hasMaximalSize: function(widget) {
          return this._getLayoutInfo(widget).getMaximal()[this._mainHasSizeGetter](true);
        },
        /**
         * test if given widget or owner if none has opposite maximal size
         * @param {classes.WidgetBase} [widget] the widget
         * @returns {number} the size
         * @protected
         */
        _hasOppositeMaximalSize: function(widget) {
          return this._getLayoutInfo(widget).getMaximal()[this._oppositeHasSizeGetter](true);
        },
        /**
         * get main available size of given widget or owner if none
         * @param {classes.WidgetBase} [widget] the widget
         * @param {boolean} [useFallback] true to get fallback value if needed
         * @returns {number} the size
         * @protected
         */
        _getAvailableSize: function(widget, useFallback) {
          var availableSize = this._getLayoutInfo(widget).getAvailable();
          return availableSize[this._mainSizeGetter](useFallback);
        },
        /**
         * set main available size of given widget or owner if none
         * @param {classes.WidgetBase} widget the widget
         * @param {number} size the size
         * @protected
         */
        _setAvailableSize: function(widget, size) {
          var availableSize = this._getLayoutInfo(widget).getAvailable();
          availableSize[this._mainSizeSetter](size);
        },
        /**
         * get opposite available size of given widget or owner if none
         * @param {classes.WidgetBase} [widget] the widget
         * @param {boolean} [useFallback] true to get fallback value if needed
         * @returns {number} the size
         * @protected
         */
        _getOppositeAvailableSize: function(widget, useFallback) {
          var availableSize = this._getLayoutInfo(widget).getAvailable();
          return availableSize[this._oppositeSizeGetter](useFallback);
        },
        /**
         * set opposite available size of given widget or owner if none
         * @param {classes.WidgetBase} widget the widget
         * @param {number} size the size
         * @protected
         */
        _setOppositeAvailableSize: function(widget, size) {
          var availableSize = this._getLayoutInfo(widget).getAvailable();
          availableSize[this._oppositeSizeSetter](size);
        },
        /**
         * get opposite allocated size of given widget or owner if none
         * @param {classes.WidgetBase} [widget] the widget
         * @param {boolean} [useFallback] true to get fallback value if needed
         * @returns {number} the size
         * @protected
         */
        _getOppositeAllocatedSize: function(widget, useFallback) {
          var allocatedSize = this._getLayoutInfo(widget).getAllocated();
          return allocatedSize[this._oppositeSizeGetter](useFallback);
        },
        /**
         * set opposite allocated size of given widget or owner if none
         * @param {classes.WidgetBase} widget the widget
         * @param {number} size the size
         * @protected
         */
        _setOppositeAllocatedSize: function(widget, size) {
          var allocatedSize = this._getLayoutInfo(widget).getAllocated();
          allocatedSize[this._oppositeSizeSetter](size);
        },
        /**
         * set item css rules for main size
         * @param {number} position child widget position in children list
         * @param {number} start render start position
         * @param {number} size render size
         * @protected
         */
        _setItemClass: function(position, start, size) {

        },
        /**
         * set item css rules for opposite size
         * @param {number} position child widget position in children list
         * @param {number} start render start position
         * @param {number} size render size
         * @protected
         */
        _setItemOppositeClass: function(position, start, size) {

        },
        /**
         * apply css rules
         * @param {number} mainSize owner main size
         * @param {number} oppositeSize owner opposite size
         * @protected
         */
        _applyMeasure: function(mainSize, oppositeSize) {

        },
        /**
         * get main stretchability from size of given widget or owner if none
         * @param {classes.WidgetBase} [widget] the widget
         * @returns {boolean} the stretchability info
         * @protected
         */
        _isStretched: function(widget) {
          return false;
        },
        /**
         * get main stretch info of given widget or owner if none
         * @param {classes.WidgetBase} [widget] the widget
         * @returns {boolean} the stretch info
         * @protected
         */
        _getMainStretched: function(widget) {
          var mainStretched = this._getLayoutInfo(widget).getStretched();
          return mainStretched["get" + this._mainStretch]();
        },
        /**
         * get opposite stretch info of given widget or owner if none
         * @param {classes.WidgetBase} [widget] the widget
         * @returns {boolean} the stretch info
         * @protected
         */
        _getOppositeStretched: function(widget) {
          var oppositeStretched = this._getLayoutInfo(widget).getStretched();
          return oppositeStretched["get" + this._oppositeStretch]();
        },
        /**
         * sort function for children widget by their main minimal size
         * @param {classes.WidgetBase} a the first widget
         * @param {classes.WidgetBase} b the second widget
         * @return {number} sort value
         * @private
         */
        _sortItems: function(a, b) {
          return this._getMinimalSize(b) - this._getMinimalSize(a);
        }
      };
    });
  });
