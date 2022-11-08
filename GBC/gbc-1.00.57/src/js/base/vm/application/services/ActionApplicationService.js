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

modulum('ActionApplicationService', ['ApplicationServiceBase', 'ApplicationServiceFactory'],
  function(context, cls) {
    /**
     * @class ActionApplicationService
     * @memberOf classes
     * @extends classes.ApplicationServiceBase
     */
    cls.ActionApplicationService = context.oo.Class(cls.ApplicationServiceBase, function($super) {
      /** @lends classes.ActionApplicationService.prototype */
      return {
        __name: "ActionApplicationService",
        $static: /** @lends classes.ActionApplicationService */ {
          /**
           * list of local actions with corresponding key accelerator
           * @type {Object}
           */
          _localActions: {
            'nextfield': 'tab',
            'prevfield': 'shift-tab',
            'nextrow': 'down',
            'prevrow': 'up',
            'firstrow': 'home',
            'lastrow': 'end',
            'nextpage': 'next',
            'prevpage': 'prior',
            'nexttab': 'control-tab',
            'prevtab': 'control-shift-tab'
          },

          /**
           * Returns local action names
           *  @returns {String[]}
           */
          getLocalActionNames: function() {
            return Object.keys(this._localActions);
          },

          /**
           * Returns local action accelerators
           *  @returns {String[]}
           */
          getLocalActionAccelerators: function() {
            return Object.values(this._localActions);
          },

          /**
           * Returns default keyboard accelerator for a local action
           * @param {string} actionName
           * @returns {?string} accelerator
           */
          getLocalActionAccelerator: function(actionName) {
            return this._localActions[actionName];
          },

          /** Returns local action name for an accelerator
           * @param {string} acc
           * @returns {?string} actionName
           */
          getLocalActionName: function(acc) {
            var accelerators = this.getLocalActionAccelerators();
            var names = this.getLocalActionNames();
            for (var i = 0; i < accelerators.length; ++i) {
              if (acc === accelerators[i]) {
                return names[i];
              }
            }
            return null;
          },

          /**
           * Browser native actions
           * @type {String[]}
           */
          browserNativeActions: ["editcopy", "editcut", "editpaste"],

          /**
           * static list of special actions
           * @type {Map<string, Object>}
           */
          _specialActions: new Map(),

          /**
           * Add special action in the list
           * @param {string} name - action name
           * @param {Object} ctor - action class typeref
           */
          registerSpecialAction: function(name, ctor) {
            this._specialActions.set(name, ctor);
          },
          /**
           * Remove special action in the list
           * @param {string} name - action name
           */
          unregisterSpecialAction: function(name) {
            this._specialActions.delete(name);
          }
        },
        /**
         * list of special actions
         * @type {Map<string, Object>}
         */
        _specialActions: null,
        /**
         * list of actions
         * @type {Map<string, classes.ActionNode>}
         */
        _actions: null,

        /**
         * list of actions defaults
         * @type {Map<string, classes.ActionDefaultNode>}
         */
        _actionDefaults: null,

        /**
         * List of bound actions filtered by browser key
         * @type {Map<string, Array>}
         */
        _boundActions: null,

        /**
         * List of interrupt widgets
         * @type {Array}
         */
        _interruptWidgets: null,
        /**
         * @inheritDoc
         */
        constructor: function(app) {
          $super.constructor.call(this, app);
          this._interruptWidgets = [];
          this._actionDefaults = new Map();
          this._boundActions = new Map();
          this._actions = new Map();
          this._specialActions = new Map();
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._specialActions.clear();
          this._actions.clear();
          this._actionDefaults.clear();
          this._boundActions.clear();

          this._interruptWidgets = null;
          this._specialActions = null;
          this._actions = null;
          this._actionDefaults = null;
          this._boundActions = null;

          $super.destroy.call(this);
        },
        /**
         * Add a new action to this App Service
         * @param {classes.ActionNode} action node
         */
        registerAction: function(action) {
          var name = action.attribute("name");
          this._actions.set(name, action);
          this._bindAccelerators(action);
          if (cls.ActionApplicationService._specialActions.has(name)) {
            var actionConstructor = cls.ActionApplicationService._specialActions.get(name);
            this._specialActions.set(name, new actionConstructor(this));
          }
          if (name === "interrupt") {
            for (var i = 0; i < this._interruptWidgets.length; i++) {
              this._interruptWidgets[i].setInterruptable(false);
            }
          }

          // Add action to application contextMenu
          var applicationWidget = this._application.getUI().getWidget();
          if (applicationWidget && applicationWidget.getContextMenu()) {
            var contextMenuWidget = applicationWidget.getContextMenu();
            var contextMenu = action.attribute('contextMenu');
            var addInCtxMenu = contextMenu === 'yes' || contextMenu === 'auto';
            /*
            // GBC-1824 regression : need to handle this case
            var defaultView = action.attribute('defaultView');
            if(defaultView === 'no' && isActionInForm()){ // Need implementation of this isActionInForm method
              addInCtxMenu = false;
            }
            */
            if (addInCtxMenu) {
              // Do not add to contextMenu if not action (e.g MenuAction)
              if (action._tag === "Action") {
                var actionText = action.attribute("text").replace(/&(.)/g, "$1"); // Filter ampersand
                contextMenuWidget.addAction(action.attribute("name"),
                  actionText,
                  action.attribute("image"),
                  action.attribute("acceleratorName").toString(), {
                    clickCallback: function() {
                      contextMenuWidget.hide();
                      action.execute();
                    },
                    hidden: action.attribute("hidden")
                  });
              }
            }
          }
        },

        /**
         * Add a new actionDefault to this App Service
         * @param {classes.NodeBase} action node
         */
        registerActionDefault: function(action) {
          this._actionDefaults.set(action.attribute("name"), action);

          this._bindAccelerators(action);
        },

        /**
         * Bind an action to VM accelerators
         * @param {classes.NodeBase} action node
         */
        _bindAccelerators: function(action) {
          var key1 = cls.KeyboardHelper.convertVMKeyToBrowserKey(action.attribute("acceleratorName"));
          var key2 = cls.KeyboardHelper.convertVMKeyToBrowserKey(action.attribute("acceleratorName2"));
          var key3 = cls.KeyboardHelper.convertVMKeyToBrowserKey(action.attribute("acceleratorName3"));
          var key4 = cls.KeyboardHelper.convertVMKeyToBrowserKey(action.attribute("acceleratorName4"));

          if (key1) {
            this._bindAccelerator(key1, action);
          }
          // we make sure to not bind same action two times :
          // for example, Enter and Return VM accelerators are both considered as Enter key from browser
          // so we only have to bind one action to this key even if there are two accelerators defined on it
          if (key2 && key2 !== key1) {
            this._bindAccelerator(key2, action);
          }
          if (key3 && key3 !== key1 && key3 !== key2) {
            this._bindAccelerator(key3, action);
          }
          if (key4 && key4 !== key1 && key4 !== key2 && key4 !== key3) {
            this._bindAccelerator(key4, action);
          }
        },

        /**
         * Bind action to browser key
         * @param {string} key - DOM key combination
         * @param {classes.NodeBase} action node
         */
        _bindAccelerator: function(key, action) {
          //erase previous action to keep the last one
          this._boundActions.set(key, []);
          var actions = this._boundActions.get(key);
          if (!actions.contains(action._id)) {
            // push new action in the list
            actions.push(action._id);
          }
        },

        /**
         * Unbind an action from VM accelerators
         * @param {classes.NodeBase} action node
         */
        _unbindAccelerators: function(action) {
          // Remove all accelerator bound for this action...
          var key1 = cls.KeyboardHelper.convertVMKeyToBrowserKey(action.attribute("acceleratorName"));
          var key2 = cls.KeyboardHelper.convertVMKeyToBrowserKey(action.attribute("acceleratorName2"));
          var key3 = cls.KeyboardHelper.convertVMKeyToBrowserKey(action.attribute("acceleratorName3"));
          var key4 = cls.KeyboardHelper.convertVMKeyToBrowserKey(action.attribute("acceleratorName4"));

          if (key1) {
            this._unbindAccelerator(key1, action);
          }
          // we make sure to not unbind same action two times :
          // for example, Enter and Return VM accelerators are both considered as Enter key from browser
          // so we only have to unbind one action from this key even if there are two accelerators defined on it
          if (key2 && key2 !== key1) {
            this._unbindAccelerator(key2, action);
          }
          if (key3 && key3 !== key1 && key3 !== key2) {
            this._unbindAccelerator(key3, action);
          }
          if (key4 && key4 !== key1 && key4 !== key2 && key4 !== key3) {
            this._unbindAccelerator(key4, action);
          }
        },

        /**
         * Unbind action from browser key
         * @param {string} key browser key
         * @param {classes.NodeBase} action node
         */
        _unbindAccelerator: function(key, action) {
          var keyActionIdArray = this._boundActions.get(key);
          if (keyActionIdArray) {
            // remove action id from our active actions list
            keyActionIdArray.remove(action._id);
            if (keyActionIdArray.length === 0) {
              this._boundActions.delete(key);
            }
          }
        },

        /**
         * Get the action by its name
         * @param {?string} name of the action
         * @returns {classes.NodeBase} action node
         */
        getAction: function(name) {
          return this._actions.get(name);
        },

        /**
         * Test if the action is registered
         * @param {string} name of the action
         * @returns {boolean} action node
         */
        hasAction: function(name) {
          return this._actions.has(name);
        },

        /**
         * Remove the action and unbind accelerators
         * @param {classes.NodeBase} action
         */
        destroyAction: function(action) {
          this._unbindAccelerators(action);

          var name = action.attribute("name");
          this._actions.delete(name);
          if (this._specialActions.has(name)) {
            this._specialActions.get(name).destroy();
            this._specialActions.delete(name);
          }

          // Remove action from app contextMenu
          var applicationWidget = this._application.getUI().getWidget();
          if (applicationWidget && applicationWidget.getContextMenu()) {
            var contextMenu = applicationWidget.getContextMenu();
            contextMenu.removeAndDestroyAction(name, false);
          }
        },

        /**
         * Remove the actionDefault and unbind accelerators
         * @param {classes.NodeBase} action
         */
        destroyActionDefault: function(action) {
          this._unbindAccelerators(action);

          var acceleratorName = action.attribute("name");
          this._actionDefaults.delete(acceleratorName);
        },

        /**
         * Execute an action by knowing its name
         * @param {string} name of the action
         * @param {classes.NodeBase=} additionalValueNode an additional value node which value should be sent to the VM too. (CheckBox special case)
         * @param {object=} options
         */
        executeByName: function(name, additionalValueNode, options) {
          var action = this.getAction(name);
          if (action) {
            this.execute(action._id, additionalValueNode, options);
          } else {
            // TODO GBC-1760 why call this it is done in execute function
            this.executeActionDefaultByName(name);
          }
        },

        /**
         * Execute an action by knowing its name
         * @param {?string} name of the action
         * @param {object=} options
         */
        executeActionDefaultByName: function(name, options) {
          options = options || {};
          var actionEvent = null;

          // TODO: GBC-1760: for me this code seems to be wrong
          // TODO GBC-1760 why we don't do this in typeaheadAction
          // why for all local actions we don't execute same code ?
          if (cls.ActionApplicationService.getLocalActionNames().contains(name)) {
            switch (name) {
              case "nextfield":
                // what if local action AND action have the same name?
                actionEvent = new cls.VMKeyEvent("Tab");
                break;
              case "prevfield":
                actionEvent = new cls.VMKeyEvent("Shift-Tab");
                break;
              case "nextrow":
                actionEvent = new cls.VMKeyEvent("Down");
                break;
              case "prevrow":
                actionEvent = new cls.VMKeyEvent("Up");
                break;
              default:
                var action = this._actionDefaults.get(name);
                var accelerator = action && action.attribute("acceleratorName");
                if (accelerator && accelerator.toString().length > 0) {
                  actionEvent = new cls.VMKeyEvent(accelerator);
                }
                break;
            }
          }
          if (actionEvent) {
            actionEvent.noUserActivity = Boolean(options.noUserActivity);

            this._registerAnimationFrame(function() {
              var focusedNode = this._application.getFocusedVMNode();
              var ctrl = focusedNode.getController();
              if (ctrl) {
                ctrl.sendWidgetCursors();
                ctrl.sendWidgetValue();
              }

              this._application.typeahead.event(actionEvent);
            }.bind(this));
          }
        },

        /**
         * Execute an action by knowing its ID
         * @param {number} idRef of the action
         * @param {classes.NodeBase=} additionalValueNode an additional value node which value should be sent to the VM too. (CheckBox special case)
         * @param {object=} options
         */
        execute: function(idRef, additionalValueNode, options) {
          options = options || {};
          var actionNode = this._application.getNode(idRef);
          var actionName = actionNode ? actionNode.attribute("name") : null;

          if (!this.getAction(actionName) && cls.ActionApplicationService.getLocalActionNames().contains(actionName)) {
            this.executeActionDefaultByName(actionName, options);
            return;
          }

          if (cls.ActionApplicationService.browserNativeActions.contains(actionName)) {
            return;
          }

          this._application.typeahead.startGroupCommand();

          var focusedNode = this._application.focus.getFocusedNode();
          if (focusedNode && options.sendValue) {
            var ctrl = focusedNode.getController();
            if (ctrl) {
              ctrl.sendWidgetCursors();
              ctrl.sendWidgetValue();
              // if there is an additionalValueNode must send its value
              if (additionalValueNode && focusedNode !== additionalValueNode && additionalValueNode.getController()) {
                additionalValueNode.getController().sendWidgetValue();
              }
            }
          }
          this._application.typeahead.action(actionNode, {
            noUserActivity: Boolean(options.noUserActivity)
          });
          this._application.typeahead.finishGroupCommand();
        },

        registerInterruptWidget: function(widget) {
          this._interruptWidgets.push(widget);
          widget.setInterruptableActive(this._application.isProcessing());
        },
        unregisterInterruptWidget: function(widget) {
          widget.setInterruptableActive(false);
          this._interruptWidgets.remove(widget);
        },
        setInterruptablesActive: function(isActive) {
          for (var i = 0; i < this._interruptWidgets.length; i++) {
            this._interruptWidgets[i].setInterruptableActive(isActive);
          }
        },
        /** Return the action node of active dialog for a given action name
         *
         * @param actionName the name of the action
         * @returns {?classes.NodeBase} an action node
         */
        getActiveDialogAction: function(actionName) {
          var uiNode = this._application.uiNode();
          if (uiNode) {
            var window = this._application.getVMWindow();
            if (window) { // search the action in the current dialog
              var dialog = window.getActiveDialog();
              if (dialog) {
                var actions = dialog.getChildren();
                for (var i = 0; i < actions.length; ++i) {
                  var action = actions[i];
                  var isActive = action.attribute("active") !== 0;
                  if (isActive) {
                    if (action.attribute("name") === actionName) {
                      return action;
                    }
                  }
                }
              }
            }
          }
          return null;
        },
      };
    });
    cls.ApplicationServiceFactory.register("Action", cls.ActionApplicationService);
  });
