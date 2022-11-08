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

modulum('FormRelatedHiddenVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Behavior controlling the ToolBar's visibility
     * @class FormRelatedHiddenVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.FormRelatedHiddenVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.FormRelatedHiddenVMBehavior.prototype */ {
        __name: "FormRelatedHiddenVMBehavior",

        watchedAttributes: {
          parent: ['hidden'],
        },

        /**
         * Updates the widget's visibility depending on the AUI tree information
         */
        _apply: function(controller, data) {
          var anchorNode = controller.getAnchorNode();
          var formNode = anchorNode.getParentNode();
          var windowNode = formNode.getParentNode();
          var hidden = formNode.attribute('hidden');
          var visible = hidden === context.constants.visibility.visible;
          var inDisplayedWindow = windowNode.getController().getWidget() === context.HostService.getCurrentWindow();
          var toolBarInVisiblePosition = anchorNode.getTag() === 'ToolBar' ? anchorNode.getStyleAttribute('toolBarPosition') !==
            'none' : true;
          var widget = controller.getWidget();
          widget.setHidden(!inDisplayedWindow || !(visible && toolBarInVisiblePosition));
        }
      };
    });
  });
