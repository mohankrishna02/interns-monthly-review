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

modulum('TableImageVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class TableImageVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.TableImageVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.TableImageVMBehavior.prototype */ {
        __name: "TableImageVMBehavior",

        watchedAttributes: {
          anchor: ['image']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (!widget) {
            return;
          }
          var tableItemWidget = widget.getParentWidget();
          if (tableItemWidget && tableItemWidget.setImage) {

            var tableColumnNode = controller.getNodeBindings().container;
            var tableNode = tableColumnNode.getParentNode();
            var isListView = tableNode.getController().isListView();
            // for list view use only first column for images
            if (!isListView || tableNode.getChildren("TableColumn").indexOf(tableColumnNode) === 0) {
              var image = controller.getAnchorNode().attribute('image');
              tableItemWidget.setImage(context.__wrapper.wrapResourcePath(image));
            }
          }
        }
      };
    });
  });
