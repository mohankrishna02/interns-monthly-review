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

modulum('DebugService', ['InitService'],
  function(context, cls) {

    /**
     * Debug Service
     * @namespace gbc.DebugService
     * @gbcService
     */
    context.DebugService = context.oo.StaticClass(function() {
      return /** @lends gbc.DebugService */ {
        __name: "DebugService",
        /** @type Window */
        _monitorWindow: null,
        /**
         * @type classes.MonitorWidget
         */
        _widget: null,
        /**
         * @type classes.DebugAuiController
         */
        _debugAuiController: null,
        auiview: null,
        _isDebugWindow: false,
        /**
         * @type classes.EventListener
         */
        _eventListener: null,

        _debugUis: null,
        _active: false,
        _disabled: false,

        _highlightElement: null,
        _highlightTimer: null,
        _nodeToShow: null,
        _persistantDebugGrid: false,

        _orderManagedEvent: null,

        _canCounterServer: false,
        /**
         * Check if the current page is a debug monitor
         * @return {boolean} - true if it's the debug monitor, false otherwise
         * @private
         */
        _isMonitor: function() {
          return Boolean(context.UrlService.currentUrl().getQueryStringObject().monitor);
        },

        /**
         * Init service method. should be called only once.
         */
        init: function() {
          this._debugUis = [];
          this._eventListener = new cls.EventListener();
          if (this._isMonitor()) {
            this.auiview = {};
            this._isDebugWindow = true;
            this._widget = cls.WidgetFactory.createWidget("Monitor", {
              appHash: gbc.systemAppId
            });
            document.body.appendChild(this._widget.getElement());
            this._debugAuiController = new cls.DebugAuiController();
            this._widget.addChildWidget(this._debugAuiController.getWidget());

            window.setTimeout(function() {
              var session = window.opener && window.opener.gbc && window.opener.gbc.SessionService.getCurrent();
              var app = session && session.getCurrentApplication();
              if (app) {
                this._debugAuiController.refreshDebugAui(app.getNode(0));
                window.opener.gbc.DebugService.attach(window);

                // Refresh debug window at each order
                this._onAppOrdersManaged(app, function() {
                  this._debugAuiController.refreshDebugAui(app.getNode(0));
                }.bind(this));
              }
            }.bind(this), 100);
          } else {
            if (context.__wrapper.isNative()) {
              context.__wrapper.on(context.__wrapper.events.DEBUGNODE, function(event, src, nodeId) {
                this.onHighlightAuiNode({
                  auiNodeId: nodeId
                });
              }.bind(this));
            }
          }
          this.whenActivationChanged(function(event, src, active) {
            if (active) {
              document.body.addClass("gbc_DebugMode");
              if (window.isURLParameterEnabled(window.location.search, "debugcounter")) {
                this.tryCounterServer();
              }
            }
          }.bind(this));
        },

        /**
         * Handler called once application has switched
         */
        onApplicationSwitch: function() {
          if (this._monitorWindow) {
            var debugAuiController = this._monitorWindow.gbc.DebugService._debugAuiController;
            var app = gbc.SessionService.getCurrent().getCurrentApplication();

            // Refresh debug window at each order
            this._onAppOrdersManaged(app, function() {
              debugAuiController.refreshDebugAui(app.getNode(0));
            }.bind(this));

            debugAuiController.refreshDebugAui(app.getNode(0));
            this.attach(this._monitorWindow);
          }
          this.hideHighlightAui();

        },

        /**
         * @return {boolean}
         */
        isMonitorWindow: function() {
          return this._isDebugWindow;
        },

        /**
         * Destroy the service
         */
        destroy: function() {
          if (this._highlightTimer) {
            window.clearTimeout(this._highlightTimer);
            this._highlightTimer = null;
          }
          if (this._monitorWindow) {
            this._monitorWindow.close();
          }
          if (this._orderManagedEvent) {
            this._orderManagedEvent(); //unbind events
          }
        },

        /**
         * Show the Debug window with the AUI tree
         * @param {Number} [auiId] the aimed node id
         */
        show: function(auiId) {
          if (!this._monitorWindow) {
            if (context.__wrapper.isNative()) {
              context.__wrapper.showDebugger(Object.isNumber(auiId) ? auiId : -1);
            } else {
              var url = context.UrlService.currentUrl();
              window.open(url.removeQueryString("app").addQueryString("monitor", true).toString());
            }
          } else {
            var uiNode = context.SessionService.getCurrent().getCurrentApplication().getNode(0);
            var debugAuiController = this._monitorWindow.gbc.DebugService._debugAuiController;
            if (uiNode.auiSerial !== debugAuiController.auiSerial) {
              debugAuiController.refreshDebugAui(uiNode);
            }
            this._monitorWindow.focus();
          }
        },

        /**
         *
         * @param monitorWindow
         */
        attach: function(monitorWindow) {
          if (this._monitorWindow !== monitorWindow) {
            this._monitorWindow = monitorWindow;
            this._monitorWindow.document.title = "GBC Debug tools";
            this._monitorWindow.onunload = function() {
              this._monitorWindow = null;
            }.bind(this);
            //Persistant Debug Grid
            this._monitorWindow.document.querySelector("#debugGrid").on("change.persistantDebugGrid", function(event) {
              gbc.DebugService.setPersistantDebugGrid(event.target.checked);
            }.bind(this));
            if (this._nodeToShow !== null) {
              this._monitorWindow.gbc.DebugService._debugAuiController.showNode(this._nodeToShow);
              this._nodeToShow = null;
            } else {
              this._monitorWindow.gbc.DebugService._debugAuiController.showNode(window.gbcNode(0));
            }
            this._monitorWindow.addEventListener(context.classes.DebugAuiController.highlightAui, this.onHighlightAuiNode.bind(
              this));
          }
        },

        /**
         * Enable/disable the persistant Debug grid
         * @param status {boolean} - true to enable, false otherwise
         */
        setPersistantDebugGrid: function(status) {
          this._persistantDebugGrid = status;
          if (!status) {
            document.body.removeChild(this._highlightElement);
            this._highlightTimer = null;
            this._highlightElement = null;
          }
        },

        /**
         *
         * @param widget
         */
        registerDebugUi: function(widget) {
          if (this._debugUis.indexOf(widget) < 0) {
            this._debugUis.push(widget);
          }
          widget.activate(this._active);
        },

        /**
         *
         * @param widget
         */
        unregisterDebugUi: function(widget) {
          if (this._debugUis.indexOf(widget) >= 0) {
            this._debugUis.remove(widget);
          }
        },

        /**
         *
         * @param hook
         * @return {*|HandleRegistration}
         */
        whenActivationChanged: function(hook) {
          return this._eventListener.when("debugActivationChanged", hook);
        },

        /**
         * This override the disabled mode
         */
        enable: function() {
          this._disabled = false;
        },

        /**
         *
         */
        disable: function() {
          this._disabled = true;
        },

        /**
         * Activate the Debug service
         * @param {?Boolean} force - true to override the url parameters
         */
        activate: function(force) {
          if (force) {
            this.enable();
          }
          if (!this._active && !this._disabled) {
            this._active = true;
            for (var i = 0; i < this._debugUis.length; i++) {
              this._debugUis[i].activate(this._active);
            }
            context.classes.DebugHelper.activateDebugHelpers();
            this._registerDebugContextMenu();
            document.body.addClass("gbc_DebugMode");
            this._eventListener.emit("debugActivationChanged", true);
          }
        },

        /**
         *
         * @private
         */
        _registerDebugContextMenu: function() {
          if (!this._isMonitor() && !this.__debugContextMenuRegistered) {
            this.__debugContextMenuRegistered = true;
            window.addEventListener('contextmenu', function(event) {
              if (window.navigator.platform.indexOf('Mac') === 0 ? event.metaKey : event.ctrlKey) {
                var auiNode = window.gbcNode(event.target);
                if (auiNode) {
                  this.show(auiNode.getId());
                  if (this._monitorWindow) {
                    var uiNode = auiNode.getApplication().getNode(0);
                    var debugAuiController = this._monitorWindow.gbc.DebugService._debugAuiController;
                    if (uiNode.auiSerial !== debugAuiController.auiSerial) {
                      debugAuiController.refreshDebugAui(uiNode);
                    }
                    this._monitorWindow.gbc.DebugService._debugAuiController.showNode(auiNode);
                  } else {
                    this._nodeToShow = auiNode;
                  }
                  event.preventCancelableDefault();
                }
              }
            }.bind(this));
          }
        },

        /**
         * Handler called once received orders from the VM
         * @param app - vm application
         * @param callback - hook called once orders are received
         * @private
         */
        _onAppOrdersManaged: function(app, callback) {
          if (this._orderManagedEvent) {
            this._orderManagedEvent();
          }
          this._orderManagedEvent = app.dvm.onOrdersManaged(function() {
            callback();
          }.bind(this));
        },

        /**
         *
         * @return {boolean}
         */
        isActive: function() {
          return this._active;
        },

        /**
         * Hide the highlight layer
         */
        hideHighlightAui: function() {
          if (this._highlightElement) {
            this._highlightElement.addClass("hidden");
          }
        },

        /**
         * Handler called when an element is clicked in AUI tree
         * @param event
         */
        onHighlightAuiNode: function(event) {
          var currentApp = gbc.SessionService.getCurrent().getCurrentApplication();
          if (currentApp) {

            var node = currentApp.getNode(event.auiNodeId);
            if (node.getTag() === 'TreeItem') {
              var table = node;
              while (table.getTag() !== 'Table') {
                table = table.getParentNode();
              }
              var valueIndex = node.attribute('row');
              if (valueIndex === -1) {
                return;
              }
              node = table.getFirstChild('TableColumn').getFirstChild('ValueList').getChildren()[valueIndex];
            }
            var widget = null;
            while (!widget) {
              var ctrl = node.getController();
              if (ctrl) {
                widget = ctrl.getWidget();
              }
              node = node.getParentNode();
            }

            if (this._highlightElement) {
              window.clearTimeout(this._highlightTimer);
              document.body.removeChild(this._highlightElement);
              this._highlightElement = null;
            }

            if (widget._layoutEngine) {
              if (widget._layoutEngine instanceof cls.GridLayoutEngine) {
                this._highlightElement = this.createGridHighlightElement(widget);
              } else if (widget._layoutEngine instanceof cls.DBoxLayoutEngine) {
                this._highlightElement = this.createDBoxHighlightElement(widget);
              }
            }
            if (!this._highlightElement) {
              this._highlightElement = this.createDefaultHighlightElement(widget);
            }

            document.body.appendChild(this._highlightElement);
            if (!this._persistantDebugGrid) {
              this._highlightTimer = window.setTimeout(function() {
                document.body.removeChild(this._highlightElement);
                this._highlightTimer = null;
                this._highlightElement = null;
              }.bind(this), 2000);
            }
          }
        },

        /**
         * Will create an element used to highlight a widget
         * @param widget
         * @return {HTMLElement}
         */
        createDefaultHighlightElement: function(widget) {
          var widgetRect = widget.getElement().getBoundingClientRect();
          var element = document.createElement("div");
          element.style.position = 'fixed';
          element.style.backgroundColor = "rgba(255,0,0,0.5)";
          element.style.border = "1px solid red";
          element.style.zIndex = 999999;
          element.style.top = widgetRect.top + "px";
          element.style.left = widgetRect.left + "px";
          element.style.width = widgetRect.width + "px";
          element.style.height = widgetRect.height + "px";

          document.body.off("keydown.debugLayer");
          document.body.off("keyup.debugLayer");
          document.body.on("keydown.debugLayer", function(event) {
            if (event.shiftKey) {
              element.style.zIndex = -5000;
            }
          });
          document.body.on("keyup.debugLayer", function(event) {
            element.style.zIndex = 999999;
          });
          return element;
        },

        /**
         * Will create an element used to highlight a grid widget
         * @param widget
         * @return {HTMLElement}
         */
        createGridHighlightElement: function(widget) {
          var widgetRect = widget.getElement().getBoundingClientRect();
          var element = this.createDefaultHighlightElement(widget);
          element.style.backgroundColor = "";

          var decorating = {
            offsetLeft: widget.getLayoutInformation().getDecoratingOffset().getWidth(true),
            offsetTop: widget.getLayoutInformation().getDecoratingOffset().getHeight(true),
            width: widget.getLayoutInformation().getDecorating().getWidth(true),
            height: widget.getLayoutInformation().getDecorating().getHeight(true)
          };
          var dimensionElementsList = [
            widget._layoutEngine._xspace.dimensionManager.dimensionElements,
            widget._layoutEngine._yspace.dimensionManager.dimensionElements
          ];
          for (var i = 0; i < dimensionElementsList.length; ++i) {
            var dimensionElements = dimensionElementsList[i];
            var total = 0;
            for (var j = 0; j < dimensionElements.length; ++j) {
              var bandSize = dimensionElements[j].getSize(true, true);
              var band = document.createElement("div");
              band.style.position = 'absolute';
              band.style.backgroundColor = j % 2 ? "rgba(255,100,0,0.3)" : "rgba(255,0,0,0.3)";
              if (i === 0) {
                band.style.top = 0 + decorating.offsetTop + "px";
                band.style.left = total + decorating.offsetLeft + "px";
                band.style.width = bandSize + "px";
                band.style.height = widgetRect.height - decorating.height + "px";
              } else {
                band.style.top = total + decorating.offsetTop + "px";
                band.style.left = 0 + decorating.offsetLeft + "px";
                band.style.width = widgetRect.width - decorating.width + "px";
                band.style.height = bandSize + "px";
              }
              total += bandSize;
              element.appendChild(band);
            }
          }

          var children = widget.getChildren();
          for (i = 0; i < children.length; ++i) {
            var childWidgetRect = children[i].getElement().getBoundingClientRect();
            var childRectElement = document.createElement("div");
            childRectElement.style.position = 'fixed';
            childRectElement.style.border = "1px solid red";
            childRectElement.style.top = childWidgetRect.top + "px";
            childRectElement.style.left = childWidgetRect.left + "px";
            childRectElement.style.width = childWidgetRect.width + "px";
            childRectElement.style.height = childWidgetRect.height + "px";
            element.appendChild(childRectElement);
          }
          return element;
        },

        /**
         * Will create an element used to highlight a DBox widget
         * @param widget
         * @return {HTMLElement}
         */
        createDBoxHighlightElement: function(widget) {
          var widgetRect = widget.getElement().getBoundingClientRect();
          var element = this.createDefaultHighlightElement(widget);

          element.style.backgroundColor = "";

          var children = widget.getChildren();
          var total = 0;
          for (var i = 0; i < children.length; ++i) {
            var bandSize = widget._layoutEngine._getAllocatedSize(children[i]);
            var band = document.createElement("div");
            band.style.position = 'absolute';
            band.style.backgroundColor = i % 2 ? "rgba(255,100,0,0.5)" : "rgba(255,0,0,0.5)";
            if (widget._layoutEngine instanceof cls.HBoxLayoutEngine) {
              band.style.top = 0;
              band.style.left = total + "px";
              band.style.width = bandSize + "px";
              band.style.height = widgetRect.height + "px";
            } else {
              band.style.top = total + "px";
              band.style.left = 0;
              band.style.width = widgetRect.width + "px";
              band.style.height = bandSize + "px";
            }
            total += bandSize;
            element.appendChild(band);
          }

          return element;
        },

        /**
         *
         * @param catName
         * @param noToggle
         */
        catClicked: function(catName, noToggle) {
          if (!noToggle) {
            this.auiview['.cat_' + catName] = !this.auiview['.cat_' + catName];
          }
          var elements = document.body.getElementsByClassName('cat_' + catName),
            i = 0,
            len = elements.length;
          for (; i < len; i++) {
            elements[i].toggleClass("hidden", Boolean(this.auiview['.cat_' + catName]));
          }
        },

        tryCounterServer: function() {
          try {
            fetch("http://localhost:9999/")
              .then(function() {
                this._canCounterServer = true;
              }.bind(this))
              .catch(function() {
                this._canCounterServer = false;
              }.bind(this));

          } catch (e) {
            this._canCounterServer = false;
          }
        },

        count: function(name) {
          if (this._canCounterServer) {
            try {
              fetch("http://localhost:9999/var/increment/" + name).catch();
            } catch (e) {
              //
            }
          }
        }
      };
    });
    context.InitService.register(context.DebugService);
  });
