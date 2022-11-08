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

modulum('WindowNode', ['StandardNode', 'NodeFactory'],
  function(context, cls) {
    /**
     * @class WindowNode
     * @memberOf classes
     * @extends classes.StandardNode
     */
    cls.WindowNode = context.oo.Class(cls.StandardNode, function() {
      return /** @lends classes.WindowNode.prototype */ {

        isCurrentWindowNode: function() {
          var uiNode = this.getApplication().getNode(0);
          return uiNode.attribute('currentWindow') === this.getId();
        },

        isTraditional: function() {
          var uiNode = this.getApplication().getNode(0);
          if (uiNode.attribute("uiMode") === "traditional") {
            var formNode = this.getFirstChild("Form");
            if (formNode) {
              var screenNode = formNode.getFirstChild("Screen");
              if (screenNode) {
                return true;
              }
            }
          }
          return false;
        },

        getFirstTraditionalWindow: function() {
          var children = this.getApplication().getNode(0).getChildren();
          for (var i = 0; i < children.length; ++i) {
            var child = children[i];
            if (child.getTag() === "Window" && child.isTraditional()) {
              return child;
            }
          }
          return null;
        },

        getActiveDialog: function() {
          var length = this._children.length;
          for (var i = length - 1; i >= 0; --i) {
            var child = this._children[i];
            if (child._tag === 'Menu' || child._tag === 'Dialog') {
              if (child.attribute('active') === 1) {
                return child;
              }
            }
          }
        },

        isModal: function() {
          var windowTypeAttr = this.getStyleAttribute("windowType");
          return windowTypeAttr === "modal" || windowTypeAttr === "popup";
        },
        _setProcessingStyle: function(processing) {
          var widget = this._controller && this._controller.getWidget();
          if (widget && widget._setProcessingStyle) {
            widget._setProcessingStyle(processing);
          }
        }
      };
    });
    cls.NodeFactory.register("Window", cls.WindowNode);
  });
