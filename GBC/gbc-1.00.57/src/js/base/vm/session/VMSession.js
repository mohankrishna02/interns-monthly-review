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

modulum("VMSession", ["EventListener"],
  function(context, cls) {
    /**
     * A VM driven Session
     * @class VMSession
     * @memberOf classes
     * @extends classes.EventListener
     * @publicdoc Base
     */
    cls.VMSession = context.oo.Class(cls.EventListener, function($super) {
      return /** @lends classes.VMSession.prototype */ {
        __name: "VMSession",
        /**
         * @type {?string}
         */
        _identifier: null,
        /**
         * @type {?string}
         */
        _sessionId: null,
        /**
         * @type {classes.VMApplication[]}
         */
        _applications: null,
        _baseInfos: null,
        _closeHandler: null,
        _restartHandler: null,
        /**
         * @type {classes.SessionWidget}
         */
        _widget: null,
        _sidebarWidget: null,
        _bookmarkWidget: null,
        _applicationIdentifier: 0,
        _applicationQueue: null,

        _browserMultiPageMode: false,
        _browserMultiPageModeAsChild: false,
        _childrenWindows: null,

        _waitingNewTasks: 0,
        _showEnding: false,
        _flushingApplications: false,
        _flushingApplicationsListener: false,
        _unloadListener: false,
        _flushableApplications: null,

        _tabbedContainerInfo: null,

        /** @type {?string} */
        _logPromptUrl: null,
        /** @type Window */
        _logPromptWindow: null,
        /** @type classes.SessionLogPromptWidget */
        _logPromptWidget: null,
        /** @type string[] */
        _serverFeatures: null,
        /** @type {?string} */
        _endUrl: null,

        /**
         * @inheritDoc
         * @constructs
         * @param {?string} identifier session identifier
         */
        constructor: function(identifier) {
          $super.constructor.call(this);
          this._widget = cls.WidgetFactory.createWidget("Session", {
            appHash: gbc.systemAppId
          });
          context.HostService.getApplicationHostWidget().addChildWidget(this._widget);
          this._sidebarWidget = cls.WidgetFactory.createWidget("SessionSidebar", {
            appHash: gbc.systemAppId
          });
          context.HostService.getApplicationHostWidget().getSideBar().addChildWidget(this._sidebarWidget);
          this._widget.setSidebarWidget(this._sidebarWidget);
          this._identifier = identifier;
          this._applications = [];
          this._applicationQueue = [];
          this._closeHandler = this._widget.getEndWidget().when(context.constants.widgetEvents.close, this.destroy.bind(this));
          this._restartHandler = this._widget.getEndWidget().when(context.constants.widgetEvents.restart, this._onRestart.bind(
            this));

          this._flushableApplications = [];
          context.HostService.getApplicationHostWidget().getSideBar().setTitleText(i18next.t("gwc.main.sidebar.title"));
          this._browserMultiPageModeAsChild = context.bootstrapInfo.subAppInfo;
          /*
          if (!this._browserMultiPageModeAsChild) {
            this._bookmarkWidget = cls.WidgetFactory.createWidget("ApplicationBookmarkHostMenu", {
              appHash: gbc.systemAppId
            });
            context.HostService.getApplicationHostWidget().getMenu().addChildWidget(this._bookmarkWidget);
            context.HostService.getApplicationHostWidget().getMenu().setBookmarkWidget(this._bookmarkWidget);
          }
          */
          this._childrenWindows = [];
          this._flushingApplicationsListener = context.InitService.when(gbc.constants.widgetEvents.onBeforeUnload, this
            ._flushWaitingApplications
            .bind(this));
          this._unloadListener = context.InitService.when(gbc.constants.widgetEvents.onUnload, this._destroyChildrenWindows.bind(
            this));
          this._tabbedContainerInfo = {
            app: null,
            windowNode: null,
            /**
             * @type {classes.TabbedContainerWidget}
             */
            tabbedContainerWidget: null,
            /**
             * @type {classes.WidgetBase[]}
             */
            tabbedApplications: [],
            currentTabbedWidget: null,
            currentTabbedRect: {
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "auto",
              height: "auto"
            },
            nullRect: {
              top: null,
              left: null,
              right: null,
              bottom: null,
              width: "auto",
              height: "auto",
              "max-width": "100%",
              "max-height": "100%"
            }
          };
          this._serverFeatures = [];
        },
        _onRestart: function() {
          if (context.bootstrapInfo.reloadOnRestart === "true") {
            window.location.reload(true);
            return;
          }
          var info = this._baseInfos;
          this.destroy(true);
          context.SessionService.start(info.appId, info.urlParameters);
        },
        getWidget: function() {
          return this._widget;
        },
        getApplicationIdentifier: function() {
          return this._applicationIdentifier++;
        },

        destroy: function(restarting) {
          /*
          if (this._bookmarkWidget) {
            context.HostService.getApplicationHostWidget().getMenu().removeChildWidget(this._bookmarkWidget);
            this._bookmarkWidget.destroy();
            this._bookmarkWidget = null;
          }
          */
          context.SessionService.remove(this, true === restarting);
          this._closeHandler();
          this._restartHandler();

          this._sidebarWidget.destroy();
          this._sidebarWidget = null;
          this._widget.destroy();
          this._widget = null;
          this._applications.length = 0;
          this._flushingApplicationsListener();
          this._destroyChildrenWindows();
          $super.destroy.call(this);
        },
        getConnector: function() {
          return this._baseInfos.connector;
        },
        /**
         * Get the session ID
         * @return {string} the session ID
         * @publicdoc
         */
        getSessionId: function() {
          return this._sessionId;
        },

        setSessionId: function(id) {
          if (!this._sessionId) {
            this._sessionId = id;
            context.SessionService.updateSessionId(this, id);
          } else if (id !== this._sessionId) {
            this.error("Session Id Changed");
          }
        },
        getAppId: function() {
          return this._baseInfos.appId;
        },
        error: function(msg) {

        },
        /**
         *
         * @param {classes.VMApplication} application
         */
        add: function(application) {
          this._applications.push(application);
          application.__idleChangedSessionHook = application.dvm.onIdleChanged(this._onIdleChanged.bind(this, application));
          this.emit(context.constants.baseEvents.applicationAdded, application);
        },
        /**
         *
         * @param {classes.VMApplication} application
         */
        remove: function(application) {
          application.__idleChangedSessionHook();
          this._applications.remove(application);
          this._applicationQueue.remove(application);
          this._applicationEnding = application.info().ending;
          var pos = 0;
          while (pos < this._applicationQueue.length) {
            if (this._applicationQueue[pos] === this._applicationQueue[pos + 1]) {
              this._applicationQueue.splice(pos, 1);
            } else {
              pos++;
            }
          }
          this.emit(context.constants.baseEvents.applicationRemoved, application);
          var currentApp = this.getCurrentApplication();
          if (currentApp) {
            var currentWindow = currentApp.getVMWindow();
            if (currentWindow) {
              var appWidget = currentApp.getUI().getWidget(),
                winWidget = currentWindow.getController().getWidget();
              this._widget.setCurrentWidget(appWidget);
              context.HostService.setDisplayedWindow(winWidget);
              context.HostService.getApplicationHostWidget().getSideBar().setActiveWindow(winWidget);
            }
          }
          this._showEnding = true;
          this._updateDisplayEnd();
        },
        _updateDisplayEnd: function() {
          if (this._showEnding && !this._applications.length) {
            if (this._childrenWindows.length || (this._browserMultiPageMode && this._waitingNewTasks > 0)) {
              this.getWidget().showWaitingEnd();
              context.HostService.setDisplayedWindow(null);
            } else {
              if (this._waitingNewTasks === 0 && !this._destroyed) {
                context.HostService.setSidebarContent();
                if (this._tabbedContainerInfo.appIdleHook) {
                  this._tabbedContainerInfo.appIdleHook();
                }
                this.displayEnd();
              }
            }
          }
        },
        _autoclose: function() {
          this._registerTimeout(function() {
            var can = !this._flushableApplications || !this._flushableApplications.length;
            if (can) {
              cls.WindowHelper.closeWindow();
            } else {
              this._autoclose();
            }
          }.bind(this), 200);
        },

        /**
         * Terminate the session
         * (This is always called by window.onunload with forceServer=true)
         * @param {boolean} [forceServer] true to send a session close (/ua/close) to the server (if supported)
         * @publicdoc
         */
        closeSession: function(forceServer) {
          // if forceServer and is not child of an other tab (stantdalone or browserMultiPage activated),
          // send session /ua/close if has feature
          if (forceServer && !this._browserMultiPageModeAsChild && this.hasServerFeature("close-session")) {
            if (this._applications && this._applications[0]) {
              this._applications[0].protocolInterface.closeSession();
            }
            // if forceServer and is child of an other tab (browserMultiPage activated)
            // try to send app /ua/close (will free parent app processing if RUN was called)
          } else if (forceServer && this._browserMultiPageModeAsChild && this._applications[0]) {
            this._applications[0].close();
          } else {
            while (this._applications.length) {
              this._applications[0].stop();
            }
          }
        },

        setEndUrl: function(url) {
          this._endUrl = url;
        },

        displayEnd: function() {
          if (this._browserMultiPageModeAsChild) {
            this._autoclose();
            return;
          }
          this.emit(context.constants.baseEvents.displayEnd, this._baseInfos.session);
          if (this.getWidget()) {
            this.getWidget().getEndWidget().setHeader(i18next.t("gwc.app.ending.title"));
            // disable sidebar on session end
            context.HostService.setSidebarAvailable(false);
            if (this._baseInfos.session) {
              this.getWidget().getEndWidget().showSessionActions();
              this.getWidget().getEndWidget().setSessionLinks(this._baseInfos.customUA || this._baseInfos.connector || "",
                this._baseInfos.session);
              //cls.AuiApplicationService.linkDownload();
              this.getWidget().getEndWidget().setSessionID(this._baseInfos.session);
            }
            if (this._baseInfos.mode === "ua") {
              this.getWidget().getEndWidget().showUAActions();
            }
            if (!this._applicationEnding.normal) {

              switch (this._applicationEnding.flag) {
                case "notFound":
                  this.getWidget().getEndWidget().setHeader(i18next.t("gwc.app.notFound.title"));
                  this.getWidget().getEndWidget().setMessage(i18next.t("gwc.app.notFound.message", {
                    appId: "<strong>\"" + this._baseInfos.appId + "\"</strong>"
                  }));
                  break;
                case "notok":
                  this.getWidget().getEndWidget().setMessage(
                    "<p data-details='notok'>" + i18next.t("gwc.app.error.message") + ".</p><p>" + this._applicationEnding
                    .message +
                    "</p>");
                  break;
                case "forbidden":
                  this.getWidget().getEndWidget().setMessage(
                    "<p data-details='forbidden'>" + i18next.t("gwc.app.forbidden.message") + ".</p><p>" + this._applicationEnding
                    .message + "</p>");
                  break;
                case "autoLogout":
                  this.getWidget().getEndWidget().setMessage(
                    "<p data-details='autoLogout'>" + i18next.t("gwc.app.autologout.message") + ".</p>");
                  break;
                case "uaProxy":
                  this.getWidget().getEndWidget().setMessage(
                    "<p data-details='uaProxy'>" + i18next.t("gwc.app.uaProxy.message") + ".</p><p>" + this._applicationEnding
                    .message +
                    "</p>");
                  break;
              }
            }
            if (this._endUrl) {
              this.getWidget().showRedirectEnd();
              window.location.href = this._endUrl;
            } else if (this._applicationEnding.flag !== "hidden") {
              this.getWidget().showEnd();
            }
          }
          this.displayLogPrompt();
          context.HostService.setDisplayedWindow(null);
        },

        displayLogPrompt: function(promptUrl) {
          var latePromptHandling = !this._logPromptUrl && Boolean(promptUrl);
          if (!latePromptHandling) {
            this._trackPromptEnding();
          }
          if (this._logPromptUrl !== promptUrl) {
            this._logPromptUrl = promptUrl;
            if (!this._logPromptUrl) {
              document.body.removeClass("logPrompting");
              if (this._logPromptWindow) {
                this._logPromptWindow.close();
                this._logPromptWindow = null;
              }
              if (this._logPromptWidgetHandle) {
                this._logPromptWidgetHandle();
              }
              if (this._logPromptWidget) {
                this._logPromptWidget.destroy();
                this._logPromptWidget = null;
              }
            } else {
              if (latePromptHandling) {
                this._trackPromptEnding();
              }
              if (!this._logPromptWidget) {
                this._logPromptWidget = cls.WidgetFactory.createWidget("SessionLogPrompt", {
                  appHash: gbc.systemAppId
                });
                this._logPromptWidgetHandle = this._logPromptWidget.when(context.constants.widgetEvents.click, function() {
                  if (!this._browserMultiPageModeAsChild) {
                    this._displayLogPopup();
                  } else {
                    var opener = window.opener,
                      openerSession = opener && opener.gbc && window.opener.gbc.SessionService.getCurrent();
                    if (openerSession) {
                      openerSession._displayLogPopup();
                    }
                  }
                }.bind(this));
                document.body.appendChild(this._logPromptWidget.getElement());
              }
              if (!this._browserMultiPageModeAsChild) {
                if (!this._logPromptWindow) {
                  document.body.addClass("logPrompting");
                } else {
                  this._logPromptWindow.location.href = this._logPromptUrl;
                }
              }
            }
          }
        },
        _displayLogPopup: function() {
          if (!this._logPromptWindow || this._logPromptWindow.closed) {
            this._logPromptWindow = window.open(this._logPromptUrl, "",
              "resizable,scrollbars,status,width=" + window.innerWidth + ",height=" + window.innerHeight +
              ",top=" + window.screenTop + ",left=" + window.screenLeft);
          } else if (this._logPromptWindow) {
            this._logPromptWindow.focus();
          }
        },

        _trackPromptEnding: function() {
          if (this._logPromptUrl) {
            var hasOnlyIdle = true,
              protocolInterface = this.getApplications()[0] && this.getApplications()[0].protocolInterface,
              protocolAlive = protocolInterface && protocolInterface.isAlive();
            this.getApplications().forEach(function(app) {
              hasOnlyIdle = hasOnlyIdle && app.isIdle();
            });
            if (hasOnlyIdle && protocolAlive) {
              protocolInterface.trackPrompt();
            }
          }
        },

        /**
         *
         * @param {string[]} features
         */
        addServerFeatures: function(features) {
          for (var i = 0; i < features.length; i++) {
            var feature = features[i].trim();
            if (this._serverFeatures.indexOf(feature) < 0) {
              this._serverFeatures.push(feature);
            }
          }
        },
        /**
         *
         * @param {string} feature
         * @return {boolean}
         */
        hasServerFeature: function(feature) {
          return Boolean(this._serverFeatures) && this._serverFeatures.indexOf(feature) >= 0;
        },
        /**
         *
         * @returns {boolean}
         */
        isEmpty: function() {
          return !this._applications.length;
        },

        start: function(appName, params) {
          var info = new cls.VMApplicationInfo({
            appId: appName,
            urlParameters: params || (
              context.bootstrapInfo.queryString ?
              new cls.QueryString(context.bootstrapInfo.queryString).copyContentsObject() :
              context.UrlService.currentUrl().getQueryStringObject()
            )
          });
          info.connector = info.urlParameters.connector || context.bootstrapInfo.connectorUri || "";
          info.customUA = info.urlParameters.customUA || null;
          info.mode = info.urlParameters.mode || "ua";
          info.inNewWindow = this._browserMultiPageModeAsChild;
          if (info.inNewWindow) {
            info.session = this._sessionId = context.bootstrapInfo.sessionId;
            context.HostService.getApplicationHostWidget().getSideBar().setTitleText(i18next.t("gwc.main.sidebar.multitab_title"));
          }
          this._baseInfos = info;
          /*
          if (this._bookmarkWidget) {
            this._bookmarkWidget.setActivated(context.BookmarkService.getBookmark(this.getAppId()));
          }
          */
          var application = new cls.VMApplication(info, this);
          var appWidget = application.getUI().getWidget();
          this.add(application);
          this._widget.setCurrentWidget(appWidget);
          application.start();
          this._registerNewTask(application.protocolInterface);
        },

        startTask: function(taskId, callback) {
          callback = callback || Function.noop;
          var info = {},
            keys;
          if (this._baseInfos) {
            keys = Object.keys(this._baseInfos);
            for (var k = 0; k < keys.length; k++) {
              info[keys[k]] = this._baseInfos[keys[k]];
            }
          }
          info.inNewWindow = this._browserMultiPageMode || (this._browserMultiPageModeAsChild &&
            (this._browserMultiPageModeAsChild !== taskId));

          if (info.inNewWindow) {
            info.urlParameters = context.bootstrapInfo.queryString ?
              new cls.QueryString(context.bootstrapInfo.queryString).copyContentsObject() :
              context.UrlService.currentUrl().getQueryStringObject();
            info.connector = info.urlParameters.connector || context.bootstrapInfo.connectorUri || "";
            info.customUA = info.urlParameters.customUA || null;
            info.mode = info.urlParameters.mode || "ua";
          }
          if (this._browserMultiPageModeAsChild) {
            context.HostService.getApplicationHostWidget().getSideBar().setTitleText(i18next.t("gwc.main.sidebar.multitab_title"));
            this._sessionId = context.bootstrapInfo.sessionId;
            info.session = this._sessionId;
          }

          info.task = true;
          info.page = 2;
          info.app = taskId;

          var application = new cls.VMApplication(new cls.VMApplicationInfo(info), this);
          if (!info.inNewWindow) {
            var appWidget = application.getUI().getWidget();
            this._widget.setCurrentWidget(appWidget);
            this.add(application);
            application.start();
            this.waitedForNewTask();
            callback();
          } else {
            application.waitForNewApp(function() {
              this.waitedForNewTask();
              callback();
            }.bind(this), function() {

            });
          }
        },

        /**
         *
         * @param {window.gbcWrapper} wrapper
         * @param {Object<string, *>} headers
         */
        startDirect: function(wrapper, headers) {
          context.HostService.setSidebarAvailable(true);
          var info = new cls.VMApplicationInfo({
            pingTimeout: 1000,
            page: 1,
            auiOrder: 0,
            mode: "direct"
          });
          if (headers) {
            var headersKeys = Object.keys(context.constants.network.startHeaders);
            for (var i = 0; i < headersKeys.length; i++) {
              var key = headersKeys[i];
              var value = context.constants.network.startHeaders[key];
              info[value.prop || key] = headers[context.constants.network.headers[key]];
            }
          }
          info.wrapper = wrapper;
          this._baseInfos = info;
          var application = new cls.VMApplication(info, this);
          application.setProcessing();
          var appWidget = application.getUI().getWidget();
          this._widget.setCurrentWidget(appWidget);
          this.add(application);
          application.start();
        },
        onApplicationAdded: function(hook) {
          return this.when(context.constants.baseEvents.applicationAdded, hook);
        },
        onApplicationRemoved: function(hook) {
          return this.when(context.constants.baseEvents.applicationRemoved, hook);
        },

        info: function() {
          return this._baseInfos;
        },

        /**
         * Get all running applications
         * @returns {classes.VMApplication[]} an array of applications or null
         * @publicdoc
         */
        getApplications: function() {
          return this._applications;
        },

        /**
         * Get the current application
         * @returns {classes.VMApplication}
         */
        getCurrentApplication: function() {
          if (this._applications.length && this._applications[this._applications.length - 1]) {
            return this._applications[this._applications.length - 1];
          }
          return null;
        },

        /**
         *
         * @returns {classes.VMApplication}
         */
        getApplicationByHash: function(hash) {
          return this._applications && this._applications.filter(function(item) {
            return item.applicationHash === hash;
          })[0];
        },
        setCurrentApplication: function(application) {
          var index = this._applications.indexOf(application);
          if (index !== -1) {
            this._applications.splice(index, 1);
            this._applications.push(application);
          }
        },
        _onIdleChanged: function(application) {
          this.emit(context.constants.baseEvents.idleChanged, application);
        },
        whenIdleChanged: function(hook) {
          return this.when(context.constants.baseEvents.idleChanged, hook);
        },
        isCurrentIdle: function() {
          var app = this.getCurrentApplication();
          return !app || app.dvm.processed && app.dvm.idle && app.layout.isIdle() && app.typeahead.hasFinished();
        },
        activateBrowserMultiPageMode: function() {
          this._browserMultiPageMode = true;
          context.HostService.getApplicationHostWidget().getSideBar().setTitleText(i18next.t("gwc.main.sidebar.multitab_title"));
        },
        _addWaitingApplication: function(application) {
          this._flushableApplications.push(application);
        },
        _removeWaitingApplication: function(application) {
          this._flushableApplications.remove(application);
        },
        _flushWaitingApplications: function() {
          this._flushingApplications = true;
          while (this._flushableApplications && this._flushableApplications.length) {
            cls.WindowHelper.openWindow(cls.UANetwork.newApp(this._flushableApplications.shift()), true);
          }
        },
        _registerNewTask: function(protocolInterface) {
          this._storedProtocol = protocolInterface;
        },
        newTask: function() {
          if (this._storedProtocol) {
            this._storedProtocol.newTask();
          }
        },
        _registerChildWindow: function(win) {
          if (win) {
            this._childrenWindows.push(win);
            win.addEventListener("unload", function() {
              if (win.location.href !== "about:blank") { // thank you firefox
                this._childrenWindows.remove(win);
                this._updateDisplayEnd();
              }
            }.bind(this));
          }
        },
        _destroyChildrenWindows: function() {
          while (this._childrenWindows.length) {
            var w = this._childrenWindows.pop();
            w.__desactivateEndingPopup = true;
            w.close();
          }
        },
        waitingForNewTask: function() {
          this._waitingNewTasks++;
        },

        waitedForNewTask: function() {
          if (this._waitingNewTasks > 0) {
            this._waitingNewTasks--;
          }
          this._updateDisplayEnd();
        },

        isInTabbedContainerMode: function() {
          return Boolean(this._tabbedContainerInfo.windowNode);
        },

        getTabbedContainerModeHostApplication: function() {
          return this._tabbedContainerInfo.app;
        },

        getTabbedContainerWidget: function() {
          return this._tabbedContainerInfo.tabbedContainerWidget;
        },

        /**
         *
         * @param {classes.WindowNode} windowNode
         */
        activateTabbedContainerMode: function(windowNode) {
          var info = this._tabbedContainerInfo;
          var opt = {};

          if (!info.windowNode && windowNode) {
            var session = context.SessionService.getCurrent(),
              apps = session.getApplications(),
              appslen = apps.length;
            session.getWidget().setCurrentWidget(windowNode.getApplication().getUI().getWidget());
            info.app = windowNode.getApplication();
            info.windowNode = windowNode;
            info.tabbedContainerWidget = cls.WidgetFactory.createWidget("TabbedContainer", {
              appHash: gbc.systemAppId
            });
            this.getWidget().setTabbedContainer(info.tabbedContainerWidget);
            var widget = windowNode.getController() && windowNode.getController().getWidget();
            if (widget) {
              this.getWidget().setTabbedContainerHost(windowNode.getApplication().getUI().getWidget());
              // 1. prepare the window
              widget.getContainerElement().empty();
              widget.when(gbc.constants.widgetEvents.unfrozen, function() {
                if (this._currentTabbedWidget && this._currentTabbedWidget._tabbedPage) {
                  this._currentTabbedWidget._tabbedPage._tabbedApp.layout.refreshLayout({
                    resize: true
                  });
                }
              }.bind(this));
              widget.when(context.constants.widgetEvents.destroyed, function() {
                var apps, appFinder = function(app) {
                  return !app._tabbedClosing;
                };
                while ((apps = this.getApplications().filter(appFinder)).length) {
                  if (apps[0] !== info.app) {
                    apps[0].close();
                  }
                  apps[0]._tabbedClosing = true;
                }
              }.bind(this));
              widget.addTabbedContainer(info.tabbedContainerWidget);
              info.tabbedContainerWidget.when(context.constants.widgetEvents.change, function(event, src, page) {
                if (this._currentTabbedWidget && this._currentTabbedWidget.getElement()) {
                  this._currentTabbedWidget.getElement().addClass("gbc_out_of_view");
                  this._currentTabbedWidget.setStyle(this._tabbedContainerInfo.nullRect);
                  this._currentTabbedWidget = null;
                }
                if (page && page._tabbedAppWidget) {
                  this._currentTabbedWidget = page._tabbedAppWidget;
                  this._currentTabbedWidget.getElement().removeClass("gbc_out_of_view");
                  this._currentTabbedWidget.setStyle(this._tabbedContainerInfo.currentTabbedRect);
                  this.setCurrentApplication(page._tabbedApp);
                  if (page._tabbedApp.layout) {
                    page._tabbedApp.layout.refreshLayout({
                      resize: true
                    });
                  }
                  var displayedWindow = page._tabbedApp.getVMWindow(),
                    displayedWindowWidget = displayedWindow && displayedWindow.getController() && displayedWindow
                    .getController()
                    .getWidget();
                  if (displayedWindowWidget) {
                    context.HostService.setDisplayedWindow(displayedWindowWidget);
                  }
                }
              }.bind(this));

              windowNode.getApplication().layout.afterLayout(function() {
                var rectPages = info.tabbedContainerWidget.getContainerElement().getBoundingClientRect(),
                  rect = this._widget.getElement().getBoundingClientRect();
                info.currentTabbedRect = {
                  top: "" + (rectPages.top - rect.top) + "px !important",
                  left: "" + (rectPages.left - rect.left) + "px !important",
                  right: "" + (rect.right - rectPages.right) + "px !important",
                  bottom: "" + (rect.bottom - rectPages.bottom) + "px !important",
                  width: "auto",
                  height: "auto"
                };
                for (var i = 0; i < info.tabbedApplications.length; i++) {
                  var app = info.tabbedApplications[i],
                    appWidget = app.getUI().getWidget();
                  if (appWidget._tabbedPage === info.tabbedContainerWidget.getCurrentPage()) {
                    appWidget.setStyle(info.currentTabbedRect);
                  } else {
                    appWidget.setStyle(this._tabbedContainerInfo.nullRect);
                  }
                  if (!appWidget.getElement().hasClass("gbc_out_of_view") &&
                    appWidget._tabbedPage.getElement().parent("gbc_ApplicationWidget") && app.layout) {
                    app.layout.refreshLayout({
                      resize: true
                    });
                  }
                }
                this._registerAnimationFrame(function() {
                  if (info.tabbedContainerWidget && info.tabbedContainerWidget.updateScrollersVisibility) {
                    info.tabbedContainerWidget.updateScrollersVisibility();
                  }
                });
              }.bind(this));

              // 2. manage sidebar
              this.manageStartMenu();

              context.HostService.setTabbedHost(widget);

              info.app.uiNode().getDescendants("Window").map(function(w) {
                if (w && w.getController() && w.getController().getWidget()) {
                  // Since registerClosableWindow can take an optional argument, use it to pass chromeBar to it
                  opt = {
                    chromeBar: w.getParentNode().getWidget().getChromeBarWidget()
                  };
                  context.HostService.registerClosableWindow(w.getController().getWidget(), opt);
                }
              });
              // 3. manage existing apps
              for (var i = 0; i < appslen; i++) {
                var app = apps[i];
                if (!app.getUI().getWidget()._tabbedPage && app !== info.app) {
                  this.addApplicationWidget(app, app.getUI().getWidget());

                  // jshint ignore:start
                  app.uiNode().getDescendants("Window").map(function(w) {
                    if (w && w.getController() && w.getController().getWidget()) {
                      opt = {
                        chromeBar: w.getParentNode().getWidget().getChromeBarWidget()
                      };
                      context.HostService.registerClosableWindow(w.getController().getWidget(), opt);
                    }
                  });
                  // jshint ignore:end

                }
              }

              context.HostService.setDisplayedWindow(widget);
            }
          }
        },

        /**
         * '
         * @param {classes.VMApplication} app
         * @param {classes.ApplicationWidget} appWidget
         */
        addApplicationWidget: function(app, appWidget) {
          if (this._tabbedContainerInfo.windowNode) {
            this._tabbedContainerInfo.tabbedApplications.push(app);
            appWidget.getElement().addClass("gbc_out_of_view");
            appWidget.setStyle(this._tabbedContainerInfo.nullRect);
            var tabbedContainerPage = cls.WidgetFactory.createWidget("Page", {
              appHash: gbc.systemAppId
            });

            var win = app.getVMWindow() && app.getVMWindow().getController().getWidget();
            tabbedContainerPage.setText(win ? (win.getText() || win.getUserInterfaceWidget().getText()) : "");
            tabbedContainerPage.setImage(win ? (win.getImage() || win.getUserInterfaceWidget().getImage()) : "");
            appWidget._tabbedPage = tabbedContainerPage;
            tabbedContainerPage._tabbedApp = app;
            tabbedContainerPage._tabbedAppWidget = appWidget;

            this.getWidget().addChildWidget(appWidget, {
              noDOMInsert: false
            });
            appWidget.when(context.constants.widgetEvents.destroyed, function() {
              this._tabbedContainerInfo.tabbedApplications.remove(app);
              this._tabbedContainerInfo.tabbedContainerWidget.removeChildWidget(appWidget._tabbedPage);
              appWidget._tabbedPage = null;
              tabbedContainerPage._tabbedApp = null;
              tabbedContainerPage._tabbedAppWidget = null;
              this._registerAnimationFrame(function() {
                if (this._tabbedContainerInfo.tabbedContainerWidget && this._tabbedContainerInfo.tabbedContainerWidget
                  .updateScrollersVisibility) {
                  this._tabbedContainerInfo.tabbedContainerWidget.updateScrollersVisibility();
                }
              }.bind(this));
            }.bind(this));
            this._tabbedContainerInfo.tabbedContainerWidget.addChildWidget(tabbedContainerPage);
            this._registerAnimationFrame(function() {
              if (this._tabbedContainerInfo.tabbedContainerWidget && this._tabbedContainerInfo.tabbedContainerWidget
                .updateScrollersVisibility) {
                this._tabbedContainerInfo.tabbedContainerWidget.updateScrollersVisibility();
              }
            }.bind(this));
          } else {
            this.getWidget().addChildWidget(appWidget);
          }
        },

        manageStartMenu: function(startMenuNode, widget) {
          if (this._tabbedContainerInfo.windowNode && (!startMenuNode ||
              this._tabbedContainerInfo.windowNode.getAncestor("UserInterface") === startMenuNode.getAncestor("UserInterface"))) {
            switch (this._tabbedContainerInfo.windowNode.getStyleAttribute("startMenuPosition")) {
              case "menu":
                context.HostService.setSidebarAvailable(false);
                break;
              case "tree":
                context.HostService.setSidebarAvailable(true);
                var startMenuWidget = widget || this._tabbedContainerInfo.windowNode.getParentNode() &&
                  this._tabbedContainerInfo.windowNode.getParentNode().getController() &&
                  this._tabbedContainerInfo.windowNode.getParentNode().getController().getWidget().getStartMenuWidget();
                if (this._tabbedContainerInfo.app) {
                  this._tabbedContainerInfo.appIdleHook = this._tabbedContainerInfo.app.dvm.onIdleChanged(function() {
                    startMenuWidget.setProcessing(this._tabbedContainerInfo.app && !this._tabbedContainerInfo.app.isIdle());
                  }.bind(this));
                }
                context.HostService.setSidebarContent(startMenuWidget);
                break;
              default:
                context.HostService.setSidebarAvailable(false);
                break;
            }
          } else {
            startMenuNode.getAncestor("UserInterface").getController().getWidget().addStartMenu(widget);
          }
        }
      };
    });
  });
