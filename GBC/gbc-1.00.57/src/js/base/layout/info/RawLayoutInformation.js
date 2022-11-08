/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('RawLayoutInformation', ['EventListener'],
  function(context, cls) {
    /**
     * Raw layout information
     * This is an advanced class, be careful while using it
     * @class RawLayoutInformation
     * @memberOf classes
     * @extends classes.EventListener
     * @publicdoc Base
     */
    cls.RawLayoutInformation = context.oo.Class(cls.EventListener, function($super) {
      return /** @lends classes.RawLayoutInformation.prototype */ {
        __name: "RawLayoutInformation",

        /**
         * is autoscale
         * @type {?number}
         */
        _autoScale: null,
        /**
         * The visible width of an object in character cells. For some objects like windows, tables and images, it can be followed by an optional unit (co,ln,pt,px). Default unit is character cells.
         * @type {?string}
         */
        _width: null,
        _height: null,
        _gridWidth: null,
        _gridHeight: null,
        _posX: null,
        _posY: null,
        _minWidth: null,
        _minHeight: null,
        _stepX: null,
        _stepY: null,
        _columnCount: null,
        _stretch: null,
        _wantFixedPageSize: null,
        _gridChildrenInParent: null,
        _childOfGridChildrenInParent: null,
        /**
         * the size policy config
         * @type {?string}
         */
        _sizePolicy: null,

        /**
         * @inheritDoc
         * @constructs
         */
        constructor: function() {
          $super.constructor.call(this);
          this.reset();
        },
        /**
         * @inheritDoc
         */
        destroy: function() {
          $super.destroy.call(this);
        },
        /**
         * reset the values for object reuse purpose
         */
        reset: function() {},

        /**
         *
         * @return {?string}
         */
        getSizePolicy: function() {
          return this._sizePolicy;
        },
        /**
         *
         * @param {?string} sizePolicy
         */
        setSizePolicy: function(sizePolicy) {
          if (this._sizePolicy !== sizePolicy) {
            this._sizePolicy = sizePolicy;
            this.invalidateInfos();
          }
        },

        getAutoScale: function() {
          return this._autoScale;
        },
        setAutoScale: function(autoScale) {
          if (this._autoScale !== autoScale) {
            this._autoScale = autoScale;
            this.invalidateInfos();
          }
        },

        getWidth: function() {
          return this._width;
        },
        setWidth: function(width) {
          if (this._width !== width) {
            this._width = width;
            this.invalidateInfos();
          }
        },

        getHeight: function() {
          return this._height;
        },
        setHeight: function(height) {
          if (this._height !== height) {
            this._height = height;
            this.invalidateInfos();
          }
        },

        getGridWidth: function() {
          return this._gridWidth;
        },
        setGridWidth: function(gridWidth) {
          if (this._gridWidth !== gridWidth) {
            this._gridWidth = gridWidth;
            this.invalidateInfos();
          }
        },

        getGridHeight: function() {
          return this._gridHeight;
        },
        setGridHeight: function(gridHeight) {
          if (this._gridHeight !== gridHeight) {
            this._gridHeight = gridHeight;
            this.invalidateInfos();
          }
        },

        getPosX: function() {
          return this._posX;
        },
        setPosX: function(posX) {
          if (this._posX !== posX) {
            this._posX = posX;
            this.invalidateInfos();
          }
        },

        getPosY: function() {
          return this._posY;
        },
        setPosY: function(posY) {
          if (this._posY !== posY) {
            this._posY = posY;
            this.invalidateInfos();
          }
        },

        getMinWidth: function() {
          return this._minWidth;
        },
        setMinWidth: function(minWidth) {
          if (this._minWidth !== minWidth) {
            this._minWidth = minWidth;
            this.invalidateInfos();
          }
        },

        getMinHeight: function() {
          return this._minHeight;
        },
        setMinHeight: function(minHeight) {
          if (this._minHeight !== minHeight) {
            this._minHeight = minHeight;
            this.invalidateInfos();
          }
        },

        getStepX: function() {
          return this._stepX;
        },
        setStepX: function(stepX) {
          if (this._stepX !== stepX) {
            this._stepX = stepX;
            this.invalidateInfos();
          }
        },

        getStepY: function() {
          return this._stepY;
        },
        setStepY: function(stepY) {
          if (this._stepY !== stepY) {
            this._stepY = stepY;
            this.invalidateInfos();
          }
        },

        getColumnCount: function() {
          return this._columnCount;
        },
        setColumnCount: function(columnCount) {
          if (this._columnCount !== columnCount) {
            this._columnCount = columnCount;
            this.invalidateInfos();
          }
        },

        getStretch: function() {
          return this._stretch;
        },
        setStretch: function(stretch) {
          if (this._stretch !== stretch) {
            this._stretch = stretch;
            this.invalidateInfos();
          }
        },

        getWantFixedPageSize: function() {
          return this._wantFixedPageSize;
        },
        setWantFixedPageSize: function(wantFixedPageSize) {
          if (this._wantFixedPageSize !== wantFixedPageSize) {
            this._wantFixedPageSize = wantFixedPageSize;
            this.invalidateInfos();
          }
        },

        getGridChildrenInParent: function() {
          return this._gridChildrenInParent;
        },
        setGridChildrenInParent: function(gridChildrenInParent) {
          if (this._gridChildrenInParent !== gridChildrenInParent) {
            this._gridChildrenInParent = gridChildrenInParent;
            this.invalidateInfos();
          }
        },

        getChildOfGridChildrenInParent: function() {
          return this._childOfGridChildrenInParent;
        },
        setChildOfGridChildrenInParent: function(childOfGridChildrenInParent) {
          if (this._childOfGridChildrenInParent !== childOfGridChildrenInParent) {
            this._childOfGridChildrenInParent = childOfGridChildrenInParent;
            this.invalidateInfos();
          }
        },

        /**
         * fired when grid information changed
         * @param {Hook} hook the hook
         * @param {boolean} [once] fires only once
         * @return {HandleRegistration} the handle registration
         */
        onRawLayoutInformationChanged: function(hook, once) {
          return this.when(context.constants.widgetEvents.layoutInformationChanged, hook, Boolean(once));
        },
        /**
         * invalidate information
         */
        invalidateInfos: function() {
          this.emit(context.constants.widgetEvents.layoutInformationChanged);
        }
      };
    });
  });
