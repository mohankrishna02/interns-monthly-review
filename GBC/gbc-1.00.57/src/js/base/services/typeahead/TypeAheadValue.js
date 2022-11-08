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

modulum('TypeAheadValue', ['TypeAheadCommand'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * TypeAhead field value change
     * This class updates the value of a widget
     * @class TypeAheadValue
     * @memberOf classes
     * @extends classes.TypeAheadCommand
     */
    cls.TypeAheadValue = context.oo.Class(cls.TypeAheadCommand, function($super) {
      return /** @lends classes.TypeAheadValue.prototype */ {
        __name: "TypeAheadValue",

        /** @type {?string} */
        _newValue: null,
        /** @type {boolean} */
        _canBeExecuted: true,

        /**
         * @param {classes.VMApplication} app owner
         * @param {classes.NodeBase} node - target node
         * @param {string} newValue - current value of the node
         * @param {boolean} [canBeExecuted] - true if the current command can be executed, false otherwise
         */
        constructor: function(app, node, newValue, canBeExecuted) {
          $super.constructor.call(this, app, node);
          this._newValue = newValue;
          this._canBeExecuted = canBeExecuted;
        },

        /**
         * @inheritDoc
         */
        checkIntegrity: function() {
          var ok = false;

          if (this._node && this._node.getController()) {

            // if value has not changed no need to check focusVMNode for integrity
            if (!this._hasValueChanged(this._node.getController())) {
              return $super.checkIntegrity.call(this);
            }

            var focusedVMNode = this._app.getFocusedVMNode();

            // integrity is ok if:
            // value node is in the focused table
            ok = (this._node.getAncestor("Table") === focusedVMNode);
            // value node is in the focused matrix
            ok = ok || (this._node.getAncestor("Matrix") === focusedVMNode);
            // value node is in a webcomponent (this a special case because value can be send even if webcomponent has the focus, specially when it is not active
            ok = ok || (this._node.getController() instanceof cls.WebComponentController);
            // or if value node is the focused one
            ok = ok || (focusedVMNode === this._node);
          }

          return ok && $super.checkIntegrity.call(this);
        },

        /**
         * @inheritDoc
         */
        execute: function() {
          var ctrl = this._node.getController();

          if (ctrl) {
            if (this._hasValueChanged(ctrl)) {
              var valueObj = {
                value: this._newValue,
              };
              var event = new cls.VMConfigureEvent(this._node.getId(), valueObj);
              return {
                processed: true,
                vmEvents: [event]
              };
            }
          }
          return {
            processed: false,
            vmEvents: []
          };
        },

        /**
         * @inheritDoc
         */
        rollback: function() {
          $super.rollback.call(this);
          if (this._node) {
            var ctrl = this._node.getController();
            if (ctrl && !(ctrl instanceof cls.WebComponentController)) { // TODO why ? can you explain
              var widget = ctrl.getWidget();
              if (widget) {
                widget.setValue(this._node.attribute('value'), true);
              }
            }
          }
        },

        /**
         * Checks if the value has changed
         * @returns {boolean} true if the value has changed, false otherwise
         * @private
         */
        _hasValueChanged: function(controller) {
          return this._newValue !== controller._getAuiValue();
        },

        /**
         * @inheritDoc
         */
        canBeExecuted: function() {
          return this._canBeExecuted;
        }
      };
    });
  }
);
