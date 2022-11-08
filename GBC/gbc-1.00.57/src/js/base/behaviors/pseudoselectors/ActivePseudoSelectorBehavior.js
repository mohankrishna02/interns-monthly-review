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

modulum('ActivePseudoSelectorBehavior', ['PseudoSelectorBehaviorBase'],
  function(context, cls) {
    /**
     * @class ActivePseudoSelectorBehavior
     * @memberOf classes
     * @extends classes.PseudoSelectorBehaviorBase
     */
    cls.ActivePseudoSelectorBehavior = context.oo.Singleton(cls.PseudoSelectorBehaviorBase, function($super) {
      return /** @lends classes.ActivePseudoSelectorBehavior.prototype */ {
        __name: "ActivePseudoSelectorBehavior",

        activeChanged: function(controller, data, event, eventData) {
          var node = controller.getAnchorNode();
          if (node._pseudoSelectorsUsedInSubTree.active ||
            node._pseudoSelectorsUsedInSubTree.inactive) {
            this.setStyleBasedBehaviorsDirty(node);
          }
        },

        _attach: function(controller, data) {
          var node = controller.getNodeBindings().container || controller.getAnchorNode();
          data.onActiveAttributeChanged = node.onAttributeChanged('active', this.activeChanged.bind(this, controller, data));
        },

        _detach: function(controller, data) {
          if (data.onActiveAttributeChanged) {
            data.onActiveAttributeChanged();
            data.onActiveAttributeChanged = null;
          }
        }
      };
    });
  }
);
