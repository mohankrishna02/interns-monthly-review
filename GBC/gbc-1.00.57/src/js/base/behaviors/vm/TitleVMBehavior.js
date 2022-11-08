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

modulum('TitleVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class TitleVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.TitleVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.TitleVMBehavior.prototype */ {
        __name: "TitleVMBehavior",

        watchedAttributes: {
          anchor: ['comment', 'name', 'actionIdRef'],
          decorator: ['comment', 'actionIdRef']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setTitle) {
            var bindings = controller.getNodeBindings();
            var commentNode = bindings.decorator ? bindings.decorator : bindings.anchor;
            var isDefined = commentNode.isAttributeSetByVM('comment');
            var text = commentNode.attribute('comment');
            if (!isDefined && controller.getAnchorNode().getTag() !== 'StartMenuCommand') {
              var actionName = commentNode.attribute('name');
              if (actionName) {
                var actionNode = commentNode.getApplication().getActionApplicationService().getActiveDialogAction(actionName);
                if (actionNode) {
                  isDefined = actionNode.isAttributeSetByVM('comment');
                  text = actionNode.attribute('comment');
                }
              }
            }
            if (isDefined) {
              widget.setTitle(text);
            }
          }
        }
      };
    });
  });
