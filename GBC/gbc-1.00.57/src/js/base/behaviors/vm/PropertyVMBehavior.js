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

modulum('PropertyVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Behavior controlling the widget's Property
     * @class PropertyVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.PropertyVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.PropertyVMBehavior.prototype */ {
        __name: "PropertyVMBehavior",

        _attrChangedHandlers: [],
        /**
         * Updates the widget's visibility depending on the AUI tree information
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget._setProperty) {
            var webComponentNode = controller.getNodeBindings().decorator;
            var children = webComponentNode.getChildren();
            if (children.length > 0) {
              var property = this._propertyToJson(children[0]);
              widget._setProperty(JSON.stringify(property));
            }
          }
        },

        _attach: function(controller, data) {
          var node = controller.getNodeBindings().decorator;
          data.nodeCreatedHandler = node.onNodeCreated(this._onNodeCreated.bind(this, controller, data), "Property");
          var webComponentNode = controller.getNodeBindings().decorator;
          var children = webComponentNode.getDescendants("Property");
          if (children.length > 0) {
            children.forEach(function(propChild) {
              this._attrChangedHandlers.push(propChild.onAttributeChanged("value", function(event, node, data) {
                this._apply(controller, data);
              }.bind(this)));

            }.bind(this));
          }
        },

        _detach: function(controller, data) {
          this._attrChangedHandlers.forEach(function(attrChangedHandle) {
            attrChangedHandle();
          });
          this._attrChangedHandlers.length = 0;
          if (data.nodeCreatedHandler) {
            data.nodeCreatedHandler();
            data.nodeCreatedHandler = null;
          }
        },

        _onNodeCreated: function(controller, data, event, src, node) {
          node.onNodeCreated(this._onNodeCreated.bind(this, controller, data));
          this._attrChangedHandlers.push(node.onAttributeChanged("value", function(event, node, data) {
            this._apply(controller, data);
          }.bind(this)));
          this._apply(controller, data);
        },

        /**
         * Convert PropertyDict node to JSON property
         * @param node
         * @returns {{}}
         * @private
         */
        _propertyToJson: function(node) {
          var jsonProperties = {};
          var childNode = null;
          var children = node.getChildren();
          var count = children && children.length || 0;
          for (var i = 0; i < count; i++) {
            childNode = children[i];
            if (childNode._tag === "Property") {
              jsonProperties[childNode.attribute("name")] = childNode.attribute("value");
            } else if (childNode._tag === "PropertyArray") {
              jsonProperties[childNode.attribute("name")] = this._propertyArrayToJson(childNode);
            } else if (childNode._tag === "PropertyDict") {
              jsonProperties[childNode.attribute("name")] = this._propertyToJson(childNode);
            }
          }
          return jsonProperties;
        },

        /**
         * Convert PropertyArray node to JSON property
         * @param node
         * @returns {Array}
         * @private
         */
        _propertyArrayToJson: function(node) {
          var propertyArray = [];
          var childNode = null;
          var children = node.getChildren();
          var count = children && children.length || 0;
          for (var i = 0; i < count; i++) {
            childNode = children[i];
            propertyArray.push(childNode.attribute("value"));
          }
          return propertyArray;
        }
      };
    });
  });
