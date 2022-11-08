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

modulum('TypeAheadApplicationService', ['ApplicationServiceBase', 'ApplicationServiceFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * TypeAhead service.
     * This class is in charge of keeping track of the type-ahead commands.
     * Stack commands, schedule their execution on the server and validate or roll them back
     * Manages client side life cycle representation of the node.
     * @class TypeAheadApplicationService
     * @memberOf classes
     * @extends classes.ApplicationServiceBase
     */
    cls.TypeAheadApplicationService = context.oo.Class(cls.ApplicationServiceBase, function($super) {
      return /** @lends classes.TypeAheadApplicationService.prototype */ {
        __name: "TypeAheadApplicationService",

        /** @type {classes.TypeAheadCommand[]} */
        _commandsQueue: null,
        /** @type {classes.TypeAheadCommand[]} */
        _processingCommands: null,
        /** @type {classes.TypeAheadCommand[]} */
        _commandsWhileFrontCallQueue: null,
        /** @type {boolean} */
        _isFrozen: false,
        /** @type {number} */
        _lastCommandTime: 0,

        /** @type {boolean} */
        _bufferizeKeysMode: false,

        /** @type {classes.TypeAheadGroup[]} */
        _currentGroupCommandQueue: null,

        /**
         * @param {classes.VMApplication} app owner
         */
        constructor: function(app) {
          $super.constructor.call(this, app);
          this._commandsQueue = [];
          this._commandsWhileFrontCallQueue = [];
          this._processingCommands = [];
          this._currentGroupCommandQueue = [];
        },

        destroy: function() {
          $super.destroy.call(this);
          this._processingCommands = [];
          this._commandsQueue = [];
          this._commandsWhileFrontCallQueue = [];

          this._currentGroupCommandQueue = null;
        },

        /**
         * Returns true if the typeahead has command which are executed but not yet validated
         * @returns {boolean}
         */
        hasProcessingCommands: function() {
          return this._processingCommands.length !== 0;
        },

        /**
         * Rollback all commands in the queue
         */
        rollbackAllCommands: function() {
          this._commandsQueue = this._commandsQueue.concat(this._commandsWhileFrontCallQueue);
          this._commandsWhileFrontCallQueue = [];

          while (this._commandsQueue.length > 0) {
            var cmd = this._commandsQueue.shift();
            cmd.rollback();
          }
        },

        /**
         * Returns true if the typeahead has finished to process all commands
         * @returns {boolean}
         */
        hasFinished: function() {
          return !this.hasProcessingCommands() && !this.hasPendingCommands();
        },

        /**
         * @param cmd new command to add to the list
         * @param topOfQueue if true insert the command at the beginning of the queue. Otherwise by default it's pushed at the end.
         * @private
         */
        _addCommand: function(cmd, topOfQueue) {
          if (this._application) {
            context.LogService.typeahead.log("[app" + this._application.applicationHash + "] " + cmd.__name + " command added",
              cmd);

            if (this._currentGroupCommandQueue.length > 0) { // if there is a current group command is added to this group
              this._currentGroupCommandQueue[this._currentGroupCommandQueue.length - 1].addCommand(cmd);
            } else {

              // if only one command of this type must be added, and there is already an existing command --> do nothing
              if (cmd.isUnique() && this.hasPendingCommands(cmd.__name)) {
                return;
              }

              // If a FrontCall is processing, queue it in a special buffer
              if (context.FrontCallService.functionCallIsProcessing()) {
                this._commandsWhileFrontCallQueue.push(cmd);
              } else {
                if (topOfQueue) {
                  this._commandsQueue.unshift(cmd);
                } else {
                  this._commandsQueue.push(cmd);
                }
              }

              // Do this in a timeout, to allow to push more than one command and to merge some commands
              this._registerTimeout(
                function() { // don't use requestAnimationFrame because when a new tab is opened, animationframe is never called
                  this._executeNextCommand();
                }.bind(this), 0);

              // if command is not predictable, switch in bufferizeKeysMode
              if (!cmd.isPredictable()) {
                this.setBufferizeKeysMode(true);
              }
            }
          }
        },

        /**
         * Execute next command
         * @private
         */
        _executeNextCommand: function() {
          if (!this.hasPendingCommands()) {
            if (!this.hasProcessingCommands()) {
              // if there is no more commands to send or to validate, we unfreeze
              this.unfreeze();
            }
            return;
          }

          if (!this.hasProcessingCommands() && !this._application.isProcessing()) { // if app is processing don't send any command
            if (context.FrontCallService.functionCallIsProcessing()) {
              context.LogService.typeahead.warn(
                "VM is waiting for a FrontCall response. Do not send another typeahead event during that process. Waiting...");
              return;
            }
            // If a frontCall is not processing, get bufferized commands while it was processing
            //if (!context.FrontCallService.functionCallIsProcessing()) {
            this._commandsQueue = this._commandsQueue.concat(this._commandsWhileFrontCallQueue);
            this._commandsWhileFrontCallQueue = [];
            //}

            var cmd = null;
            var events = [];

            var integrityOk = true;
            while (events.length === 0 && this._commandsQueue.length !== 0 && integrityOk) {
              do {
                cmd = this._commandsQueue.shift();
                context.LogService.typeahead.log("Executing " + cmd.__name + " command", cmd);

                // Merge beginning commands of the FIFO into cmd;
                while (this._commandsQueue.length !== 0 && cmd.merge(this._commandsQueue[0])) {
                  this._commandsQueue.shift();
                }

                integrityOk = cmd.checkIntegrity();
                if (integrityOk) {

                  // save existing typeahead list
                  var savedCommandsQueue = this._commandsQueue.slice();
                  this._commandsQueue = [];

                  var res = cmd.execute();

                  // all the commands created during the command execution must be added at the beginning of commandsQueue
                  this._commandsQueue = this._commandsQueue.concat(savedCommandsQueue);
                  savedCommandsQueue = [];

                  if (res.vmEvents.length > 0) { // if command generate vm events, add it to processingCommands list
                    events = events.concat(res.vmEvents);
                    this._processingCommands.push(cmd);
                  } else if (!res.processed) {
                    context.LogService.typeahead.log("Poping unused " + cmd.__name + " command", cmd);
                  }
                }

              } while (this._commandsQueue.length !== 0 && !cmd.needsVmSync() && integrityOk);
            }

            if (integrityOk === false) {
              context.LogService.typeahead.warn("Command integrity error --> rollback all commands", cmd);
              if (cmd) {
                cmd.rollback();
              }
              // if there is an integrity error in a command, ignore and rollback all next commands
              this.rollbackAllCommands();

              // after rollback need to restore the focus at the right place
              this._application.layout.when(context.constants.widgetEvents.afterLayoutFocusRestored, function() {
                this._application.focus.restoreVMFocus(true);
              }.bind(this), true);
            }

            if (events.length !== 0 && this._processingCommands.length !== 0) {
              this._lastCommandTime = this._processingCommands[this._processingCommands.length - 1].getTime();
              context.LogService.typeahead.log("Sending events to VM", events);
              this._application.protocolInterface.event(events);
            } else { // if there is no events to send, unfreeze
              this.unfreeze();
            }
          }
        },

        /**
         * @returns {boolean} return if typeahead is frozen or not
         */
        isFrozen: function() {
          return this._isFrozen;
        },

        /**
         * Unfreeze typeahead.
         */
        unfreeze: function() {
          if (this._isFrozen === true) { // unfreeze only it is frozen
            context.LogService.typeahead.log("Unfreeze");
            this.setBufferizeKeysMode(false);
            this._isFrozen = false;
            context.OverlayService.disable("typeahead");
          }
        },

        /**
         * Freeze typeahead. (overlay added to avoid mouse interaction)
         * @param {boolean} overlay -
         */
        freeze: function() {
          if (this._isFrozen === false) { // freeze only it is not frozen
            context.LogService.typeahead.log("Freeze");
            this._isFrozen = true;
            this.setBufferizeKeysMode(true);
            context.OverlayService.enable("typeahead");
          }
        },

        /**
         * @returns {boolean} return if typeahead is in bufferizeKeys mode
         */
        isBufferizeKeysMode: function() {
          return this._bufferizeKeysMode;
        },

        /**
         * @param {boolean} b - bufferizeKeys mode on/off
         */
        setBufferizeKeysMode: function(b) {
          this._bufferizeKeysMode = b;
          context.LogService.typeahead.log("BufferizeKeysMode = ", this._bufferizeKeysMode);
        },

        /**
         * Validate the last commands send to the VM
         * This function is called each time we received a message from VM
         * @param {boolean} isCurrentApp - is application the current one ?
         */
        validateLastCommand: function(isCurrentApp) {
          if (this._processingCommands.length !== 0) {
            var uiNode = this._application.uiNode();
            var hasFrontCall = Boolean(uiNode) && Boolean(uiNode.getFirstChild('FunctionCall'));
            var isLastCommandValidated = true;

            var cmd = null;
            // validate each commands
            while (this._processingCommands.length > 0 && isLastCommandValidated) {
              cmd = this._processingCommands.shift();
              isLastCommandValidated = cmd.validate();
            }

            // if one command is not validated or if there is a frontcall, rollback all next commands
            var needToRollback = (hasFrontCall || !isLastCommandValidated);

            if (needToRollback) {
              if (!isLastCommandValidated) { // last command validation has failed rollback it
                context.LogService.typeahead.warn("Command validation failed --> rollback it", cmd);
                cmd.rollback();
              }
              if (this._processingCommands.length > 0 || this._commandsQueue.length > 0 || this._commandsWhileFrontCallQueue.length > 0) {
                if (hasFrontCall) {
                  context.LogService.typeahead.warn("FrontCall detected in command validation", cmd);
                }
                context.LogService.typeahead.warn("Rollback all next commands");

                while (this._processingCommands.length > 0) {
                  cmd = this._processingCommands.shift();
                  cmd.rollback();
                }

                this.rollbackAllCommands();
              }

              var focusedNode = this._application.focus.getFocusedNode();
              if (focusedNode) {
                // Restoring the currently focused node's value
                var ctrl = focusedNode.getController();
                if (ctrl && ctrl._getAuiValue) { // focus on a ValueContainerBaseController
                  var auiValue = ctrl._getAuiValue();
                  if (auiValue !== ctrl._getWidgetValue()) {
                    focusedNode.getController().getWidget().setValue(auiValue);
                  }
                }
              }
            } else { // last commands are valid
              context.LogService.typeahead.log("Command(s) validation OK", this._processingCommands);
            }

            this._application.layout.when(context.constants.widgetEvents.afterLayoutFocusRestored, function() {
              // synchronize ui & business model focus with VM focus
              if (this.hasFinished() || hasFrontCall) {
                // there is no more commands, disable bufferizeKeys mode
                this.setBufferizeKeysMode(false);
                // force refocus dom for rollbacks, frontcall and action events
                this._application.focus.restoreVMFocus(!isLastCommandValidated || hasFrontCall);

              }
            }.bind(this), true);
          } else {
            context.LogService.typeahead.log("No command to validate");

            if (isCurrentApp) { // first page load
              // TODO this seems to be unnecessary, restoreVMFocus is already done in HostService::setDisplayedWindow function
              this._application.layout.when(context.constants.widgetEvents.afterLayoutFocusRestored, function() {
                this._application.focus.restoreVMFocus(false);
              }.bind(this), true);
            }
          }

          // try to send next commands
          this._executeNextCommand();
        },

        /**
         * Checks if the given node has pending VALUE command in the typeahead command list
         * @param {classes.NodeBase} [node]
         * @returns {boolean}
         */
        hasPendingValueCommands: function(node) {
          for (var i = 0; i < this._commandsQueue.length; ++i) {
            var cmd = this._commandsQueue[i];
            if (cmd instanceof cls.TypeAheadValue && (!node || cmd.getNode() === node)) {
              return true;
            }
          }
          return false;
        },

        /**
         * Checks if the given node has pending FOCUS command in the typeahead command list
         * @param {classes.NodeBase} [node]
         * @returns {boolean}
         */
        hasPendingFocusCommands: function(node) {
          for (var i = 0; i < this._commandsQueue.length; ++i) {
            var cmd = this._commandsQueue[i];
            if (cmd instanceof cls.TypeAheadFocus && (!node || cmd.getNode() === node)) {
              return true;
            }
          }
          return false;
        },

        /**
         * Checks if the given node has pending navigation command in the typeahead command list
         * @returns {boolean}
         */
        hasPendingNavigationCommands: function() {
          for (var i = 0; i < this._commandsQueue.length; ++i) {
            var cmd = this._commandsQueue[i];
            if ((cmd instanceof cls.TypeAheadCurrentRow || cmd instanceof cls.TypeAheadFocus) && (cls.ActionNode
                .isTableNavigationAction(
                  cmd._actionName) || cls.ActionNode.isFieldNavigationAction(cmd._actionName))) {
              return true;
            }
          }
          return false;
        },

        /**
         * Checks if the given node has pending FunctionCallResult command in the typeahead command list
         * @param {boolean} [processing] - check also if there is a frontcall command in processing commands list
         * @returns {boolean}
         */
        hasPendingFunctionCallResultCommands: function(processing) {
          var i;
          var cmd;
          for (i = 0; i < this._commandsQueue.length; ++i) {
            cmd = this._commandsQueue[i];
            if (cmd instanceof cls.TypeAheadFunctionCallResult) {
              return true;
            }
          }
          if (processing) {
            for (i = 0; i < this._processingCommands.length; ++i) {
              cmd = this._processingCommands[i];
              if (cmd instanceof cls.TypeAheadFunctionCallResult) {
                return true;
              }
            }
          }
          return false;
        },

        /**
         * Checks if there are pending commands in the typeahead
         * @param {String} [classname] - class name of the command
         * @returns {boolean}
         */
        hasPendingCommands: function(classname) {
          if (!classname) {
            return this._commandsQueue.length > 0;
          } else {
            for (var i = 0; i < this._commandsQueue.length; ++i) {
              var cmd = this._commandsQueue[i];
              if (cmd.__name === classname) {
                return true;
              }
            }
          }
          return false;
        },

        /**
         * @returns {number} the creation time of the last executed command
         */
        getLastCommandTime: function() {
          return this._lastCommandTime;
        },

        /**
         * Request focus on the given node
         * @param {classes.NodeBase} node - node which should get the focus
         * @param {number} [cursor1] - current starting cursor of the node
         * @param {number} [cursor2] - current ending cursor of the node
         * @param {string} [actionName] - name of the action leading to this focus change
         */
        focus: function(node, cursor1, cursor2, actionName) {
          this._addCommand(new cls.TypeAheadFocus(this.getApplication(), node, cursor1, cursor2, actionName));
        },

        /**
         * Send value on the given node
         * @param {classes.NodeBase} node - target node
         * @param {string} value - current value of the node
         */
        value: function(node, value) {
          // If the value command is part of a TypeAheadGroup, it's canBeExecuted should return false
          var canBeExecuted = this._currentGroupCommandQueue.length === 0;
          this._addCommand(new cls.TypeAheadValue(this.getApplication(), node, value, canBeExecuted));
        },

        /**
         * Send cursors of a given node
         * @param {classes.NodeBase} node - target node
         * @param {number} cursor1 - current starting cursor of the node
         * @param {number} cursor2 - current ending cursor of the node
         */
        cursors: function(node, cursor1, cursor2) {
          // If the value command is part of a TypeAheadGroup, it's canBeExecuted should return false
          var canBeExecuted = this._currentGroupCommandQueue.length === 0;
          this._addCommand(new cls.TypeAheadCursors(this.getApplication(), node, cursor1, cursor2, canBeExecuted));
        },

        /**
         * Send scroll change command. During a scroll, we freeze typeahead
         * @param {classes.TableNode|classes.MatrixNode} node
         * @param {number} offset
         */
        scroll: function(node, offset) {
          this.freeze();
          this._addCommand(new cls.TypeAheadScroll(this.getApplication(), node, offset));
        },

        /**
         * Send currentRow change command
         * @param {classes.TableNode|classes.MatrixNode} node
         * @param {string} actionName
         * @param {boolean} [ctrlKey] - ctrlKey pressed during command creation
         * @param {boolean} [shiftKey] - shiftKey pressed during command creation
         */
        currentRow: function(node, actionName, ctrlKey, shiftKey) {
          this._addCommand(new cls.TypeAheadCurrentRow(this.getApplication(), node, actionName, ctrlKey, shiftKey));
        },

        /**
         * Send rowSelection change command
         * @param {classes.TableNode} node
         * @param {boolean} ctrlKey
         * @param {boolean} shiftKey
         * @param {number} type - type of row selection (merge, toggle, selectAll)
         * @param {string} [actionName] - actionName used to change current row
         */
        rowSelection: function(node, ctrlKey, shiftKey, type, actionName) {
          this._addCommand(new cls.TypeAheadRowSelection(this.getApplication(), node, ctrlKey, shiftKey, type, actionName));
        },

        /**
         * Send action command
         * @param {classes.NodeBase} node
         * @param {Object} options - add options
         * @param {Boolean} [options.noUserActivity] - true if action is not from a user interaction
         * @param {String} [options.actionName] - action name instead of id
         */
        action: function(node, options) {
          this._addCommand(new cls.TypeAheadAction(this.getApplication(), node, options));
        },

        /**
         * Send a front call result
         * @param status front call result status
         * @param message front call result status message
         * @param values front call result values
         */
        functionCallResult: function(status, message, values) {
          this._addCommand(new cls.TypeAheadFunctionCallResult(this.getApplication(), status, message, values), true);
        },

        /**
         * Send VM event command
         * @param {classes.VMEventBase} event
         * @param {classes.NodeBase} [node]
         */
        event: function(event, node) {
          this._addCommand(new cls.TypeAheadEvent(this.getApplication(), event, node));
        },

        /**
         * Add an typeahead delayedKey command
         * @param {String} keyString string corresponding to the key
         * @param {Event} keyEvent
         */
        delayedKey: function(keyString, keyEvent) {
          this._addCommand(new cls.TypeAheadDelayedKey(this.getApplication(), keyString, keyEvent));
        },

        /**
         * Add an typeahead native back command
         * @param {String[]} actionList list of actions
         */
        nativeBack: function(actionList) {
          this._addCommand(new cls.TypeAheadNativeBack(this.getApplication(), actionList));
        },

        /**
         * Add an typeahead native close command
         */
        nativeClose: function() {
          this._addCommand(new cls.TypeAheadNativeClose(this.getApplication()));
        },

        /**
         * Add an typeahead native notificationpushed command
         */
        nativeNotificationPushed: function() {
          this._addCommand(new cls.TypeAheadNativeNotificationPushed(this.getApplication()));
        },

        /**
         * Add an typeahead native cordovacallback command
         */
        nativeCordovaCallback: function() {
          this._addCommand(new cls.TypeAheadNativeCordovaCallback(this.getApplication()));
        },

        /**
         * Add an typeahead callback command
         * @param {function} callback - function to call when command is executed
         */
        callback: function(callback) {
          this._addCommand(new cls.TypeAheadCallback(this.getApplication(), callback));
        },

        /** Start group command.
         *  all commands added between call of startGroupCommand() and finishGroupCommand()
         *  will be added in a group command.
         */
        startGroupCommand: function() {
          var groupCommand = new cls.TypeAheadGroup(this.getApplication(), [], null);
          this._currentGroupCommandQueue.push(groupCommand);
          context.LogService.typeahead.log("[app" + this._application.applicationHash + "] Start command group", groupCommand);
        },

        /** Finish group command and add it in the typeahead queue.
         */
        finishGroupCommand: function() {
          var groupCommand = this._currentGroupCommandQueue.pop();
          context.LogService.typeahead.log("[app" + this._application.applicationHash + "] Finish command group", groupCommand);
          this._addCommand(groupCommand);
        }
      };
    });
    cls.ApplicationServiceFactory.register("TypeAhead", cls.TypeAheadApplicationService);
  }
);
