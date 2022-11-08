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

modulum('ValueVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class ValueVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.ValueVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.ValueVMBehavior.prototype */ {
        __name: "ValueVMBehavior",

        watchedAttributes: {
          anchor: ['value'],
          completer: ['size']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setValue) {
            var anchorNode = controller.getAnchorNode(),
              decoratorNode = controller.getNodeBindings().decorator;
            var auiValue = anchorNode.attribute('value');

            if (!widget.isEditing) { // if widget is not a TextWidgetBase, simply setValue and return
              if (decoratorNode && decoratorNode.getTag() === "Image") {
                widget.setValue(context.__wrapper.wrapResourcePath(auiValue), true);
              } else {
                widget.setValue(auiValue, true);
              }
              return;
            }

            var typeahead = anchorNode.getApplication().typeahead;
            if (typeahead.hasPendingValueCommands(anchorNode)) {
              return; // if there are pending commands do nothing
            }

            var lastCommandTime = anchorNode.getApplication().typeahead.getLastCommandTime();
            if (!widget.isEditing() || lastCommandTime >= widget.getEditingTime()) {
              if (decoratorNode && decoratorNode.getTag() === "Image") {
                widget.setValue(context.__wrapper.wrapResourcePath(auiValue), true);
              } else {
                widget.setValue(auiValue, true);
              }
              if (widget.hasFocus() && widget.hasCursors()) { // need to set correct cursor (QA GBC-937)
                var containerNode = controller.getNodeBindings().container;
                var cursor = containerNode.attribute('cursor');
                var cursor2 = containerNode.attribute('cursor2');
                widget.setCursors(cursor, cursor2);
              }
            }
          }
        }
      };
    });
  });
