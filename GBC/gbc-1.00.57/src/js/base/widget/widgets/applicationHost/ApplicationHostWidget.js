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

modulum('ApplicationHostWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class ApplicationHostWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.ApplicationHostWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.ApplicationHostWidget.prototype */ {
        __name: "ApplicationHostWidget",
        /**
         * @type {classes.ApplicationHostSidebarWidget}
         */
        _sidebar: null,
        /**
         * @type {classes.ApplicationHostSidebarBackdropWidget}
         */
        _sidebarBackdrop: null,
        /**
         * @type {classes.ApplicationHostMenuWidget}
         */
        _menu: null,
        /**
         * left css position of the container
         * @type {?number}
         */
        _position: null,
        /**
         * @type {HTMLElement}
         */
        _centralContainer: null,
        _launcher: null,

        /**
         * @type {HandleRegistration}
         */
        _browserResizeHandler: null,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          // no layout
        },

        /**
         * @inheritDoc
         */
        _initContainerElement: function() {
          $super._initContainerElement.call(this);
          this._centralContainer = this._element.firstElementChild;
          this._sidebar = cls.WidgetFactory.createWidget('ApplicationHostSidebar', this.getBuildParameters());
          this._sidebar.setParentWidget(this);
          this._browserResizeHandler = context.HostService.onScreenResize(this._onDisplayChanged);
          this._sidebar.onDisplayChanged(this._onDisplayChanged);
          this._element.prependChild(this._sidebar.getElement());
          this._sidebarBackdrop = cls.WidgetFactory.createWidget('ApplicationHostSidebarBackdrop', this.getBuildParameters());
          this._sidebarBackdrop.setParentWidget(this);
          this._element.appendChild(this._sidebarBackdrop.getElement());
          if (gbc.ThemeService.getValue("theme-legacy-topbar")) {
            this._menu = cls.WidgetFactory.createWidget('ApplicationHostMenu', this.getBuildParameters());
            this._menu.setParentWidget(this);
            this._containerElement.parentNode.insertBefore(this._menu.getElement(), this._containerElement);
            this._menu.setURBar(context.__wrapper.isNative());
            this._menu.when(context.constants.widgetEvents.toggleClick, this.showSidebar.bind(this));
          }

          this._sidebar.when(context.constants.widgetEvents.toggleClick, this.hideSidebar.bind(this));
          this._sidebarBackdrop.onClick(this.hideSidebar.bind(this));
          this._launcher = cls.WidgetFactory.createWidget('ApplicationLauncher', this.getBuildParameters());
          this._launcher.setHidden(true);
          this.addChildWidget(this._launcher);
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._browserResizeHandler) {
            this._browserResizeHandler();
            this._browserResizeHandler = null;
          }
          this._sidebar.destroy();
          this._sidebarBackdrop.destroy();
          if (gbc.ThemeService.getValue("theme-legacy-topbar")) {
            this._menu.destroy();
          }
          this._launcher.destroy();
          this._centralContainer = null;
          $super.destroy.call(this);
        },
        getLauncher: function() {
          return this._launcher;
        },

        /**
         *
         * @returns {classes.ApplicationHostSidebarWidget}
         */
        getSideBar: function() {
          return this._sidebar;
        },
        getMenu: function() {
          return this._menu;
        },
        getCentralContainerPosition: function() {
          return this._position;
        },
        /**
         *
         * @param position
         * @returns {boolean} true if position has changed
         */
        setCentralContainerPosition: function(position) {
          if (position !== this._position) {
            this._position = position;
            this._centralContainer.style.left = position + "px";
            return true;
          }
          return false;

        },
        showSidebar: function() {
          this._sidebar.setDisplayed(true);
          this._sidebarBackdrop.setDisplayed(true);
          //Save it to the stored settings
          gbc.StoredSettingsService.setSideBarVisible(true);
          gbc.LogService.ui.log("sidebar open", true);
        },
        hideSidebar: function() {
          this._sidebar.setDisplayed(false);
          this._sidebarBackdrop.setDisplayed(false);
          //Save it to the stored settings
          gbc.StoredSettingsService.setSideBarVisible(false);
          gbc.LogService.ui.log("sidebar open", false);
        },
        toggleSidebar: function() {
          if (this._sidebar.isDisplayed()) {
            this.hideSidebar();
          } else {
            this.showSidebar();
          }
        },

        enableSidebar: function(enable) {
          this._sidebar.setUnavailable(!enable);
          this._sidebarBackdrop.setUnavailable(!enable);
          if (gbc.ThemeService.getValue("theme-legacy-topbar")) {
            this._menu.setSidebarUnavailable(!enable);
          }
          this._centralContainer.toggleClass("mt-sidebar-unavailable", !enable);
          if (!gbc.StoredSettingsService.isSideBarVisible()) {
            this.hideSidebar();
          } else {
            this.showSidebar();
          }
        },

        /**
         * trigger a display update on the host application
         */
        updateDisplay: function() {
          this._registerAnimationFrame(this._onDisplayChanged);
        },

        _onDisplayChanged: function() {
          var session = context.SessionService.getCurrent(),
            app = session && session.getCurrentApplication();
          if (session && session.isInTabbedContainerMode()) {
            app = session.getTabbedContainerModeHostApplication();
            var tabbedContainerHost = session.getTabbedContainerWidget() && session.getTabbedContainerWidget().getParentWidget();
            if (tabbedContainerHost) {
              tabbedContainerHost.getLayoutEngine().forceMeasurement();
              tabbedContainerHost.getLayoutEngine().invalidateAllocatedSpace();
              tabbedContainerHost.getLayoutInformation().invalidateMeasure();
            }
          }
          if (app && app.layout) {
            app.layout.refreshLayout({
              resize: true
            });
          }
        },
        setSidebarContent: function(widget) {
          this.getSideBar().setSidebarContent(widget);
        }

      };
    });
    cls.WidgetFactory.registerBuilder('ApplicationHost', cls.ApplicationHostWidget);
  });
