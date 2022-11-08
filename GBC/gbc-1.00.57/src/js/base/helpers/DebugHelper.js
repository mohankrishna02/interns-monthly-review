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

modulum('DebugHelper',
  function(context, cls) {
    /**
     *
     * @class DebugHelper
     * @memberOf classes
     */
    cls.DebugHelper = context.oo.StaticClass(function() {
      return /** @lends classes.DebugHelper */ {
        activateDebugHelpers: function() {
          if (!window.gbcNode) {
            /**
             *
             * @param elementOrIdRef
             * @return {classes.NodeBase}
             */
            window.gbcNode = function(elementOrIdRef) {
              if (typeof(elementOrIdRef) === 'object') {
                var element = elementOrIdRef;
                while (element) {
                  var classList = element.classList;
                  for (var i = 0; i < classList.length; ++i) {
                    var cls = classList[i];
                    if (cls.startsWith("aui__")) {
                      var id = parseInt(cls.substr(5), 10);
                      return context.SessionService.getCurrent().getCurrentApplication().getNode(id);
                    }
                  }
                  element = element.parentElement;
                }
                return null;
              } else {
                return context.SessionService.getCurrent().getCurrentApplication().getNode(elementOrIdRef);
              }
            };
          }
          if (!window.gbcJsonAui) {
            window.gbcJsonAui = function() {
              var rootNode = window.gbcNode(0);
              return rootNode._attributes;
            };
          }
          if (!window.gbcController) {
            window.gbcController = function(elementOrIdRef) {
              var node = window.gbcNode(elementOrIdRef);
              return node ? node.getController() : null;
            };
          }
          if (!window.gbcWidget) {
            /**
             *
             * @param elementOrIdRef
             * @returns {classes.WidgetBase}
             */
            window.gbcWidget = function(elementOrIdRef) {
              var controller = window.gbcController(elementOrIdRef);
              return controller ? controller.getWidget() : null;
            };
          }
          if (!window.gbcMeasuring) {
            window.gbcMeasuring = function() {
              var list = document.getElementsByClassName("g_measured"),
                len = list.length,
                i = 0;
              for (; i < len; i++) {
                list[i].removeClass("g_measured").addClasses("g_measuring", "__debug");
              }
            };
          }
        }
      };
    });
  });
