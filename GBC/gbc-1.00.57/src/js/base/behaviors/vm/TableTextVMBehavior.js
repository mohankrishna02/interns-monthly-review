/// FOURJS_START_COPYRIGHT(D,2016)
/// Property of Four Js*
/// (c) Copyright Four Js 2016, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('TableTextVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class TableTextVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.TableTextVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.TableTextVMBehavior.prototype */ {
        __name: "TableTextVMBehavior",

        watchedAttributes: {
          anchor: ['text']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setText) {
            var bindings = controller.getNodeBindings();
            var text = bindings.anchor.attribute('text');
            widget.setText(text);
          }
        }
      };
    });
  });
