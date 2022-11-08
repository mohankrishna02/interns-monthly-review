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

modulum('TopMenuController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class TopMenuController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.TopMenuController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.TopMenuController.prototype */ {
        __name: "TopMenuController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          this._addBehavior(cls.StyleVMBehavior);
          // END WARNING

          // 4st behaviors
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          if (this.getAnchorNode().getParentNode().getTag() === 'Form') {
            this._addBehavior(cls.FormRelatedHiddenVMBehavior);
          }
          this._addBehavior(cls.BackgroundColorVMBehavior);

        },
        attachUI: function() {
          var parentNode = this.getAnchorNode().getParentNode();
          while (parentNode) {
            var controller = parentNode.getController();
            if (controller) {
              var widget = controller.getWidget();
              if (widget && widget.addTopMenu) {
                var containerWidget = widget;
                // only topmenu from modal is being added inside modal
                if (!parentNode.isModal || !parentNode.isModal()) { // if parent isn't a modal
                  containerWidget = this.getAnchorNode().getAncestor('UserInterface').getController().getWidget();
                }
                var isUnderForm = this.getAnchorNode().getParentNode().getTag() === 'Form';
                var order = isUnderForm ? 2 : 1;
                widget.addTopMenu(this.getWidget(), order, containerWidget);
                break;
              }
            }
            parentNode = parentNode.getParentNode();
          }
        },
        detachUI: function() {
          var winNode = this.getAnchorNode().getAncestor('Window');
          if (winNode) {
            var winWidget = winNode.getController().getWidget();
            winWidget.removeTopMenu(this.getWidget());
          }

          $super.detachUI.call(this);
        }
      };
    });
    cls.ControllerFactory.register("TopMenu", cls.TopMenuController);

  });
