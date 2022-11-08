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

modulum('QAInfoVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class QAInfoVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.QAInfoVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.QAInfoVMBehavior.prototype */ {
        __name: "QAInfoVMBehavior",

        watchedAttributes: {
          anchor: ['name', 'value'],
          container: ['name'],
          table: ['offset']
        },
        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var bindings = controller.getNodeBindings();
          var node = bindings.container || bindings.anchor;
          var widget = controller.getWidget();
          if (widget && widget.setQAInfo) {
            var name = node.attribute('name') || node.attribute('tabName');
            widget.setQAInfo('name', name);
            var value = bindings.anchor.attribute('value');
            widget.setQAInfo('value', value);

            widget.setQAInfo('aui-id', node._id);

            var offsetNode = null;
            if (bindings.container &&
              (bindings.container.getTag() === 'TableColumn' || bindings.container.getTag() === 'Matrix')) {
              offsetNode = bindings.container.getParentNode();
            }
            if (offsetNode) {
              var offset = offsetNode.attribute('offset') || 0;
              widget.setQAInfo('index', offset + controller.getAnchorNode().getParentNode().getChildren().indexOf(controller
                .getAnchorNode()));
            }
            var tabIndex = node.attribute('tabIndex');
            if (tabIndex) {
              widget.setQAInfo('tabindex', tabIndex);
            }
          }
        }
      };
    });
  });
