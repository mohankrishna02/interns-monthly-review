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
modulum('VMApplication', ['EventListener'],
  function(context, cls) {
    /**
     * Object that represents an application of a VM Session
     * @class VMApplication
     * @memberOf classes
     * @extends classes.EventListener
     * @publicdoc Base
     */
    cls.VMApplication = context.oo.Class(cls.EventListener, function($super) {
      return /** @lends classes.VMApplication.prototype */ {
        $static: /** @lends classes.VMApplication */ {
          styleListLoaded: "gStyleListLoaded"
        },
        __name: "VMApplication",
        /** General information for this application
         * @type classes.VMApplicationInfo
         */
        applicationInfo: null,
        /** Indicator to know if the application is running or not */
        running: false,
        /** Indicator to know if the application is ending */
        ending: false,
        ended: false,
        /** Indicator to know if the application has protocol error */
        hasError: false,
        /** protocolInterface
         * @type classes.ProtocolInterface
         */
        protocolInterface: null,
        /** dvm management
         * @type classes.DVMApplicationService
         */
        dvm: null,
        /** model (aui) management
         * @type classes.AuiApplicationService
         */
        model: null,
        /** layout management
         * @type classes.LayoutApplicationService
         */
        layout: null,
        /** actions
         * @type classes.ActionApplicationService
         */
        action: null,
        /** file transfer management
         * @type classes.FileTransferApplicationService
         */
        filetransfer: null,
        /** type ahead management
         * @type classes.TypeAheadApplicationService
         */
        typeahead: null,
        /** keyboard management
         * @type classes.KeyboardApplicationService
         */
        keyboard: null,
        /** Focus management
         * @type classes.FocusApplicationService
         */
        focus: null,
        /** application ui
         * @type classes.UIApplicationService
         * */
        _ui: null,
        /**
         * @type {classes.VMSession}
         */
        _session: null,

        /** @type {Array} */
        styleAttributesChanged: null,

        /** @type {boolean} */
        styleListsChanged: false,

        /** @type {Object} */
        usedStyleAttributes: {},

        _currentlyProcessing: false,
        _processingDelayer: 0,

        /**
         *
         * @param {classes.VMApplicationInfo} info - application info
         * @param {classes.VMSession} session

         */
        constructor: function(info, session) {
          $super.constructor.call(this);
          this._session = session;
          this.applicationInfo = info;
          this.applicationHash = session.getApplicationIdentifier();
          if (!info.inNewWindow) {
            this._ui = cls.ApplicationServiceFactory.create('UI', this);
            this.dvm = cls.ApplicationServiceFactory.create('Dvm', this);
            this.model = cls.ApplicationServiceFactory.create('Model', this);
            this.layout = cls.ApplicationServiceFactory.create('Layout', this);
            this.action = cls.ApplicationServiceFactory.create('Action', this);
            this.filetransfer = cls.ApplicationServiceFactory.create('FileTransfer', this);
            this.typeahead = cls.ApplicationServiceFactory.create('TypeAhead', this);
            this.keyboard = cls.ApplicationServiceFactory.create('Keyboard', this);
            this.focus = cls.ApplicationServiceFactory.create('Focus', this);
            this.message = cls.ApplicationServiceFactory.create('Message', this);
          }
          this.protocolInterface = cls.ApplicationServiceFactory.create(this._getProtocolInterface(info), this);

          this.styleAttributesChanged = [];
          context.WidgetService.registerVMApplication(this);
        },
        /**
         * Get the owning session
         * @returns {classes.VMSession} The owning session
         * @publicdoc
         */
        getSession: function() {
          return this._session;
        },

        waitForNewApp: function(onSuccess, onFailure) {
          this.protocolInterface.waitForNewApp(onSuccess, onFailure);
        },
        _getProtocolInterface: function(info) {
          var result = "NoProtocolInterface";
          switch (info.mode) {
            case "direct":
              result = "DirectProtocolInterface";
              break;
            case "ua":
              result = "UAProtocolInterface";
              break;
            default:
              break;
          }
          return result;
        },
        /**
         * @inheritDoc
         */
        destroy: function() {
          if (!this._destroyed) { // TODO whe should not call destroy on a destroyed object
            this._ui.destroy();
            this.filetransfer.destroy();
            this._session.remove(this);
            this.model.destroy();

            this.applicationInfo = null;

            this._session = null;
            this._ui = null;
            this.dvm = null;
            this.model = null;
            this.layout = null;
            this.action = null;
            this.filetransfer = null;
            this.typeahead = null;
            this.keyboard = null;
            this.focus = null;
            this.message = null;
            this.protocolInterface = null;

            $super.destroy.call(this);

            context.WidgetService.unregisterVMApplication(this);
          }
        },

        start: function() {
          this.protocolInterface.start(this.applicationInfo);
        },
        stop: function(message) {
          if (!this.stopping) {
            this.stopping = true;
            if (!this.ended && this.applicationInfo) {
              if (message) {
                this.applicationInfo.ending = cls.ApplicationEnding.notok(message);
              }
              if (!this.applicationInfo.ending) {
                this.applicationInfo.ending = cls.ApplicationEnding.ok;
              }
              if (this.applicationInfo.urlParameters.logPlayer) {
                this.applicationInfo.ending = cls.ApplicationEnding.logPlayer;
              }

              context.styler.bufferize();
              // TODO reorder, why we don't call this in destroy ??
              this.typeahead.destroy();
              this.model.remove();
              this.setEnding();
              this.action.destroy();
              this.layout.destroy();
              this.model.stop();
              this.dvm.destroy();
              this.protocolInterface.destroy();
              this.keyboard.destroy();
              this.focus.destroy();
              this.filetransfer.destroy();
              this.message.destroy();

              this.destroy();
              context.styler.flush();
              this.ended = true;
            }
          }
        },
        /**
         * Set status of application
         * @param {boolean} running Status
         */
        setRunning: function(running) {
          this.running = running;
          this._ui.setRunning(running);
        },

        /**
         * Set the error status at application's protocol error
         */
        setError: function() {
          this.hasError = true;
        },

        /**
         * Set the ending status at application's end
         */
        setEnding: function() {
          if (!this.ending && !this.ended && !this._destroyed) {
            this.ending = true;
            this.setIdle();
          }
        },

        /**
         * Returns this application's info.
         * @returns {classes.VMApplicationInfo}
         */
        info: function() {
          return this.applicationInfo;
        },
        /**
         * Get application instantiated node by its Aui Id
         * @param {number} id the node id
         * @returns {classes.NodeBase} the node, if found
         * @publicdoc
         */
        getNode: function(id) {
          return this.model && this.model.getNode(id);
        },
        uiNode: function() {
          return this.getNode(0);
        },

        /**
         * Get the VM Focused Node instance
         * @returns {classes.NodeBase} The VM focused node
         * @publicdoc
         */
        getFocusedVMNode: function() {
          var uiNode = this.uiNode();
          if (uiNode) {
            var id = uiNode.attribute("focus");
            return this.getNode(id);
          }
          return null;
        },

        /**
         * Get the VM Focused Node instance
         * or if the focused node is a table or a matrix get the current value node
         * @param {boolean} [inputModeOnly] - return value node only if is node is in INPUT mode
         * @returns {*|classes.NodeBase}
         */
        getFocusedVMNodeAndValue: function(inputModeOnly) {
          var focusedNode = this.getFocusedVMNode();
          if (focusedNode && focusedNode.getCurrentValueNode) {
            var currentValueNode = focusedNode.getCurrentValueNode(inputModeOnly);
            if (currentValueNode) {
              focusedNode = currentValueNode;
            }
          }
          return focusedNode;
        },

        newTask: function() {
          var opener = this._session && this._session._browserMultiPageModeAsChild && window.opener,
            openerSession = opener && opener.gbc && window.opener.gbc.SessionService.getCurrent();
          if (openerSession) {
            openerSession.newTask();
          } else {
            this.protocolInterface.newTask();
          }
        },
        /**
         * Set the idle status to true
         */
        setIdle: function() {
          this._setProcessingStyle(false);
          this.dvm.setIdle(true);
          this.action.setInterruptablesActive(false);
        },
        /**
         * Set the processing status to true
         */
        setProcessing: function() {
          this._setProcessingStyle(true);
          this.dvm.setIdle(false);
          this.action.setInterruptablesActive(true);
          if (gbc.ThemeService.getValue("theme-legacy-topbar")) {
            this.getMenu("runtimeStatus").setProcessing();
          }
        },

        _setProcessingStyleImpl: function(processing) {
          this._processingDelayer = 0;
          if (this._ui && this._ui.getWidget()) {
            this._ui.getWidget().getSidebarWidget().setProcessing(processing);
            var windows = this.model.getNodesByTag("Window"),
              len = windows.length,
              i = 0;
            for (; i < len; i++) {
              if (windows[i] && windows[i]._setProcessingStyle) {
                windows[i]._setProcessingStyle(processing);
              }
            }
          }
        },

        _setProcessingStyle: function(processing) {
          if (!processing) {
            if (this._processingDelayer !== 0) {
              this._clearAnimationFrame(this._processingDelayer);
              this._processingDelayer = 0;
            }
            this._setProcessingStyleImpl(false);
          } else {
            if (this._processingDelayer === 0) {
              this._processingDelayer = this._registerAnimationFrame(this._setProcessingStyleImpl.bind(this, true));
            }
          }
        },
        /**
         * Check if the application is idle
         * @returns {boolean} true if idle, false otherwise
         */
        isIdle: function() {
          return this.dvm.idle;
        },

        /**
         * Check if the application is running
         * @returns {boolean} true if running, false otherwise
         */
        isProcessing: function() {
          return !this.dvm.idle;
        },
        /**
         * Send an Interrupt order
         */
        interrupt: function() {
          this.protocolInterface.interrupt();
        },
        close: function() {
          if (!this.ended && !this._destroyed) {
            if (this.ending) {
              this.destroy();
            } else {
              this.protocolInterface.close();
            }
          }
        },
        error: function() {
          this.setEnding();
        },
        /**
         * fail application gracefully,
         * @param ending ending message
         */
        fail: function(ending) {
          if (ending && this.applicationInfo) {
            this.applicationInfo.ending = cls.ApplicationEnding.notok(ending);
          }
          this._registerTimeout(function() {
            this.stop(ending);
          }.bind(this));
        },
        /**
         * get active window
         * @returns {classes.WindowNode}
         */
        getVMWindow: function() {
          if (this.ending) {
            return null;
          }
          var uiNode = this.uiNode();
          var uiCurrentWindow = uiNode &&
            uiNode.isAttributeSetByVM("currentWindow") &&
            uiNode.attribute("currentWindow");
          if (uiCurrentWindow) { // we don't consider the value 0 as it is not a Window node
            return this.model.getNode(uiCurrentWindow);
          } else {
            return null;
          }
        },

        getActionApplicationService: function() {
          return this.action;
        },

        getTitle: function() {
          if (this.uiNode()) {
            return this.uiNode().attributes.text || this.uiNode().attributes.name;
          } else {
            return "New application";
          }
        },

        /**
         *
         * @param {classes.WidgetBase} widget
         */
        attachRootWidget: function(widget) {
          this._ui.getWidget().addChildWidget(widget);
        },
        /**
         *
         * @returns {classes.UIApplicationService}
         */
        getUI: function() {
          return this._ui;
        },

        /**
         * Get items from the chromebar or from the applicationHostWidget if legacy mode enabled
         * @param {String} name
         * @return {*}
         */
        getMenu: function(name) {
          var sessionWidget = this.getSession().getWidget();
          var menu = null;
          if (!gbc.ThemeService.getValue("theme-legacy-topbar")) {
            menu = this.getUI().getWidget().getUserInterfaceWidget().getChromeBarWidget();
            return menu.getGbcMenuItem(name);
          } else {
            var applicationHostWidget = sessionWidget.getParentWidget();
            menu = applicationHostWidget._menu;
            return name ? menu["_" + name] : menu;
          }
        },

        /**
         * Get the Chromebar
         * @return {classes.ChromeBarWidget|null} the chromebar
         */
        getChromeBar: function() {
          return this.getUI().getWidget().getUserInterfaceWidget().getChromeBarWidget();
        },

        hasActiveKeyEventNode: function() {
          var uiNode = this.uiNode();
          if (uiNode) {
            var focusId = uiNode.attribute('focus');
            var focusedNode = this.getNode(focusId);
            if (['Table', 'Matrix', 'Menu', 'MenuAction', 'Dialog', 'Action'].indexOf(focusedNode.getTag()) !== -1) {
              var isActive = focusedNode.attribute('active') === 1;
              return isActive && (!focusedNode.isAttributePresent("dialogType") || focusedNode.attribute("dialogType").startsWith(
                "Display")); // if node is table and is in display or displayarray mode (only send keys to VM if not in edit mode)
            }
          }
          return false;
        },

        setBrowserMultiPageMode: function(activation) {
          var applicationCount = this._session && this._session.getApplications().length;
          if (applicationCount === 1) {
            if (activation) {
              this._session.activateBrowserMultiPageMode();
            }
          }
        },

        setTabbedContainerMode: function(activation, windowNode) {
          if (this._session && activation) {
            this._session.activateTabbedContainerMode(windowNode);
          }
        },

        /** Return the action node of active dialog according to vmKey param
         *
         * @param vmKey
         * @returns {*} vm event
         */
        getActiveDialogAction: function(vmKey) {

          var actionNode = null;
          var window = this.getVMWindow();
          var acceleratorName = null;
          var acceleratorName2 = null;
          var acceleratorName3 = null;
          var acceleratorName4 = null;

          if (window) { // search the action in the current dialog
            var dialog = window.getActiveDialog();
            if (dialog) {
              var actions = dialog.getChildren();
              for (var i = 0; i < actions.length; ++i) {
                var action = actions[i];
                var isActive = (action.attribute("active") !== 0);
                if (isActive) {
                  acceleratorName = action.attribute("acceleratorName");
                  acceleratorName2 = action.attribute("acceleratorName2");
                  acceleratorName3 = action.attribute("acceleratorName3");
                  acceleratorName4 = action.attribute("acceleratorName4");
                  if (acceleratorName && acceleratorName.toString().toLowerCase() === vmKey ||
                    acceleratorName2 && acceleratorName2.toString().toLowerCase() === vmKey ||
                    acceleratorName3 && acceleratorName3.toString().toLowerCase() === vmKey ||
                    acceleratorName4 && acceleratorName4.toString().toLowerCase() === vmKey) {
                    actionNode = action;
                  }
                }
              }
            }
          }
          return actionNode;
        },

        /** Return the action node of default action list according to vmKey param
         *
         * @param vmKey
         * @returns {*} vm event
         */
        getDefaultAction: function(vmKey) {
          var acceleratorName = null;
          var acceleratorName2 = null;
          var acceleratorName3 = null;
          var acceleratorName4 = null;

          // search the action in the action default list
          var actionDefaultList = this.uiNode() && this.uiNode().getFirstChild("ActionDefaultList");
          if (actionDefaultList) {
            var actionDefaults = actionDefaultList.getChildren();
            for (var i = 0; i < actionDefaults.length; ++i) {
              var actionDefault = actionDefaults[i];
              acceleratorName = actionDefault.attribute("acceleratorName");
              acceleratorName2 = actionDefault.attribute("acceleratorName2");
              acceleratorName3 = actionDefault.attribute("acceleratorName3");
              acceleratorName4 = actionDefault.attribute("acceleratorName4");
              if (acceleratorName && acceleratorName.toString().toLowerCase() === vmKey ||
                acceleratorName2 && acceleratorName2.toString().toLowerCase() === vmKey ||
                acceleratorName3 && acceleratorName3.toString().toLowerCase() === vmKey ||
                acceleratorName4 && acceleratorName4.toString().toLowerCase() === vmKey) {
                return actionDefault;
              }
            }
          }
          return null;
        },

        getDefaultActionForName: function(name) {
          var actionDefaultList = this.uiNode() && this.uiNode().getFirstChild("ActionDefaultList");
          if (actionDefaultList) {
            var actionDefaults = actionDefaultList.getChildren();
            for (var i = 0; i < actionDefaults.length; ++i) {
              var actionDefault = actionDefaults[i];
              if (name === actionDefault.attribute("name")) {
                return actionDefault;
              }
            }
          }
          return null;
        }
      };
    });
  });
