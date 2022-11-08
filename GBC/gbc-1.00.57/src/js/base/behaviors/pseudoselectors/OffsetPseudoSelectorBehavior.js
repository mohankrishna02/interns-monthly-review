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

modulum('OffsetPseudoSelectorBehavior', ['PseudoSelectorBehaviorBase'],
  function(context, cls) {
    /**
     * @class OffsetPseudoSelectorBehavior
     * @memberOf classes
     * @extends classes.PseudoSelectorBehaviorBase
     */
    cls.OffsetPseudoSelectorBehavior = context.oo.Singleton(cls.PseudoSelectorBehaviorBase, function($super) {
      return /** @lends classes.OffsetPseudoSelectorBehavior.prototype */ {
        __name: "OffsetPseudoSelectorBehavior",

        offsetChanged: function(controller, data, event, eventData) {
          var node = controller.getAnchorNode();
          if (node._pseudoSelectorsUsedInSubTree.even ||
            node._pseudoSelectorsUsedInSubTree.odd) {
            this.setStyleBasedBehaviorsDirty(node);
          }
        },

        _attach: function(controller, data) {
          var node = controller.getAnchorNode();
          data.onOffsetAttributeChanged = node.onAttributeChanged('offset', this.offsetChanged.bind(this, controller, data));
        },

        _detach: function(controller, data) {
          if (data.onOffsetAttributeChanged) {
            data.onOffsetAttributeChanged();
            data.onOffsetAttributeChanged = null;
          }
        }
      };
    });
  });
