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

modulum('PlaceholderVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Behavior controlling the widget's Menu
     * @class PlaceholderVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.PlaceholderVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.PlaceholderVMBehavior.prototype */ {
        __name: "PlaceholderVMBehavior",

        watchedAttributes: {
          container: ['active', 'dialogType', 'currentRow', 'offset'],
          table: ['currentRow', 'offset'],
          decorator: ['placeholder']
        },
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var activeNode = null;

          if (widget && widget.setPlaceHolder) {
            var decoratorNode = controller.getNodeBindings().decorator;
            if (decoratorNode && decoratorNode.isAttributeSetByVM('placeholder')) {
              var bindings = controller.getNodeBindings();
              if (bindings.container) {
                activeNode = bindings.container;
              } else if (bindings.anchor.isAttributePresent('active')) {
                activeNode = bindings.anchor;
              }
              var placeholder = "";
              if (activeNode) {
                var activeValue = activeNode.attribute('active');
                var dialogType = bindings.container.attribute("dialogType");

                // Only enabled widget in Input, Construct or InputArray should have placeholder visible. In InputArray only current row widget does
                if (activeValue === 1 && dialogType !== "Display" && dialogType !== "DisplayArray") {
                  // only widget being in focused in current should have its placeholder visible
                  if (controller.isInTable() || controller.isInMatrix()) {
                    var container = controller.isInTable() ? bindings.table : bindings.container;
                    var currentRow = container.attribute("currentRow");
                    var offset = container.attribute("offset");
                    var size = container.attribute("size");
                    if (currentRow - offset === bindings.anchor.getIndex()) {
                      placeholder = decoratorNode.attribute('placeholder');
                    }
                  } else {
                    placeholder = decoratorNode.attribute('placeholder');
                  }
                }
              }
              widget.setPlaceHolder(placeholder);
            }
          }
        },

      };
    });
  });
