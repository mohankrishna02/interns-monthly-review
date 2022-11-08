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

modulum('PseudoSelectorBehaviorBase', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class PseudoSelectorBehaviorBase
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.PseudoSelectorBehaviorBase = context.oo.Class(cls.BehaviorBase, function($super) {
      return /** @lends classes.PseudoSelectorBehaviorBase.prototype */ {
        __name: "PseudoSelectorBehaviorBase",
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {},

        /**
         * set node and all its descendants controllers dirty
         * @param {classes.NodeBase} rootNode main node
         */
        setStyleBasedBehaviorsDirty: function(rootNode) {
          rootNode.forThisAndEachDescendant(function(node) {
            var controller = node.getController();
            if (controller) {
              controller.setStyleBasedBehaviorsDirty();
            }
          });
        }
      };
    });
  });
