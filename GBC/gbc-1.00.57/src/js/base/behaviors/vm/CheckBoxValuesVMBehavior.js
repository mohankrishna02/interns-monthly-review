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

modulum('CheckBoxValuesVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class CheckBoxValuesVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.CheckBoxValuesVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.CheckBoxValuesVMBehavior.prototype */ {
        __name: "CheckBoxValuesVMBehavior",

        watchedAttributes: {
          decorator: ['valueChecked', 'valueUnchecked']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var decorator = controller.getNodeBindings().decorator;
          if (widget && widget.setCheckedValue) {
            var checkedValue = decorator.attribute('valueChecked');
            widget.setCheckedValue(checkedValue);
          }
          if (widget && widget.setUncheckedValue) {
            var uncheckedValue = decorator.attribute('valueUnchecked');
            widget.setUncheckedValue(uncheckedValue);
          }
        }
      };
    });
  });
