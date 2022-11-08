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

modulum('FieldButtonEnabledVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Handles the enabled / disabled state of a button included in a field (ex. ButtonEdit)
     * @class FieldButtonEnabledVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.FieldButtonEnabledVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.FieldButtonEnabledVMBehavior.prototype */ {
        __name: "FieldButtonEnabledVMBehavior",

        watchedAttributes: {
          container: ['active'],
          decorator: ['actionActive']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setButtonEnabled) {
            var bindings = controller.getNodeBindings();
            var isEnabled = bindings.container.attribute('active') === 1 &&
              bindings.decorator.attribute('actionActive') === 1;
            widget.setButtonEnabled(isEnabled);
          }
        }
      };
    });
  });
