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

modulum('TableRowHeightVMBehavior', ['BehaviorBase'],
  /**
   * Manage "height" attribute on widgets to set table row height
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class TableRowHeightVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.TableRowHeightVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.TableRowHeightVMBehavior.prototype */ {
        __name: "TableRowHeightVMBehavior",

        watchedAttributes: {
          decorator: ['height']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setRowHeight) {
            var decoratorNode = controller.getNodeBindings().decorator;
            var height = decoratorNode.attribute('height');
            if (data.savedHeight !== height && height > 1) {
              data.savedHeight = height;
              // Transform nb of characters to pixels
              var fontInfo = cls.Measurement.fontInfo(widget.getElement());
              height = cls.Measurement.measuredHeight(fontInfo["font-family"], fontInfo["font-size"], height);

              widget.setRowHeight(height);
            }
          }
        }
      };
    });
  });
