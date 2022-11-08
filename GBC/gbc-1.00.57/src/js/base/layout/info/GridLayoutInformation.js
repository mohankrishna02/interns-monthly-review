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

modulum('GridLayoutInformation', ['EventListener'],
  function(context, cls) {
    /**
     * Grid layout information
     * This is an advanced class, be careful while using it
     * @class GridLayoutInformation
     * @memberOf classes
     * @extends classes.EventListener
     * @publicdoc Base
     */
    cls.GridLayoutInformation = context.oo.Class(cls.EventListener, function($super) {
      return /** @lends classes.GridLayoutInformation.prototype */ {
        __name: "GridLayoutInformation",

        _useVirtual: false,

        _gridX: null,
        _gridY: null,
        _gridWidth: null,
        _gridHeight: null,

        _virtualGridX: null,
        _virtualGridY: null,
        _virtualGridWidth: null,
        _virtualGridHeight: null,

        /**
         * @inheritDoc
         * @constructs
         */
        constructor: function() {
          $super.constructor.call(this);
          this.reset();
        },
        /**
         * reset the values for object reuse purpose
         */
        reset: function() {
          this._gridX = 0;
          this._gridY = 0;
          this._gridWidth = 1;
          this._gridHeight = 1;

          this._virtualGridX = 0;
          this._virtualGridY = 0;
          this._virtualGridWidth = 1;
          this._virtualGridHeight = 1;
        },

        isUsingVirtualCoordinates: function() {
          return Boolean(this._useVirtual);
        },
        useVirtualCoordinates: function(useVirtual) {
          useVirtual = Boolean(useVirtual);
          if (this._useVirtual !== useVirtual) {
            this._useVirtual = useVirtual;
            this.invalidateInfos();
          }
        },

        getX: function() {
          return this._useVirtual ? this._virtualGridX : this._gridX;
        },
        getY: function() {
          return this._useVirtual ? this._virtualGridY : this._gridY;
        },
        getWidth: function() {
          return this._useVirtual ? this._virtualGridWidth : this._gridWidth;
        },
        getHeight: function() {
          return this._useVirtual ? this._virtualGridHeight : this._gridHeight;
        },

        getGridX: function() {
          return this._gridX;
        },
        setGridX: function(gridX) {
          if (this._gridX !== gridX) {
            this._gridX = gridX;
            this.invalidateInfos();
          }
        },

        getGridY: function() {
          return this._gridY;
        },
        setGridY: function(gridY) {
          if (this._gridY !== gridY) {
            this._gridY = gridY;
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

        getVirtualGridX: function() {
          return this._virtualGridX;
        },
        setVirtualGridX: function(gridX) {
          if (this._virtualGridX !== gridX) {
            this._virtualGridX = gridX;
            this.invalidateInfos();
          }
        },

        getVirtualGridY: function() {
          return this._virtualGridY;
        },
        setVirtualGridY: function(gridY) {
          if (this._virtualGridY !== gridY) {
            this._virtualGridY = gridY;
            this.invalidateInfos();
          }
        },

        getVirtualGridWidth: function() {
          return this._virtualGridWidth;
        },
        setVirtualGridWidth: function(gridWidth) {
          if (this._virtualGridWidth !== gridWidth) {
            this._virtualGridWidth = gridWidth;
            this.invalidateInfos();
          }
        },

        getVirtualGridHeight: function() {
          return this._virtualGridHeight;
        },
        setVirtualGridHeight: function(gridHeight) {
          if (this._virtualGridHeight !== gridHeight) {
            this._virtualGridHeight = gridHeight;
            this.invalidateInfos();
          }
        },

        /**
         * fired when grid information changed
         * @param {Hook} hook the hook
         * @return {HandleRegistration} the handle registration
         */
        onGridLayoutInformationChanged: function(hook) {
          return this.when(context.constants.widgetEvents.layoutInformationChanged, hook);
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
