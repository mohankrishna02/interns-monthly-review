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

modulum('TableDialogTypeVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class TableDialogTypeVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.TableDialogTypeVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.TableDialogTypeVMBehavior.prototype */ {
        __name: "TableDialogTypeVMBehavior",

        watchedAttributes: {
          anchor: ['dialogType']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget) {
            var dialogType = controller.getAnchorNode().attribute('dialogType');

            if (widget._resetItemsSelection) {
              widget._resetItemsSelection();
            }

            if (widget.setInputMode) {
              widget.setInputMode(!(dialogType === "Display" || dialogType === "DisplayArray"));
            }
            if (widget.setDndItemEnabled) {
              widget.setDndItemEnabled(dialogType === "DisplayArray");
            }
          }

        }
      };
    });
  });
