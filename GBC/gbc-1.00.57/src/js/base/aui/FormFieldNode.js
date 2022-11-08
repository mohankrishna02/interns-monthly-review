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

modulum('FormFieldNode', ['NodeBase', 'NodeFactory'],
  function(context, cls) {
    /**
     * @class FormFieldNode
     * @memberOf classes
     * @extends classes.NodeBase
     */
    cls.FormFieldNode = context.oo.Class(cls.NodeBase, function() {
      return /** @lends classes.FormFieldNode.prototype */ {
        /**
         * @inheritDoc
         */
        _createController: function() {
          var decoratorNode = this._children[0];
          var controllerType = decoratorNode && decoratorNode._tag;
          return cls.ControllerFactory.create(controllerType, {
            anchor: this,
            parent: this._parent,
            ui: this.getApplication().getNode(0),
            decorator: decoratorNode,
            container: this
          });
        },
        /**
         * @inheritDoc
         */
        _createChildrenControllers: function(_queue) {},

        /**
         * @inheritDoc
         */
        getStyleAttribute: function(styleAttr, forcedPseudoSelectors) {
          // On FormFields, take the decorator node into account
          var decoratorNode = this.getChildren()[0];
          var pseudoSelectors = forcedPseudoSelectors || this._computePseudoSelectors();
          return decoratorNode._getStyleAttributeImpl(styleAttr, pseudoSelectors);
        }
      };
    });
    cls.NodeFactory.register("FormField", cls.FormFieldNode);
  });
