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

modulum('HostService', ['InitService', 'DebugService', 'EventListener'],
  function(context, cls) {

    /**
     * @namespace gbc.HostService
     */
    context.HostService = context.oo.StaticClass( /** @lends gbc.HostService */ {
      __name: "HostService",

      currentWindowChanged: "currentWindowChanged",

      /** @type classes.MainContainerWidget */
      _widget: null,
      /** @type classes.LogPlayerWidget */
      _logPlayer: null,
      /** @type String */
      _defaultTitle: "",
      /** @type classes.ApplicationHostWidget */
      _applicationHostWidget: null,
      /** @type classes.WindowWidget */
      _currentWindow: null,
      /** @type classes.EventListener */
      _eventListener: null,
      /** @type HTMLElement */
      _dropDownContainer: null,

      init: function() {
        this._eventListener = new cls.EventListener();

        var existingOnError = window.onerror;
        window.onerror = function(msg, file, line, col, error) {
          if (existingOnError) {
            existingOnError(msg, file, line, col, error);
          }
          context.HostService._eventListener.emit('error', error, msg, file, line, col);
          return false;
        };

        // Device orientation handler
        window.addEventListener("orientationchange", function() {
          if (window.isMobile) {
            this._eventListener.emit("orientationChange.Host");
          }
        }.bind(this));
        // Window Resize handler
        window.addEventListener("resize", function() {
          this._eventListener.emit("resize.Host");
        }.bind(this));
      },

      isLogPlayerRequested: function() {
        return window.isURLParameterEnabled("logplayer");
      },

      preStart: function() {
        if (!context.DebugService.isMonitorWindow()) {
          this._widget = cls.WidgetFactory.createWidget("MainContainer", {
            appHash: gbc.systemAppId
          });
          if (this.isLogPlayerRequested()) {
            this._logPlayer = cls.WidgetFactory.createWidget("LogPlayer", {
              appHash: gbc.systemAppId
            });
            this._logPlayer.addChildWidget(this._widget);
          }
          window.requestAnimationFrame(function() {
            var w = this._logPlayer ? this._logPlayer : this._widget;
            document.body.appendChild(w.getElement());
            if (this.isLogPlayerRequested()) {
              this.setSidebarAvailable(true);
            }
          }.bind(this));
          this._defaultTitle = document.title;
          this._applicationHostWidget = cls.WidgetFactory.createWidget("ApplicationHost", {
            appHash: gbc.systemAppId
          });
          this._widget.addChildWidget(this._applicationHostWidget);

          // create drop down container
          if (!this._dropDownContainer) {
            // TODO rename gbc_DropDownContainerWidget to gbc_DropDownContainer (this is not a widget)
            this._dropDownContainer = document.createElement("div");
            this._dropDownContainer.addClasses("gbc_DropDownContainerWidget", "hidden");
            document.body.appendChild(this._dropDownContainer);
          }
        }
      },
      getWidget: function() {
        return this._widget;
      },

      /**
       *
       * @returns {classes.ApplicationHostWidget}
       */
      getApplicationHostWidget: function() {
        return this._applicationHostWidget;
      },

      getLogPlayer: function() {
        return this._logPlayer;
      },

      /**
       *
       * @param {boolean} enable
       */
      setSidebarAvailable: function(enable) {
        this._applicationHostWidget.enableSidebar(enable);
      },

      setSidebarContent: function(widget) {
        this._applicationHostWidget.setSidebarContent(widget);
      },
      start: function() {
        var params = context.UrlService.currentUrl().getQueryStringObject();
        if (params.app || context.bootstrapInfo.appName) {
          context.SessionService.start(params.app || context.bootstrapInfo.appName);
        } else {
          this.displayNoSession();
        }
      },
      displaySession: function() {
        this._applicationHostWidget.getLauncher().setHidden(true);
      },
      displayNoSession: function() {
        this._applicationHostWidget.getLauncher().setHidden(false);
      },
      whenError: function(cb) {
        this._eventListener.when('error', cb);
      },
      getCurrentWindow: function() {
        return this._currentWindow;
      },
      setCurrentWindow: function(win) {
        this._currentWindow = win;
      },

      /**
       * get info about the current available closebutton if any
       * @return {*}
       * @private
       */
      _getCurrentWindowCloseButtonInfo: function() {
        var result = null,
          windowWidget = this.getCurrentWindow();
        if (windowWidget) {
          var uiWidget = windowWidget.getUserInterfaceWidget && windowWidget.getUserInterfaceWidget(),
            app = uiWidget && uiWidget.getParentWidget();
          if (app && app._tabbedPage) {
            var tabbedHostInfo = this._closeButtonsInfo && this._closeButtonsInfo._tabbedHost;
            if (tabbedHostInfo) {
              result = this.getCloseButtonInfo(tabbedHostInfo.widget);
            }
          } else {
            result = this.getCloseButtonInfo(windowWidget);
          }
        }
        return result;
      },

      /**
       * do a click if possible on the current available closebutton if any
       */
      tryCloseButtonClick: function() {
        var closeInfo = this._getCurrentWindowCloseButtonInfo();
        if (closeInfo && closeInfo.closeWidget) {
          closeInfo.closeWidget.manageMouseClick();
        }
      },
      /**
       *
       * @param {Hook} hook
       * @return {HandleRegistration}
       */
      onCurrentWindowChange: function(hook) {
        return this._eventListener.when(this.currentWindowChanged, hook);
      },

      /**
       * - Manage switch of window in the DOM depending of whether they are modal or not and having WebComponent or not.
       * - Display/hide topmenu & toolbars of active/inactive windows.
       * - Set window title
       * @param {classes.WindowWidget} win
       */
      setDisplayedWindow: function(win) {
        if (this._applicationHostWidget) {
          this._applicationHostWidget.updateDisplay();
        }
        if (!win) {
          return;
        }

        // determine if switch of application occured using _currentWindow static variable
        var switchingApplication = (!this._currentWindow && Boolean(win)) ||
          (Boolean(win) && Boolean(this._currentWindow) && win.getUserInterfaceWidget() !== this._currentWindow
            .getUserInterfaceWidget());
        var session = context.SessionService.getCurrent(),
          app = session && session.getCurrentApplication();

        var sameApplication = app && app.getUI().getWidget() === (win.getUserInterfaceWidget() && win.getUserInterfaceWidget()
          .getParentWidget());

        // If new window is a modal, we don't remove/insert it in DOM. Modal is fully managed by WindowTypeVMBehavior
        if (this._currentWindow) {
          this._currentWindow.freeze();
        }
        if (win) {
          // determine if in current application a switch of window occured
          // if only a switch of application occured without change of window in current app, we do nothing (application management done by SessionWidget did all the job)
          var currentUI = win.getUserInterfaceWidget();
          var previousWindow = currentUI._activeWindow;

          if (switchingApplication || !win.isModal) { // if app window changed and new active window isn't a modal, we add it to DOM

            context.DebugService.onApplicationSwitch();

            // WebComponent Management
            if ((previousWindow && previousWindow.hasChildWebComponent()) || (win && win.hasChildWebComponent())) {
              // if window to remove has a webcomponent, just send it far away out of view, without removing it
              if (previousWindow && previousWindow.hasChildWebComponent()) {
                previousWindow.addClass("gbc_out_of_view");
                if (win && !win.hasChildWebComponent() && currentUI && currentUI.getContainerElement()) {
                  currentUI.getContainerElement().appendChild(win.getElement());
                }
              } else {
                if (previousWindow) {
                  previousWindow.getElement().remove();
                }
              }
              // if window to be displayed has a webcomponent, just put it back in the view
              if (win && win.hasChildWebComponent()) {
                win.removeClass("gbc_out_of_view");
                if (!win.getElement().parentNode) {
                  currentUI.getContainerElement().appendChild(win.getElement());
                }
              }
              // if neither previous and new window has WebComponent
            } else if (currentUI) {
              if (currentUI.getContainerElement()) {
                // if previous window wasn't a modal neither, we can safely remove it from DOM
                if (previousWindow && !previousWindow.isModal) {
                  previousWindow.getElement().remove();
                }
                if (win && !win.hasChildWebComponent() && (!win.getElement().parentElement ||
                    (win.getElement().parentElement.lastChild !== win.getElement()))) {
                  currentUI.getContainerElement().appendChild(win.getElement());
                }
              }
              currentUI.activate(); // send activate signal to inform elements that window is append to DOM
            }
          } else if (switchingApplication || win.isModal) {
            var childrenWin = currentUI.getChildren();
            var nonModalPrevWin = null;
            var winIndex = childrenWin.indexOf(win);
            var parentId = win.getParentWindowId();

            // Get the previous non modal window to display it
            for (winIndex; winIndex >= 0; winIndex--) {
              nonModalPrevWin = childrenWin[winIndex - 1];
              if (nonModalPrevWin && !nonModalPrevWin.isModal && nonModalPrevWin._auiTag === parentId) {
                break;
              }
            }
            if (nonModalPrevWin &&
              (nonModalPrevWin.hasChildWebComponent && !nonModalPrevWin.hasChildWebComponent())) {
              if (nonModalPrevWin !== previousWindow && !currentUI.getContainerElement().contains(nonModalPrevWin.getElement())) {
                currentUI.getContainerElement().appendChild(nonModalPrevWin.getElement());
              }
              nonModalPrevWin._forceVisible = true;
            }
          }

          // hide topmenu/toolbar of previous windows if none previous and new window are modal. In that case, topmenu/toolbar container is shared
          if (previousWindow && !previousWindow.isModal && win && !win.isModal) {
            if (previousWindow._activeTopMenuWidget) {
              previousWindow._activeTopMenuWidget.setHidden(true);
            }
            if (previousWindow._toolBarWidget) {
              previousWindow._toolBarWidget.setHidden(true);
            }
          }

          //Manage the top menu of the background window for modal window
          if (previousWindow && previousWindow._parentWindowWidgetForModal && previousWindow._parentWindowWidgetForModal
            ._activeTopMenuWidget) {
            previousWindow._parentWindowWidgetForModal._activeTopMenuWidget.setHidden(true);
          }
          if (win && win._parentWindowWidgetForModal && win._parentWindowWidgetForModal._activeTopMenuWidget) {
            win._parentWindowWidgetForModal._activeTopMenuWidget.setHidden(false);
            if (win.isModal && previousWindow && previousWindow !== win._parentWindowWidgetForModal && previousWindow._activeTopMenuWidget) {
              previousWindow._activeTopMenuWidget.setHidden(true);
            }
          }

          // display topmenu/toolbar of new current window
          if (win) {
            if (win._activeTopMenuWidget) {
              win._activeTopMenuWidget.setHidden(false);
            }
            if (win._toolBarWidget) {
              win._toolBarWidget.setHidden(false);
            }
          }

          this._currentWindow = win;
          currentUI._activeWindow = win;

          if (this._currentWindow) {
            this._currentWindow.unfreeze();
            var chromebar = this._currentWindow.getParentWidget().getChromeBarWidget();
            if (chromebar) {
              chromebar.setLinkedWindow(this._currentWindow);
            }
          }

          // if we switched of application we need to invalidate allocated space
          if (previousWindow && win && switchingApplication) {
            win.getUserInterfaceWidget().getLayoutEngine().invalidateAllocatedSpace();
          }
          // set current window title (icon + text) as application host menu title
          if (sameApplication && !switchingApplication && app && app.getUI().getWidget()._tabbedPage) {
            if (!win.isModal) {
              app.getUI().getWidget()._tabbedPage.setText(win ? (win.getText() || win.getUserInterfaceWidget().getText()) : "");
              app.getUI().getWidget()._tabbedPage.setImage(win ? (win.getImage() || win.getUserInterfaceWidget().getImage()) : "");
            }
          }
          if (!app || (!app.getUI().getWidget()._tabbedPage && !win.isModal)) {
            this.setCurrentTitle(win ? (win.getText() || win.getUserInterfaceWidget().getText()) : "");
            this.setCurrentIcon(win ? (win.getImage() || win.getUserInterfaceWidget().getImage()) : "");
          }

          this._eventListener.emit(this.currentWindowChanged, win);
        }
        // need to refresh current application layout for potential background dynamic VM update
        app = session && session.getCurrentApplication();
        if (app) {
          if (app.dvm) {
            app.dvm.updateProcessingStatus();
          }
          app.layout.when(context.constants.widgetEvents.afterLayoutFocusRestored, function() {
            app.focus.restoreVMFocus(true);
          }.bind(this), true);
          app.layout.refreshLayout();
        }
      },

      /**
       * Define the current app title to display
       * @param {string} title - text to display in top bar
       */
      setCurrentTitle: function(title) {
        if (gbc.ThemeService.getValue("theme-legacy-topbar")) {
          this._applicationHostWidget.getMenu().setText(title);
        }
        var app = gbc.SessionService.getCurrent() && gbc.SessionService.getCurrent().getCurrentApplication();
        var uiWidget = app && app.model.getNode(0) && app.model.getNode(0).getWidget();
        if (uiWidget && uiWidget.getChromeBarWidget()) {
          uiWidget.getChromeBarWidget().setTitle(title);
        }
        document.title = title ? title : this._defaultTitle;
        context.__wrapper.nativeCall({
          name: "windowTitle",
          args: [document.title]
        });
      },

      /**
       * Define the current icon for this app
       * @param {string} img - the icon url for current app
       * @param {string} appIcon - the global icon url
       */
      setCurrentIcon: function(img, appIcon) {
        if (gbc.ThemeService.getValue("theme-legacy-topbar")) {
          this._applicationHostWidget.getMenu().setIcon(img, appIcon);
        }
        var app = gbc.SessionService.getCurrent() && gbc.SessionService.getCurrent().getCurrentApplication();
        var uiWidget = app && app.model.getNode(0) && app.model.getNode(0).getWidget();
        if (uiWidget && uiWidget.getChromeBarWidget()) {
          uiWidget.getChromeBarWidget().setIcon(img, appIcon);
        }
      },
      unsetDisplayedWindow: function(win) {
        if (win && this._currentWindow === win) {
          this._currentWindow.disableActions();
        }
      },

      _closeButtonsInfo: {},

      /**
       *
       * @param {classes.WindowWidget} windowWidget
       */
      getCloseButtonInfo: function(windowWidget) {
        return windowWidget && this._closeButtonsInfo[windowWidget._appHash] &&
          this._closeButtonsInfo[windowWidget._appHash][windowWidget.getUniqueIdentifier()];
      },
      setTabbedHost: function(windowWidget) {
        this._closeButtonsInfo._tabbedHost = {
          widget: windowWidget,
          appHash: windowWidget._appHash,
          windowId: windowWidget.getUniqueIdentifier()
        };
      },
      /**
       *
       * @param {classes.WindowWidget} windowWidget
       * @param {Object} opts
       */
      registerClosableWindow: function(windowWidget, opts) {
        var legacyMenu = context.HostService.getApplicationHostWidget().getMenu();
        if (windowWidget && this._closeButtonsInfo[windowWidget._appHash] &&
          this._closeButtonsInfo[windowWidget._appHash][windowWidget.getUniqueIdentifier()]) {
          this.unregisterClosableWindow(windowWidget, true);
        }
        var perAppInfo = this._closeButtonsInfo[windowWidget._appHash] = this._closeButtonsInfo[windowWidget._appHash] || {};
        var closeInfo = perAppInfo[windowWidget.getUniqueIdentifier()] = perAppInfo[windowWidget.getUniqueIdentifier()] || {};

        // Tabbed host with different window (hosted window)
        if (this._closeButtonsInfo._tabbedHost && this._closeButtonsInfo._tabbedHost.appHash !== windowWidget._appHash) {
          if (opts && opts.chromeBar) {
            //closeInfo.closeWidget = opts.chromeBar.getGbcMenuItem("close");
            opts.chromeBar.setHidden(true);
          } //else {
          closeInfo.closeWidget = cls.WidgetFactory.createWidget("TabbedApplicationClose", {
            appHash: gbc.systemAppId
          });
          closeInfo.closeClickHandler = closeInfo.closeWidget.onClick(windowWidget._emitClose.bind(windowWidget));
          //}

          var session = context.SessionService.getCurrent(),
            application = session && session.getApplicationByHash(windowWidget._appHash),
            applicationWidget = application && application.getUI() && application.getUI().getWidget(),
            actionsElement = applicationWidget && applicationWidget._tabbedPage && applicationWidget._tabbedPage.getTitleWidget()
            .getActionsContainerElement();
          this.setClosableWindowActionProcessing(windowWidget, application.isProcessing());
          if (actionsElement) {
            actionsElement.appendChild(closeInfo.closeWidget.getElement());
          }

          // Tabbed host with a window (host window)
        } else if (this._closeButtonsInfo._tabbedHost && this._closeButtonsInfo._tabbedHost.appHash === windowWidget._appHash) {
          //  if chromebar
          if (opts && opts.chromeBar) {
            closeInfo.closeWidget = opts.chromeBar.getGbcMenuItem("close");
            closeInfo.closeWidget.setLinkedWindow(windowWidget);
          } else if (legacyMenu) {
            closeInfo.closeWidget = cls.WidgetFactory.createWidget("TabbedApplicationHostWindowCloseMenu", {
              appHash: gbc.systemAppId
            });
            closeInfo.closeClickHandler = closeInfo.closeWidget.onClick(windowWidget._emitClose.bind(windowWidget));
            legacyMenu.addChildWidget(closeInfo.closeWidget);
          }
        } else {
          // default case
          //  if chromebar
          if (opts && opts.chromeBar) {
            closeInfo.closeWidget = opts.chromeBar.getGbcMenuItem("close");
            if (!closeInfo.closeWidget.isHidden()) {
              closeInfo.closeWidget.setLinkedWindow(windowWidget);
            }
          } else if (legacyMenu) {
            closeInfo.closeWidget = cls.WidgetFactory.createWidget("ApplicationHostWindowCloseMenu", {
              appHash: gbc.systemAppId
            });
            legacyMenu.addChildWidget(closeInfo.closeWidget);
            closeInfo.closeClickHandler = closeInfo.closeWidget.onClick(windowWidget._emitClose.bind(windowWidget));
          }

          if (legacyMenu && gbc.ThemeService.getValue("theme-legacy-topbar")) {
            legacyMenu.setCloseWidget(closeInfo.closeWidget);
          }
        }

      },
      unregisterClosableWindow: function(windowWidget, noHostDelete) {
        var closeInfo = this.getCloseButtonInfo(windowWidget);
        if (closeInfo.closeWidget.isInstanceOf(cls.ChromeBarItemCloseWidget)) {
          closeInfo.closeWidget.setLinkedWindow(null); // Should restore old linked window
          if (!noHostDelete && this._closeButtonsInfo._tabbedHost && this._closeButtonsInfo._tabbedHost.windowId === windowWidget
            .getUniqueIdentifier()) {
            delete this._closeButtonsInfo._tabbedHost;
          }
        } else {
          if (closeInfo && closeInfo.closeWidget && !closeInfo.closeWidget.isDestroyed()) {
            closeInfo.closeWidget.getElement().remove();
            if (closeInfo.closeClickHandler) {
              closeInfo.closeClickHandler();
              closeInfo.closeClickHandler = null;
            }
            closeInfo.closeWidget.destroy();
            closeInfo.closeWidget = null;
            delete this._closeButtonsInfo[windowWidget._appHash][windowWidget.getUniqueIdentifier()];
            if (!Object.keys(this._closeButtonsInfo[windowWidget._appHash]).length) {
              delete this._closeButtonsInfo[windowWidget._appHash];
            }
            if (!noHostDelete && this._closeButtonsInfo._tabbedHost && this._closeButtonsInfo._tabbedHost.windowId === windowWidget
              .getUniqueIdentifier()) {
              delete this._closeButtonsInfo._tabbedHost;
            }
          }
        }
      },
      setClosableWindowActionActive: function(windowWidget, active) {
        var closeInfo = this.getCloseButtonInfo(windowWidget);
        if (closeInfo && closeInfo.closeWidget) {
          closeInfo.closeWidget.setActive(active, windowWidget);
        }
      },
      setClosableWindowActionHidden: function(windowWidget, hidden) {
        var closeInfo = this.getCloseButtonInfo(windowWidget);
        if (closeInfo && closeInfo.closeWidget && windowWidget.isClosable()) {
          closeInfo.closeWidget.setHidden(hidden, windowWidget);
        }
      },
      setClosableWindowActionProcessing: function(windowWidget, processing) {
        var closeInfo = this.getCloseButtonInfo(windowWidget);
        if (closeInfo && closeInfo.closeWidget && closeInfo.closeWidget._setProcessingStyle) {
          closeInfo.closeWidget._setProcessingStyle(processing);
        }
      },

      /**
       * Handler when the screen orientation changed
       * @param {function} callback - method to call once screen orientation changes
       * @note mobile only
       */
      onOrientationChange: function(callback) {
        return this._eventListener.when("orientationChange.Host", callback.bind(this));
      },

      /**
       * Handler when the screen size changed
       * @param {function} callback - method to call once screen size changes
       */
      onScreenResize: function(callback) {
        return this._eventListener.when("resize.Host", callback.bind(this));
      }

    });
    context.InitService.register(context.HostService);
  });
