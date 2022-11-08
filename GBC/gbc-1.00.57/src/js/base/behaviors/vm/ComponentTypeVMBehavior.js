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

modulum('ComponentTypeVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class ComponentTypeVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.ComponentTypeVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.ComponentTypeVMBehavior.prototype */ {
        __name: "ComponentTypeVMBehavior",

        watchedAttributes: {
          decorator: ['componentType']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var decoratorNode = controller.getNodeBindings().decorator;
          var widget = controller.getWidget();
          if (widget && widget.setWebComponentType) {
            var componentType = decoratorNode.attribute('componentType');
            var isApi = Boolean(componentType);
            widget.setWebComponentType(componentType ? "api" : "url");
            if (isApi) {
              // if application info has webComponent prefix, use it
              var componentUrlPart = decoratorNode.getApplication().info().webComponent ?
                (decoratorNode.getApplication().info().webComponent + "/" + componentType + "/" + componentType + ".html") :
                (componentType + "/" + componentType + ".html"),
                webcompUrl = context.__wrapper.wrapResourcePath(
                  componentUrlPart,
                  "webcomponents",
                  decoratorNode.getApplication().info().webComponent);
              widget.setUrl(webcompUrl);
            }
          }
        }
      };
    });
  });
