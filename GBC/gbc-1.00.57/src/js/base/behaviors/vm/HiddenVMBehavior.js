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

modulum('HiddenVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * Behavior controlling the widget's visibility
     * @class HiddenVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.HiddenVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.HiddenVMBehavior.prototype */ {
        __name: "HiddenVMBehavior",

        watchedAttributes: {
          anchor: ['hidden', 'defaultView'],
          container: ['hidden', 'pageSize', 'bufferSize']
        },

        /**
         * @param {classes.ControllerBase} controller
         * @param {Object} data
         */
        setup: function(controller, data) {
          data.firstApply = true;
        },

        /**
         * Updates the widget's visibility depending on the AUI tree information
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();

          var bindings = controller.getNodeBindings();
          var hiddenNode = null;
          var defaultViewNode = null;
          if (bindings.container) {
            hiddenNode = bindings.container;
          } else {
            hiddenNode = bindings.anchor;
          }
          if (bindings.anchor.isAttributePresent('defaultView')) {
            defaultViewNode = bindings.anchor;
          }

          // Handle visibility in case of Matrix
          var isMatrix = hiddenNode.getTag() === "Matrix";
          if (isMatrix) {
            var valueList = hiddenNode._children[1];
            var pageSize = hiddenNode.attribute('pageSize');
            var bufferSize = hiddenNode.attribute('bufferSize');
            // Hide if Valuelist is bigger than pageSize
            if (valueList._children.indexOf(controller.getAnchorNode()) >= Math.max(pageSize, bufferSize)) {
              if (widget && widget.setHidden) {
                widget.setHidden(true);
                return;
              }
            }
          }

          if (widget && widget.setHidden) {
            var hidden = hiddenNode.attribute('hidden');
            var visible = hidden === context.constants.visibility.visible;
            var parentStyle = hiddenNode.getParentNode().attribute('style');
            if (visible && defaultViewNode && parentStyle !== "popup" && parentStyle !==
              "dialog") { // defaultView is not taken into account when in menu style is not popup and not dialog (GBC-600)
              var defaultView = defaultViewNode.attribute('defaultView');
              visible = defaultView === context.constants.viewType.showAlways;
            }

            // Table column specific code
            var isTableColumn = hiddenNode.getTag() === "TableColumn";
            if (isTableColumn && widget.setAlwaysHidden) {
              widget.setAlwaysHidden(hidden === context.constants.visibility.hiddenByProgram);

              // Stored settings columns
              var storedHidden = data.firstApply ? controller.getStoredSetting("hidden") : null;
              if (storedHidden !== null && (hidden === context.constants.visibility.hiddenByUser) !== storedHidden) {
                visible = !storedHidden;
                // Send order to hide/show column
                var event = new cls.VMConfigureEvent(hiddenNode.getId(), {
                  hidden: visible ? context.constants.visibility.visible : context.constants.visibility.hiddenByUser
                });
                hiddenNode.getApplication().dvm.onOrdersManaged(function() {
                  hiddenNode.getApplication().typeahead.event(event, hiddenNode);
                }.bind(this), true);
              }
            }

            widget.setHidden(!visible);

            data.firstApply = false;
          }
        }
      };
    });
  });
