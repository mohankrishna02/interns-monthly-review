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

modulum('KeyboardHintVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class KeyboardHintVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.KeyboardHintVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      return /** @lends classes.KeyboardHintVMBehavior.prototype */ {
        __name: "KeyboardHintVMBehavior",

        watchedAttributes: {
          container: ['varType'],
          decorator: ['keyboardHint']
        },

        usedStyleAttributes: ["dataTypeHint"],

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setType) {
            var bindings = controller.getNodeBindings();
            var keyboardHint = null;
            var keyboardVal = bindings.decorator.attribute('keyboardHint');
            if (keyboardVal) {
              keyboardHint = keyboardVal.toLowerCase();
            }
            var varType = null;
            var attrVal = bindings.container.attribute('varType');
            if (attrVal) {
              attrVal = attrVal.toLowerCase();
              var pattern = /(\w+)/;
              var match = attrVal.match(pattern);
              varType = match[1];
            }

            switch (keyboardHint) {
              case "email":
                widget.setType("email");
                break;
              case "number":
                widget.setType("text");
                break;
              case "phone":
                widget.setType("tel");
                break;
              case "url":
                widget.setType("url");
                break;
              case "default":
                /* falls through */
              default:
                switch (varType) {
                  case "bigint":
                  case "byte":
                  case "decimal":
                  case "float":
                  case "integer":
                  case "interval":
                  case "smallFloat":
                  case "smallInt":
                  case "tinyInt":
                    widget.setType("text");
                    break;

                  case "date":
                  case "datetime":
                  case "char":
                  case "string":
                  case "text":
                  case "varchar":
                  case "money":
                    /* falls through */
                  default:
                    var dataTypeHint = controller.getAnchorNode().getStyleAttribute('dataTypeHint');
                    if (dataTypeHint) {
                      widget.setType(dataTypeHint);
                    } else {
                      widget.setType("text");
                    }
                }
            }
          }
        }
      };
    });
  });
