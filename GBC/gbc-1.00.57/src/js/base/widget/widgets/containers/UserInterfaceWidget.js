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

modulum('UserInterfaceWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * UserInterface widget.
     * @class UserInterfaceWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     * @publicdoc Widgets
     */
    cls.UserInterfaceWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.UserInterfaceWidget.prototype */ {
        __name: "UserInterfaceWidget",

        $static: {
          startMenuPosition: 'gStartMenuPosition'
        },

        _text: "",
        _image: null,
        _topMenuContainer: null,
        _toolBarContainer: null,
        /** @type {classes.ToolBarWidget} */
        _toolBarWidget: null,
        _startMenuWidget: null,
        _startMenuContainer: null,
        _sidebarWidget: null,
        _traditionalWindowContainer: null,
        /** @type {?number} */
        _currentWindowIdRef: null,
        /**
         * VM Focused widget
         * @type {classes.WidgetBase}
         */
        _vmFocusedWidget: null,
        /**
         * VM Previously Focused widget
         * @type {classes.WidgetBase}
         */
        _vmPreviouslyFocusedWidget: null,
        /**
         * Client focused widget
         * @type {classes.WidgetBase}
         */
        _focusedWidget: null,
        /**
         * Previously Focused widget
         * @type {classes.WidgetBase}
         */
        _previouslyFocusedWidget: null,

        _dbDate: "MDY4/", // default format
        _unBindLayoutHandler: null,
        _activeWindow: null,
        _errorMessageWidget: null,

        /** @type {Node} */
        _chromeBarContainer: null,
        /** @type {classes.ChromeBarWidget} */
        _chromeBar: null,

        /**
         * Typeahead
         */
        _isBufferingKeys: null,

        _browserResizeHandler: null,
        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this._chromeBarContainer = this._element.getElementsByClassName("gbc_chromeBarContainer")[0];
          this._topMenuContainer = this._element.getElementsByClassName("gbc_topMenuContainer")[0];
          this._toolBarContainer = this._element.getElementsByClassName("gbc_toolBarContainer")[0];
          this._startMenuContainer = this._element.getElementsByClassName("gbc_startMenuContainer")[0];
          this._errorMessageWidget = cls.WidgetFactory.createWidget("Message", this.getBuildParameters());
          this._errorMessageWidget.setHidden(true);

          if (!gbc.ThemeService.getValue("theme-legacy-topbar")) {
            this._chromeBar = cls.WidgetFactory.createWidget("ChromeBar", this.getBuildParameters());
            var appHost = context.HostService.getApplicationHostWidget();
            this._chromeBar.when(context.constants.widgetEvents.toggleClick, appHost.showSidebar.bind(appHost));
            this.addChromeBar();
          }
          this._browserResizeHandler = context.HostService.onScreenResize(function() {
            this.getLayoutEngine().forceMeasurement();
            this.getLayoutInformation().invalidateMeasure();
          }.bind(this));
        },
        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._browserResizeHandler) {
            this._browserResizeHandler();
            this._browserResizeHandler = null;
          }
          this._topMenuContainer = null;
          this._toolBarContainer = null;
          this._startMenuContainer = null;
          if (this._unBindLayoutHandler) {
            this._unBindLayoutHandler();
            this._unBindLayoutHandler = null;
          }
          this._chromeBarContainer = null;
          if (this._chromeBar) {
            this._chromeBar.destroy();
            this._chromeBar = null;
          }
          this._errorMessageWidget.destroy();
          this._errorMessageWidget = null;
          this._vmFocusedWidget = null;
          this._focusedWidget = null;
          $super.destroy.call(this);
          this._startMenuWidget = null;
        },
        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.UserInterfaceLayoutEngine(this);
          this._unBindLayoutHandler = this._layoutEngine.onLayoutApplied(this._onLayoutApplied.bind(this));
        },

        _onLayoutApplied: function() {
          if (this.getContainerElement().children.length > 1) {
            for (var i = 0; i < this.getChildren().length; i++) {
              var current = this.getChildren()[i];
              if (this._canBeRemoved(current)) {
                current.getElement().remove();
              }
            }
          }

          if (this._unBindLayoutHandler) {
            this._unBindLayoutHandler();
            this._unBindLayoutHandler = null;
          }
        },

        _canBeRemoved: function(widget) {
          return widget instanceof cls.WindowWidget &&
            (context.HostService.getCurrentWindow() &&
              widget !== context.HostService.getCurrentWindow()) &&
            !widget._forceVisible;
        },

        getSidebarWidget: function() {
          return this._sidebarWidget;
        },
        setSidebarWidget: function(widget) {
          this._sidebarWidget = widget;
        },
        getMessageWidget: function() {
          return this._errorMessageWidget;
        },

        /**
         * Get the chromebar widget if any
         * @return {*|null}
         */
        getChromeBarWidget: function() {
          return this._chromeBar;
        },

        /**
         * @inheritDoc
         */
        addChildWidget: function(widget, options) {
          $super.addChildWidget.call(this, widget, options);
          if (widget instanceof cls.WindowWidget && this.getSidebarWidget()) {
            this.getSidebarWidget().addChildWidget(widget.getSidebarWidget());
          }
          if (options && !options.noDOMInsert) {
            this._syncCurrentWindow();
          }
        },

        /**
         * @inheritDoc
         * @param {classes.ApplicationWidget} widget
         */
        removeChildWidget: function(widget) {
          if (widget instanceof cls.WindowWidget && this.getSidebarWidget()) {
            this.getSidebarWidget().removeChildWidget(widget.getSidebarWidget());
          }
          $super.removeChildWidget.call(this, widget);
        },

        addTopMenu: function(widget, order) {
          widget.setOrder(order);
          if (widget.getParentWidget() === null) {
            this.addChildWidget(widget, {
              noDOMInsert: true
            });
          }
          widget.getElement().insertAt(order, this._topMenuContainer);
        },

        /**
         * Add the chromebar to the dom
         */
        addChromeBar: function() {
          if (this._chromeBar) {
            this.addChildWidget(this._chromeBar, {
              noDOMInsert: true
            });
            this._chromeBarContainer.appendChild(this._chromeBar.getElement());
          }
        },

        addStartMenu: function(widget) {
          this._startMenuWidget = widget;
          this._startMenuContainer.appendChild(widget.getElement());
        },

        getStartMenuWidget: function() {
          return this._startMenuWidget;
        },

        /**
         * Add a toolbar in the good container
         * @param widget
         * @param order
         * @param widgetContainer
         * @param chromeBar
         */
        addToolBar: function(widget, order, widgetContainer, chromeBar) {
          this._toolBarWidget = widget;
          widget.setOrder(order);
          if (widget.getParentWidget() === null) {
            this.addChildWidget(widget, {
              noDOMInsert: true
            });
          }
          //add it to the chromebar if any
          if (chromeBar) {
            chromeBar.addToolBar(widget, order);
          } else {
            this._toolBarContainer.appendChild(widget._element);
          }
        },

        /**
         * Get the Global Toolbar
         * @return {classes.ToolBarWidget}
         */
        getToolBar: function() {
          return this._toolBarWidget;
        },

        /**
         * Set the Global Toolbar position
         * @param {String} position - "top" or "chrome" value
         */
        setToolBarPosition: function(position) {
          // only "top" and "chrome" value are supported
          var visible = (position !== "none");

          if (this.getToolBar()) {
            this.getToolBar().setHidden(!visible);
          }

          this._toolBarContainer.toggleClass("hidden", !visible);
        },

        /**
         * Sets the current window
         * @param windowIdRef
         */
        setCurrentWindowId: function(windowIdRef) {
          var currentChanged = this._currentWindowIdRef !== windowIdRef;
          if (currentChanged) {
            this._currentWindowIdRef = windowIdRef;
            this._syncCurrentWindow();
          }
        },

        _syncCurrentWindow: function() {
          var currentWin = this.getCurrentWindow();
          if (currentWin) {

            currentWin._sidebarItemWidget.setCurrent();
            context.HostService.setDisplayedWindow(currentWin);

            this.getLayoutEngine().invalidateAllocatedSpace();
            this.emit(cls.UserInterfaceWidget.startMenuPosition, currentWin._auiTag);
          }
        },
        /**
         * @returns {classes.WindowWidget} the current window
         */
        getCurrentWindow: function() {
          var i;
          var win = null;
          for (i = 0; i < this.getChildren().length; ++i) {
            win = this.getChildren()[i];
            if (this._currentWindowIdRef && win._auiTag === this._currentWindowIdRef) {
              return win;
            }
          }
          // If no window has been found, return the traditional window container
          for (i = 0; i < this.getChildren().length; ++i) {
            win = this.getChildren()[i];
            if (win.hasClass("gbc_TraditionalContainerWindow")) {
              return win;
            }
          }
          return null;
        },

        /**
         * @inheritDoc
         */
        setFocus: function(fromMouse) {
          $super.setFocus.call(this, fromMouse);
          this.getElement().domFocus();
        },

        /**
         * Set VM focused widget
         * @param {classes.WidgetBase} widget - widget which gains VM focus
         */
        setVMFocusedWidget: function(widget) {
          this._vmPreviouslyFocusedWidget = this._vmFocusedWidget;
          if (this._vmFocusedWidget !== widget) {
            if (this._vmFocusedWidget) {
              this._vmFocusedWidget.loseVMFocus();
            }
            this._vmFocusedWidget = widget;
          }
        },

        /**
         * Set client focused widget
         * @param {classes.WidgetBase} widget - widget which gains client focus
         */
        setFocusedWidget: function(widget) {
          this._previouslyFocusedWidget = this._focusedWidget;
          if (this._focusedWidget && this._focusedWidget !== widget) {
            if (this._focusedWidget.getElement()) {
              this._focusedWidget.getElement().removeClass("gbc_Focus");
              this._focusedWidget.loseFocus();
            }
          }
          if (!this._focusedWidget || this._focusedWidget !== widget) {
            this._focusedWidget = widget;
            if (this._focusedWidget.getElement()) {
              this._focusedWidget.getElement().addClass("gbc_Focus");
            }
          }
        },

        /**
         * @returns {classes.WidgetBase} current focused widget (by VM)
         */
        getVMFocusedWidget: function() {
          return this._vmFocusedWidget;
        },

        /**
         * @returns {boolean} true if current focused widget changed (by VM)
         */
        hasVMFocusedWidgetChanged: function() {
          return this._vmFocusedWidget !== this._vmPreviouslyFocusedWidget;
        },

        /**
         * @returns {boolean} true if current focused widget changed
         */
        hasFocusedWidgetChanged: function() {
          return this._focusedWidget !== this._previouslyFocusedWidget;
        },

        /**
         * @returns {classes.WidgetBase} current focused widget (by VM)
         */
        getFocusedWidget: function() {
          return this._focusedWidget;
        },
        /**
         * @param {string} text The window title
         */
        setText: function(text) {
          this._text = text;
        },
        /**
         * @returns {string} The window title
         */
        getText: function() {
          return this._text;
        },

        setImage: function(image) {
          this._image = image;
          this.getSidebarWidget().setApplicationIcon(image);
        },

        getImage: function() {
          return this._image;
        },

        getDbDateFormat: function() {
          return this._dbDate;
        },

        setDbDateFormat: function(format) {
          this._dbDate = format;
        },

        getTraditionalWindowContainer: function() {
          if (!this._traditionalWindowContainer) {
            this._traditionalWindowContainer = cls.WidgetFactory.createWidget("TraditionalWindowContainer", this
              .getBuildParameters());
          }
          return this._traditionalWindowContainer;
        },

        removeTraditionalWindowContainer: function() {
          if (this._traditionalWindowContainer) {
            this.removeChildWidget(this._traditionalWindowContainer);
            this._traditionalWindowContainer = null;
          }
        },
        isLayoutTerminator: function() {
          return true;
        },
        activate: function() {
          this.emit(context.constants.widgetEvents.activate);
        },

        onActivate: function(hook) {
          return this.when(context.constants.widgetEvents.activate, hook);
        },
        onDisable: function(hook) {
          return this.when(context.constants.widgetEvents.disable, hook);
        },

        /**
         * @inheritDoc
         */
        setBackgroundColor: function(color) {
          $super.setBackgroundColor.call(this, color);
          this.setStyle('> .gbc_barsContainer', {
            "background-color": color && !this._ignoreBackgroundColor ? color : null
          });
        },

        /**
         * Show/hide filter item in chromebar
         * @param {boolean} visible - true if item must be visible
         * @param {String} [filterValue] - initial filter value
         */
        showChromeBarFilterMenuItem: function(visible, filterValue) {
          if (this._chromeBar) {
            this._chromeBar.showFilterMenuItem(visible, filterValue);
          }
        },
      };
    });
    cls.WidgetFactory.registerBuilder('UserInterface', cls.UserInterfaceWidget);
  });
