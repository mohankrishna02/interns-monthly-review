/// FOURJS_START_COPYRIGHT(D,2019)
/// Property of Four Js*
/// (c) Copyright Four Js 2019, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('TableActionsNode', ['StandardNode', 'NodeFactory'],
  function(context, cls) {
    /**
     * @class TableActionsNode
     * @memberOf classes
     * @extends classes.StandardNode
     */
    cls.TableActionsNode = context.oo.Class(cls.StandardNode, function($super) {
      return /** @lends classes.TableActionsNode.prototype */ {

        /**
         * @inheritDoc
         */
        createController: function(_queue, force) {
          // force creation of controller and children controllers
          $super.createController.call(this, _queue, true);
        },

        /**
         * @inheritDoc
         */
        autoCreateChildrenControllers: function() {
          return true;
        }
      };
    });
    cls.NodeFactory.register("TableActions", cls.TableActionsNode);
  });
