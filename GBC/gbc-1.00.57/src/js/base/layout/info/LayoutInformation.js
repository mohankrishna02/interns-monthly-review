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

modulum('LayoutInformation', ['EventListener'],
  function(context, cls) {
    /**
     * Layout information
     * This is an advanced class, be careful while using it
     * @class LayoutInformation
     * @memberOf classes
     * @extends classes.EventListener
     * @publicdoc Base
     */
    cls.LayoutInformation = context.oo.Class(cls.EventListener, function($super) {
      return /** @lends classes.LayoutInformation.prototype */ {
        __name: "LayoutInformation",
        /**
         * the widget
         * @type {classes.WidgetBase}
         */
        _widget: null,

        /**
         * @type {classes.RawLayoutInformation}
         */
        _rawInformation: null,

        /**
         * @type {classes.GridLayoutInformation}
         */
        _gridInformation: null,

        _isAutomaticStack: false,
        _isChildOfAutomaticStack: false,

        /**
         * Has a grid width set in the AUI
         * @type {boolean}
         */
        _hasRawGridWidth: false,
        /**
         * Initial size preferred by design
         * @type {classes.Size}
         */
        _preferred: null,
        /**
         * is the element sizable
         * @type boolean
         */
        _sizable: true,
        /**
         * Size hint //TODO this value should never be change by any LayoutEngine as it comes from VM
         * @type {classes.Size}
         */
        _sizeHint: null,
        /**
         * measured char size
         * @type {classes.CharSize}
         */
        _charSize: null,
        /**
         * Measure in current state
         * @type {classes.Size}
         */
        _measured: null,
        /**
         * Raw element measure
         * @type {classes.Size}
         */
        _rawMeasure: null,
        /**
         * Till which size i can shrink
         * @type {classes.Size}
         */
        _minimal: null,
        /**
         * Till which size i can grow
         * @type {classes.Size}
         */
        _maximal: null,
        /**
         * The space i will effectively take
         * @type {classes.Size}
         */
        _allocated: null,
        /**
         * The space my host reserved for me
         * @type {classes.Size}
         */
        _available: null,

        /**
         * widget overflow behavior when container is not big enough
         * @type {boolean}
         */
        _willOverflowContainerIfNeeded: false,

        /**
         * In case of a container, the space reserved for decoration(borders, title, ...)
         * @type {classes.Size}
         */
        _decorating: null,
        /**
         * In case of a container, the offset of the containerElement
         * @type {classes.Size}
         */
        _decoratingOffset: null,
        /**
         * x and y stretchability
         * @type {classes.Stretch}
         */
        _stretched: null,
        /**
         * list of children info that stretches x
         * @type {Array<classes.LayoutInformation>}
         */
        _childrenStretchX: null,
        /**
         * list of children info that stretches y
         * @type {Array<classes.LayoutInformation>}
         */
        _childrenStretchY: null,
        /**
         * classes applied to the host element
         * @type {?{x:?string, y:?string, width:?string, height:?string}}
         */
        _classes: null,
        /**
         * the host element
         * @type {HTMLElement}
         */
        _hostElement: null,
        /**
         * the size policy config
         * @type {classes.SizePolicyConfig}
         */
        _sizePolicyConfig: null,
        _needMeasure: true,
        _needValuedMeasure: false,
        _initialMeasure: false,
        /**
         * owning grid if any
         * @type {classes.WidgetGridLayoutBase}
         */
        _owningGrid: null,

        hasBeenFixed: false,

        forcedMinimalWidth: 1,
        forcedMinimalHeight: 1,

        /**
         * If widget content contains only a single line
         * @type {boolean}
         */
        _singleLineContentOnly: false,

        /** Number of cols reserved for decoration (done by VM)
         * @type {number}
         */
        _reservedDecorationSpace: 0,

        /**
         * @inheritDoc
         * @constructs
         * @param {classes.WidgetBase} widget Owner
         */
        constructor: function(widget) {
          $super.constructor.call(this);
          this._rawInformation = new cls.RawLayoutInformation();
          this._gridInformation = new cls.GridLayoutInformation();
          this._widget = widget;
          this._childrenStretchX = [];
          this._childrenStretchY = [];
          this._sizeHint = new cls.Size();
          this._charSize = new cls.CharSize();
          this._preferred = new cls.Size();
          this._measured = new cls.Size();
          this._rawMeasure = new cls.Size();
          this._minimal = new cls.Size();
          this._maximal = new cls.Size({
            undefinedValue: cls.Size.maximal
          });
          this._allocated = new cls.Size();
          this._available = new cls.Size();
          this._decorating = new cls.Size();
          this._decoratingOffset = new cls.Size();
          this._stretched = new cls.Stretch();
          this._sizePolicyConfig = new cls.SizePolicyConfig();
          this._classes = {
            x: null,
            y: null,
            width: null,
            height: null
          };
          this.reset();
        },
        /**
         * @inheritDoc
         */
        destroy: function() {
          this._widget = null;
          this._rawInformation.destroy();
          this._rawInformation = null;
          this._gridInformation.destroy();
          this._gridInformation = null;
          $super.destroy.call(this);
        },
        /**
         * reset the values for object reuse purpose
         * @param {boolean} [soft] true to keep information given by the VM
         */
        reset: function(soft) {
          if (!soft) {
            this._rawInformation.reset();
            this._gridInformation.reset();

            this._classes.x = null;
            this._classes.y = null;
            this._classes.width = null;
            this._classes.height = null;

            this._stretched.reset();
            this._sizePolicyConfig.reset();

            this.resetChildrenStretch();

            this._sizeHint.reset();
          }

          this._initialMeasure = false;
          this.hasBeenFixed = false;

          this._charSize.reset();
          this._preferred.reset();
          this._measured.reset();
          this._rawMeasure.reset();
          this._minimal.reset();
          this._maximal.reset();
          this._allocated.reset();
          this._available.reset();
          this._decorating.reset();
          this._decoratingOffset.reset();
        },

        /**
         *
         * @return {classes.RawLayoutInformation}
         */
        getRawInformation: function() {
          return this._rawInformation;
        },
        /**
         * returns true if the layout engine must measure element
         * @return {boolean} true if need measure
         */
        needMeasure: function() {
          if (this._needMeasure || this._needValuedMeasure) {
            this._needMeasure = false;
            this._needValuedMeasure = false;
            return true;
          }
          return !this._measured.hasWidth() && !this._measured.hasHeight();
        },
        /**
         * get the owning grid
         * @return {classes.WidgetGridLayoutBase} the owning grid
         */
        getOwningGrid: function() {
          return this._owningGrid;
        },
        /**
         * set the owning grid
         * @param {classes.WidgetGridLayoutBase} grid the grid
         */
        setOwningGrid: function(grid) {
          this._owningGrid = grid;
        },
        /**
         * force measure invalidation
         */
        invalidateMeasure: function() {
          this._needMeasure = true;
        },
        /**
         * force initial measure invalidation (for size policy initial purpose)
         * @param {boolean} hadValue true if had value once
         * @param {boolean} hasValue true if has currently a value
         */
        invalidateInitialMeasure: function(hadValue, hasValue) {
          if (this.getSizePolicyConfig().isDynamic()) {
            this._needValuedMeasure = true;
            this._initialMeasure = true;
          } else if (this.getSizePolicyConfig().isFixed()) {
            this._needValuedMeasure = false;
          } else if (!this._initialMeasure) {
            this._needValuedMeasure = true;
            if (!hadValue && hasValue) {
              this._initialMeasure = true;
            }
          }
        },
        /**
         * Get the raw element measure
         * @returns {classes.Size} the raw element measure
         */
        getRawMeasure: function() {
          return this._rawMeasure;
        },
        /**
         * Set the raw element measure
         * @param {number} width the width
         * @param {number} height the height
         */
        setRawMeasure: function(width, height) {
          this._rawMeasure.setWidth(width);
          this._rawMeasure.setHeight(height);
        },
        /**
         * Get the measured size
         * @returns {classes.Size} the measured size
         */
        getMeasured: function() {
          return this._measured;
        },
        /**
         * Set the measured size
         * @param {number} width the width
         * @param {number} height the height
         */
        setMeasured: function(width, height) {
          this._measured.setWidth(width);
          this._measured.setHeight(height);
        },
        /**
         * Get the minimal size
         * @returns {classes.Size} the minimal size
         */
        getMinimal: function(containerOnly) {
          if (containerOnly) {
            return this._minimal.minus(this._decorating);
          } else {
            return this._minimal;
          }
        },
        /**
         * Set the minimal size
         * @param {number} width the width
         * @param {number} height the height
         */
        setMinimal: function(width, height) {
          this._minimal.setWidth(width);
          this._minimal.setHeight(height);
        },
        /**
         * Get the maximal size
         * @returns {classes.Size} the maximal size
         */
        getMaximal: function() {
          return this._maximal;
        },
        /**
         * Set the maximal size
         * @param {number} width the width
         * @param {number} height the height
         */
        setMaximal: function(width, height) {
          this._maximal.setWidth(width);
          this._maximal.setHeight(height);
        },
        /**
         * Get the allocated size
         * @returns {classes.Size} the allocated size
         */
        getAllocated: function() {
          return this._allocated;
        },
        /**
         * Set the allocated size
         * @param {number} width the width
         * @param {number} height the height
         */
        setAllocated: function(width, height) {
          this._allocated.setWidth(width);
          this._allocated.setHeight(height);
        },
        /**
         * Get the decorating size
         * @returns {classes.Size} the decorating size
         */
        getDecorating: function() {
          return this._decorating;
        },
        /**
         * Set the decorating size
         * @param {number} width the width
         * @param {number} height the height
         */
        setDecorating: function(width, height) {
          this._decorating.setWidth(width);
          this._decorating.setHeight(height);
        },
        /**
         * Get the decorating offset
         * @returns {classes.Size} the decorating offset
         */
        getDecoratingOffset: function() {
          return this._decoratingOffset;
        },
        /**
         * Set the decorating offset
         * @param {number} width the width
         * @param {number} height the height
         */
        setDecoratingOffset: function(width, height) {
          this._decoratingOffset.setWidth(width);
          this._decoratingOffset.setHeight(height);
        },
        /**
         * Get the available size
         * @returns {classes.Size} the available size
         */
        getAvailable: function(containerOnly) {
          if (containerOnly) {
            return this._available.minus(this._decorating);
          } else {
            return this._available;
          }
        },
        /**
         * Set the available size
         * @param {number} width the width
         * @param {number} height the height
         */
        setAvailable: function(width, height) {
          this._available.setWidth(width);
          this._available.setHeight(height);
        },

        /**
         * get whether or not the widget would overflow its container if this one is not big enough
         * @return {boolean} true if the widget would overflow its container if this one is not big enough
         */
        willOverflowContainerIfNeeded: function() {
          /* // sample test of using context.DebugService.count
             // todo : see if feature is interesting
          if (this._willOverflowContainerIfNeeded) {
            context.DebugService.count("willOverflowContainerIfNeeded");
          }
          */
          return this._willOverflowContainerIfNeeded;
        },

        /**
         * set whether or not the widget would overflow its container if this one is not big enough
         * @param {boolean} willOverflowContainerIfNeeded - true to let the widget overflow its container if this one is not big enough
         */
        wouldOverflowContainerIfNeeded: function(willOverflowContainerIfNeeded) {
          this._willOverflowContainerIfNeeded = willOverflowContainerIfNeeded;
        },
        /**
         * Get the preferred size
         * @returns {classes.Size} the prefered size
         */
        getPreferred: function() {
          return this._preferred;
        },
        /**
         * Set the prefered size
         * @param {number} width the width
         * @param {number} height the height
         */
        setPreferred: function(width, height) {
          this._preferred.setWidth(width);
          this._preferred.setHeight(height);
        },

        /**
         * is the element sizable
         * @returns {boolean} true if it is sizable
         */
        isSizable: function() {
          return this._sizable;
        },

        /**
         * Set if the element is sizable
         * @param {boolean} sizable true if it is sizable
         */
        setSizable: function(sizable) {
          this._sizable = sizable;
        },

        /**
         * get the char size
         * @returns {classes.CharSize} the char size
         */
        getCharSize: function() {
          return this._charSize;
        },

        /**
         * Set the char size
         * @param {number} widthM witth of M
         * @param {number} width0 width of 0
         * @param {number} height height of M
         */
        setCharSize: function(widthM, width0, height) {
          this._charSize.setWidthM(widthM);
          this._charSize.setWidth0(width0);
          this._charSize.setHeight(height);
          this.updatePreferred();
        },

        /**
         * get the size hint
         * @returns {classes.Size} the size hint
         */
        getSizeHint: function() {
          return this._sizeHint;
        },

        /**
         * Set the size hint
         * @param {number} width the width
         * @param {number} height the height
         */
        setSizeHint: function(width, height) {
          this._sizeHint.setWidth(width);
          this._sizeHint.setHeight(height);
          this.updatePreferred();
        },

        /**
         * update prefered from size hint and char size
         */
        updatePreferred: function() {
          this._preferred.setWidth(cls.CharSize.translate(this._sizeHint.getWidth(true), this._charSize.getWidthM(), this._charSize
            .getWidth0()));
          this._preferred.setHeight(cls.Size.translate(this._sizeHint.getHeight(true), this._charSize.getHeight()));
        },

        /**
         * get the size policy config
         * @returns {classes.SizePolicyConfig} the size policy config
         */
        getSizePolicyConfig: function() {
          return this._sizePolicyConfig;
        },
        /**
         * get the current size policy
         * @returns {classes.SizePolicy} the current size policy
         */
        getCurrentSizePolicy: function() {
          return this._sizePolicyConfig.getMode();
        },
        /**
         * set the size policy mode
         * @param {string} policy the size policy mode
         */
        setSizePolicyMode: function(policy) {
          this._sizePolicyConfig.setMode(policy);
        },
        /**
         * get the x position in grid
         * @returns {number} the x position in grid
         */
        getGridX: function() {
          var delta = 0;
          if (this._owningGrid && !this.isInAutomaticStack()) {
            delta = this._owningGrid.getLayoutInformation().getGridX() || 0;
          }
          return this._gridInformation.getX() + delta;
        },

        /**
         * set the x position in grid
         * @param {number} x the x position in grid
         * @param {?boolean} [noEvent] true to avoid sending {context.constants.widgetEvents.gridInfoChanged}
         * @return {?boolean} true if the value has been changed
         */
        setGridX: function(x, noEvent) {
          if (x !== this._gridInformation.getGridX()) {
            this._gridInformation.setGridX(x || 0);
            this.setGridXClass(this.getPositionClassName("x", this.getGridX()));
            this.setGridWidthClass(this.getLengthClassName("w", this.getGridX(), this.getGridWidth()));
            if (!noEvent) {
              this.emit(context.constants.widgetEvents.gridInfoChanged);
            }
            return true;
          }
        },
        /**
         * get the y position in grid
         * @returns {number} the y position in grid
         */
        getGridY: function() {
          var delta = 0;
          if (this._owningGrid && !this.isInAutomaticStack()) {
            delta = this._owningGrid.getLayoutInformation().getGridY() || 0;
          }
          return this._gridInformation.getY() + delta;
        },
        /**
         * set the y position in grid
         * @param {number} y the y position in grid
         * @param {?boolean} [noEvent] true to avoid sending {context.constants.widgetEvents.gridInfoChanged}
         * @return {?boolean} true if the value has been changed
         */
        setGridY: function(y, noEvent) {
          if (y !== this._gridInformation.getGridY()) {
            this._gridInformation.setGridY(y || 0);
            this.setGridYClass(this.getPositionClassName("y", this.getGridY()));
            this.setGridHeightClass(this.getLengthClassName("h", this.getGridY(), this.getGridHeight()));
            if (!noEvent) {
              this.emit(context.constants.widgetEvents.gridInfoChanged);
            }
            return true;
          }
        },

        setVirtualGridY: function(y, no) {
          this._gridInformation.setVirtualGridY(y);
          this._gridInformation.setVirtualGridHeight(this._gridInformation.getGridHeight());
          this.setGridXClass(this.getPositionClassName("x", this.getGridX()));
          this.setGridWidthClass(this.getLengthClassName("w", this.getGridX(), this.getGridWidth()));
          this.setGridYClass(this.getPositionClassName("y", this.getGridY()));
          this.setGridHeightClass(this.getLengthClassName("h", this.getGridY(), this.getGridHeight()));
          if (!no) {
            this.emit(context.constants.widgetEvents.gridInfoChanged);
          }
          return true;
        },
        /**
         * get the width in grid
         * @returns {number} the width in grid
         */
        getGridWidth: function() {
          return this._gridInformation.getWidth();
        },

        /**
         * set the width in grid
         * @param {number} width the width in grid
         * @param {?boolean} [noEvent] true to avoid sending {context.constants.widgetEvents.gridInfoChanged}
         * @return {?boolean} true if the value has been changed
         */
        setGridWidth: function(width, noEvent) {
          this._hasRawGridWidth = Boolean(width);
          if (width !== this._gridInformation.getGridWidth()) {
            this._gridInformation.setGridWidth(width || (width === 0 ? 0 : 1));
            this.setGridWidthClass(this.getLengthClassName("w", this.getGridX(), this.getGridWidth()));
            if (!noEvent) {
              this.emit(context.constants.widgetEvents.gridInfoChanged);
            }
            return true;
          }
        },

        /**
         * Returns if layout has a grid width in the AUI (generally it should mean thant widget is in a grid)
         * @returns {boolean} true is has a grid width in the AUI
         */
        hasRawGridWidth: function() {
          return this._hasRawGridWidth;
        },

        /**
         * get the height in grid
         * @returns {number} the height in grid
         */
        getGridHeight: function() {
          return this._gridInformation.getHeight();
        },
        /**
         * set the height in grid
         * @param {number} height the height in grid
         * @param {?boolean} [noEvent] true to avoid sending {context.constants.widgetEvents.gridInfoChanged}
         * @return {?boolean} true if the value has been changed
         */
        setGridHeight: function(height, noEvent) {
          if (height !== this._gridInformation.getGridHeight()) {
            this._gridInformation.setGridHeight(height || (height === 0 ? 0 : 1));
            this.setGridHeightClass(this.getLengthClassName("h", this.getGridY(), this.getGridHeight()));
            if (!noEvent) {
              this.emit(context.constants.widgetEvents.gridInfoChanged);
            }
            return true;
          }
        },
        /**
         * get the host element
         * @returns {HTMLElement} the host element
         */
        getHostElement: function() {
          return this._hostElement;
        },
        /**
         * set the host element
         * @param {HTMLElement} hostElement the host element
         */
        setHostElement: function(hostElement) {
          this._hostElement = hostElement;
          this.setGridXClass(this.getPositionClassName("x", this.getGridX()));
          this.setGridYClass(this.getPositionClassName("y", this.getGridY()));
          this.setGridWidthClass(this.getLengthClassName("w", this.getGridX(), this.getGridWidth()));
          this.setGridHeightClass(this.getLengthClassName("h", this.getGridY(), this.getGridHeight()));
        },
        /**
         * set the grid x class on host element
         * @param {string} className the classname
         */
        setGridXClass: function(className) {
          if (this._classes.x) {
            if (this._hostElement) {
              this._hostElement.removeClass(this._classes.x);
            }
          }
          this._classes.x = className;
          if (this.isGridItem()) {
            if (this._hostElement) {
              this._hostElement.addClass(this._classes.x);
            }
          }
        },
        /**
         * set the grid y class on host element
         * @param {string} className the classname
         */
        setGridYClass: function(className) {
          if (this._classes.y) {
            if (this._hostElement) {
              this._hostElement.removeClass(this._classes.y);
            }
          }
          this._classes.y = className;
          if (this.isGridItem()) {
            if (this._hostElement) {
              this._hostElement.addClass(this._classes.y);
            }
          }
        },
        /**
         * set the grid width class on host element
         * @param {string} className the classname
         */
        setGridWidthClass: function(className) {
          if (this._classes.width) {
            if (this._hostElement) {
              this._hostElement.removeClass(this._classes.width);
            }
          }
          this._classes.width = className;
          if (this.isGridItem()) {
            if (this._hostElement) {
              this._hostElement.addClass(this._classes.width);
            }
          }
        },
        /**
         * set the grid height class on host element
         * @param {string} className the classname
         */
        setGridHeightClass: function(className) {
          if (this._classes.height) {
            if (this._hostElement) {
              this._hostElement.removeClass(this._classes.height);
            }
          }
          this._classes.height = className;
          if (this.isGridItem()) {
            if (this._hostElement) {
              this._hostElement.addClass(this._classes.height);
            }
          }
        },
        /**
         * test if item is in a grid layout
         * @todo check the test
         * @return {boolean} true if is a grid item
         */
        isGridItem: function() {
          return Boolean(this._widget.getParentWidget()) &&
            (
              this._widget.getParentWidget().getLayoutEngine() instanceof cls.GridLayoutEngine ||
              this._widget.getParentWidget().getLayoutEngine() instanceof cls.ScrollGridLayoutEngine
            );
        },

        /**
         * get the position classname
         * @param {string} way the wày (x/y)
         * @param {number} pos the position
         * @return {?string} the classname
         */
        getPositionClassName: function(way, pos) {
          if (this._widget.getParentWidget()) {
            var uuid = this._widget.getParentWidget().getUniqueIdentifier();
            return ["gl_", uuid, "_", way, "_", pos].join("");
          } else {
            return null;
          }
        },
        /**
         * get the position classname
         * @param {string} way the wày (width/height)
         * @param {number} pos the position
         * @param {number} len the length
         * @return {?string} the classname
         */
        getLengthClassName: function(way, pos, len) {
          if (this._widget.getParentWidget()) {
            var uuid = this._widget.getParentWidget().getUniqueIdentifier();
            return ["gl_", uuid, "_", way, "_", pos, "_", len].join("");
          } else {
            return null;
          }
        },

        /**
         * Set if widget content contains only a single line
         * @param {boolean} b true if widget content contains only a single line
         */
        setSingleLineContentOnly: function(b) {
          this._singleLineContentOnly = b;
        },

        /**
         * Returns if widget content contains only a single line
         * @returns {boolean} true if widget content contains only a single line
         */
        hasSingleLineContentOnly: function() {
          return this._singleLineContentOnly;
        },

        /**
         * Sets number of cols reserved for decoration by VM
         * @param {number} n number of cols reserved for decoration by VM
         */
        setReservedDecorationSpace: function(n) {
          this._reservedDecorationSpace = n;
        },

        /**
         * Returns number of cols reserved for decoration by VM
         * @returns {number} number of cols reserved for decoration by VM
         */
        getReservedDecorationSpace: function() {
          return this._reservedDecorationSpace;
        },

        /**
         * Get stretchability info
         * @returns {classes.Stretch} stretchability info
         */
        getStretched: function() {
          return this._stretched;
        },
        /**
         * get whether or not is x stretched
         * @returns {boolean} true if is x stretched
         */
        isXStretched: function() {
          return this.isInAutomaticStack() || this._stretched.getX(true);
        },
        /**
         * Set if is x stretched
         * @param {boolean} stretch true if is x stretched
         */
        setXStretched: function(stretch) {
          if (this._stretched.getX() !== stretch) {
            this._stretched.setX(stretch);
            this.emit(context.constants.widgetEvents.gridInfoChanged);
          }
        },
        /**
         * get whether or not is y stretched
         * @returns {boolean} true if is y stretched
         */
        isYStretched: function() {
          return this._stretched.getY(true);
        },
        /**
         * get whether or not at least one child is x stretchable
         * @returns {boolean} true if at least one child is x stretchable
         */
        isChildrenXStretched: function() {
          return Boolean(this._childrenStretchX.length);
        },
        /**
         * get whether or not at least one child is y stretchable
         * @returns {boolean} true if at least one child is y stretchable
         */
        isChildrenYStretched: function() {
          return Boolean(this._childrenStretchY.length);
        },
        /**
         * Set if is y stretched
         * @param {boolean} stretch true if is y stretched
         */
        setYStretched: function(stretch) {
          if (this._stretched.getY() !== stretch) {
            this._stretched.setY(stretch);
            this.emit(context.constants.widgetEvents.gridInfoChanged);
          }
        },
        /**
         * reset x and y stretchable list
         */
        resetChildrenStretch: function() {
          this._childrenStretchX.length = 0;
          this._childrenStretchY.length = 0;
        },
        /**
         * add child info to x stretchables
         * @param {classes.LayoutInformation} val the child info
         */
        addChildrenStretchX: function(val) {
          this._childrenStretchX.push(val);
        },
        /**
         * add child info to y stretchables
         * @param {classes.LayoutInformation} val the child info
         */
        addChildrenStretchY: function(val) {
          this._childrenStretchY.push(val);
        },
        /**
         * fired when grid information changed
         * @param {Hook} hook the hook
         * @return {HandleRegistration} the handle registration
         */
        onGridInfoChanged: function(hook) {
          return this.when(context.constants.widgetEvents.gridInfoChanged, hook);
        },

        setGridAutomaticStack: function(automaticStack, no) {
          if (this._isAutomaticStack !== automaticStack) {
            this._isAutomaticStack = automaticStack;
            if (this._hostElement) {
              this._hostElement.setAttribute("grid-renderer", this._isAutomaticStack ? "stack" : "grid");
            }
            if (!no) {
              this.emit(context.constants.widgetEvents.gridInfoChanged);
            }
          }
        },

        setChildOfGridAutomaticStack: function(automaticStack, no) {
          if (this._isChildOfAutomaticStack !== automaticStack) {
            this._isChildOfAutomaticStack = automaticStack;
            this._gridInformation.useVirtualCoordinates(automaticStack);
            if (this._hostElement) {
              this._hostElement.setAttribute("grid-parent-renderer", this._isChildOfAutomaticStack ? "stack" : "grid");
            }
            if (!no) {
              this.emit(context.constants.widgetEvents.gridInfoChanged);
            }
          }
        },

        isStacked: function() {
          return this._isAutomaticStack;
        },

        isInAutomaticStack: function() {
          return this._isChildOfAutomaticStack;
        },
        /**
         * invalidate information
         */
        invalidateInfos: function() {
          this.emit(context.constants.widgetEvents.gridInfoChanged);
        }
      };
    });
  });
