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

modulum('LayoutEngineBase', ['EventListener', 'LayoutInvalidationService'],
  function(context, cls) {
    /**
     * Definition of Layout Engine
     * This is an advanced class, be careful while using it
     * @class LayoutEngineBase
     * @memberOf classes
     * @extends classes.EventListener
     * @publicdoc Base
     */
    cls.LayoutEngineBase = context.oo.Class(cls.EventListener, function($super) {
      return /** @lends classes.LayoutEngineBase.prototype */ {
        __name: "LayoutEngineBase",

        /**
         * owner widget
         * @protected
         * @type {classes.WidgetBase}
         */
        _widget: null,

        /**
         * flag to know if widget's char size has been measured
         * @type {boolean}
         */
        _charMeasured: false,

        /**
         * buffered css rules
         * @type {Object}
         * @protected
         */
        _styleRules: null,

        /**
         * layout statuses
         * @type {?classes.LayoutStatus}
         * @protected
         */
        _statuses: null,

        /**
         * the current measure invalidation timestamp
         * @type {number}
         */
        _invalidatedMeasure: context.LayoutInvalidationService.getInitialInvalidation(),

        /**
         * the current allocated space invalidation timestamp
         * @type {number}
         */
        _invalidatedAllocatedSpace: context.LayoutInvalidationService.getInitialInvalidation(),

        /**
         * flag to know if this layout has to force parent layout measure invalidation
         * @type {boolean}
         */
        _forceParentInvalidateMeasure: false,

        /**
         * flag to know if this layout needs measure
         * @type {boolean}
         */
        _needMeasure: true,

        /**
         * @inheritDoc
         * @constructs
         * @param {classes.WidgetBase} widget Owner widget
         */
        constructor: function(widget) {
          $super.constructor.call(this);
          this._widget = widget;
          this._styleRules = {};
          this._statuses = {
            measured: false,
            adjusted: false,
            layouted: false
          };
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._destroyStyle();
          this._widget = null;
          this._styleRules = null;
          this._statuses = null;
          $super.destroy.call(this);
        },

        /**
         * Destroy style sheet related to widget layout engine
         * @private
         */
        _destroyStyle: function() {
          if (this._styleSheetId) {
            var stylingContext = this._widget.getStylingContext();
            if (stylingContext === "window") {
              var win = this._widget.getWindowWidget();
              var sheetId = win && win.getUniqueIdentifier() || this._appHash || "_";
              context.styler.appendStyleSheet({}, this._styleSheetId, true, sheetId);
            } else if (stylingContext === "widget") {
              context.styler.removeStyleSheet(this._styleSheetId);
            }
          }
        },

        /**
         * Resets all precalculated layout data
         * @param {boolean} recursive is the reset need to be applied to children recursively
         */
        reset: function(recursive) {
          this._statuses.layouted = false;
          this._statuses.measured = false;
          this._statuses.adjusted = false;

          this._invalidatedMeasure = context.LayoutInvalidationService.getInitialInvalidation();
          this._invalidatedAllocatedSpace = context.LayoutInvalidationService.getInitialInvalidation();
          this._forceParentInvalidateMeasure = false;
          this._needMeasure = true;
          this._charMeasured = false;
          this._getLayoutInfo().reset(true);
          if (recursive) {
            var children = this._widget && this._widget.getChildren && this._widget.getChildren(),
              i = 0,
              len = children && children.length || 0;
            for (; i < len; i++) {
              var engine = children[i].getLayoutEngine();
              if (engine) {
                engine.reset(recursive);
              }
            }
          }
        },

        /**
         * Get layout information of the given widget, or owner widget if not given
         * @param {classes.WidgetBase=} widget the widget
         * @returns {classes.LayoutInformation} thi information
         */
        _getLayoutInfo: function(widget) {
          var w = widget || this._widget;
          if (!w) {
            return null;
          }
          return w.getLayoutInformation();
        },

        /**
         * The layout engine cannot have a child
         * @param {classes.WidgetBase} widget child widget
         */
        registerChild: function(widget) {},

        /**
         * The layout engine cannot have a child
         * @param {classes.WidgetBase} widget child widget
         */
        unregisterChild: function(widget) {},

        /**
         * reset
         */
        resetSizes: function() {
          var layoutInfo = this._widget.getLayoutInformation();
          layoutInfo.getMinimal().reset();
          layoutInfo.getMaximal().reset();
          layoutInfo.getMeasured().reset();
          layoutInfo.getAllocated().reset();
          layoutInfo.getAvailable().reset();
        },

        /**
         * action entry point to deal with layout information, children widget layout information/placement before any layout computing is done
         */
        beforeLayout: function() {},

        /**
         * prepare measure self widget
         */
        prepareMeasure: function() {},

        /**
         * measure char size in widget
         */
        measureChar: function() {
          if (!this._ignoreLayout && !this._charMeasured) {
            var MMMlen = this._widget.__charMeasurer1.getBoundingClientRect(),
              _000len = this._widget.__charMeasurer2.getBoundingClientRect();
            this._getLayoutInfo().setCharSize(MMMlen.width / 10, _000len.width / 10, MMMlen.height / 10);
            if (_000len.width > 0 && MMMlen.height > 0) {
              this._charMeasured = true;
            }
          }
        },
        /**
         * raw measure widget DOM element
         */
        DOMMeasure: function() {
          var layoutInfo = this._widget.getLayoutInformation(),
            element = this._widget.getElement(),
            elemRects = element.getBoundingClientRect();

          layoutInfo.setRawMeasure(elemRects.width, elemRects.height);
        },

        /**
         * measure self widget
         */
        measure: function() {},

        /**
         * measure widget decoration
         */
        measureDecoration: function() {

        },

        /**
         * called after measure.
         * Should not be overridden
         */
        afterMeasure: function() {
          this._statuses.measured = true;
        },

        /**
         * update information from children to parent
         */
        prepareAdjustments: function() {},

        /**
         * determine measured ('natural size') from children
         */
        adjustMeasure: function() {},

        /**
         * called after adjust.
         * Should not be overridden
         */
        afterAdjustMeasure: function() {
          this._statuses.adjusted = true;
        },

        /**
         * determine children stretchability
         */
        adjustStretchability: function() {},

        /**
         * determine stretched allocated size for children
         * @param {classes.LayoutApplicationService} [layoutApplicationService] layoutApplicationService
         */
        prepareApplyLayout: function(layoutApplicationService) {},

        /**
         * apply final sizes
         */
        applyLayout: function() {},

        /**
         * Notify layout was applied
         */
        notifyLayoutApplied: function() {
          this.emit(context.constants.widgetEvents.layoutApplied);
        },

        /**
         * Everytime layout is applied, launch a callback
         * @param {Hook} hook - callback to appy
         * @return {HandleRegistration}  a registration handle (for unbind purpose)
         */
        onLayoutApplied: function(hook) {
          return this.when(context.constants.widgetEvents.layoutApplied, hook);
        },

        /**
         * does the widget need measure
         * @return {boolean} true if the widget need measure
         */
        needMeasure: function() {
          return this._needMeasure;
        },

        /**
         * method that would return true if the engine does not want to force a measuring
         * @return {boolean} true if the engine does not want to force a measuring
         */
        ignoreMeasureInvalidation: function() {
          return false;
        },

        /**
         * force measure need
         */
        forceMeasurement: function() {
          this._needMeasure = true;
        },
        /**
         * invalidates measure of the linked widget against an invalidation increment
         * @param {number} [invalidation] the invalidation timestamp
         */
        invalidateMeasure: function(invalidation) {
          if (this._widget && this._widget.getElement() && !this._widget.getElement().isInDOM()) {
            this._invalidatedMeasure = context.LayoutInvalidationService.getInitialInvalidation();
          }
          this._invalidatedMeasure = this._prepareInvalidation(invalidation, this._invalidatedMeasure);
          if (this._widget && (this._forceParentInvalidateMeasure || !this._widget.isHidden())) {
            var parentWidget = this._widget && this._widget.getParentWidget(),
              parentEngine = parentWidget && parentWidget.getLayoutEngine();
            if (parentEngine) {
              parentEngine.invalidateMeasure(this._invalidatedMeasure, this);
            }
            this._forceParentInvalidateMeasure = false;
          }
        },

        /**
         * invalidates allocated space of the linked widget against an invalidation increment
         * @param {number} [invalidation] the invalidation timestamp
         */
        invalidateAllocatedSpace: function(invalidation) {
          this._invalidatedAllocatedSpace = this._prepareInvalidation(invalidation, this._invalidatedAllocatedSpace);
          if (this._widget && !this._widget.isHidden()) {
            var children = this.getRenderableChildren(),
              len = children.length;
            for (var i = 0; i < len; i++) {
              if (children[i]) {
                var layoutEngine = children[i].getLayoutEngine();
                if (layoutEngine) {
                  layoutEngine.invalidateAllocatedSpace(this._invalidatedAllocatedSpace);
                }
              }
            }
          }
        },

        _prepareInvalidation: function(invalidation, current) {
          if (current !== context.LayoutInvalidationService.getInitialInvalidation() && (!invalidation || current < invalidation)) {
            return invalidation || context.LayoutInvalidationService.nextInvalidation();
          }
          return current;
        },
        /**
         * test if layout must switch to measure mode
         * @return {boolean} true if measure mode is neede
         */
        needMeasureSwitching: function() {
          return true;
        },
        /**
         * test measure invalidation against a timestamp
         * @param {number} timestamp the timestamp
         * @return {boolean} true if measure is invalidated
         */
        isInvalidatedMeasure: function(timestamp) {
          return this.needMeasure() && Boolean(this._widget) &&
            !this._widget.isHidden() && (this._invalidatedMeasure >= timestamp);
        },
        /**
         * test allocated space invalidation against a timestamp
         * @param {number} timestamp the timestamp
         * @return {boolean} true if allocated space is invalidated
         */
        isInvalidatedAllocatedSpace: function(timestamp) {
          return Boolean(this._widget) && !this._widget.isHidden() &&
            (this._invalidatedAllocatedSpace >= timestamp);
        },
        /**
         * test invalidation against a timestamp
         * @param {number} timestamp the timestamp
         * @return {boolean} true if layout engine is invalidated
         */
        isInvalidated: function(timestamp) {
          var result = this.isInvalidatedMeasure(timestamp) || this.isInvalidatedAllocatedSpace(timestamp),
            windowWidget = this._widget && this._widget.getWindowWidget();

          return result && (!windowWidget || !windowWidget._disabled || windowWidget._forceVisible);
        },

        isXStretched: function() {
          var info = this._getLayoutInfo();
          return info && info.isXStretched() || info.isChildrenXStretched();
        },

        isYStretched: function() {
          var info = this._getLayoutInfo();
          return info && info.isYStretched() || info.isChildrenYStretched();
        },

        /**
         * get list of renderable children
         * @return {classes.WidgetBase[]} list of renderable children
         */
        getRenderableChildren: function() {
          return this._widget && this._widget.getChildren && this._widget.getChildren() || [];
        },
        /**
         * update invalidation information
         * @param {number} invalidation the invalidation timestamp
         */
        updateInvalidated: function(invalidation) {
          if (this._widget && this._widget.isLayoutMeasureable(true)) {
            this._invalidatedMeasure = this._getUpdatedInvalidation(invalidation, this._invalidatedMeasure);
            this._invalidatedAllocatedSpace = this._getUpdatedInvalidation(invalidation, this._invalidatedAllocatedSpace);
            if (this._getLayoutInfo().getSizePolicyConfig().isInitial()) {
              this._needMeasure = false;
            }
            this._statuses.layouted = true;
          }
        },

        _getUpdatedInvalidation: function(invalidation, current) {
          return Math.max(invalidation, current === context.LayoutInvalidationService.getInitialInvalidation() ? 1 : current);
        },

        /**
         * Inform the layout that visibility has changed
         */
        changeHidden: function() {
          this._forceParentInvalidateMeasure = true;
          if (this._widget && this._widget.getParentWidget() && this._widget.getParentWidget().getLayoutEngine()) {
            this._widget.getParentWidget().getLayoutEngine().invalidateMeasure();
            this._widget.getParentWidget().getLayoutEngine().invalidateAllocatedSpace();
          }
          this.invalidateMeasure();
        },

        /**
         * get a generated css sheet id
         * @return {string}
         */
        getLayoutSheetId: function() {
          return this._widget && this._widget.getStyleSheetId() || "_";
        }
      };
    });
  });
