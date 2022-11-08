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

modulum('ApplicationHostMenuWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class ApplicationHostMenuWidget
     * @deprecated This is only used if "theme-legacy-topbar" theme variable is on
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.ApplicationHostMenuWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.ApplicationHostMenuWidget.prototype */ {
        __name: "ApplicationHostMenuWidget",
        _windowIconImage: null,
        _hasWindowIcon: false,
        /** @type {Element} */
        _titleElement: null,
        _defaultTitle: "Genero Browser Client",
        /** @type {Element} */
        _sidebarToggle: null,
        _aboutMenu: null,
        _debugMenu: null,
        _settingsMenu: null,
        _runtimeStatus: null,
        _uploadStatus: null,
        _bookmarkWidget: null,
        _closeWidget: null,

        /** @type {Element} */
        _toggleSettings: null,
        _sidebarBackdrop: null,
        _barsContainerZindex: 0,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this._createMenuItems();
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._sidebarToggle = this._element.getElementsByClassName("mt-sidebar-toggle")[0];
          if (!this._titleElement) {
            this._titleElement = this._element.getElementsByClassName("currentDisplayedWindow")[0];
            this.setText();
          }

          this._toggleSettings = this._element.querySelector(".mt-sidebar-action-toggle");
          if (this._toggleSettings) {
            this._element.querySelector(".mt-actions").onSwipe("MenuWidgetSettings", this._closeSettingsBar.bind(this), {
              direction: ["right"]
            });
          }
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
        destroy: function() {
          this._destroyMenuItems();

          if (this._toggleSettings) {
            this._element.querySelector(".mt-actions").offSwipe("MenuWidgetSettings");
          }

          if (this._windowIconImage) {
            this._windowIconImage.destroy();
            this._windowIconImage = null;
          }
          this._sidebarToggle = null;
          this._toggleSettings = null;
          this._sidebarBackdrop = null;
          this._titleElement = null;

          $super.destroy.call(this);
        },

        _createMenuItems: function() {
          this._uploadStatus = cls.WidgetFactory.createWidget('ApplicationHostUploadsMenu', this.getBuildParameters());
          this.addChildWidget(this._uploadStatus);
          this._runtimeStatus = cls.WidgetFactory.createWidget('ApplicationHostMenuRuntime', this.getBuildParameters());
          this.addChildWidget(this._runtimeStatus);
          this._aboutMenu = cls.WidgetFactory.createWidget('ApplicationHostAboutMenu', this.getBuildParameters());
          this.addChildWidget(this._aboutMenu);
          this._settingsMenu = cls.WidgetFactory.createWidget('ApplicationHostSettingsMenu', this.getBuildParameters());
          this.addChildWidget(this._settingsMenu);
          //debug
          this._proxyLogMenu = cls.WidgetFactory.createWidget('ApplicationHostMenuProxyLog', this.getBuildParameters());
          this.addChildWidget(this._proxyLogMenu);
          this._vmLogMenu = cls.WidgetFactory.createWidget('ApplicationHostMenuVmLog', this.getBuildParameters());
          this.addChildWidget(this._vmLogMenu);
          this._runInGwcMenu = cls.WidgetFactory.createWidget('ApplicationHostMenuRunInGwc', this.getBuildParameters());
          this.addChildWidget(this._runInGwcMenu);
          this._runInGdcMenu = cls.WidgetFactory.createWidget('ApplicationHostMenuRunInGdc', this.getBuildParameters());
          this.addChildWidget(this._runInGdcMenu);
          this._debugMenu = cls.WidgetFactory.createWidget('ApplicationHostDebugMenu', this.getBuildParameters());
          this.addChildWidget(this._debugMenu);
        },

        _destroyMenuItems: function() {
          this._destroyMenuItem(this._runtimeStatus);
          this._runtimeStatus = null;
          this._destroyMenuItem(this._proxyLogMenu);
          this._proxyLogMenu = null;
          this._destroyMenuItem(this._vmLogMenu);
          this._vmLogMenu = null;
          this._destroyMenuItem(this._runInGwcMenu);
          this._runInGwcMenu = null;
          this._destroyMenuItem(this._runInGdcMenu);
          this._runInGdcMenu = null;
          this._destroyMenuItem(this._aboutMenu);
          this._aboutMenu = null;
          this._destroyMenuItem(this._debugMenu);
          this._debugMenu = null;
          this._destroyMenuItem(this._settingsMenu);
          this._settingsMenu = null;
          this._destroyMenuItem(this._uploadStatus);
          this._uploadStatus = null;

          this._destroyMenuItem(this._bookmarkWidget);
          this._bookmarkWidget = null;
          this._destroyMenuItem(this._closeWidget);
          this._closeWidget = null;
        },

        _destroyMenuItem: function(item) {
          if (item) {
            this.removeChildWidget(item);
            item.destroy();
          }
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          var target = domEvent.target;
          if (target.isElementOrChildOf(this._sidebarToggle)) {
            this.emit(context.constants.widgetEvents.toggleClick);
          } else if (target.isElementOrChildOf(this._toggleSettings) || target.isElementOrChildOf(this._sidebarBackdrop)) {
            this._toggleSettingsBar();
          }

          return true;
        },

        /**
         * Set the Bar in UR mode (no debug display, no close button)
         * @param {Boolean} isUR - true to enable this mode
         */
        setURBar: function(isUR) {
          if (isUR) {
            this._proxyLogMenu.setHidden(true);
            this._vmLogMenu.setHidden(true);
            this._runInGwcMenu.setHidden(true);
            this._runInGdcMenu.setHidden(true);
            this._debugMenu.setHidden(true);
          }
        },

        /**
         * Create a reference to the BookmarkWidget
         * @param {classes.ApplicationHostMenuBookmarkWidget} widget
         */
        setBookmarkWidget: function(widget) {
          this._bookmarkWidget = widget;
          if (context.__wrapper.isNative()) {
            this._bookmarkWidget.setHidden(true);
          }
        },

        /**
         * Create a reference to the CloseWidget
         * @param {classes.ApplicationHostMenuWindowCloseWidget} widget
         */
        setCloseWidget: function(widget) {
          this._closeWidget = widget;
          if (context.__wrapper.isNative()) {
            this._closeWidget.setHidden(true);
          }
        },

        _toggleSettingsBar: function() {
          // TODO why we don't use ApplicationHostSidebarBackdropWidget ???? like left sidebar ?
          this._sidebarBackdrop = this._element.querySelector(".mt-sidebar-backdrop");
          var barsContainer = this._parentWidget._element.querySelector(".gbc_barsContainer");
          if (this._toggleSettings.hasClass("open")) {
            this._toggleSettings.removeClass("open");
            this._sidebarBackdrop.removeClass("mt-sidebar-displayed");
            this._element.querySelector(".mt-actions").removeClass("open");
            if (barsContainer) {
              barsContainer.style["z-index"] = this._barsContainerZindex;
            }
          } else if (this._element.querySelector(".mt-actions")) {
            this._toggleSettings.addClass("open");
            this._element.querySelector(".mt-actions").addClass("open");
            this._barsContainerZindex = barsContainer ? barsContainer.style["z-index"] : 0;
            if (barsContainer) {
              barsContainer.style["z-index"] = "0";
            }
            this._sidebarBackdrop.addClass("mt-sidebar-displayed");
          }
        },

        _closeSettingsBar: function() {
          if (this._toggleSettings.hasClass("open")) {
            this._toggleSettings.removeClass("open");
            this._element.querySelector(".mt-actions").removeClass("open");
            this._sidebarBackdrop.removeClass("mt-sidebar-displayed");
          }
        },

        setSidebarUnavailable: function(unavailable) {
          this._sidebarToggle.toggleClass("mt-sidebar-unavailable", Boolean(unavailable));
        },

        setText: function(title) {
          this._setElementAttribute("innerHTML", title || this._defaultTitle, "_titleElement");
        },

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
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ApplicationHostMenu', cls.ApplicationHostMenuWidget);
  });
