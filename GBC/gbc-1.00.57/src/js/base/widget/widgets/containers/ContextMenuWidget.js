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

modulum('ContextMenuWidget', ['ChoiceDropDownWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * ContextMenu DropDown widget.
     * @class ContextMenuWidget
     * @memberOf classes
     * @extends classes.DropDownWidget
     */
    cls.ContextMenuWidget = context.oo.Class(cls.ChoiceDropDownWidget, function($super) {
      /** @lends classes.ContextMenuWidget.prototype */
      return {
        __name: "ContextMenuWidget",
        __templateName: "DropDownWidget",

        /** @type {Map<string, classes.MenuLabelWidget|classes.HLineWidget>} */
        _actionWidgets: null,
        /** @type {Map<string, classes.MenuLabelWidget|classes.HLineWidget>} */
        _extraActionWidgets: null,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
        },

        /**
         * @inheritDoc
         */
        _initContainerElement: function() {
          $super._initContainerElement.call(this);

          this._actionWidgets = new Map();
          this._extraActionWidgets = new Map();

          this.allowMultipleChoices(true);
          this.getElement().addClass("menu");
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          // no layout
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          $super.destroy.call(this);

          this.removeAndDestroyActions();
          this._actionWidgets = null;
          this._extraActionWidgets = null;
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          if (!domEvent.target.elementOrParent("gbc_CheckBoxWidget")) { // if click is not on a checkbox
            this.hide(); // hide context menu
          }
          return false;
        },

        /**
         * @inheritDoc
         */
        managePriorityKeyDown: function(keyString, domKeyEvent, repeat) {
          var keyProcessed = false;

          if (this.isVisible()) {
            switch (keyString) {
              case "tab":
              case "shift+tab":
                this.hide();
                break;
              case "space":
                var currentChild = this.getCurrentChildren();
                if (currentChild.getName() === "CheckBoxWidget") {
                  currentChild.manageMouseClick(null);
                } else {
                  this._onClick(null, currentChild);
                }
                keyProcessed = true;
                break;
            }
          }

          if (!keyProcessed) {
            keyProcessed = $super.managePriorityKeyDown.call(this, keyString, domKeyEvent, repeat);
          }
          return keyProcessed;
        },

        /**
         * Remove and destroy all actions widgets
         * @param {boolean} [onlyExtra] - if true remove only extra actions else remove all
         */
        removeAndDestroyActions: function(onlyExtra) {

          // remove extra actions widgets
          this._extraActionWidgets.forEach(function(value, key) {
            this.removeAndDestroyAction(key, true);
          }.bind(this));
          this._extraActionWidgets.clear();

          if (!onlyExtra) {
            // remove other actions widgets
            this._actionWidgets.forEach(function(value, key) {
              this.removeAndDestroyAction(key, false);
            }.bind(this));
            this._actionWidgets.clear();
          }
        },

        /**
         * Remove and destroy one action widget
         * @param {string} actionName - name of the action
         * @param {boolean} extra - is action in the extra actions ?
         */
        removeAndDestroyAction: function(actionName, extra) {
          var widgets = this._actionWidgets;
          if (extra) {
            widgets = this._extraActionWidgets;
          }
          var actionWidget = widgets.get(actionName);
          if (actionWidget) {
            if (!actionWidget._destroyed) {
              actionWidget.destroy();
            }
            widgets.delete(actionName);
          }
        },

        /**
         * Add one action in the contextmenu
         * @param {string} actionName - name
         * @param {string} actionText - text
         * @param {string} actionImage - image
         * @param {string} actionAccelerator - accelerator of the action
         * @param {Object} opts - actions options
         * @param {boolean} extra - is it an extra actions ?
         */
        addAction: function(actionName, actionText, actionImage, actionAccelerator, opts, extra) {
          var widgets = this._actionWidgets;
          if (extra) {
            widgets = this._extraActionWidgets;
            if (this._extraActionWidgets.size === 0 && this.hasVisibleAction()) {
              // before the first extra action add a separator
              this.addSeparator(extra);
            }
          }

          if (actionText.length > 0) {
            var actionWidget = widgets.get(actionName);
            if (!actionWidget) {
              actionWidget = cls.WidgetFactory.createWidget("MenuLabel", this.getBuildParameters());
              widgets.set(actionName, actionWidget);
              this.addChildWidget(actionWidget, opts);
            }

            this.updateAction(actionWidget, actionText, actionImage, actionAccelerator, opts);
          }
        },

        /**
         * Update one action in the contextmenu
         * @param {object|string} action
         * @param {string} actionText - text
         * @param {string} actionImage - image
         * @param {string} actionAccelerator - accelerator of the action
         * @param {Object} opts - actions options
         */
        updateAction: function(action, actionText, actionImage, actionAccelerator, opts) {
          var actionWidget = action;
          opts = opts || {};
          if (typeof action === "string") {
            actionWidget = this._actionWidgets.get(action);
          }
          if (actionWidget) {
            actionWidget.setText(actionText);
            if (actionImage) {
              actionWidget.setImage(actionImage);
            }
            if (actionAccelerator) {
              if (window.browserInfo.isSafari) {
                actionAccelerator.replace("Control", "⌘")
                  .replace("-", "");
              } else {
                actionAccelerator.replace("-", "+")
                  .replace("Control", "Ctrl");
              }
              actionWidget.setComment(actionAccelerator);
            }
            actionWidget.setEnabled(!opts.disabled);
            actionWidget.setHidden(!!opts.hidden);
          }
        },

        /**
         * Returns if there is at least one visible action
         * @returns {boolean} true if there is at least one visible actions
         */
        hasVisibleAction: function() {
          var visible = false;
          for (var i = 0; i < this.getChildren().length; i++) {
            if (this.getChildren()[i].isVisible()) {
              visible = true;
              break;
            }
          }
          return visible;
        },

        /**
         * Add separator
         * @param {boolean} extra - add it in extra action list ??
         */
        addSeparator: function(extra) {
          var widgets = this._actionWidgets;
          var line = cls.WidgetFactory.createWidget("HLine", this.getBuildParameters());
          line.setEnabled(false);
          if (extra) {
            widgets = this._extraActionWidgets;
            widgets.set(line.getRootClassName(), line);
          }
          this.addChildWidget(line);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ContextMenu', cls.ContextMenuWidget);
  });
