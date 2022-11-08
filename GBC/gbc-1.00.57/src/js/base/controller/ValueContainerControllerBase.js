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

modulum('ValueContainerControllerBase', ['ControllerBase'],
  function(context, cls) {
    /**
     * Base controller for an AUI node.
     * Manages client side life cycle representation of the node.
     * @class ValueContainerControllerBase
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.ValueContainerControllerBase = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.ValueContainerControllerBase.prototype */ {
        __name: "ValueContainerControllerBase",

        /**
         * @inheritDoc
         */
        _initBehaviors: function() {
          $super._initBehaviors.call(this);
          if (this.isInStack() && !(this.isInMatrix() || this.isInTable())) {
            this._addBehavior(cls.StackLabelVMBehavior);
          }
        },

        /**
         * Creates a new widget depending on the dialog type
         * @returns {classes.WidgetBase} the widget
         */
        createWidget: function() {
          if (!this._widget && this.autoCreateWidget()) {
            var dialogType = null;

            // Determine the widget kind of a valueNode
            if (this.getAnchorNode()) {
              dialogType = this.getAnchorNode().attribute('dialogType');
            }
            if (!dialogType && this.getNodeBindings().decorator) {
              dialogType = this.getNodeBindings().decorator.attribute('dialogType');
            }
            if (!dialogType && this.getNodeBindings().container) {
              dialogType = this.getNodeBindings().container.attribute('dialogType');
            }

            var type = this._getWidgetType(dialogType);
            this._widgetKind = dialogType;
            this._widgetType = type;

            this._widget = this._createWidget(type);
          }
          return this._widget;
        },

        /**
         *
         * @inheritDoc
         * @protected
         * @virtual
         */
        _createWidget: function(type) {
          return cls.WidgetFactory.createWidget(type, {
            appHash: this.getAnchorNode().getApplication().applicationHash,
            appWidget: this.getAnchorNode().getApplication().getUI().getWidget(),
            auiTag: this.getAnchorNode().getId(),
            inTable: this.isInTable(),
            inFirstTableRow: this.isInFirstTableRow(),
            inMatrix: this.isInMatrix(),
            inScrollGrid: this.isInScrollGrid()
          }, this.getNodeBindings().decorator);
        },

        /**
         * @inheritDoc
         */
        autoCreateWidget: function() {

          if (this.isInTable() && this._autoCreateWidget) {
            // In table if the value index is greater than table size, it's not necessary to create a widget (optim)
            var tableNode = this.getNodeBindings().container.getParentNode();
            if (tableNode.attribute("offset") > 0) {
              return true;
            }

            var tableSize = tableNode.attribute("size");
            var valueIndex = this.getAnchorNode().getParentNode().getChildren().indexOf(this.getAnchorNode());

            if (valueIndex >= tableSize) {
              var autoCreate = (tableSize === 0 && valueIndex === 0);
              this._useAUIPositionToAttachUI = !autoCreate;
              return autoCreate;
            }
          }

          return $super.autoCreateWidget.call(this);
        },

        /**
         * Strategy method which returns widget value in VM ready format
         * @returns {string} the widget value
         * @protected
         */
        _getWidgetValue: function() {
          var decoratorNode = this.getNodeBindings().decorator;
          var widget = this.getWidget();
          var value = widget.getValue();

          if (value === null || value === undefined) {
            value = "";
          } else {
            value = value.toString();
          }
          value = this._shiftConversion(value, widget, decoratorNode);

          // Validate value, if not valid, rollback to old VM's value!
          if (widget instanceof cls.FieldWidgetBase && !widget.validateValue()) {
            value = widget._oldValue;
            widget.setValue(value);
          }
          return value;
        },

        /**
         * Strategy method which returns AUI value in VM ready format
         * @returns {string} the AUI value
         * @protected
         */
        _getAuiValue: function() {
          var valueNode = this.getNodeBindings().anchor;
          return valueNode.attribute("value").toString();
        },

        /**
         * Get the value depending of the shift attribute
         * @param {string} value - value to process
         * @param {classes.WidgetBase} widget - concerned widget
         * @param {classes.NodeBase} decoratorNode - concerned Node
         * @return {string} - the updated value
         * @private
         */
        _shiftConversion: function(value, widget, decoratorNode) {
          // manage upshift & downshift case
          if (decoratorNode && decoratorNode.isAttributeSetByVM('shift')) {
            var shiftAttr = decoratorNode.attribute('shift');
            if (this.getWidget() && this.getWidget().getTextTransform) {
              shiftAttr = this.getWidget().getTextTransform();
            }
            if (shiftAttr !== "none" && (widget.isEditing && widget.isEditing())) {
              switch (shiftAttr) {
                case 'up':
                  value = value.toUpperCase();
                  break;
                case 'down':
                  value = value.toLowerCase();
                  break;
              }
            }
          }
          return value;
        },

        /**
         * @inheritDoc
         */
        sendWidgetValue: function(dirty) {
          var anchorNode = this.getAnchorNode();
          var widget = this.getWidget();
          var widgetValue = this._getWidgetValue();
          var auiValue = anchorNode.attribute('value');

          // We send value:
          // - dirty==false --> always send value
          // - dirty==true  --> send value only if widget has been edited or if widget value is different from aui value
          if (!dirty || (widget && widget instanceof cls.FieldWidgetBase && widget.isEditing()) || (auiValue !== widgetValue)) {
            anchorNode.getApplication().typeahead.value(anchorNode, widgetValue);
          }
        },

        /**
         * @inheritDoc
         */
        sendWidgetCursors: function(dirty) {
          var widget = this.getWidget();
          if (!widget || !widget.hasCursors()) {
            return;
          }
          if (!dirty || widget.isEditing()) {
            var cursors = widget.getCursors();
            var anchorNode = this.getAnchorNode();
            anchorNode.getApplication().typeahead.cursors(anchorNode, cursors.start, cursors.end);
          }
        }
      };
    });
  });
