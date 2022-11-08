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

modulum('ToolBarWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * ToolBar widget.
     * @class ToolBarWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     * @publicdoc Widgets
     */
    cls.ToolBarWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.ToolBarWidget.prototype */ {
        __name: 'ToolBarWidget',

        /**
         * Widget to use to scroll on toolbar
         * @type {classes.FlowDecoratorWidget}
         */
        _flowDecoratorWidget: null,

        /** @type {Element} **/
        _flowDecoratorContainer: null,

        /** @type {classes.ChromeBarWidget} **/
        _chromeBar: null,

        _resizeHandler: null,

        /** @type {classes.FormWidget} **/
        _formWidget: null,

        /**
         * @inheritDoc
         */
        _initContainerElement: function() {
          $super._initContainerElement.call(this);
          this._flowDecoratorWidget = cls.WidgetFactory.createWidget("FlowDecorator", this.getBuildParameters());
          this._flowDecoratorWidget.setParentWidget(this);
          this._flowDecoratorWidget.setOrientation("vertical");
          this._flowDecoratorWidget.setRendering("list");
          this._flowDecoratorContainer = this.getElement().querySelector(".mt-tab-flow");
          this._flowDecoratorContainer.appendChild(this._flowDecoratorWidget.getElement());
          this._resizeHandler = context.HostService.onScreenResize(this._onResize.bind(this));
          this.addChildWidget(this._flowDecoratorWidget, {
            noDOMInsert: true
          });
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.FlowLayoutEngine(this);
          this._layoutEngine.setFlowDecoratorWidget(this._flowDecoratorWidget);

        },

        /**
         * Handler called when screen is resized
         * @private
         */
        _onResize: function() {
          this._layoutEngine.forceMeasurement();
          this._layoutEngine.invalidateMeasure();
        },

        /**
         * Set Priority of this toolbar
         * @param {number} order the priority of this toolbar
         * @publicdoc
         */
        setOrder: function(order) {
          this.setStyle({
            order: order
          });
        },

        /**
         * Get Priority of this toolbar
         * @returns {number} priority of this toolbar
         * @publicdoc
         */
        getOrder: function() {
          return this.getStyle('order');
        },

        /**
         * Show/hide the text of the toolbar items
         * @param {boolean} state - true to display text under image, false to hide it
         * @publicdoc
         */
        setButtonTextHidden: function(state) {
          if (state) {
            this.getElement().addClass('buttonTextHidden');
          } else {
            this.getElement().removeClass('buttonTextHidden');
          }
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._flowDecoratorWidget) {
            this._flowDecoratorWidget.destroy();
            this._flowDecoratorWidget = null;
          }
          if (this._resizeHandler) {
            this._resizeHandler();
            this._resizeHandler = null;
          }
          if (this.isChromeBar()) {
            //this._chromeBar.removeToolBar(this);
            this._chromeBar = null;
          }

          $super.destroy.call(this);
        },

        /**
         * Define this Toolbar as a ChromeBar part
         * @param {classes.ChromeBarWidget} chromeBar - widget to set
         */
        setAsChromeBar: function(chromeBar) {
          this._chromeBar = chromeBar;
        },

        /**
         * Check if this toolbar is a chromeBar part
         * @return {boolean} - true if widget is a chromebar, false otherwise
         */
        isChromeBar: function() {
          return Boolean(this._chromeBar);
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          if (!domEvent.target.hasClass("gbc_FlowDecoratorWidget")) {
            this._flowDecoratorWidget.closeDropDown();
          }

          return true;
        },

        /**
         * Get the 3 dots real width
         * @return {number} width in px
         */
        getDecoratorWidth: function() {
          return this._flowDecoratorWidget.getLayoutInformation().getRawMeasure().getWidth();
        },

        /**
         *
         * @return {classes.FlowDecoratorWidget}
         */
        getFlowDecoratorWidget: function() {
          return this._flowDecoratorWidget;
        },

        /**
         * Define the form linked to this toolbar
         * Mainly used for layout calculation in modal window
         * @param {classes.FormWidget} widget - the form widget to link
         */
        setFormWidget: function(widget) {
          this._formWidget = widget;
        }

      };
    });
    cls.WidgetFactory.registerBuilder('ToolBar', cls.ToolBarWidget);
  });
