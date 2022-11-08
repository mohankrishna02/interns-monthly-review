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

modulum('ChromeBarWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Main entry point for chrome Menu
     * Top bar used with mobile devices
     * In order, it adds:
     *  - UI Toolbar
     *  - Window Toolbar
     *  - Action Panel / Ring Menu
     *  - GBC centric actions
     * @class ChromeBarWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.ChromeBarWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.ChromeBarWidget.prototype */ {
        __name: "ChromeBarWidget",

        /** @type {Element} */
        _toggleRightBarElement: null,

        /** @type {string} **/
        _defaultTitle: "Genero Browser Client",

        /** @type {classes.ChromeRightBarWidget} */
        _rightBarWidget: null,

        /** @type {Element} */
        _titleElement: null,

        /** @type {Object} */
        _refreshConditions: null,

        _orientationHandler: null,

        /** @type {Boolean} **/
        _hasWindowIcon: false,

        /** @type {classes.ImageWidget} **/
        _windowIconImage: null,

        /** @type {Boolean} **/
        _lightMode: false,

        _aboutMenuItem: null,
        _settingsMenuItem: null,
        _uploadStatusMenuItem: null,
        _runtimeStatusMenuItem: null,
        _bookmarkMenuItem: null,
        _closeMenuItem: null,
        _debugMenuItem: null,
        _proxyLogMenuItem: null,
        _VMLogMenuItem: null,
        _runInGDCMenuItem: null,

        /** @type {classes.ChromeBarItemFilterWidget} **/
        _filterMenuItem: null,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          // Handle items of both rightbar and topchromebar
          this._refreshConditions = {
            childrenNumber: 0,
            screenOrientation: 0,
            windowWidth: window.innerWidth,
          };

          $super.constructor.call(this, opts);

          if (opts.lightmode) {
            this.setLightMode(true);
          }
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.ChromeBarLayoutEngine(this);
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this.clearActions();

          // Destroy GBC menu items
          if (this._aboutMenuItem) {
            this._aboutMenuItem.destroy();
            this._aboutMenuItem = null;
          }
          if (this._bookmarkMenuItem) {
            this._bookmarkMenuItem.destroy();
            this._bookmarkMenuItem = null;
          }
          if (this._debugMenuItem) {
            this._debugMenuItem.destroy();
            this._debugMenuItem = null;
          }
          if (this._proxyLogMenuItem) {
            this._proxyLogMenuItem.destroy();
            this._proxyLogMenuItem = null;
          }
          if (this._VMLogMenuItem) {
            this._VMLogMenuItem.destroy();
            this._VMLogMenuItem = null;
          }
          if (this._runInGDCMenuItem) {
            this._runInGDCMenuItem.destroy();
            this._runInGDCMenuItem = null;
          }
          if (this._settingsMenuItem) {
            this._settingsMenuItem.destroy();
            this._settingsMenuItem = null;
          }
          if (this._closeMenuItem) {
            this._closeMenuItem.destroy();
            this._closeMenuItem = null;
          }
          if (this._uploadStatusMenuItem) {
            this._uploadStatusMenuItem.destroy();
            this._uploadStatusMenuItem = null;
          }
          if (this._runtimeStatusMenuItem) {
            this._runtimeStatusMenuItem.destroy();
            this._runtimeStatusMenuItem = null;
          }
          if (this._filterMenuItem) {
            this._filterMenuItem.destroy();
            this._filterMenuItem = null;
          }

          // Destroy remaining things
          this._toggleRightBarElement = null;
          this._rightBarWidget.destroy();
          this._rightBarWidget = null;
          this._titleElement = null;
          if (this._windowIconImage) {
            this._windowIconImage.destroy();
            this._windowIconImage = null;
          }

          this._orientationHandler();
          this._orientationHandler = null;
          this._resizeHandler();
          this._resizeHandler = null;

          if (gbc.LogService.isRecordingEnabled() && this._logRecordWidget) {
            this._logRecordWidget.destroy();
            this._logRecordWidget = null;
          }

          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);

          // All those are not needed in light mode
          if (!this._lightMode) {
            this._rightBarWidget = cls.WidgetFactory.createWidget('ChromeRightBar', this.getBuildParameters());
            this._rightBarWidget.setParentWidget(this);
            this._toggleRightBarElement = this._element.getElementsByClassName("mt-sidebar-action-toggle")[0];

            this._titleElement = this.getElement().querySelector(".currentDisplayedWindow");

            this._sidebarToggle = this._element.getElementsByClassName("mt-sidebar-toggle")[0];
          }
          this._refreshConditions.screenOrientation = window.orientation;
          this._orientationHandler = context.HostService.onOrientationChange(this.onOrientationChanged.bind(this));
          this._resizeHandler = context.HostService.onScreenResize(this._onResize.bind(this));

          if (gbc.LogService.isRecordingEnabled() && !this._lightMode) {
            this._logRecordWidget = cls.WidgetFactory.createWidget("LogRecorder", this.getBuildParameters());
            this._element.querySelector(".mt-toolbar-title").appendChild(this._logRecordWidget.getElement());
          }
        },

        /**
         * Show/hide filter item
         * @param {boolean} visible - true if item must be visible
         * @param {String} [filterValue] - initial filter value
         */
        showFilterMenuItem: function(visible, filterValue) {
          this._filterMenuItem.setFilterValue(filterValue);
          this._filterMenuItem.setHidden(!visible);
        },

        /**
         * @inheritDoc
         */
        _afterInitElement: function() {
          $super._afterInitElement.call(this);

          this._filterMenuItem = cls.WidgetFactory.createWidget("ChromeBarItemFilter", this.getBuildParameters());
          this._filterMenuItem.setHidden(true);
          this.addItemWidget(this._filterMenuItem);

          var gbcItems = [];
          // If we want a simple chromebar (not many items and so)
          if (this._lightMode) {
            gbcItems = ["about", "settings", "close"];
          } else {
            gbcItems = ["about", "debug", "runInGDC", "uploadStatus", "runtimeStatus", "proxyLog", "VMLog", "settings", "bookmark",
              "close"
            ];
          }

          this._createGBCMenuItems(gbcItems); // prepare gbcItem widgets
        },

        /**
         * Create all the GBC menu item (about, settings and so...)
         * Note that it doesn't add them to the dom! see _addGBCMenuItems for that
         * @param {String[]} gbcItems - list of items to create
         * @private
         */
        _createGBCMenuItems: function(gbcItems) {
          // Create all the gbc items
          gbcItems.forEach(function(item) {
            var widgetName = 'ChromeBarItem' + item.substr(0, 1).toUpperCase() + item.substr(1);
            this["_" + item + "MenuItem"] = cls.WidgetFactory.createWidget(widgetName, this.getBuildParameters());
          }.bind(this));
          this._addGBCMenuItems();
        },

        /**
         * Add the GBC menu item to the chromebar (let the chromebar moving it to the rightbar if needed)
         * @private
         */
        _addGBCMenuItems: function() {
          // About processing item
          this.addItemWidget(this._uploadStatusMenuItem);
          // About Menu item
          this.addItemWidget(this._aboutMenuItem);

          // *** Debug/Dev entries ***
          // Debug Menu item
          this.addItemWidget(this._debugMenuItem);
          // Run in GDC Menu item
          this.addItemWidget(this._runInGDCMenuItem);
          // Proxy Logs Menu item
          this.addItemWidget(this._proxyLogMenuItem);
          // VM Logs Menu item
          this.addItemWidget(this._VMLogMenuItem);

          // Settings Menu item
          this.addItemWidget(this._settingsMenuItem);
          // Bookmark Menu item
          this.addItemWidget(this._bookmarkMenuItem);
          // Close Window
          this.addItemWidget(this._closeMenuItem);
        },

        /**
         * Get a GBC menu item by its name
         * @param name
         */
        getGbcMenuItem: function(name) {
          return this["_" + name + "MenuItem"];
        },

        /**
         * Get the associated rightBar
         * @return {classes.ChromeRightBarWidget}
         */
        getRightBarWidget: function() {
          return this._rightBarWidget;
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          // Click on the burger to open left Sidebar
          if (domEvent.target.isElementOrChildOf(this._sidebarToggle)) {
            this.closeRightBar();
            this.emit(context.constants.widgetEvents.toggleClick);
          }

          // Click on the 3 dots top right
          if (domEvent.target.isElementOrChildOf(this._toggleRightBarElement)) {
            if (this._rightBarWidget) {
              this._rightBarWidget.toggle();
            }
          }

          return true; // bubble
        },

        /**
         * Close the right bar
         */
        closeRightBar: function() {
          if (this._rightBarWidget) {
            this._rightBarWidget.hide();
          }
        },

        /**
         * Add a toolbar to the chromeBar
         * @param {classes.ToolBarWidget} toolbarWidget - item to add
         * @param {number} order
         */
        addToolBar: function(toolbarWidget, order) {
          toolbarWidget.setAsChromeBar(this);
          var children = toolbarWidget.getChildren().slice(); // copy object for safe foreach
          children.forEach(function(child) {
            child.addClass("toolbarItem");
            if (!child.isInstanceOf(cls.ToolBarSeparatorWidget) && !child.isInstanceOf(cls
                .FlowDecoratorWidget)) { // Skip toolbar separators in chromebar
              this.addItemWidget(child); // Add it to chrome TopBar first for layout measurement
            }
          }.bind(this));
        },

        /**
         * Add a menu to the chromeBar (Menu or Dialog)
         * @param {classes.MenuWidget} menuWidget - widget to add
         */
        addMenu: function(menuWidget) {
          menuWidget.setAsChromeBar(this);
          var children = menuWidget.getChildren().slice(); // copy object for safe foreach
          children.forEach(function(child) {
            child.addClass("menuItem");
            this.addItemWidget(child);
          }.bind(this));
        },

        _onResize: function() {
          this._layoutEngine.forceMeasurement();
          this._layoutEngine.invalidateMeasure();
          this.refresh();
        },

        /**
         * Handler called when layout notify changes
         * @param {Boolean} force - force a refresh
         */
        refresh: function(force) {
          // Add timeout to that to throttle
          if (this._timeoutHandler) {
            this._clearTimeout(this._timeoutHandler);
          }
          this._timeoutHandler = this._registerTimeout(function() {
            this._refresh(force);
            this._containerElement.style.opacity = "1";
          }.bind(this), 100);
        },

        /**
         * Throttled Handler called when layout notify changes
         * @param {Boolean} force - force a refresh
         * @private
         */
        _refresh: function(force) {
          if (force || this.needRefresh()) { // Check if a refresh is really needed
            var sortedItemList = this._sortChromeBarItems();
            var filterHasFocus = false;

            if (sortedItemList.length > 0) {
              filterHasFocus = this._filterMenuItem && this._filterMenuItem.hasFocusOnInput();

              sortedItemList.forEach(function(c) {
                this._removeChildWidgetFromDom(c);
              }.bind(this));

              sortedItemList.forEach(function(item) {
                this.adoptChildWidget(item);
              }.bind(this));

              if (filterHasFocus) {
                this._filterMenuItem.setFocusOnInput();
              }

              sortedItemList = null; // cleanup
            }

            // Flow Items if necessary
            var topBarFull = false;
            var children = this.getChildren().slice(0); // copy children array to avoid list alteration while processing
            if (children) {
              // Now we choose, who should stay in topbar, or who shouldn't
              var availableSpace = this.getLayoutInformation().getRawMeasure().getWidth() - this.getLayoutInformation()
                .getDecorating()
                .getWidth();
              var currentUsedWidth = 0;
              var childWidth = 0;

              for (var j = 0; j < children.length; j++) {
                if (!topBarFull) {
                  // Hidden item take zero Width, otherwise get width from layout measure
                  childWidth = children[j].isHidden() ? 0 : children[j].getLayoutInformation().getRawMeasure().getWidth();
                  // Add total size
                  currentUsedWidth = currentUsedWidth + childWidth;
                  // TopBar is full if children take more space than container
                  topBarFull = currentUsedWidth > availableSpace;
                }
                // Check again, since it might have changed
                if (topBarFull) {
                  this._rightBarWidget.adoptChildWidget(children[j]); // Add it to the sidebar instead of topbar
                }
              }
            }

            // Show/hide right '3 dots' button if there are children in the right bar
            if (this._rightBarWidget.getChildren().length === 0) {
              this._toggleRightBarElement.addClasses("hidden");
            } else {
              this._toggleRightBarElement.removeClass("hidden");
            }
          }

        },

        /**
         * Method to check if calling a refresh is necessary
         * @return {boolean} - true if necessary false otherwise
         */
        needRefresh: function() {
          var children = this.getChildren().slice(0); // copy children array to avoid list alteration while processing
          var childrenOverflow = false,
            changedUsedWidth = false,
            childrenPosChanged = false;

          if (children) {
            // availableSpace is containerElement width ( all widget - decoration)
            var availableSpace = this.getLayoutInformation().getRawMeasure().getWidth() - this.getLayoutInformation()
              .getDecorating()
              .getWidth();

            var sortedItemList = this._sortChromeBarItems();
            var currentUsedWidth = 0;
            for (var i = 0; i < children.length; i++) {
              if (children[i].getLayoutInformation().getRawMeasure().getWidth()) {
                currentUsedWidth = currentUsedWidth + children[i].getLayoutInformation().getRawMeasure()
                  .getWidth(); // get item layout engine
              }

              // Compare the children position to the sorted children position: if changed, need a refresh
              if (!childrenPosChanged && sortedItemList[i] !== children[i]) {
                childrenPosChanged = true;
              }
            }

            childrenOverflow = currentUsedWidth > availableSpace;
            if (this._currentUsedWidth !== currentUsedWidth) {
              changedUsedWidth = true;
              this._currentUsedWidth = currentUsedWidth;
            }
          }

          return childrenOverflow || changedUsedWidth || childrenPosChanged || this._refreshConditions.screenOrientation !== window
            .orientation ||
            this._refreshConditions.windowWidth !== window.innerWidth ||
            this._refreshConditions.forceRefresh;
        },

        /**
         * Sort the items in chrome
         * @return {T[]} the Array of sorted items
         * @private
         */
        _sortChromeBarItems: function() {
          var rbChildren = this._rightBarWidget.getChildren("item").slice(0);
          var rbGbcChildren = this._rightBarWidget.getChildren("gbcItem").slice(0);
          // Sort items by *UniqueId*
          var sortedItemList = this.getChildren("item").concat(rbChildren).slice(0).sort(function(a, b) {
            return a.getAuiLinkedUniqueIdentifier() - b.getAuiLinkedUniqueIdentifier();
          });
          // Sort gbcItems by *_uuid*
          var sortedGbcItemList = this.getChildren("gbcItem").concat(rbGbcChildren).slice(0).sort(function(a, b) {
            return a._uuid - b._uuid;
          });
          return sortedItemList.concat(sortedGbcItemList);
        },

        /**
         * Handler called when screen orientation changed
         */
        onOrientationChanged: function() {
          this.closeRightBar();
          // Need to clear all children from bars (top and right) then put it back at the right places
          // Save the children before clearing it
          var chromeBarChildren = this.getChildren().slice();
          var chromeRightBarChildren = this._rightBarWidget ? this._rightBarWidget.getChildren().slice() : [];

          this.clearActions();

          for (var i = 0; i < chromeBarChildren.length; i++) {
            this.addItemWidget(chromeBarChildren[i]);
          }

          for (i = 0; i < chromeRightBarChildren.length; i++) {
            this.addItemWidget(chromeRightBarChildren[i]);
          }
          this._refreshConditions.screenOrientation = window.orientation; // Update refresh conditions
        },

        /**
         * Add an item as a child or as a chromebar child
         * @param {classes.ChromeBarItemWidget} widget - item to add
         */
        addItemWidget: function(widget) {
          if (widget && !widget.isDestroyed()) {
            var noDomInsert = false;
            this._containerElement.style.opacity = "0"; // 'Hide' style for flickering issues
            this.adoptChildWidget(widget, {
              noDOMInsert: noDomInsert
            });
          }
        },

        /**
         * Remove dom actions
         */
        clearActions: function() {
          while (this.getContainerElement() && this.getContainerElement().firstChild) {
            this.getContainerElement().removeChild(this.getContainerElement().firstChild);
          }
          if (this._rightBarWidget) {
            while (this._rightBarWidget.getContainerElement() && this._rightBarWidget.getContainerElement().firstChild) {
              this._rightBarWidget.getContainerElement().removeChild(this._rightBarWidget.getContainerElement().firstChild);
            }
          }
        },

        /**
         * Define the title displayed in the chromeBar
         * @param {String} title - title displayed
         */
        setTitle: function(title) {
          if (title) {
            this._titleElement.innerHTML = title;
          } else {
            this._titleElement.innerHTML = this._defaultTitle;
          }
        },

        /**
         * Define the icon displayed at the burger place
         * @param image
         * @param appIcon
         */
        setIcon: function(image, appIcon) {
          if (image && image !== "") {
            if (!appIcon) { // set global icon using app icon only if not previously set with window icon
              this._hasWindowIcon = true;
            } else if (this._hasWindowIcon === true) {
              return;
            }
            this._element.getElementsByClassName('zmdi')[0].addClass('hidden');
            if (!this._windowIconImage) {
              this._windowIconImage = cls.WidgetFactory.createWidget("ImageWidget", this.getBuildParameters());
              this._sidebarToggle.appendChild(this._windowIconImage.getElement());
            }
            this._windowIconImage.setSrc(image);
            this._windowIconImage.setAlignment("verticalCenter", "horizontalCenter");
            this._windowIconImage.setHidden(false);
          } else {
            this._element.getElementsByClassName('zmdi')[0].removeClass('hidden');
            if (this._windowIconImage) {
              this._windowIconImage.setHidden(true);
            }
          }
        },

        /**
         * Set menu items as hidden to Handle 4ST actionPanelPosition:none
         * @param {Boolean} hidden - true if must be hidden
         */
        setMenuItemsHidden: function(hidden) {
          this.toggleClass("menuHidden", hidden);
        },

        /**
         * Get all children of this widget with filtering options
         * @param {string?} itemType - filter result on a given itemType
         * @returns {classes.ChromeBarItemWidget[]} the list of children of this widget group
         */
        getChildren: function(itemType) {
          if (!itemType) {
            // Default
            return $super.getChildren.call(this);
          } else {
            // Filtering
            return this._children.filter(function(child) {
              return child.getItemType && child.getItemType() === itemType;
            });
          }
        },

        /**
         * Allows one to create a Chromebar without all the items (i.e: session end, logPlayer ...)
         * @param {Boolean} enable - true to enable this mode, false otherwise
         */
        setLightMode: function(enable) {
          this._lightMode = enable;
          this.toggleClass("lightmode", enable);
          if (enable) {
            this.setTitle(this._defaultTitle);
            if (this._logRecordWidget) {
              this._logRecordWidget.destroy();
              this._logRecordWidget = null;
            }
          }
        },

        /**
         * Set the current linked window
         * @param {classes.WindowWidget} window - to link to the chromebar
         */
        setLinkedWindow: function(window) {
          this._closeMenuItem.setLinkedWindow(window);
          this._currentLinkedWindow = window;
        },

        /**
         * Emit the close event of the current window
         */
        closeCurrentWindow: function() {
          this._closeMenuItem.close();
        },

      };
    });
    cls.WidgetFactory.registerBuilder('ChromeBar', cls.ChromeBarWidget);
  });
