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

modulum('GridLayoutEngine', ['LayoutEngineBase'],
  function(context, cls) {
    /**
     * @class GridLayoutEngine
     * @memberOf classes
     * @extends classes.LayoutEngineBase
     */
    cls.GridLayoutEngine = context.oo.Class(cls.LayoutEngineBase, function($super) {
      return /** @lends classes.GridLayoutEngine.prototype */ {
        __name: "GridLayoutEngine",
        /**
         * list of registered childrn widgets
         * @type {classes.WidgetBase[]}
         */
        _registeredWidgets: null,
        /**
         * map of registered grid dimension slots
         * @type {object<string, ?classes.XYDimensionSlot>}
         */
        _registeredSlots: null,
        /**
         * map of widgets handle registration
         * @type {object<Number, HandleRegistration>}
         */
        _registeredWidgetWatchers: null,
        /**
         * X dimension sub engine
         * @type {classes.GridLayoutEngineX}
         */
        _xspace: null,
        /**
         * Y dimension sub engine
         * @type {classes.GridLayoutEngineY}
         */
        _yspace: null,

        /**
         * stylesheet id
         */
        _styleSheetId: null,
        /**
         * set to false to avoid render children
         * @type {boolean}
         */
        _willRenderContent: true,
        /**
         * @inheritDoc
         * @constructs
         */
        constructor: function(widget) {
          $super.constructor.call(this, widget);
          this._styleSheetId = "gridLayout_" + widget.getUniqueIdentifier();
          this._registeredWidgets = [];
          this._registeredSlots = {};
          this._registeredWidgetWatchers = {};
          this._xspace = new cls.GridLayoutEngineX(widget);
          this._yspace = new cls.GridLayoutEngineY(widget);
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          for (var w in this._registeredWidgetWatchers) {
            var watch = this._registeredWidgetWatchers[w];
            if (watch) {
              watch();
            }
          }
          for (var i = this._registeredWidgets.length - 1; i > -1; i--) {
            var wi = this._registeredWidgets[i];
            wi.destroy();
            this.unregisterChild(wi);
          }
          for (var s in this._registeredSlots) {
            var slot = this._registeredSlots[s];
            if (slot) {
              slot.x.destroy();
              slot.y.destroy();
            }
          }
          this._xspace.destroy();
          this._yspace.destroy();
          this._xspace = null;
          this._yspace = null;
          this._registeredSlots = null;
          this._registeredWidgetWatchers = null;
          this._registeredWidgets.length = 0;
          $super.destroy.call(this);
        },

        /**
         * whether or not to render content
         * @return {boolean}  true if content has to be rendered
         */
        willRenderContent: function() {
          var parentEngine = this._widget && this._widget.getParentWidget() &&
            this._widget.getParentWidget().isInstanceOf(cls.GroupWidget) &&
            this._widget.getParentWidget().getLayoutEngine(),
            hasWillRenderContent = parentEngine && parentEngine.willRenderContent;
          return this._willRenderContent && (!hasWillRenderContent || parentEngine.willRenderContent());
        },
        /**
         * set hint size
         * @param {number|string} widthHint the width
         * @param {number|string} heightHint the height
         */
        setHint: function(widthHint, heightHint) {
          this._widget.getLayoutInformation().setSizeHint(
            ((typeof(widthHint) === "undefined") || widthHint === null || widthHint === "") ? 1 : widthHint,
            ((typeof(heightHint) === "undefined") || heightHint === null || heightHint === "") ? 1 : heightHint
          );
        },

        /**
         *
         * @param {classes.LayoutInformation} widgetLayoutInformation
         * @param {?{x:classes.GridDimensionSlot, y:classes.GridDimensionSlot}} slotRecycle
         * @return {classes.GridDimensionSlot}
         */
        getSlotX: function(widgetLayoutInformation, slotRecycle) {
          var gridX = widgetLayoutInformation.getGridX(),
            gridWidth = widgetLayoutInformation.getGridWidth(),
            result = null;
          if (slotRecycle && slotRecycle.x) {
            result = slotRecycle.x.reset(gridX, gridWidth);
          } else {
            result = new cls.GridDimensionSlot(gridX, gridWidth);
          }
          return result;
        },

        /**
         *
         * @param {classes.LayoutInformation} widgetLayoutInformation
         * @param {?{x:classes.GridDimensionSlot, y:classes.GridDimensionSlot}} slotRecycle
         * @return {classes.GridDimensionSlot}
         */
        getSlotY: function(widgetLayoutInformation, slotRecycle) {
          var gridY = widgetLayoutInformation.getGridY(),
            gridHeight = widgetLayoutInformation.getGridHeight(),
            result = null;
          if (slotRecycle && slotRecycle.y) {
            result = slotRecycle.y.reset(gridY, gridHeight);
          } else {
            result = new cls.GridDimensionSlot(gridY, gridHeight);
          }
          return result;
        },

        /**
         * @inheritDoc
         */
        registerChild: function(widget) {
          var slotRecycle = null;
          if (this._registeredWidgets.indexOf(widget) >= 0) {
            slotRecycle = this.unregisterChild(widget);
          }
          var widgetLayoutInformation = widget.getLayoutInformation(),
            id = widget.getUniqueIdentifier();
          if (!this._registeredSlots[id]) {
            this._registeredWidgets.push(widget);
            var slotX = this.getSlotX(widgetLayoutInformation, slotRecycle);
            var slotY = this.getSlotY(widgetLayoutInformation, slotRecycle);
            this._registeredSlots[id] = {
              x: this._xspace.registerSlot(slotX),
              y: this._yspace.registerSlot(slotY)
            };
            this._registeredWidgetWatchers[id] = widgetLayoutInformation.onGridInfoChanged(this.registerChild.bind(this, widget));
          }
        },

        hasChangesInSlot: function(widget) {
          var id = widget.getUniqueIdentifier(),
            widgetLayoutInformation = widget.getLayoutInformation();
          if (this._registeredSlots[id]) {
            var slotX = this._registeredSlots[id].x;
            var slotY = this._registeredSlots[id].y;
            return slotX.getPosition() !== widgetLayoutInformation.getGridX() ||
              slotX.getSize() !== widgetLayoutInformation.getGridWidth() ||
              slotY.getPosition() !== widgetLayoutInformation.getGridY() ||
              slotY.getSize() !== widgetLayoutInformation.getGridHeight();
          } else {
            return true;
          }
        },
        /**
         * @inheritDoc
         */
        unregisterChild: function(widget) {
          var id = widget.getUniqueIdentifier();
          if (this._registeredSlots[id]) {
            var slotRecycle = {};
            this._registeredWidgetWatchers[id]();
            this._registeredWidgetWatchers[id] = null;
            var index = this._registeredWidgets.indexOf(widget);
            if (index >= 0) {
              this._registeredWidgets.splice(index, 1);
            }
            slotRecycle.x = this._xspace.unregisterSlot(this._registeredSlots[id].x);
            slotRecycle.y = this._yspace.unregisterSlot(this._registeredSlots[id].y);
            this._registeredSlots[id] = null;
            return slotRecycle;
          }
          return null;
        },

        /**
         * @inheritDoc
         */
        beforeLayout: function() {
          var layoutInformation = this._getLayoutInfo(),
            i = 0,
            currentVirtualY = 0,
            widget = null,
            widgetLayoutInformation = null,
            list = null,
            hasChanges = false;
          if (this._registeredWidgets.length) {
            for (; i < this._registeredWidgets.length; i++) {
              widget = this._registeredWidgets[i];
              widgetLayoutInformation = widget && widget.getLayoutInformation();
              if (widgetLayoutInformation) {
                widgetLayoutInformation.setChildOfGridAutomaticStack(layoutInformation.isStacked(), true);
              }
            }
            if (layoutInformation.isStacked()) {
              list = this._registeredWidgets.slice().sort(function(a, b) {
                var ax = a.getLayoutInformation().getRawInformation().getPosX(),
                  ay = a.getLayoutInformation().getRawInformation().getPosY(),
                  bx = b.getLayoutInformation().getRawInformation().getPosX(),
                  by = b.getLayoutInformation().getRawInformation().getPosY();
                return Number.compare(ay, by) || Number.compare(ax, bx);
              });
              for (i = 0; i < list.length; i++) {
                widget = list[i];
                widgetLayoutInformation = widget && widget.getLayoutInformation();
                if (widgetLayoutInformation) {
                  widgetLayoutInformation.setVirtualGridY(currentVirtualY, true);
                  currentVirtualY += widgetLayoutInformation.getGridHeight();
                }
              }
            }

            list = this._registeredWidgets.slice();
            for (i = 0; i < list.length; i++) {
              widget = list[i];
              /*   hasChanges = hasChanges || this.hasChangesInSlot(widget);
               }
               if(hasChanges) {
                 for (i = 0; i < list.length; i++) {
                   widget = list[i];*/
              this.registerChild(widget);
              //  }
            }
          }
        },

        /**
         * @inheritDoc
         */
        measureDecoration: function() {
          var layoutInformation = this._getLayoutInfo();
          var element = this._widget.getElement(),
            container = this._widget.getContainerElement();
          layoutInformation.setDecorating(
            element.clientWidth - container.clientWidth,
            element.clientHeight - container.clientHeight
          );
          layoutInformation.setDecoratingOffset(
            container.offsetLeft - element.offsetLeft,
            container.offsetTop - element.offsetTop
          );
        },

        /**
         * @inheritDoc
         */
        adjustMeasure: function() {
          var layoutInformation = this._getLayoutInfo();
          if (this._registeredWidgets.length) {
            for (var i = 0; i < this._registeredWidgets.length; i++) {
              var widget = this._registeredWidgets[i],
                widgetLayoutInformation = widget.getLayoutInformation(),
                owningGrid = widgetLayoutInformation.getOwningGrid(),
                isOwningGridDisplayed = !owningGrid || owningGrid.isVisible(),
                isOwningGridNoContentRender = !owningGrid || owningGrid.getLayoutEngine().willRenderContent(),
                isDisplayed = widget.isVisible() && isOwningGridDisplayed,
                widgetSlot = this._registeredSlots[widget.getUniqueIdentifier()];

              if (isDisplayed && isOwningGridNoContentRender && this.willRenderContent()) {
                widgetSlot.x.setDisplayed(true);
                widgetSlot.y.setDisplayed(true);
                widgetSlot.x.setMinimumBeforeGap();
                widgetSlot.x.setMinimumAfterGap();
                widgetSlot.y.setMinimumBeforeGap();
                widgetSlot.y.setMinimumAfterGap();
                var
                  measured = widgetLayoutInformation.getMeasured(),
                  maxSize = widgetLayoutInformation.getMaximal(),
                  minSize = widgetLayoutInformation.getMinimal();

                widgetSlot.x.setMinSize(minSize.getWidth());
                widgetSlot.y.setMinSize(minSize.getHeight());
                widgetSlot.x.setMaxSize(maxSize.getWidth());
                widgetSlot.y.setMaxSize(maxSize.getHeight());

                widgetSlot.x.setDesiredMinimalSize(measured.getWidth() || widgetLayoutInformation.forcedMinimalWidth);
                widgetSlot.y.setDesiredMinimalSize(measured.getHeight() || widgetLayoutInformation.forcedMinimalHeight);

                if (widget.isGridChildrenInParent && widget.isGridChildrenInParent()) {
                  widgetSlot.x.setMinimumBeforeGap(widgetLayoutInformation.getDecoratingOffset().getWidth());
                  widgetSlot.x.setMinimumAfterGap(widgetLayoutInformation.getDecorating().getWidth() - widgetLayoutInformation
                    .getDecoratingOffset()
                    .getWidth());
                  widgetSlot.y.setMinimumBeforeGap(widgetLayoutInformation.getDecoratingOffset().getHeight());
                  widgetSlot.y.setMinimumAfterGap(widgetLayoutInformation.getDecorating().getHeight() - widgetLayoutInformation
                    .getDecoratingOffset()
                    .getHeight());
                } else {
                  widgetSlot.x.setMinimumBeforeGap(null);
                  widgetSlot.x.setMinimumAfterGap(null);
                  widgetSlot.y.setMinimumBeforeGap(null);
                  widgetSlot.y.setMinimumAfterGap(null);
                }

                var extra = widgetLayoutInformation._extraGap;
                if (extra) {
                  widgetSlot.x.extraBeforeGap = Math.max(widgetSlot.x.extraBeforeGap, extra.beforeX || 0);
                  widgetSlot.x.extraAfterGap = Math.max(widgetSlot.x.extraAfterGap, extra.afterX || 0);
                  widgetSlot.y.extraBeforeGap = Math.max(widgetSlot.y.extraBeforeGap, extra.beforeY || 0);
                  widgetSlot.y.extraAfterGap = Math.max(widgetSlot.y.extraAfterGap, extra.afterY || 0);
                }
              } else {
                widgetSlot.x.setDisplayed(false);
                widgetSlot.y.setDisplayed(false);
              }
            }
            layoutInformation.setMeasured(this._xspace.adjustMeasure() + layoutInformation.getDecorating().getWidth(true),
              this._yspace.adjustMeasure() + layoutInformation.getDecorating().getHeight(true));
            layoutInformation.setMinimal(
              this._xspace.getMinSize() + layoutInformation.getDecorating().getWidth(true),
              this._yspace.getMinSize() + layoutInformation.getDecorating().getHeight(true));
            layoutInformation.setMaximal(this._xspace.getMaxSize(), this._yspace.getMaxSize());
          } else {
            layoutInformation.setMeasured(
              layoutInformation.getDecorating().getWidth(true),
              layoutInformation.getDecorating().getHeight(true)
            );
            layoutInformation.setMinimal(layoutInformation.getMeasured().getWidth(), layoutInformation.getMeasured().getHeight());
            layoutInformation.setMaximal(layoutInformation.getMeasured().getWidth(), layoutInformation.getMeasured().getHeight());
          }
        },

        /**
         * @inheritDoc
         */
        adjustStretchability: function() {
          var layoutInformation = this._getLayoutInfo();
          if (this._registeredWidgets.length) {
            for (var i = 0; i < this._registeredWidgets.length; i++) {
              var widget = this._registeredWidgets[i],
                widgetLayoutEngine = widget.getLayoutEngine(),
                widgetLayoutInformation = widget.getLayoutInformation(),
                owningGrid = widgetLayoutInformation.getOwningGrid(),
                isOwningGridDisplayed = !owningGrid || owningGrid.isVisible(),
                isOwningGridNoContentRender = !owningGrid || owningGrid.getLayoutEngine().willRenderContent(),
                isDisplayed = widget.isVisible() && isOwningGridDisplayed,
                widgetSlot = this._registeredSlots[widget.getUniqueIdentifier()];

              if (isDisplayed && isOwningGridNoContentRender && this.willRenderContent()) {

                var hintSize = widgetLayoutInformation.getPreferred();
                widgetSlot.x.setHintSize(hintSize.getWidth());
                widgetSlot.y.setHintSize(hintSize.getHeight());
                if (widgetLayoutEngine.isXStretched()) {
                  widgetSlot.x.setStretchable(true);
                  layoutInformation.addChildrenStretchX(widgetLayoutInformation);
                }
                if (widgetLayoutEngine.isYStretched()) {
                  widgetSlot.y.setStretchable(true);
                  layoutInformation.addChildrenStretchY(widgetLayoutInformation);
                }
                widgetSlot.x.setOpportunisticStretchable(widgetLayoutInformation.getStretched().getOpportunisticX());
                widgetSlot.y.setOpportunisticStretchable(widgetLayoutInformation.getStretched().getOpportunisticY());
              }
            }
            this._xspace.adjustStretchability();
            this._yspace.adjustStretchability();
          }
          layoutInformation.setPreferred(this._xspace.getHintSize(), this._yspace.getHintSize());
        },

        /**
         * @inheritDoc
         */
        prepareApplyLayout: function() {
          var layoutInfo = this._widget.getLayoutInformation();
          var size = layoutInfo.getMeasured();
          var availableSize = layoutInfo.getAvailable().clone(true);
          var minimalSize = layoutInfo.getMinimal();
          if (minimalSize.getWidth() > availableSize.getWidth()) {
            availableSize.setWidth(minimalSize.getWidth());
          }
          if (minimalSize.getHeight() > availableSize.getHeight()) {
            availableSize.setHeight(minimalSize.getHeight());
          }
          var diffSize = availableSize.minus(size);
          if (diffSize.getWidth() >= 0) {
            var children = this._widget.getChildren() && this._widget.getChildren().filter(function(item) {
              return item && item.isHidden && !item.isHidden();
            });
            this._xspace.setStretchable(true);
            if (layoutInfo.getPreferred().hasWidth() || (children.length === 1 && (children[0] instanceof cls.VBoxWidget))) {
              this._xspace.doStretch(diffSize.getWidth());
            }
          } else {
            if (layoutInfo.getPreferred().hasWidth()) {
              this._xspace.doShrink(diffSize.getWidth());
            }
          }
          if (diffSize.getHeight() >= 0) {
            this._yspace.setStretchable(true);
            if (layoutInfo.getPreferred().hasHeight()) {
              this._yspace.doStretch(diffSize.getHeight());
            }
          } else {
            if (layoutInfo.getPreferred().hasHeight()) {
              this._yspace.doShrink(diffSize.getHeight());
            }
          }

          var hasGridChildrenInParentChildren = this._widget.getChildren() && this._widget.getChildren().filter(function(item) {
            return item && item.isHidden && !item.isHidden() && item.isGridChildrenInParent && item.isGridChildrenInParent();
          }).length;
          for (var i = 0; i < this._registeredWidgets.length; i++) {
            var widget = this._registeredWidgets[i];
            var slot = this._registeredSlots[widget.getUniqueIdentifier()];
            var widgetLayoutInformation = this._getLayoutInfo(widget);
            widgetLayoutInformation.setAvailable(
              this._xspace.adjustAvailableMeasure(slot.x),
              this._yspace.adjustAvailableMeasure(slot.y)
            );
            widgetLayoutInformation.setAllocated(widgetLayoutInformation.getAvailable().getWidth(), widgetLayoutInformation
              .getAvailable()
              .getHeight());
            var isChildOfGridWithGridChildrenInParent = !(!widget.isGridChildrenInParent || widget.isGridChildrenInParent()) &&
              Boolean(hasGridChildrenInParentChildren);
            widgetLayoutInformation.getHostElement()
              .toggleClass("gl_gridElementHidden", !slot.x.displayed)
              .toggleClass("g_gridChildrenInParent", Boolean(widget.isGridChildrenInParent && widget.isGridChildrenInParent()))
              .toggleClass("g_gridChildrenInParentChild", Boolean(widgetLayoutInformation.getOwningGrid()))
              .toggleClass("g_decoratingElement", Boolean(widgetLayoutInformation._extraGap))
              .toggleClass("g_childOfGridWithGridChildrenInParent", isChildOfGridWithGridChildrenInParent);
          }
          if (!this._widget._isGridChildrenInParent) {
            layoutInfo.setAllocated(
              this._xspace.getCalculatedSize() + layoutInfo.getDecorating().getWidth(true),
              this._yspace.getCalculatedSize() + layoutInfo.getDecorating().getHeight(true)
            );
          }
          this._styleRules[".g_measured #w_" + this._widget.getUniqueIdentifier() + ".g_measureable"] = {
            "min-height": layoutInfo.getAllocated().getHeight() + "px",
            "min-width": layoutInfo.getAllocated().getWidth() + "px"
          };
        },

        /**
         * @inheritDoc
         */
        applyLayout: function() {
          var prefix = ".gl_" + this._widget.getUniqueIdentifier() + "_";
          this._xspace.applyStyles(this._styleRules, prefix);
          this._yspace.applyStyles(this._styleRules, prefix);
          context.styler.appendStyleSheet(this._styleRules, this._styleSheetId, true, this.getLayoutSheetId());
        }
      };
    });
  });
