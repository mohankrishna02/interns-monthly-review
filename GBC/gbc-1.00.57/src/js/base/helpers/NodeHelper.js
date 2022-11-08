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

modulum('NodeHelper',
  function(context, cls) {
    /**
     * Memory implementation of an AUI Node.
     *
     * Reflects the state of the AUI node in the DVM.
     *
     * @namespace classes.NodeHelper
     * @extends classes.EventListener
     */
    cls.NodeHelper = context.oo.StaticClass(function() {
      return /** @lends classes.NodeHelper */ {
        /**
         *
         * @param {string} nodeTag
         */
        getDefaultAttributes: function(nodeTag) {
          var result = context.constants.nodeAttributes[nodeTag];
          return result || [];
        },
        /**
         *
         * @param {classes.NodeBase} node
         * @param {string} attributeName
         */
        setAttributeDefaultValue: function(node, attributeName) {
          node._attributes[attributeName] = this.getAttributeDefaultValue(node._tag, attributeName);
        },
        /**
         *
         * @param {string} nodeTag
         * @param {string} attributeName
         */
        getAttributeDefaultValue: function(nodeTag, attributeName) {
          var value = null;
          var defaultsForTag = context.constants.attributeDefaultValuesByNodeType[nodeTag];
          var defaultsForAny = context.constants.attributeDefaultValues;

          if (defaultsForTag && defaultsForTag.hasOwnProperty(attributeName)) {
            value = defaultsForTag[attributeName];
          } else {
            value = defaultsForAny[attributeName];
          }
          return value;
        },
        /**
         *
         * @param {classes.NodeBase} node
         * @param {classes.NodeBase=} originNode
         * @param [boolean=} useAUIPositionToAttachWidget - use position in AUI tree parent node to add widget at the correct position
         */
        addToParentWidget: function(node, originNode, useAUIPositionToAttachWidget) {
          originNode = originNode || node;
          if (!originNode.getController()) {
            this.failed("adding from node without controller", originNode._tag);
          } else if (!originNode.getController().getWidget()) {
            this.failed("adding from node without widget", originNode._tag);
          } else {
            node = node.getParentNode();
            if (!node) {
              if (originNode._id > 0) { // Don't display error for UserInterface which doesn't have parent
                this.failed("could not find parent widget", originNode._tag);
              }
            } else {
              if (!node.getController()) {
                this.addToParentWidget(node, originNode, useAUIPositionToAttachWidget);
              } else {
                if (!node.getController().getWidget()) {
                  this.addToParentWidget(node, originNode, useAUIPositionToAttachWidget);
                } else {
                  if (!node.getController().getWidget().addChildWidget) {
                    this.failed("Parent widget cannot hosts children");
                  } else {
                    var opt;
                    if (useAUIPositionToAttachWidget) {
                      opt = {};
                      opt.position = originNode.getIndex();
                    }
                    node.getController().getWidget().addChildWidget(originNode.getController().getWidget(), opt);
                  }
                }
              }
            }
          }
        },
        /**
         *
         * @param msg
         * @params {*[]} params
         */
        failed: function(msg, param) {
          gbc.error(msg, param);
        }
      };
    });
  });
