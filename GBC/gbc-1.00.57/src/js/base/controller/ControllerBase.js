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

/**
 * @typedef {Object} ControllerBindings
 * @property {classes.NodeBase} anchor
 * @property {?classes.NodeBase} decorator
 * @property {?classes.NodeBase} container
 * @property {?Object} additionalBindings
 */

modulum('ControllerBase', ['EventListener'],
  /**
   * @namespace Controllers
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Base controller for an AUI node.
     * Manages client side life cycle representation of the node.
     * @class ControllerBase
     * @memberOf classes
     * @extends classes.EventListener
     */
    cls.ControllerBase = context.oo.Class(cls.EventListener, function($super) {
      return /** @lends classes.ControllerBase.prototype */ {
        __name: "ControllerBase",
        /**
         * list of controller's node binding
         * @type {?ControllerBindings}
         */
        _nodeBindings: null,
        /**
         * linked behaviors
         * @type {Object[]}
         */
        _behaviors: null,
        /**
         * controller's widget
         * @type {classes.WidgetBase}
         */
        _widget: null,
        /**
         * controller's widget kind
         * @type {?string}
         */
        _widgetKind: null,
        /**
         * controller's widget active status
         * @type {?boolean}
         */
        _widgetActive: null,
        /**
         * controller's widget nbmp
         * @type {?string}
         */
        _widgetType: null,
        /**
         * if false, don't create controller's widget automatically
         * @type {boolean}
         */
        _autoCreateWidget: true,

        /**
         * Use position in AUI tree parent node to add widget at the correct position
         * @type {boolean}
         */
        _useAUIPositionToAttachUI: false,

        /**
         * @constructs
         * @param {ControllerBindings} bindings
         */
        constructor: function(bindings) {
          $super.constructor.call(this);
          this._nodeBindings = bindings;
          this._behaviors = [];
          this.createWidget();
          this._initBehaviors();
          if (gbc.qaMode) {
            this._addBehavior(cls.QAInfoVMBehavior);
          }
          this._addBehavior(cls.AuiNameVMBehavior);
        },

        _initWidgetKind: function() {
          if (this._nodeBindings.container) {
            this._widgetKind = this._nodeBindings.container.attribute("dialogType");
            this._widgetActive = this._nodeBindings.container.attribute("active");
          }
          this._widgetType = this._getWidgetType(this._widgetKind, this._widgetActive);
        },

        isInMatrix: function() {
          return this.getAnchorNode() && this.getAnchorNode().isInMatrix();
        },

        isInTable: function() {
          return this.getAnchorNode() && this.getAnchorNode().isInTable();
        },

        isInFirstTableRow: function() {
          return this.getAnchorNode() && this.getAnchorNode().isInFirstTableRow();
        },

        isInStack: function() {
          return this.getAnchorNode() && this.getAnchorNode().isInStack();
        },

        isInScrollGrid: function() {
          return this.getAnchorNode() && this.getAnchorNode().isInScrollGrid();
        },

        /**
         * init behaviors: override in children class
         * @protected
         * @abstract
         */
        _initBehaviors: function() {},

        /**
         * Link behavior to the controller
         * @param {Function} BehaviorClass the behavior class to link
         * @param {*} [config] configuration object
         * @protected
         */
        _addBehavior: function(BehaviorClass, config) {
          var behaviorContainer = {
            _behavior: BehaviorClass,
            dirty: true
          };
          if (BehaviorClass.setup) {
            BehaviorClass.setup(this, behaviorContainer, config);
          }
          this._behaviors.push(behaviorContainer);
          BehaviorClass.firstAttach(this, behaviorContainer);
        },
        /**
         * Applies all behaviors attached to this controller
         * @param {Array} treeModificationTrack list of nodes where behaviors were applied
         * @param {?boolean} force true force apply all
         * @return {boolean} true if behaviors went dirty
         */
        applyBehaviors: function(treeModificationTrack, force) {
          var remainingDirty = false,
            invalidatesFollowing = false,
            len = this._behaviors.length;
          for (var i = 0; i < len; i++) {
            var behaviorContainer = this._behaviors[i];
            var behavior = behaviorContainer._behavior;
            if (behavior === cls.QAInfoVMBehavior || behavior === cls.AuiNameVMBehavior) {
              behavior.apply(this, behaviorContainer);
            } else {
              if (force || invalidatesFollowing || behavior.canApply(this, behaviorContainer, treeModificationTrack)) {
                invalidatesFollowing = behavior.apply(this, behaviorContainer) || invalidatesFollowing;
              }
              remainingDirty = remainingDirty || behavior.dirty;
            }
          }
          return remainingDirty;
        },
        /**
         * attach widget
         * @protected
         */
        _attachWidget: function() {
          for (var i = 0; i < this._behaviors.length; i++) {
            var behaviorContainer = this._behaviors[i];
            behaviorContainer._behavior.attachWidget(this, behaviorContainer);
          }
        },
        /**
         * detach widget
         * @protected
         */
        _detachWidget: function() {
          for (var i = 0; i < this._behaviors.length; i++) {
            var behaviorContainer = this._behaviors[i];
            behaviorContainer._behavior.detachWidget(this, behaviorContainer);
          }
        },
        /**
         * destroy behaviors
         * @protected
         */
        _destroyBehaviors: function() {
          for (var i = 0; i < this._behaviors.length; i++) {
            var behaviorContainer = this._behaviors[i];
            behaviorContainer._behavior.cleanup(this, behaviorContainer);
            behaviorContainer._behavior = null;
          }
          this._behaviors.length = 0;
          this._behaviors = null;
        },
        /**
         * @inheritDoc
         */
        destroy: function() {
          this._destroyBehaviors();
          this.detachUI();
          this._nodeBindings = null;
          this._widget = null;
          $super.destroy.call(this);
        },
        /**
         * Get the anchor node
         * @returns {classes.NodeBase} the anchor node
         */
        getAnchorNode: function() {
          return this._nodeBindings && this._nodeBindings.anchor;
        },
        /**
         * Get the application node
         * @returns {classes.NodeBase} the ui node
         */
        getUINode: function() {
          return this._nodeBindings && this._nodeBindings.ui;
        },
        /**
         * get the nodes linked to the controller
         * @returns {ControllerBindings} the nodes
         */
        getNodeBindings: function() {
          return this._nodeBindings;
        },
        /**
         * create widget
         * @returns {classes.WidgetBase} the widget
         */
        createWidget: function() {
          if (!this._widget && this.autoCreateWidget()) {
            this._initWidgetKind();
            this._widget = this._createWidget(this._widgetType);
          }
          return this._widget;
        },

        /**
         * create widget from given type
         * @param {string} widgetType the widget type
         * @returns {classes.WidgetBase} the widget
         */
        createWidgetFromType: function(widgetType) {
          if (!this._widget) {
            this._widgetType = widgetType;
            this._widget = this._createWidget(this._widgetType);
          }
          return this._widget;
        },

        /**
         * Check if the widget should be automatically created.
         * @return {boolean} true if controller will create widget automatically
         */
        autoCreateWidget: function() {
          return this._autoCreateWidget;
        },

        /**
         * Set if widget should be automatically created
         * @param {boolean} b true if widget should be automatically created
         */
        setAutoCreateWidget: function(b) {
          this._autoCreateWidget = b;
        },

        /**
         * Basic widget types depending of dialogType. To override for specific rules
         * @param {string} kind widget dialogType
         * @param {boolean} [active] is dialog active ?
         * @returns {string} widget type
         * @protected
         */
        _getWidgetType: function(kind, active) {
          return this.__name.replace("Controller", "");
        },

        /**
         * create widget
         * @param {string} [type] the widget type
         * @returns {classes.WidgetBase} the created widget
         * @protected
         */
        _createWidget: function(type) {
          return cls.WidgetFactory.createWidget(type, {
            appHash: this.getAnchorNode().getApplication().applicationHash,
            appWidget: this.getAnchorNode().getApplication().getUI().getWidget(),
            auiTag: this.getAnchorNode().getId(),
            inTable: this.isInTable(),
            inMatrix: this.isInMatrix(),
            inScrollGrid: this.isInScrollGrid()
          }, this.getAnchorNode());
        },
        /**
         * Recreate widget depending on dialogType
         * @param {string} kind widget kind
         * @param {boolean} active is dialog active ?
         */
        changeWidgetKind: function(kind, active) {
          if ((kind !== this._widgetKind || active !== this._widgetActive) && this.autoCreateWidget()) {
            this._widgetKind = kind;
            this._widgetActive = active;
            var type = this._getWidgetType(kind, active);
            if (type !== this._widgetType) {
              this._widgetType = type;
              var oldWidget = this._widget;
              this._detachWidget();
              this._widget = this._createWidget(type);
              if (this._widget) {
                if (oldWidget) {
                  oldWidget.replaceWith(this._widget);
                } else {
                  // No older widget to replace, attach new one
                  this.attachUI();
                }
              }

              if (oldWidget) {
                oldWidget.destroy();
              }
              this._attachWidget();
              return true;
            } else if (this._widget.setWidgetMode) {
              this._widget.setWidgetMode(kind, active);
            }
          }
          return false;
        },

        /**
         * attach UI
         */
        attachUI: function() {
          cls.NodeHelper.addToParentWidget(this.getAnchorNode(), null, this._useAUIPositionToAttachUI);
        },

        /**
         * detach UI
         */
        detachUI: function() {
          if (this._widget) {
            this._widget.destroy();
            this._widget = null;
          }
        },

        /**
         * get the widget
         * @returns {classes.WidgetBase} the widget
         */
        getWidget: function() {
          return this._widget;
        },

        /**
         * Returns current internal widget (in table or matrix)
         * @returns {classes.WidgetBase} current internal widget
         * @public
         */
        getCurrentInternalWidget: function() {
          var widget = null;
          var node = this.getAnchorNode();
          if (node.getCurrentValueNode) {
            var valueNode = node.getCurrentValueNode(false);
            if (valueNode) {
              var controller = valueNode.getController();
              if (controller) {
                widget = controller.getWidget();
              }
            }
          }
          return widget;
        },

        /**
         * Ensures the widget corresponding to this controller is visible to the user
         * @param {boolean} [executeAction] - true to execute action linked (e.g. for a page, the linked action when showing)
         * @return {boolean} true if a layout is needed after that
         */
        ensureVisible: function(executeAction) {
          var p = this.getAnchorNode().getParentNode(),
            result = false;
          while (p !== null) {
            var controller = p.getController();
            if (controller !== null) {
              result = result || controller.ensureVisible(executeAction);
              break;
            }
            p = p.getParentNode();
          }
          return result;
        },

        /**
         * Try to set focus to controller's widget
         */
        setFocus: function() {
          if (this._widget && this._widget.setFocus) {
            this._widget.setFocus();
          }
          // Hide filter menu item from chrome bar
          this.getUINode().getController().getWidget().showChromeBarFilterMenuItem(false);
        },

        /**
         * update dirty state of style application behaviors
         *
         * @param {boolean} noUsageCheck if false or not defined, set as dirty in all cases
         * @param {boolean} noRecurse if false or not defined, do it recursively
         * @protected
         */
        setStyleBasedBehaviorsDirty: function(noUsageCheck, noRecurse) {
          var app = this.getAnchorNode().getApplication();
          for (var i = 0; i < this._behaviors.length; i++) {
            var behaviorContainer = this._behaviors[i];
            var behavior = behaviorContainer._behavior,
              len = behavior.usedStyleAttributes && behavior.usedStyleAttributes.length;
            if (len) {
              if (noUsageCheck) {
                behaviorContainer.dirty = true;
              } else {
                for (var j = 0; j < len; ++j) {
                  if (app.usedStyleAttributes[behavior.usedStyleAttributes[j]]) {
                    behaviorContainer.dirty = true;
                    break;
                  }
                }
              }
            }
          }
          if (!noRecurse) {
            var children = this.getAnchorNode().getRawChildren();
            for (i = 0; i < children.length; ++i) {
              var child = children[i];
              var ctrl = child.getController();
              if (ctrl) {
                ctrl.setStyleBasedBehaviorsDirty(noUsageCheck);
              }
            }
          }
        },

        /**
         * Set stored setting for this controller
         * @param key {string} Setting key
         * @param value {*} Setting value
         */
        setStoredSetting: function(key, value) {},

        /**
         * Get stored setting for this controller
         * @param key {string} Setting key
         * @returns {*} the stored settings object, if any
         */
        getStoredSetting: function(key) {
          return null;
        },

        /**
         * Sends the updated value to the DVM
         * @param {boolean} [dirty] - if true send only if widget has been edited
         */
        sendWidgetValue: function(dirty) {},

        /**
         * Sends the updated cursors to the DVM
         * @param {boolean} [dirty] - if true send only if widget has been edited
         */
        sendWidgetCursors: function(dirty) {},

        /**
         * Check if Widget should be display in chromebar or keep the default behavior
         * @return {Boolean} true if it's displayed in the chromebar
         */
        isInChromeBar: function() {
          // Legacy mode means no chromebar
          if (gbc.ThemeService.getValue("theme-legacy-topbar")) {
            return false;
          }
          var anchor = this.getAnchorNode();
          var ancestorWindow = anchor.getAncestor("Window");
          var isInTabbedContainer = anchor.getApplication().getSession().getTabbedContainerModeHostApplication();
          var ancestorMenu = anchor.getAncestor("Menu");
          var isMenuWinMsg = ancestorMenu && ancestorMenu._vmStyles.indexOf("winmsg") >= 0 || anchor._vmStyles.indexOf("winmsg") >=
            0; //menu item in winmsg
          var isDialogMenu = ancestorMenu && ancestorMenu._vmStyles.indexOf("dialog") >= 0;
          var isPopupMenu = ancestorMenu && ancestorMenu._vmStyles.indexOf("popup") >= 0 || anchor._vmStyles.indexOf("popup") >=
            0; //menu item in popup
          var isWinMsg = ancestorWindow && ancestorWindow._vmStyles.indexOf("winmsg") >= 0; //menu item in winmsg
          var isWinModal = ancestorWindow && ancestorWindow.getStyleAttribute("windowType") === "modal"; //menu item in modal window

          // Position style for all MENU (and MENU items under this instruction)
          var ringMenuPositionStyle = ancestorWindow && (ancestorWindow._initialStyleAttributes.ringMenuPosition || gbc.ThemeService
            .getValue("gbc-WindowWidget-defaultRingMenuPosition"));
          // Position style for all ACTIONs in a DIALOG
          var actionPanelPositionStyle = ancestorWindow && (ancestorWindow._initialStyleAttributes.actionPanelPosition || gbc
            .ThemeService
            .getValue("gbc-WindowWidget-defaultActionPanelPosition"));

          // Position style for TOOLBAR
          // For the window toolbar, get the parent window style
          // For a global toolbar, get the first window style in userInterface node
          var tbWindow = ancestorWindow || anchor.getAncestor("UserInterface").getChildren("Window")[0];
          var toolbarPositionStyle = tbWindow && (tbWindow._initialStyleAttributes.toolBarPosition || gbc.ThemeService.getValue(
            "gbc-WindowWidget-defaultToolBarPosition"));

          // In tabbed container mode, override the default theme / 4ST to never use the chromebar
          if (isInTabbedContainer) {
            toolbarPositionStyle = toolbarPositionStyle === "chrome" ? "top" : toolbarPositionStyle;
            ringMenuPositionStyle = ringMenuPositionStyle === "chrome" ? "right" : ringMenuPositionStyle;
            actionPanelPositionStyle = actionPanelPositionStyle === "chrome" ? "right" : actionPanelPositionStyle;
          }

          // This final step defines if the position is in chromeBar
          var position4STChrome = false;
          if (this.isInstanceOf(cls.ToolBarController) || this.isInstanceOf(cls.ToolBarItemController)) {
            position4STChrome = toolbarPositionStyle === "chrome";
          } else if (this.isInstanceOf(cls.MenuActionController) || this.isInstanceOf(cls.MenuController)) {
            position4STChrome = ringMenuPositionStyle === "chrome";
          } else if (this.isInstanceOf(cls.ActionController)) {
            position4STChrome = actionPanelPositionStyle === "chrome";
          } else if (this.isInstanceOf(cls.DialogController)) {
            position4STChrome = actionPanelPositionStyle === "chrome";
          }

          // Don't display menus as chromebar on modal or popup
          return position4STChrome && !isDialogMenu && !isMenuWinMsg && !isPopupMenu && !isWinMsg && !isWinModal;
        }

      };
    });
  });
