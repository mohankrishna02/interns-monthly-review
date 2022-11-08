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

modulum('TableColumnNode', ['NodeBase', 'NodeFactory'],
  function(context, cls) {
    /**
     * @class TableColumnNode
     * @memberOf classes
     * @extends classes.NodeBase
     */
    cls.TableColumnNode = context.oo.Class(cls.NodeBase, function() {
      return /** @lends classes.TableColumnNode.prototype */ {
        /**
         * @inheritDoc
         */
        _createChildrenControllers: function(_queue) {
          for (var i = 1; i < this._children.length; i++) {
            var child = this._children[i];
            if (child._tag === "ValueList") {
              for (var j = 0; j < child._children.length; j++) { // create value controller
                child._children[j].createController(_queue);
              }
            } else {
              child.createController(_queue);
            }
          }
        },
        /**
         * @inheritDoc
         */
        _createController: function() {
          var decoratorNode = this._children[0];

          return cls.ControllerFactory.create(this._tag, {
            anchor: this,
            parent: this._parent,
            ui: this.getApplication().getNode(0),
            decorator: decoratorNode
          });
        }
      };
    });
    cls.NodeFactory.register("TableColumn", cls.TableColumnNode);
  });
