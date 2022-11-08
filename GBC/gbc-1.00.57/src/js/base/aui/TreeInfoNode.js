/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('TreeInfoNode', ['NodeBase', 'NodeFactory'],
  function(context, cls) {
    /**
     * @class TreeInfoNode
     * @memberOf classes
     * @extends classes.NodeBase
     */
    cls.TreeInfoNode = context.oo.Class(cls.NodeBase, function($super) {

      return /** @lends classes.TreeInfoNode.prototype */ {
        constructor: function(parent, tag, id, attributes, app) {
          // when a treeInfo node is created must immediately inform parent table node
          if (parent.getWidget()) {
            // If this node is created while the table has already built its widget, stop the application
            window.requestAnimationFrame(function() {
              parent.getApplication().stop("Can't dynamically transform a table to a TreeView");
            });
          } else {
            parent._isTree = true;
          }
          $super.constructor.call(this, parent, tag, id, attributes, app);
        },
      };

    });
    cls.NodeFactory.register("TreeInfo", cls.TreeInfoNode);
  });
