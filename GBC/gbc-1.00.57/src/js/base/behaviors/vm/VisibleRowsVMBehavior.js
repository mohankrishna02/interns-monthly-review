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

modulum('VisibleRowsVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class VisibleRowsVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.VisibleRowsVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.VisibleRowsVMBehavior.prototype */ {
        __name: "VisibleRowsVMBehavior",

        watchedAttributes: {
          anchor: ['size', 'offset', 'bufferSize', 'dialogType']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var tableWidget = controller.getWidget();
          if (tableWidget && tableWidget.setVisibleRows) {
            var tableNode = controller.getAnchorNode();
            var size = tableNode.attribute('size');
            var offset = tableNode.attribute('offset');
            var bufferSize = tableNode.attribute('bufferSize');
            var currentRow = tableNode.attribute('currentRow');

            var visibleRows = Math.min(bufferSize, size - offset);
            var dialogType = tableNode.attribute('dialogType');
            if ((dialogType === "Construct" || dialogType === "Input" || (dialogType === "InputArray" && currentRow === 0)) &&
              visibleRows === 0) {
              visibleRows = 1;
            }
            tableWidget.setVisibleRows(visibleRows);
          }
        }
      };
    });
  });
