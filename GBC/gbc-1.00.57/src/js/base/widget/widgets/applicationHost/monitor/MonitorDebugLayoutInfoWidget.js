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

modulum('MonitorDebugLayoutInfoWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class MonitorDebugLayoutInfoWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.MonitorDebugLayoutInfoWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.MonitorDebugLayoutInfoWidget.prototype */ {
        __name: "MonitorDebugLayoutInfoWidget",
        _layoutEngineName: null,
        _posX: null,
        _posY: null,
        _gridWidth: null,
        _gridHeight: null,
        _width: null,
        _height: null,
        _measuredHasSize: null,
        _measuredWidth: null,
        _measuredHeight: null,
        _minimalHasSize: null,
        _minimalWidth: null,
        _minimalHeight: null,
        _maximalHasSize: null,
        _maximalWidth: null,
        _maximalHeight: null,
        _availableHasSize: null,
        _availableWidth: null,
        _availableHeight: null,
        _allocatedHasSize: null,
        _allocatedWidth: null,
        _allocatedHeight: null,
        _preferredHasSize: null,
        _preferredWidth: null,
        _preferredHeight: null,
        _decoratingHasSize: null,
        _decoratingWidth: null,
        _decoratingHeight: null,
        _decoratingoffsetHasSize: null,
        _decoratingoffsetWidth: null,
        _decoratingoffsetHeight: null,
        _stretchX: null,
        _stretchY: null,
        _childrenStretchX: null,
        _childrenStretchY: null,
        _invalidatedMeasure: null,
        _invalidatedAllocatedSpace: null,
        _initElement: function() {
          $super._initElement.call(this);
          this._layoutEngineName = this._element.getElementsByClassName("value_layoutEngineName")[0];
          this._posX = this._element.getElementsByClassName("value_posX")[0];
          this._posY = this._element.getElementsByClassName("value_posY")[0];
          this._gridWidth = this._element.getElementsByClassName("value_gridWidth")[0];
          this._gridHeight = this._element.getElementsByClassName("value_gridHeight")[0];
          this._width = this._element.getElementsByClassName("value_width")[0];
          this._height = this._element.getElementsByClassName("value_height")[0];
          this._measuredHasSize = this._element.getElementsByClassName("value_measured_hasSize")[0];
          this._measuredWidth = this._element.getElementsByClassName("value_measured_width")[0];
          this._measuredHeight = this._element.getElementsByClassName("value_measured_height")[0];
          this._minimalHasSize = this._element.getElementsByClassName("value_minimal_hasSize")[0];
          this._minimalWidth = this._element.getElementsByClassName("value_minimal_width")[0];
          this._minimalHeight = this._element.getElementsByClassName("value_minimal_height")[0];
          this._maximalHasSize = this._element.getElementsByClassName("value_maximal_hasSize")[0];
          this._maximalWidth = this._element.getElementsByClassName("value_maximal_width")[0];
          this._maximalHeight = this._element.getElementsByClassName("value_maximal_height")[0];
          this._availableHasSize = this._element.getElementsByClassName("value_available_hasSize")[0];
          this._availableWidth = this._element.getElementsByClassName("value_available_width")[0];
          this._availableHeight = this._element.getElementsByClassName("value_available_height")[0];
          this._allocatedHasSize = this._element.getElementsByClassName("value_allocated_hasSize")[0];
          this._allocatedWidth = this._element.getElementsByClassName("value_allocated_width")[0];
          this._allocatedHeight = this._element.getElementsByClassName("value_allocated_height")[0];
          this._preferredHasSize = this._element.getElementsByClassName("value_preferred_hasSize")[0];
          this._preferredWidth = this._element.getElementsByClassName("value_preferred_width")[0];
          this._preferredHeight = this._element.getElementsByClassName("value_preferred_height")[0];
          this._decoratingHasSize = this._element.getElementsByClassName("value_decorating_hasSize")[0];
          this._decoratingWidth = this._element.getElementsByClassName("value_decorating_width")[0];
          this._decoratingHeight = this._element.getElementsByClassName("value_decorating_height")[0];
          this._decoratingoffsetHasSize = this._element.getElementsByClassName("value_decoratingoffset_hasSize")[0];
          this._decoratingoffsetWidth = this._element.getElementsByClassName("value_decoratingoffset_width")[0];
          this._decoratingoffsetHeight = this._element.getElementsByClassName("value_decoratingoffset_height")[0];
          this._stretchX = this._element.getElementsByClassName("value_stretch_x")[0];
          this._stretchY = this._element.getElementsByClassName("value_stretch_y")[0];
          this._childrenStretchX = this._element.getElementsByClassName("value_stretch_children_x")[0];
          this._childrenStretchY = this._element.getElementsByClassName("value_stretch_children_y")[0];
          this._invalidatedMeasure = this._element.getElementsByClassName("value_invalidated_measure")[0];
          this._invalidatedAllocatedSpace = this._element.getElementsByClassName("value_invalidated_allocatedspace")[0];

        },
        setLayoutEngineName: function(value) {
          this._layoutEngineName.textContent = value;
        },
        setPosX: function(value) {
          this._posX.textContent = value;
        },
        setPosY: function(value) {
          this._posY.textContent = value;
        },
        setGridWidth: function(value) {
          this._gridWidth.textContent = value;
        },
        setGridHeight: function(value) {
          this._gridHeight.textContent = value;
        },
        setWidth: function(value) {
          this._width.textContent = value;
        },
        setHeight: function(value) {
          this._height.textContent = value;
        },
        setMeasuredHasSize: function(value) {
          this._measuredHasSize.textContent = value;
        },
        setMeasuredWidth: function(value) {
          this._measuredWidth.textContent = value;
        },
        setMeasuredHeight: function(value) {
          this._measuredHeight.textContent = value;
        },
        setMinimalHasSize: function(value) {
          this._minimalHasSize.textContent = value;
        },
        setMinimalWidth: function(value) {
          this._minimalWidth.textContent = value;
        },
        setMinimalHeight: function(value) {
          this._minimalHeight.textContent = value;
        },
        setMaximalHasSize: function(value) {
          this._maximalHasSize.textContent = value;
        },
        setMaximalWidth: function(value) {
          this._maximalWidth.textContent = value;
        },
        setMaximalHeight: function(value) {
          this._maximalHeight.textContent = value;
        },
        setAvailableHasSize: function(value) {
          this._availableHasSize.textContent = value;
        },
        setAvailableWidth: function(value) {
          this._availableWidth.textContent = value;
        },
        setAvailableHeight: function(value) {
          this._availableHeight.textContent = value;
        },
        setAllocatedHasSize: function(value) {
          this._allocatedHasSize.textContent = value;
        },
        setAllocatedWidth: function(value) {
          this._allocatedWidth.textContent = value;
        },
        setAllocatedHeight: function(value) {
          this._allocatedHeight.textContent = value;
        },
        setPreferredHasSize: function(value) {
          this._preferredHasSize.textContent = value;
        },
        setPreferredWidth: function(value) {
          this._preferredWidth.textContent = value;
        },
        setPreferredHeight: function(value) {
          this._preferredHeight.textContent = value;
        },
        setDecoratingHasSize: function(value) {
          this._decoratingHasSize.textContent = value;
        },
        setDecoratingWidth: function(value) {
          this._decoratingWidth.textContent = value;
        },
        setDecoratingHeight: function(value) {
          this._decoratingHeight.textContent = value;
        },
        setDecoratingoffsetHasSize: function(value) {
          this._decoratingoffsetHasSize.textContent = value;
        },
        setDecoratingoffsetWidth: function(value) {
          this._decoratingoffsetWidth.textContent = value;
        },
        setDecoratingoffsetHeight: function(value) {
          this._decoratingoffsetHeight.textContent = value;
        },
        setStretchX: function(value) {
          this._stretchX.textContent = value;
        },
        setStretchY: function(value) {
          this._stretchY.textContent = value;
        },
        setChildrenStretchX: function(value) {
          this._childrenStretchX.textContent = value;
        },
        setChildrenStretchY: function(value) {
          this._childrenStretchY.textContent = value;
        },
        setInvalidatedMeasure: function(value) {
          this._invalidatedMeasure.textContent = value;
        },
        setInvalidatedAllocatedSpace: function(value) {
          this._invalidatedAllocatedSpace.textContent = value;
        },
        /**
         * Remove the layout panel and add a message instead
         */
        setNoLayout: function() {
          this.setLayoutEngineName("No layout information");
          this._element.querySelector(".aui").addClass("hidden");
          this._element.querySelector(".measures").addClass("hidden");
          this._element.querySelector(".stretch").addClass("hidden");
          this._element.querySelector("h6").addClass("hidden");

        }
      };
    });
    cls.WidgetFactory.registerBuilder('MonitorDebugLayoutInfo', cls.MonitorDebugLayoutInfoWidget);
  });
