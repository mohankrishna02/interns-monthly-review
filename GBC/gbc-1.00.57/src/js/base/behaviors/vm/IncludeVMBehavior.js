/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('IncludeVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Handle field validation: Include (list of allowed values)
     * @class IncludeVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.IncludeVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.IncludeVMBehavior.prototype */ {
        __name: "IncludeVMBehavior",

        watchedAttributes: {
          container: ['include']
        },

        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setAllowedValues) {
            var containerNode = controller.getNodeBindings().container;
            var include = containerNode.attribute('include');
            include = include.split("|");
            widget.setAllowedValues(include.length ? include : null);
          }
        }
      };
    });
  });
