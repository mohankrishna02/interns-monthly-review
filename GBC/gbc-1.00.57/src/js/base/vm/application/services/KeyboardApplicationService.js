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

modulum('KeyboardApplicationService', ['ApplicationServiceBase', 'ApplicationServiceFactory'],
  function(context, cls) {
    /**
     * @class KeyboardApplicationService
     * @memberOf classes
     * @extends classes.ApplicationServiceBase
     */
    cls.KeyboardApplicationService = context.oo.Class(cls.ApplicationServiceBase, function($super) {
      return /** @lends classes.KeyboardApplicationService.prototype */ {
        __name: "KeyboardApplicationService",
        $static: /** @lends classes.KeyboardApplicationService */ {
          keymap: {
            8: 'backspace',
            9: 'tab',
            13: 'enter',
            16: 'shift',
            17: 'ctrl',
            18: 'alt',
            19: 'pause',
            20: 'capslock',
            27: 'esc',
            32: 'space',
            33: 'pageup',
            34: 'pagedown',
            35: 'end',
            36: 'home',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            45: 'ins',
            46: 'del',
            91: 'meta',
            92: 'meta',
            93: 'contextmenu',
            112: 'f1',
            113: 'f2',
            114: 'f3',
            115: 'f4',
            116: 'f5',
            117: 'f6',
            118: 'f7',
            119: 'f8',
            120: 'f9',
            121: 'f10',
            122: 'f11',
            123: 'f12',
            144: 'numlock',
            145: 'scrolllock',
            224: 'meta',
          },

          navigationKeys: [
            'up',
            'down',
            'left',
            'right'
          ]
        },

        _bufferedKeys: null,

        /** @type {boolean} */
        _keyDownProcessed: false,

        /**
         * @inheritDoc
         */
        constructor: function(app) {
          $super.constructor.call(this, app);
          this._application.dvm.onOrdersManaged(this._bindKeyboardEvents.bind(this), true);
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._bufferedKeys = null;
          this._unbindKeyboardEvents();
          $super.destroy.call(this);
        },

        /**
         * Bind keydown & keyup events on the ui and listen to them to catch all keys
         * @private
         */
        _bindKeyboardEvents: function() {
          var uiWidget = this._application.getUI().getWidget();
          if (uiWidget) {
            var uiElement = uiWidget.getElement();
            uiElement.on("keydown.UserInterfaceWidget", this._onKeyDown.bind(this));
            uiElement.on("keyup.UserInterfaceWidget", this._onKeyUp.bind(this));
          }
        },

        /**
         * Unbind keydown & keyup events of the ui
         * @private
         */
        _unbindKeyboardEvents: function() {
          var uiWidget = this._application.getUI().getWidget();
          if (uiWidget) {
            var uiElement = uiWidget.getElement();
            uiElement.off("keydown.UserInterfaceWidget");
            uiElement.off("keyup.UserInterfaceWidget");
          }
        },

        /**
         * Keydown handler bound on UserInterface widget. Catch all keydown events and propagate it to the corresponding widget.
         * We detect the key combination and execute all actions bound to it. Otherwise we let widget manage the key
         * @param event
         * @private
         */
        _onKeyDown: function(event) {
          event.gbcKey = this.getNormalizedKey(event);
          var combi = this.translateKeys(event, event.gbcKey);
          // if user keep pressing same key without releasing it and typeahead is flagged as frozen, we don't push event
          this._keyDownProcessed = false;

          var repeatKey = this._bufferedKeys === combi;

          window.isCapslock(event);

          if (combi && combi !== "unidentified") {
            this._bufferedKeys = combi;
            context.LogService.keyboard.log("KEY USED onKeyDown saved as bufferedKeys : ", this._bufferedKeys, event.key);

            var focusedNode = this._application.focus.getFocusedNode();
            // Add delayed keys when in bufferize mode and no webcomponent is inside the current focused node.
            // They may be background process such as current focused node being destroyed when checking on webcomponent
            // TODO : validate with thierry
            if (this._application.typeahead.isBufferizeKeysMode() && (!focusedNode || focusedNode.getFirstChild('WebComponent') === null)) {
              event.stopPropagation();
              event.preventCancelableDefault();

              if (!repeatKey) { // don't delay repeated key, simply ignore it
                context.LogService.keyboard.log("Delayed key captured : ", this._bufferedKeys);
                this._application.typeahead.delayedKey(this._bufferedKeys, event);
              }
            } else {
              this._keyDownProcessed = this.processKey(this._bufferedKeys, event, repeatKey);
              if (this._keyDownProcessed) {
                context.LogService.keyboard.log("onKeyDown processed event.key : ", event.key);
              }
            }
          }
        },

        /**
         * Keyup handler bound on UserInterface widget. Catch all keyup events and propagate it to the corresponding widget.
         * Key combination previously detected in Keydown is passed as parameter
         * @param event
         * @private
         */
        _onKeyUp: function(event) {
          event.gbcKey = this.getNormalizedKey(event);
          this.executeKeyUp(this._bufferedKeys, event);
          this._bufferedKeys = null;
        },

        /**
         * @param {String} keyString string corresponding to the key
         * @param {Object} keyEvent keyDown js event
         */
        executeKeyUp: function(keyString, keyEvent) {
          var focusedNode = this._application.focus.getFocusedNode();
          var widget = focusedNode && focusedNode.getWidget();
          if (widget) {
            // we pass bufferedKeys as parameter in order to be able to be sure to manage previously typed combination.
            widget.manageKeyUp(keyString, keyEvent);
          }
        },

        /**
         * Check if key is a basic modifier (ctrl, shift, alt)
         * @param {string} key
         * @returns {boolean} returns true if key is a basic modifier
         */
        isBasicModifier: function(key) {
          var k = key.toLowerCase();
          return k === 'shift' || k === 'ctrl' || k === 'alt' || k === 'meta' || k === 'dead';
        },

        /**
         * Normalize DOM event key using VM modifier common names
         * @param event
         * @returns {*|string} returns normalized key
         */
        getNormalizedKey: function(event) {
          var key = cls.KeyboardApplicationService.keymap[event.which] || "";

          //Difference between Return and Enter
          if (key === "enter" && event.code !== "NumpadEnter") {
            key = "return";
          }

          if (!key) {
            key = event.key;
          }
          if (window.browserInfo.isEdge || window.browserInfo.isIE) {
            key = key.replace("Divide", "/").replace("Multiply", "*").replace("Subtract", "-").replace("Add", "+").replace(
              "Decimal", ".");
          }

          if (!key) {
            key = String.fromCharCode(event.which || event.code);
          }

          return key;
        },

        /**
         * Get the combination of keys (modifiers included) being typed
         * @param event
         * @param {string} normalizedKey
         * @returns {string} returns normalized keys combination
         */
        translateKeys: function(event, normalizedKey) {
          var ctrlKey = event.ctrlKey;
          var altKey = event.altKey;
          var shiftKey = event.shiftKey;
          var metaKey = event.metaKey;

          var keys = "";
          if (!this.isBasicModifier(normalizedKey)) {
            if (metaKey) {
              keys += "meta";
            }
            // use that order : ctrl+shift+alt
            if (ctrlKey) {
              if (keys.length !== 0) {
                keys += '+';
              }
              keys += "ctrl";
            }
            if (altKey) {
              if (keys.length !== 0) {
                keys += '+';
              }
              keys += "alt";
            }
            if (shiftKey) {
              if (keys.length !== 0) {
                keys += '+';
              }
              keys += "shift";
            }
            if (keys.length !== 0) {
              keys += '+';
            }
            keys += normalizedKey;
          }
          return keys.toLowerCase(); // return any combi in lowercase
        },

        /**
         *
         * @param {String} keyString - string of the key (including combination, ctrl+, shift+, ...)
         * @param {Object} event - dom key event
         * @param {boolean} repeat - true if key is being pressed
         * @returns {boolean} true if the key has been processed, false otherwise
         */
        processKey: function(keyString, event, repeat) {

          var processed = false;

          var app = this._application;

          var focusedNode = app.focus.getFocusedNode();
          var currentDropDownWidget = app.focus.getFocusedDropDownWidget();

          var widget = focusedNode && focusedNode.getWidget();
          // 1. Special case CTRL+C, if there is a text selection and the current VM focus has not DOM focus
          if (keyString === "ctrl+c" || keyString === "meta+c") {
            var selectionText = window.getSelection().toString();
            var domFocus = widget.hasDOMFocus();
            if (!domFocus && selectionText && selectionText !== "") {
              // return false, to let the browser manage CTRL+C
              return false;
            }
          }

          if (app.typeahead.isFrozen()) {
            // set the typeahead overlay visible if user press a key when typeahead is frozen
            context.OverlayService.setOpacity("typeahead", true);
          }

          // 2. Priority key managed by the widget before any action
          if (!processed) {
            if (currentDropDownWidget) {
              // TODO why are we doing this ?
              // TODO it seems that in most cases currentDropDownWidget & widget are the same, so it seems to be useless
              processed = currentDropDownWidget.managePriorityKeyDown(keyString, event, repeat);
            }
            if (!processed && widget && !widget.isHidden()) {
              processed = widget.managePriorityKeyDown(keyString, event, repeat);
            }

          }

          // 3. Try to process action for combination key
          if (!processed) {
            processed = this._processAction(keyString);
          }
          // 4. If there is no action on combination and shift key is pressed,
          // we try to process action on shifted key but only for key which can be displayed
          if (!processed && event.shiftKey === true && event.key && event.key.length === 1) {
            processed = this._processAction(event.key);
          }

          // 5. if key not processed, ask widget to manage it
          if (!processed) {
            if (currentDropDownWidget) {
              // TODO why are we doing this ?
              // TODO it seems that in most cases currentDropDownWidget & widget are the same, so it seems to be useless
              processed = currentDropDownWidget.manageKeyDown(keyString, event, repeat);
            }
            if (!processed && widget && !widget.isHidden()) {
              processed = widget.manageKeyDown(keyString, event, repeat);
            }

          }

          if (event) {
            if (processed) {
              event.stopPropagation();
              if (event.gbcDontPreventDefault !== true) {
                event.preventCancelableDefault();
              }
            } else {
              // check if existing modal menu
              var uiNode = app.uiNode();
              var currentWindow = uiNode && app.getNode(uiNode.attribute('currentWindow'));
              var modalMenu = currentWindow && currentWindow.getFirstChildWithAttribute('Menu', 'active', 1);
              if (modalMenu) {
                var modalType = modalMenu.attribute("style");
                if (modalType === "winmsg" || modalType === "dialog") {
                  // dialog detected, we need to prevent default to avoid focus being moved to another application
                  event.stopPropagation();
                  event.preventCancelableDefault();
                }
              }
            }
          }

          return processed;
        },

        /**
         * Check if key is a menu action shortcut
         * @param {classes.NodeBase} menuNode
         * @param {string} key
         * @returns {boolean} returns true if key is a shortcut of the passed menu node
         * @private
         */
        _isMenuActionShortcutKey: function(menuNode, key) {
          var menuActions = menuNode.getChildren('MenuAction');
          for (var i = 0; i < menuActions.length; ++i) {
            var menuAction = menuActions[i];
            if (menuAction.attribute('active')) {
              var text = menuAction.isAttributeSetByVM('text') ? menuAction.attribute('text') : menuAction.attribute('name');
              text = text.toString().toLocaleLowerCase();
              if (text && text.length !== 0 && text[0] === key) {
                return true;
              }
            }
          }
          return false;
        },

        /**
         * Find and execute VM action corresponding to key
         * @param {string} keyString - string of the key (including combination, ctrl+, shift+, ...)
         * @returns {boolean} true if the key has been processed, false otherwise
         */
        _processAction: function(keyString) {

          var processed = false;
          var actionName = null;
          var actionNode = null;
          var vmEvent = null;
          var vmKey = cls.KeyboardHelper.convertBrowserKeyToVMKey(keyString);

          var app = this._application;
          var typeahead = app.typeahead;

          var focusedNode = app.focus.getFocusedNode();

          // 1. Try to find corresponding action in active dialog actions list
          if (!processed) {
            actionNode = this._application.getActiveDialogAction(vmKey);
            if (actionNode) {
              actionName = actionNode.attribute('name');
              if (cls.ActionApplicationService.getLocalActionNames().contains(actionName)) {
                // pass the actionNode to processLocalAction because "in some cases" when the action is in the active dialog actions list
                // we must send an ActionEvent instead of a KeyEvent
                processed = this._processLocalAction(actionName, vmKey, actionNode);
              } else {
                vmEvent = new cls.VMActionEvent(actionNode.getId());
                context.LogService.keyboard.log("processKey found Action & send ActionEvent for key : ", keyString);
              }
            }
          }

          // 2. Try to find corresponding action in default action list
          if (!vmEvent && !processed) {
            actionNode = this._application.getDefaultAction(vmKey);
            if (actionNode) {
              actionName = actionNode.attribute('name');
              if (cls.ActionApplicationService.browserNativeActions.contains(actionName)) {
                context.LogService.keyboard.log("processKey found copy/cut/paste Action");
              } else if (cls.ActionApplicationService.getLocalActionNames().contains(actionName)) {
                processed = this._processLocalAction(actionName, vmKey);
              } else {
                vmEvent = new cls.VMKeyEvent(vmKey);
                context.LogService.keyboard.log("processKey found ActionDefault & send KeyEvent for key : ", vmKey);
              }
            }
          }

          // 3. Check if key must be send to VM (for specific nodes and specific keys we always send to VM)
          if (!vmEvent && !processed && focusedNode) {
            var createKeyEvent;
            switch (focusedNode.getTag()) {
              case "MenuAction":
                // first letter of actions and nav keys should be send to VM to navigate in the menu
                createKeyEvent = (this._isMenuActionShortcutKey(focusedNode.getParentNode(), vmKey) || cls
                  .KeyboardApplicationService
                  .navigationKeys.indexOf(keyString) >= 0);
                break;
              case "Table":
                // letter should be send to VM for "search" feature
                createKeyEvent = (focusedNode.attribute("dialogType") === "DisplayArray" && vmKey.length === 1 && (cls
                  .KeyboardHelper
                  .isLetter(vmKey) || cls.KeyboardHelper.isNumeric(vmKey)));
                break;
              default:
                createKeyEvent = false;
            }

            if (createKeyEvent) {
              vmEvent = new cls.VMKeyEvent(vmKey);
              context.LogService.keyboard.log("processKey send KeyEvent for key : ", vmKey);
            }
          }

          // 4. TODO explain this ...
          if (!vmEvent && !processed) {
            actionName = cls.ActionApplicationService.getLocalActionName(vmKey);
            if (actionName) {
              processed = this._processLocalAction(actionName, vmKey);
            }
          }

          if (vmEvent && !processed) { // a vmEvent is found, send current widget value and then send key to VM
            if (focusedNode) {
              var ctrl = focusedNode.getController();
              if (ctrl) {
                ctrl.sendWidgetCursors();
                ctrl.sendWidgetValue();
              }
            }
            typeahead.event(vmEvent);
            processed = true;
          }

          return processed;

        },

        /**
         * @param {string} actionName - abstract name of the action to process
         * @param {string} actionAccelerator - accelerator key corresponding to the action
         * @param {classes.ActionNode} [actionNode] - action node to be processed
         * @returns {boolean} true if the action has been processed, false otherwise
         * @private
         */
        _processLocalAction: function(actionName, actionAccelerator, actionNode) {

          var app = this._application;
          var typeahead = app.typeahead;
          var focusedNode = app.focus.getFocusedNode();
          var processed = false;

          var focusedNodeController = focusedNode.getController();
          var focusedNodeIsFormField = (focusedNode.getTag() === "FormField");
          var focusedNodeIsAction = (focusedNode.getTag() === "Action" || focusedNode.getTag() === "MenuAction");
          var focusedNodeIsButton = (focusedNode.getTag() === "Button");
          var focusedNodeIsMatrix = (focusedNode.getTag() === "Matrix");
          var focusedNodeIsTable = (focusedNode.getTag() === "Table");
          var focusedNodeIsValue = (focusedNode.getTag() === "Value");

          var focusedNodeIsInInputMode = (['Input', 'InputArray', 'Construct'].indexOf(focusedNode.attribute('dialogType')) !==
            -1);

          // if Table or Matrix in DISPLAY mode
          if ((focusedNodeIsTable || focusedNodeIsMatrix) && !focusedNodeIsInInputMode) {
            return this._processDisplayTableMatrixLocalAction(focusedNode, actionName, actionAccelerator, actionNode);
          }

          typeahead.startGroupCommand();
          if (focusedNodeController) {
            focusedNodeController.sendWidgetCursors(true);
            focusedNodeController.sendWidgetValue(true);
          }

          // FormField case
          if (focusedNodeIsFormField || focusedNodeIsAction || focusedNodeIsButton) {
            processed = this._processFormFieldLocalAction(focusedNode, actionName, actionAccelerator);
          } else {
            // Case of Matrix or Table (INPUT)
            var valueNode = null;
            if (focusedNodeIsValue) {
              valueNode = focusedNode;
            } else if (focusedNodeIsMatrix || focusedNodeIsTable) {
              valueNode = focusedNode.getCurrentValueNode();
            }

            if (valueNode !== null) {
              /** @type classes.MatrixNode|classes.TableColumnNode */
              var containerNode = Boolean(valueNode.getParentNode()) && valueNode.getParentNode().getParentNode();
              if (focusedNodeIsMatrix || (focusedNode && focusedNode.isInMatrix()) || focusedNodeIsTable || (
                  focusedNodeController && focusedNode.isInTable())) {
                processed = this._processInputTableMatrixLocalAction(containerNode, valueNode, actionName, actionAccelerator);
              }
            } else { //focused node is directly Table/Matrix (currentRow not in visible offset)
              typeahead.freeze();
              processed = this._sendKeyEvent(actionAccelerator);
            }
          }

          typeahead.finishGroupCommand();

          return processed;
        },

        /**
         * Sends a key event command
         * @param {string} keyName
         * @returns {boolean}
         * @private
         */
        _sendKeyEvent: function(keyName) {
          this._application.typeahead.event(new cls.VMKeyEvent(keyName));
          return true;
        },

        /**
         * @param {classes.FormFieldNode} formFieldNode
         * @param {string} actionName abstract name of the action to process
         * @param {string} actionAccelerator accelerator key corresponding to the action
         * @returns {boolean} true if the action has been processed, false otherwise
         * @private
         */
        _processFormFieldLocalAction: function(formFieldNode, actionName, actionAccelerator) {
          var isFieldNavigation = cls.ActionNode.isFieldNavigationAction(actionName);
          if (isFieldNavigation) {
            var uiNode = this._application.uiNode();
            var currentWindow = uiNode && this._application.getNode(uiNode.attribute('currentWindow'));
            var form = currentWindow && currentWindow.getLastChild('Form');
            if (!form) {
              return false;
            }
            var inputWrap = uiNode && uiNode.attribute('inputWrap');
            var newFocusedNode = cls.FocusApplicationService.getPrevOrNextContainer(form, formFieldNode, actionName ===
              'nextfield' ?
              1 : -1,
              inputWrap);
            if (newFocusedNode && !this._application.typeahead.isFrozen()) {
              return this._application.focus._transferFocusToNode(actionName, newFocusedNode);
            } else {
              return this._sendKeyEvent(actionAccelerator);
            }
          } else {
            var dialogType = formFieldNode.attribute("dialogType");
            var isArrayContainer = dialogType ? dialogType.indexOf("Array") !== -1 : false;
            if (isArrayContainer && cls.ActionNode.isTableNavigationAction(actionName)) {
              // FormField is a single line matrix
              return this._sendKeyEvent(actionAccelerator);
            }
          }
          return false;
        },

        /**
         * @param {classes.TableColumnNode|classes.MatrixNode} node
         * @param {classes.ValueNode} valueNode
         * @param {string} actionName abstract name of the action to process
         * @param {string} actionAccelerator accelerator key corresponding to the action
         * @returns {boolean} true if the action has been processed, false otherwise
         * @private
         */
        _processInputTableMatrixLocalAction: function(node, valueNode, actionName, actionAccelerator) {

          // if a action is table or field navigation consider that action is processed
          var processed = cls.ActionNode.isTableNavigationAction(actionName) || cls.ActionNode.isFieldNavigationAction(
            actionName);

          var isTable = (node.getTag() === "TableColumn");
          var arrayNode = isTable ? node.getParentNode() : node; // MatrixNode or TableNode

          var localRow = valueNode.getIndex();
          var newLocalRow = localRow;
          var newCurrentRow = null;
          var newColumn = null;
          var newNode = null;
          var pageSize = arrayNode.attribute('pageSize');
          var offset = arrayNode.attribute('offset');
          var size = arrayNode.attribute('size');

          if (isTable) { // TABLE
            var tableNode = arrayNode;
            newNode = tableNode; // no new node the focus is still on table node

            var columnList = cls.FocusApplicationService.getOrderedTableColumns(tableNode);
            var column = columnList.indexOf(node);

            // compute new row and new col
            newColumn = column;

            if (actionName === 'nextfield') {
              if (newColumn + 1 < columnList.length) {
                newColumn++;
              } else {
                newColumn = 0;
                newLocalRow++;
              }
            } else if (actionName === 'prevfield') {
              if (newColumn - 1 >= 0) {
                newColumn--;
              } else {
                newColumn = 0;
                newLocalRow--;
              }
            } else {
              newCurrentRow = cls.TypeAheadCurrentRow.computeNewRowFromAction(tableNode, actionName, localRow + offset, true);
              newLocalRow = newCurrentRow - offset;
            }

            // if row and col have not changed nothing to do
            if (localRow === newLocalRow && column === newColumn) {
              return processed;
            }
          } else { // MATRIX
            // compute new row an col
            var newMatrixNode = node;

            if (actionName === 'nextfield' || actionName === 'prevfield') {
              var uiNode = this._application.uiNode();
              var currentWindow = uiNode && this._application.getNode(uiNode.attribute('currentWindow'));
              var form = currentWindow && currentWindow.getLastChild('Form');
              if (!form) {
                return false;
              }
              var mats = [];
              cls.FocusApplicationService.orderFields(form, mats, ['Matrix'], {
                screenRecord: node.attribute('screenRecord')
              });
              var currentIndex = mats.indexOf(node);
              currentIndex += actionName === 'nextfield' ? 1 : -1;
              if (currentIndex < 0) {
                currentIndex = mats.length - 1;
                newLocalRow--;
              } else if (currentIndex >= mats.length) {
                currentIndex = 0;
                newLocalRow++;
              }
              newMatrixNode = mats[currentIndex];
            } else {
              newCurrentRow = cls.TypeAheadCurrentRow.computeNewRowFromAction(node, actionName, localRow + offset, true);
              newLocalRow = newCurrentRow - offset;
            }

            // if row and col have not changed nothing to do
            if (localRow === newLocalRow && node === newMatrixNode) {
              return processed;
            }

            newNode = newMatrixNode; // matrix node can change
          }

          // if we are outside of [0...pageSize] typeahead is no more possible
          // if we want to put the row on a index >= size of table
          // we don't know what to do --> freeze Typeahead
          if ((newLocalRow >= pageSize || newLocalRow < 0) || ((newLocalRow + offset) >= size)) {
            this._application.typeahead.freeze();
          }

          if (this._application.typeahead.isFrozen()) {

            // typeahead frozen --> send key event to VM
            var requiredAccelerator = cls.ActionNode.getRequiredAccelerator(actionName);
            this._sendKeyEvent(!!requiredAccelerator ? requiredAccelerator : actionAccelerator);
            var scrollGridNode = node.getAncestor('ScrollGrid');
            if (scrollGridNode && scrollGridNode.getController().isPagedScrollGrid()) {
              var newOffset = Math.floor((newLocalRow + offset) / pageSize) * pageSize;
              var isLastPage = size - offset < pageSize;
              if (newOffset !== offset || isLastPage) {
                this._application.typeahead.scroll(node, newOffset);
              }
            }
            return true;
          } else {
            // else transfer focus to appropriate widget
            return this._application.focus._transferFocusToNode(actionName, newNode, newLocalRow, newColumn);
          }
        },

        /**
         * @param {classes.TableNode|classes.MatrixNode} node
         * @param {string} actionName abstract name of the action to process
         * @param {string} actionAccelerator accelerator key corresponding to the action
         * @param {classes.ActionNode} [actionNode] - action node to be processed
         * @returns {boolean} true if the action has been processed, false otherwise
         * @private
         */
        _processDisplayTableMatrixLocalAction: function(node, actionName, actionAccelerator, actionNode) {
          var ctrl = node.getController();
          var widget = ctrl.getWidget(); // matrix controller has no widget
          var offset = node.attribute('offset');
          var pageSize = node.attribute('pageSize');
          var size = node.attribute('size');
          var localRow = node.attribute("currentRow") - offset;
          var scrollGridController = null;
          if (widget) { // if there is a widget, it means you are in a table
            localRow = widget.getCurrentRow();
          } else { // if we are in a matrix, we check if a corresponding widget exists (PagedScrollGrid, StretchableScrollGrid, etc..)
            // TODO this could be simplified by using getAncestor('ScrollGrid') and checking types instead of searching for methods
            var matrixParent = node.getParentNode();
            var matrixParentWidget = matrixParent && matrixParent.getController() && matrixParent.getController().getWidget();
            while (matrixParent && matrixParentWidget && !matrixParentWidget.setCurrentRow) {
              matrixParent = matrixParent.getParentNode();
              matrixParentWidget = matrixParent && matrixParent.getController() && matrixParent.getController().getWidget();
            }
            if (matrixParentWidget && matrixParentWidget.getCurrentRow) { // we found a scrollgrid widget, we get its current row
              scrollGridController = matrixParent.getController();
              localRow = matrixParentWidget.getCurrentRow();
            } else if (ctrl.getCurrentRow) { // no widget exists, we get currentrow from matrix controller
              localRow = ctrl.getCurrentRow();
            }
          }

          // compute new row
          var newLocalRow = localRow;

          if (scrollGridController && scrollGridController.isPagedScrollGrid()) {
            // Tab / Shift-Tab should be handled as prevrow and nextrow in paged ScrollGrids
            if (actionName === 'prevfield') {
              actionName = 'prevrow';
            } else if (actionName === 'nextfield') {
              actionName = 'nextrow';
            }
          }
          var isTableNavigation = cls.ActionNode.isTableNavigationAction(actionName);
          if (isTableNavigation) {
            if (node.attribute('multiRowSelection') === 1) {
              return false; // in case of mrs, local actions will be managed by the widget
            }
            var newCurrentRow = cls.TypeAheadCurrentRow.computeNewRowFromAction(node, actionName, localRow + offset, false);
            newLocalRow = newCurrentRow - offset;
          } else {
            var vmEvent = actionNode ? new cls.VMActionEvent(actionNode.getId()) : new cls.VMKeyEvent(actionAccelerator);
            this._application.typeahead.event(vmEvent);
            return true;
          }

          // if row has not changed nothing to do
          if (localRow === newLocalRow) {
            return false;
          }

          // if we are outside of [0...pageSize] typeahead is no more possible
          // if we want to put the row on a index >= size of table
          // we don't know what to do --> freeze Typeahead
          if ((newLocalRow >= pageSize || newLocalRow < 0) || ((newLocalRow + offset) >= size)) {
            this._application.typeahead.freeze();
          }

          return this._application.focus._transferFocusToNode(actionName, node, newLocalRow);

        }
      };
    });
    cls.ApplicationServiceFactory.register("Keyboard", cls.KeyboardApplicationService);
  });
