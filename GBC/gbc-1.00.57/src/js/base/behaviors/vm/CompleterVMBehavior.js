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

modulum('CompleterVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Behavior controlling the completer items
     * @class CompleterVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.CompleterVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.CompleterVMBehavior.prototype */ {
        __name: "CompleterVMBehavior",

        watchedAttributes: {
          anchor: ['value']
        },

        /**
         * Updates the widget's visibility depending on the AUI tree information
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var completerNode = controller.getNodeBindings().completer;
          var anchorNode = controller.getAnchorNode();
          var focusedNode = anchorNode.getApplication().getFocusedVMNodeAndValue(true);
          var hasFocus = focusedNode === anchorNode;
          if (hasFocus && completerNode && widget) { // only display completer if widget has focus and has completer
            if (widget.addCompleterWidget) {
              widget.addCompleterWidget();
            }

            var completerWidget = null;
            if (widget.getCompleterWidget) {
              completerWidget = widget.getCompleterWidget();
            }

            if (completerWidget) {

              var children = completerNode.getChildren();
              var size = completerNode.attribute("size");
              completerWidget.clearChoices();
              completerWidget.setSize(size);

              for (var i = 0; i < size; i++) {
                completerWidget.addChoice(children[i].attribute("text"));
              }

              if (size > 0) {
                completerWidget.show();
              } else {
                completerWidget.hide();
              }
            }
          }
        },

        /**
         * @inheritDoc
         * @protected
         */
        _attach: function(controller, data) {
          var decoratorNode = controller.getNodeBindings().decorator;

          //on new Item node
          data._onNodeCreateHandle = decoratorNode.onNodeCreated(this._onItemsCountChanged.bind(this, controller, data),
            "Item");
          data._onNodeRemoveHandle = decoratorNode.onNodeRemoved(this._onItemsCountChanged.bind(this, controller, data),
            "Item");
        },

        /**
         * Handler executed each time a node is created or removed
         * @param controller
         * @param data
         * @param event
         * @param src
         * @param node
         * @private
         */
        _onItemsCountChanged: function(controller, data, event, src, node) {
          var nodeBindings = controller.getNodeBindings();

          if (nodeBindings) {
            var completerNode = nodeBindings.completer;

            data._watchedAttributes = [{
              node: completerNode,
              attribute: 'size'
            }];
            for (var i = 0; i < completerNode._children.length; ++i) {
              var itemNode = completerNode._children[i];
              data._watchedAttributes.push({
                node: itemNode,
                attribute: 'text'
              });
            }
            data.dirty = true;
          }

        },

        /**
         * @inheritDoc
         * @protected
         */
        _detach: function(controller, data) {
          if (data._onNodeCreateHandle) {
            data._onNodeCreateHandle();
            data._onNodeCreateHandle = null;
          }
          if (data._onNodeRemoveHandle) {
            data._onNodeRemoveHandle();
            data._onNodeRemoveHandle = null;
          }
        }
      };
    });
  });
