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

modulum('ValueNode', ['NodeBase', 'NodeFactory'],
  function(context, cls) {
    /**
     * @class ValueNode
     * @memberOf classes
     * @extends classes.NodeBase
     */
    cls.ValueNode = context.oo.Class(cls.NodeBase, function($super) {
      return /** @lends classes.ValueNode.prototype */ {
        /**
         * @inheritDoc
         */
        _createController: function() {
          var containerNode = this._parent && this._parent._parent;
          var decoratorNode = containerNode && containerNode._children[0];
          var controllerType = decoratorNode && decoratorNode._tag;
          var tableNode = containerNode._tag === 'TableColumn' ? containerNode._parent : undefined;
          return cls.ControllerFactory.create(controllerType, {
            anchor: this,
            parent: this._parent,
            ui: this.getApplication().getNode(0),
            decorator: decoratorNode,
            container: containerNode,
            table: tableNode,
            treeItem: null
          });
        },

        /**
         * @inheritDoc
         */
        getStyleAttribute: function(styleAttr, forcedPseudoSelectors) {
          // On value nodes, the styles should be interpreted as if they where asked on the decorator node
          var decoratorNode = this._parent._parent._children[0];
          var pseudoSelectors = forcedPseudoSelectors || this._computePseudoSelectors();
          return decoratorNode._getStyleAttributeImpl(styleAttr, pseudoSelectors);
        },

        /**
         * @inheritDoc
         */
        _populatePseudoSelectors: function(pseudoSelectors, focusedNodeIdRef) {
          var container = this._parent._parent;
          var positionHolder = container;
          var index = this.getIndex();
          var offset = null;

          if (container.getTag() === 'TableColumn') {
            var table = container._parent;
            if (table.getId() === focusedNodeIdRef) {
              pseudoSelectors.focus = false;
              var dialogType = container.attribute('dialogType');
              if (dialogType === "Input" || dialogType === "InputArray") {
                var currentRow = table.attribute('currentRow');
                offset = table.attribute('offset');
                if (currentRow - offset === index) {
                  var currentColumn = table.attribute('currentColumn');
                  if (currentColumn === container.getIndex()) {
                    pseudoSelectors.focus = true;
                  }
                }
              }
            }
            positionHolder = table;
          }

          offset = positionHolder.attribute('offset');
          if ((offset + index + 1) % 2) {
            pseudoSelectors.odd = true;
          } else {
            pseudoSelectors.even = true;
          }
          return $super._populatePseudoSelectors.call(this, pseudoSelectors, focusedNodeIdRef);
        }
      };
    });
    cls.NodeFactory.register("Value", cls.ValueNode);
  });
