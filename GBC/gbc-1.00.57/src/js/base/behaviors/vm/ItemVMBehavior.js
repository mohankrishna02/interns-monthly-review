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

modulum('ItemVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Behavior controlling the completer items
     * @class ItemVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.ItemVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.ItemVMBehavior.prototype */ {
        __name: "ItemVMBehavior",

        /**
         * Updates the widget's visibility depending on the AUI tree information
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();

          if (widget && widget.setChoices) {
            var children = controller.getNodeBindings().decorator.getChildren(),
              needUpdate = data.widget !== widget || (!data.lastItems || data.lastItems.length !== children.length ||
                Boolean(data.lastItems.find(function(item, i) {
                  return children[i].attribute("name") !== item.value ||
                    children[i].attribute("text") !== item.text;
                })));

            if (needUpdate) {
              data.widget = widget;
              data.lastItems = children.map(function(child) {
                return {
                  text: child.attribute("text"),
                  value: child.attribute("name")
                };
              });
              widget.setChoices(data.lastItems);
            }
          }
        },

        _onItemsCountChanged: function(controller, data, event, src, node) {
          data.dirty = true;
        },

        /**
         * @inheritDoc
         * @protected
         */
        _attach: function(controller, data) {
          var decoratorNode = controller.getNodeBindings().decorator;
          //on new Item node
          data._onNodeCreateHandle = decoratorNode.onNodeCreated(this._onItemsCountChanged.bind(this, controller, data), "Item");
          data._onNodeRemoveHandle = decoratorNode.onNodeRemoved(this._onItemsCountChanged.bind(this, controller, data), "Item");
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
