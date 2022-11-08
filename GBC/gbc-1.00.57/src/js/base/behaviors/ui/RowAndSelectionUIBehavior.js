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

modulum('RowAndSelectionUIBehavior', ['UIBehaviorBase'],
  function(context, cls) {
    /**
     * @class RowAndSelectionUIBehavior
     * @memberOf classes
     * @extends classes.UIBehaviorBase
     */
    cls.RowAndSelectionUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      return /** @lends classes.RowAndSelectionUIBehavior.prototype */ {
        /** @type {string} */
        __name: "RowAndSelectionUIBehavior",
        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          data.lastEvent = null;
          var widget = controller.getWidget();
          if (widget) {
            data.downHandle = widget.when(gbc.constants.widgetEvents.keyArrowDown, this._onNavigationKey.bind(this, controller,
              "nextrow"));
            data.upHandle = widget.when(gbc.constants.widgetEvents.keyArrowUp, this._onNavigationKey.bind(this, controller,
              "prevrow"));
            data.pageDownHandle = widget.when(gbc.constants.widgetEvents.keyPageDown, this._onNavigationKey.bind(this, controller,
              "nextpage"));
            data.pageUpHandle = widget.when(gbc.constants.widgetEvents.keyPageUp, this._onNavigationKey.bind(this, controller,
              "prevpage"));
            data.homeHandle = widget.when(gbc.constants.widgetEvents.keyHome, this._onNavigationKey.bind(this, controller,
              "firstrow"));
            data.endHandle = widget.when(gbc.constants.widgetEvents.keyEnd, this._onNavigationKey.bind(this, controller,
              "lastrow"));

            data.leftHandle = widget.when(gbc.constants.widgetEvents.keyArrowLeft, this._onKeyLeft.bind(this, controller, data));
            data.rightHandle = widget.when(gbc.constants.widgetEvents.keyArrowRight, this._onKeyRight.bind(this, controller, data));

            data.spaceHandle = widget.when(gbc.constants.widgetEvents.keySpace, this._onKeySpace.bind(this, controller, data));
            data.selectAllHandle = widget.when(gbc.constants.widgetEvents.selectAll, this._onSelectAll.bind(this, controller,
              data));
          }
        },
        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.downHandle) {
            data.downHandle();
            data.downHandle = null;
          }
          if (data.upHandle) {
            data.upHandle();
            data.upHandle = null;
          }
          if (data.leftHandle) {
            data.leftHandle();
            data.leftHandle = null;
          }
          if (data.rightHandle) {
            data.rightHandle();
            data.rightHandle = null;
          }
          if (data.pageDownHandle) {
            data.pageDownHandle();
            data.pageDownHandle = null;
          }
          if (data.pageUpHandle) {
            data.pageUpHandle();
            data.pageUpHandle = null;
          }
          if (data.homeHandle) {
            data.homeHandle();
            data.homeHandle = null;
          }
          if (data.endHandle) {
            data.endHandle();
            data.endHandle = null;
          }
          if (data.spaceHandle) {
            data.spaceHandle();
            data.spaceHandle = null;
          }
          if (data.selectAllHandle) {
            data.selectAllHandle();
            data.selectAllHandle = null;
          }
        },

        /**
         * On navigation key widget event
         * @private
         */
        _onNavigationKey: function(controller, actionName, event, sender, domEvent) {
          var node = controller.getAnchorNode();
          if (node.attribute('multiRowSelection') !== 0) {
            this._sendCommands(controller, actionName, domEvent.ctrlKey || domEvent.metaKey, domEvent.shiftKey);
          } // else is managed by TypeAheadApplicationService
        },

        /**
         * Creates, configures and sends commands
         * @param {classes.TableController} controller
         * @param {string} actionName - action name (nextrow, prevrow, ...)
         * @param {boolean} ctrlKey - true if ctrl or meta key is pressed
         * @param {boolean} shiftKey - true if shift key is pressed
         */
        _sendCommands: function(controller, actionName, ctrlKey, shiftKey) {
          var node = controller.getAnchorNode();
          var app = node.getApplication();

          var sendSelect = !(ctrlKey && !shiftKey);
          if (sendSelect) {
            app.typeahead.rowSelection(node, ctrlKey, shiftKey, cls.TypeAheadRowSelection.currentRow, actionName);
          }

          app.typeahead.currentRow(node, actionName, ctrlKey, shiftKey);
        },

        /**
         * On keyLeft widget event
         * @private
         */
        _onKeyLeft: function(controller, data, event, sender, domEvent) {
          var widget = controller.getWidget();
          if (widget.hasFocusOnField()) {
            var keyEvent = new cls.VMKeyEvent("Left");
            var node = controller.getAnchorNode();
            node.getApplication().typeahead.event(keyEvent, node);
          } else if (widget.isDisplayMode() && !widget.isTreeView()) {
            widget.doHorizontalScroll("left");
          }
        },

        /**
         * On keyRight widget event
         * @private
         */
        _onKeyRight: function(controller, data, event, sender, domEvent) {
          var widget = controller.getWidget();
          if (widget.hasFocusOnField()) {
            var keyEvent = new cls.VMKeyEvent("Right");
            var node = controller.getAnchorNode();
            node.getApplication().typeahead.event(keyEvent, node);
          } else if (widget.isDisplayMode() && !widget.isTreeView()) {
            widget.doHorizontalScroll("right");
          }
        },

        /**
         * On keySpace widget event
         * @private
         */
        _onKeySpace: function(controller, data, event, sender, domEvent) {
          var node = controller.getAnchorNode();
          if (node.attribute('multiRowSelection') !== 0) {
            var app = node.getApplication();
            app.typeahead.rowSelection(node, domEvent.ctrlKey, domEvent.shiftKey, cls.TypeAheadRowSelection.toggle);
          }
        },

        /**
         * On selectAll widget event
         * @private
         */
        _onSelectAll: function(controller, data, event, sender) {
          var node = controller.getAnchorNode();
          if (node.attribute('multiRowSelection') !== 0) {
            var app = node.getApplication();
            app.typeahead.rowSelection(node, false, false, cls.TypeAheadRowSelection.selectAll);
          }
        }
      };
    });
  });
