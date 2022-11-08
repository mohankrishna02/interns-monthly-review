/// FOURJS_START_COPYRIGHT(D,2014)
/// Property of Four Js*
/// (c) Copyright Four Js 2014, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

'use strict';

modulum('ModelHelper', ['EventListener'],
  function(context, cls) {
    /**
     * Helper to ease AUI tree access for customized widgets,
     * Manages client side life cycle representation of the node.
     * @class ModelHelper
     * @memberOf classes
     * @extends classes.EventListener
     * @publicdoc Base
     */
    cls.ModelHelper = context.oo.Class(cls.EventListener, function($super) {
      return /** @lends classes.ModelHelper.prototype */ {
        __name: 'ModelHelper',

        /** @type {classes.WidgetBase} */
        _widget: null,
        /** @type {?Function[]} */
        _newApplicationsListeners: null,
        /** @type {?Function[]} */
        _closeApplicationsListeners: null,
        /** @type {?Function[]} */
        _sessionEndListeners: null,
        /** @type {?Function[]} */
        _auiUpdateListeners: null,
        /** @type {?Function[]} */
        _currentWindowListeners: null,
        /** @type {?Function[]} */
        _activeListenersHandlers: null,

        /**
         * @constructs
         * @param {classes.WidgetBase} widget the widget to handle
         */
        constructor: function(widget) {
          $super.constructor.call(this);
          this._widget = widget;
        },

        /**
         * Unbind all active listeners and destroy the current instance.
         */
        destroy: function() {
          // unbind all active listeners
          var h = null;
          if (this._activeListenersHandlers) {
            while (this._activeListenersHandlers.length > 0) {
              h = this._activeListenersHandlers.pop();
              if (h) {
                h(); // unregister listener
              }
            }
            h = null;
            this._activeListenersHandlers = null;
          }
          this._newApplicationsListeners = null;
          this._closeApplicationsListeners = null;
          this._sessionEndListeners = null;
          this._auiUpdateListeners = null;
          this._currentWindowListeners = null;

          this._widget = null;
          $super.destroy.call(this);
        },

        /**
         * Registers a listener which will be called when a new application is started
         * @param listener {Function=} - the function to call when a new application is started
         * @returns {function(this:classes.ModelHelper)} The unregister handler. Simply call this function to stop listening for new applications
         * @publicdoc
         */
        addNewApplicationListener: function(listener) {
          if (this._activeListenersHandlers === null) {
            this._activeListenersHandlers = [];
          }
          if (this._newApplicationsListeners === null) {
            this._newApplicationsListeners = [];

            var onApplicationAdded = function(event, sender, app) {
              // for each iteration we recheck if array is defined because modelhelper may have been destroyed in a previous iteration
              for (var i = 0; this._newApplicationsListeners && i < this._newApplicationsListeners.length; ++i) {
                this._newApplicationsListeners[i](app);
              }
            }.bind(this);

            this._activeListenersHandlers.push(context.SessionService.onSessionAdded(function(event, sender, session) {
              // If null, widget may have been destroyed. We stop to create listeners. Otherwise, we attach new one.
              if (this._activeListenersHandlers) {
                this._activeListenersHandlers.push(session.when(context.constants.baseEvents.applicationAdded,
                  onApplicationAdded));
              }
            }.bind(this)));
            var session = context.SessionService.getCurrent();
            if (session) {
              this._activeListenersHandlers.push(session.when(context.constants.baseEvents.applicationAdded, onApplicationAdded));
            }
          }
          this._newApplicationsListeners.push(listener);

          return function() {
            if (this._newApplicationsListeners) {
              this._newApplicationsListeners.remove(listener);
            }
          }.bind(this);
        },

        /**
         * Registers a listener which will be called when an application is closed
         * @param listener {Function=} - the function to call when an application is closed
         * @returns {function(this:classes.ModelHelper)} The unregister handler. Simply call this function to stop listening for closed applications
         * @publicdoc
         */
        addCloseApplicationListener: function(listener) {
          if (this._activeListenersHandlers === null) {
            this._activeListenersHandlers = [];
          }
          if (this._closeApplicationsListeners === null) {
            this._closeApplicationsListeners = [];

            var onApplicationClosed = function(event, sender, app) {
              // for each iteration we recheck if array is defined because modelhelper may have been destroyed in a previous iteration
              for (var i = 0; this._closeApplicationsListeners && i < this._closeApplicationsListeners.length; ++i) {
                this._closeApplicationsListeners[i](app);
              }
            }.bind(this);

            this._activeListenersHandlers.push(context.SessionService.onSessionAdded(function(event, sender, session) {
              // If null, widget may have been destroyed. We stop to create listeners. Otherwise, we attach new one.
              if (this._activeListenersHandlers) {
                this._activeListenersHandlers.push(session.when(context.constants.baseEvents.applicationRemoved,
                  onApplicationClosed));
              }
            }.bind(this)));
            var session = context.SessionService.getCurrent();
            if (session) {
              this._activeListenersHandlers.push(session.when(context.constants.baseEvents.applicationRemoved, onApplicationClosed));
            }
          }
          this._closeApplicationsListeners.push(listener);

          return function() {
            if (this._closeApplicationsListeners) {
              this._closeApplicationsListeners.remove(listener);
            }
          }.bind(this);
        },

        /**
         * Registers a listener which will be called when all applications are closed and session end page is displayed.
         * @param listener {Function=} - the function to call when session end page is displayed
         * @returns {function(this:classes.ModelHelper)} The unregister handler. Simply call this function to stop listening for session end
         * @publicdoc
         */
        addSessionEndListener: function(listener) {
          if (this._activeListenersHandlers === null) {
            this._activeListenersHandlers = [];
          }
          if (this._sessionEndListeners === null) {
            this._sessionEndListeners = [];

            var onSessionEndClosed = function(event, sender, sessionId) {
              // for each iteration we recheck if array is defined because modelhelper may have been destroyed in a previous iteration
              for (var i = 0; this._sessionEndListeners && i < this._sessionEndListeners.length; ++i) {
                this._sessionEndListeners[i](sessionId);
              }
            }.bind(this);

            this._activeListenersHandlers.push(context.SessionService.onSessionAdded(function(event, sender, session) {
              // If null, widget may have been destroyed. We stop to create listeners. Otherwise, we attach new one.
              if (this._activeListenersHandlers) {
                this._activeListenersHandlers.push(session.when(context.constants.baseEvents.displayEnd, onSessionEndClosed));
              }
            }.bind(this)));
            var session = context.SessionService.getCurrent();
            if (session) {
              this._activeListenersHandlers.push(session.when(context.constants.baseEvents.displayEnd, onSessionEndClosed));
            }
          }
          this._sessionEndListeners.push(listener);

          return function() {
            if (this._sessionEndListeners) {
              this._sessionEndListeners.remove(listener);
            }
          }.bind(this);
        },

        /**
         * Registers a listener which will be called when the current window changes
         * @param listener {Function=} - the function to call when the current window changes
         * @returns {function(this:classes.ModelHelper)} The unregister handler. Simply call this function to stop listening for window changes
         * @publicdoc
         */
        addCurrentWindowChangeListener: function(listener) {
          if (this._activeListenersHandlers === null) {
            this._activeListenersHandlers = [];
          }
          if (this._currentWindowListeners === null) {
            this._currentWindowListeners = [];

            this._activeListenersHandlers.push(context.HostService.onCurrentWindowChange(
              /**
               * @param {classes.Event} event event object
               * @param {Object} src event emitter
               * @param {classes.WindowWidget} win data
               */
              function(event, sender, win) {
                var i = 0;
                var windowNode = null;
                var w = win;
                var appHash = null;
                while (w) {
                  if (w._appHash !== undefined) {
                    appHash = w._appHash;
                    break;
                  }
                  w = w.getParentWidget();
                }
                if (appHash !== null) {
                  var app = null;
                  var session = context.SessionService.getCurrent();
                  for (i = 0; i < session._applications.length; ++i) {
                    var a = session._applications[i];
                    if (a.applicationHash === appHash) {
                      app = a;
                      break;
                    }
                  }
                  windowNode = app.model.getNode(win._auiTag);
                }
                // for each iteration we recheck if array is defined because modelhelper may have been destroyed in a previous iteration
                for (i = 0; this._currentWindowListeners && i < this._currentWindowListeners.length; ++i) {
                  this._currentWindowListeners[i](windowNode);
                }
              }.bind(this)));
          }
          this._currentWindowListeners.push(listener);

          return function() {
            if (this._currentWindowListeners) {
              this._currentWindowListeners.remove(listener);
            }
          }.bind(this);
        },

        /**
         * Registers a listener which will be called when any DVM answer is received.
         * You can update your widget in the provided callback
         * This listening method is general to all started applications. If your UI updates are heavy, prefer more fine grained update notification mechanisms
         * @param {Function=} listener - the function to call when a new application is started
         * @returns {function(this:classes.ModelHelper)} The unregister handler. Simply call this function to stop listening for new applications
         * @publicdoc
         */
        addAuiUpdateListener: function(listener) {
          if (this._activeListenersHandlers === null) {
            this._activeListenersHandlers = [];
          }
          if (this._auiUpdateListeners === null) {
            this._auiUpdateListeners = [];

            this._activeListenersHandlers.push(context.SessionService.onSessionAdded(function(event, session) {
              // If null, widget may have been destroyed. We stop to create listeners. Otherwise, we attach new one.
              if (this._activeListenersHandlers) {
                this._activeListenersHandlers.push(session.when(context.constants.baseEvents.applicationAdded, this._onApplicationAdded
                  .bind(this)));
              }
            }.bind(this)));
            var session = context.SessionService.getCurrent();
            if (session) {
              for (var i = 0; i < session._applications.length; ++i) {
                this._activeListenersHandlers.push(session._applications[i].dvm.onOrdersManaged(this._dispatchUpdate.bind(this)));
              }
            }
          }
          this._auiUpdateListeners.push(listener);
          return function() {
            if (this._auiUpdateListeners) {
              this._auiUpdateListeners.remove(listener);
            }
          }.bind(this);
        },

        _dispatchUpdate: function(event, src, data) {
          // for each iteration we recheck if array is defined because modelhelper may have been destroyed in a previous iteration
          for (var i = 0; this._auiUpdateListeners && i < this._auiUpdateListeners.length; ++i) {
            this._auiUpdateListeners[i](src, data);
          }
        },

        _onApplicationAdded: function(event, app) {
          if (this._activeListenersHandlers) {
            this._activeListenersHandlers.push(app.dvm.onOrdersManaged(this._dispatchUpdate.bind(this)));
          }
        },

        /**
         * Get the current application
         * @returns {?classes.VMApplication} the currently visible application or null if it cannot be found.
         * @publicdoc
         */
        getCurrentApplication: function() {
          var session = context.SessionService.getCurrent();
          if (session) {
            return session.getCurrentApplication();
          }
          return null;
        },

        /**
         * Get the widget application
         * @returns {?classes.VMApplication} the VM application to which this widget is attached. null if the widget isn't below a VM application
         * @publicdoc
         */
        getApplication: function() {
          var session = context.SessionService.getCurrent();
          if (session) {
            for (var i = 0; i < session.getApplications().length; ++i) {
              var app = session.getApplications()[i];
              if (app.applicationHash === this._widget._appHash) {
                return app;
              }
            }
          }
          return null;
        },

        /**
         * Get a node with its id
         * @param {number} idRef - the VM id of the node to return
         * @returns {?classes.NodeBase} the requested node or null if it couldn't be found
         * @publicdoc
         */
        getNode: function(idRef) {
          var app = this.getApplication();
          if (app) {
            return app.model.getNode(idRef);
          }
          return null;
        },

        /**
         * Get the UserInterface Node
         * @returns {?classes.NodeBase} the UserInterface node of the current application or null if it coulnd't be found
         * @publicdoc
         */
        getUserInterfaceNode: function() {
          return this.getNode(0);
        },

        /**
         * Get Anchor Node of the widget
         * @returns {?classes.NodeBase} the AUI anchor node of this widget. Generally the corresponding node or the node holding the displayed value
         * @publicdoc
         */
        getAnchorNode: function() {
          if (this._widget._auiTag !== null) {
            var app = this.getApplication();
            if (app) {
              return app.model.getNode(this._widget._auiTag);
            }
          }
          return null;
        },

        /**
         * Applies only to entry fields (FormField, Matrix or TableColumn)
         * @returns {?classes.NodeBase} the field node corresponding to the widget or null if it doesn't apply
         * @publicdoc
         */
        getFieldNode: function() {
          var anchorNode = this.getAnchorNode();
          if (anchorNode) {
            if (anchorNode.getTag() === 'FormField') {
              return anchorNode;
            } else if (anchorNode.getTag() === 'Value') {
              return anchorNode.getParentNode().getParentNode();
            }
          }
          return null;
        },

        /**
         * Applies only to entry fields (FormField, Matrix or TableColumn)
         * A decoration node is the node holding visual information (Edit, CheckBox, ComboBox, etc...)
         * @returns {?classes.NodeBase} the decoration node corresponding to the widget or null if it doesn't apply
         * @publicdoc
         */
        getDecorationNode: function() {
          var fieldNode = this.getFieldNode();
          if (fieldNode) {
            return fieldNode.getChildren()[0];
          }
          return null;
        },

        /**
         * Try to find & execute an action by name (search in the active Dialog/Menu of the current Window).
         * Note that the focused widget with pending changes will send its value to the VM
         * @param {string} name of the action
         * @returns {boolean} true if an action has been found and executed, false otherwise.
         * @publicdoc
         */
        executeActionByName: function(name) {
          var actionExecuted = false;
          var currentApp = this.getCurrentApplication();
          if (currentApp) {
            // TODO GBC-1760 we should use ActionApplicationService to search an action
            var activeWindow = currentApp.getVMWindow();
            if (activeWindow) {
              var activeDialog = activeWindow.getActiveDialog();
              if (activeDialog) {
                var action = activeDialog.getFirstChildWithAttribute(null, 'name', name);
                if (action) {
                  currentApp.action.execute(action.getId(), null, {
                    sendValue: true
                  });
                  actionExecuted = true;
                }
              }
            }
          }
          return actionExecuted;
        }
      };
    });
  }
);
