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

modulum('StandardNode', ['NodeBase'],
  function(context, cls) {
    /**
     * AUI Node default
     *
     * @class StandardNode
     * @memberOf classes
     * @extends classes.NodeBase
     */
    cls.StandardNode = context.oo.Class(cls.NodeBase, function() {
      return /** @lends classes.StandardNode.prototype */ {
        __name: "StandardNode",
        /**
         *
         * @inheritDoc
         */
        _createController: function() {
          return cls.ControllerFactory.create(this._tag, {
            anchor: this,
            parent: this._parent,
            ui: this.getApplication().getNode(0)
          });
        }
      };
    });
  });
