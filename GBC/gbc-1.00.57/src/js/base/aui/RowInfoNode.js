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

modulum('RowInfoNode', ['StandardNode', 'NodeFactory'],
  function(context, cls) {
    /**
     * @class RowInfoNode
     * @memberOf classes
     * @extends classes.StandardNode
     */
    cls.RowInfoNode = context.oo.Class(cls.StandardNode, function() {
      return /** @lends classes.RowInfoNode.prototype */ {
        /**
         * @inheritDoc
         */
        _createController: function() {
          return cls.ControllerFactory.create(this._tag, {
            anchor: this,
            parent: this._parent,
            table: this._parent._parent,
            ui: this.getApplication().getNode(0)
          });
        }
      };
    });
    cls.NodeFactory.register("RowInfo", cls.RowInfoNode);
  });
