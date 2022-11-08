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

modulum('ScrollGridLineController', ['EventListener'],
  function(context, cls) {
    /**
     * @class ScrollGridLineController
     * @memberOf classes
     * @extends classes.EventListener
     */
    cls.ScrollGridLineController = context.oo.Class(cls.EventListener, function($super) {
      return /** @lends classes.ScrollGridLineController.prototype */ {
        __name: "ScrollGridLineController",
        _widget: null,
        _index: -1,
        _scrollGridNode: null,
        _childrenControllers: [],

        constructor: function(scrollGridNode, index) {
          this._scrollGridNode = scrollGridNode;
          this._index = index;
          this._widget = cls.WidgetFactory.createWidget('StretchableScrollGridLine',
            scrollGridNode.getController().getWidget().getBuildParameters());
          this._widget.when(context.constants.widgetEvents.click, this._onClick.bind(this));
          var children = this._scrollGridNode.getChildren();
          for (var i = 0; i < children.length; ++i) {
            this._createControllers(children[i], this._widget);
          }
        },

        _applyBehaviors: function() {
          for (var i = 0; i < this._childrenControllers.length; i++) {
            var ctrl = this._childrenControllers[i];
            if (ctrl._behaviors !== null) {
              ctrl.applyBehaviors(null, true);
            }
          }
        },

        _createControllers: function(node, parentWidget) {
          var ctrl = null;
          var widget = null;
          if (node.getTag() === "Matrix") {
            if (node._controller === null) {
              node._controller = node._createController();
            }
            var valueList = node.getFirstChild("ValueList");
            if (valueList) {
              var valueNode = valueList.getChildren()[this._index];
              ctrl = valueNode.getController();
              if (!ctrl) {
                ctrl = valueNode._createController({
                  scrollGridLineController: this
                });
                valueNode._controller = ctrl;
                widget = ctrl.createWidget();
                ctrl.applyBehaviors();
                parentWidget.addChildWidget(widget);
                ctrl._attachWidget();

                this._childrenControllers.push(ctrl);
              }
            }
          } else {
            var ctrlGroup = null;
            var nodeController = node._controller;
            if (!nodeController) {
              ctrlGroup = new cls.ControllerGroup(node);
              node._controller = ctrlGroup;
            } else if (nodeController.isInstanceOf(cls.ControllerGroup)) {
              ctrlGroup = nodeController;
            } else {
              return; // if controller is already created and it is not a ControllerGroup, nothing to do
            }
            ctrl = node._createController({
              scrollGridLineController: this
            });
            if (ctrl) {
              ctrlGroup.addController(ctrl);
              widget = ctrl.createWidget();
              ctrl.applyBehaviors();
              parentWidget.addChildWidget(widget);
              ctrl._attachWidget();
              if (node.getTag() === "HBox" || node.getTag() === "Group") {
                var nodeChildren = node.getChildren();
                for (var i = 0; i < nodeChildren.length; ++i) {
                  this._createControllers(nodeChildren[i], widget);
                }
              }
            }
          }
        },

        destroy: function() {
          this._recursiveRemove(this._scrollGridNode);
          this._widget.destroy();
        },

        _recursiveRemove: function(node) {
          var children = node.getChildren();
          for (var i = 0; i < children.length; ++i) {
            this._recursiveRemove(children[i], this._index);
          }
          if (node._controller) {
            if (node._controller instanceof cls.ControllerGroup) {
              var ctrls = node._controller.getControllers();
              ctrls[this._index].destroy();
              ctrls.splice(this._index);
            } else if (node.getTag() === "Value" && node.getIndex() === this._index) {
              node._controller.destroy();
              node._controller = null;
            }
          }
        },

        getWidget: function() {
          return this._widget;
        },

        getIndex: function() {
          return this._index;
        },

        _onClick: function(event, domEvent) {
          var currentRow = this._scrollGridNode.attribute("currentRow");
          var newCurrentRow = this._scrollGridNode.attribute("offset") + this._index;
          if (newCurrentRow !== currentRow) {
            this.getWidget().getParentWidget().setCurrentRow(this._index);
            this._scrollGridNode.getController().setCurrentRow(this._index);
            this._scrollGridNode.getApplication().typeahead.focus(this._scrollGridNode);
          }
        },
      };
    });
  });
