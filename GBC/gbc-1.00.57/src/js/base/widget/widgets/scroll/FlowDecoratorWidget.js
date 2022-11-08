/// FOURJS_START_COPYRIGHT(D,2019)
/// Property of Four Js*
/// (c) Copyright Four Js 2019, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('FlowDecoratorWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {
    /**
     * Widget to handle overflowing items in a dropdown
     * @memberOf classes
     * @extends classes.WidgetBase
     * @publicdoc Widgets
     */
    cls.FlowDecoratorWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.FlowDecoratorWidget.prototype */ {
        __name: "FlowDecoratorWidget",

        /** @type {classes.WidgetBase[]} */
        _overflowWidgets: null,

        /** @type {classes.DropDownWidget} */
        _dropDown: null,

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.FlowItemLayoutEngine(this);
        },

        /**
         * @inheritDoc
         */
        constructor: function(opt) {
          $super.constructor.call(this, opt);
          this._overflowWidgets = [];
          this._dropDown = cls.WidgetFactory.createWidget('DropDown', this.getBuildParameters());
          this._dropDown.addClass("gbc_FlowingDropDown");
          this._dropDown.reverseX = true;
        },

        /**
         * @inheritDoc
         */
        setParentWidget: function(widget, options) {
          $super.setParentWidget.call(this, widget, options);
          this._dropDown.setParentWidget(widget);
          this._dropDown.shouldClose = function(targetElement) {
            var isParentChild = targetElement.isElementOrChildOf(widget.getElement());
            return !isParentChild;
          };
        },

        /**
         * Defines the orientation of the dropdown
         * @param {String} orientation - can be "horizontal" or "vertical"
         */
        setOrientation: function(orientation) {
          this._dropDown.addClass("gbc_orientation_" + orientation);
        },

        /**
         * Defines the rendering of the dropdown
         * @param {String} rendering - can be "list" or "buttons"
         */
        setRendering: function(rendering) {
          this._dropDown.addClass("gbc_rendering_" + rendering);
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          if (this._dropDown && this._dropDown.isVisible()) {
            this.closeDropDown();
          } else {
            this.openDropDown();
          }
          return true;
        },

        /**
         * Show the dropdown with flowing items
         */
        openDropDown: function() {
          this._dropDown.show();
        },

        /**
         * Hide the dropdown with flowing items
         */
        closeDropDown: function() {
          this._dropDown.hide();
        },

        /**
         * Flow a given child widget
         * @param {classes.WidgetBase} widget - widget to add to the dropdown
         * @param {boolean} flowing true to add to the dropdown, false to put it back to the toolbar
         */
        flowChild: function(widget, flowing) {
          var opt = {};

          if (flowing) {
            opt.ordered = true;
            this._dropDown.adoptChildWidget(widget, opt);
            widget.when(context.constants.widgetEvents.click, function() {
              this._dropDown.hide();
            }.bind(this));
          } else {

            this.getParentWidget().adoptChildWidget(widget, opt);
          }
          if (this._dropDown.getChildren().length <= 0) {
            this.enable(false);
          }
        },

        /**
         * Get a copy of flowing children
         * @return {classes.WidgetBase[]}
         */
        getFlowingChildren: function() {
          return this._dropDown.getChildren().slice(0);
        },

        /**
         * Enable the flowing mechanism by displaying it
         * @param {Boolean} enabled - true to activate it, false to de-activate
         */
        enable: function(enabled) {
          this.setHidden(!enabled);
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          $super.destroy.call(this);
          if (this._dropDown) {
            this._dropDown.destroy();
            this._dropDown = null;
          }
        },

      };
    });
    cls.WidgetFactory.registerBuilder('FlowDecorator', cls.FlowDecoratorWidget);

  });
