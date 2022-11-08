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

modulum('NativeService',
  function(context, cls) {

    /**
     * Native Service to interact with native in UR mode
     * @namespace gbc.NativeService
     * @gbcService
     */
    context.NativeService = context.oo.StaticClass( /** @lends gbc.NativeService */ {
      __name: "NativeService",

      /**
       *
       * @param {{name:string, args:Array}} data
       */
      onNativeAction: function(data) {
        if (data) {
          var app = context.SessionService.getCurrent().getCurrentApplication();
          switch (data.name) {
            case "notificationpushed":
              app.typeahead.nativeNotificationPushed();
              break;
            case "cordovacallback":
              app.typeahead.nativeCordovaCallback();
              break;
            case "back":
              app.typeahead.nativeBack(data.args);
              break;
            case "close":
              app.typeahead.nativeClose();
              break;
            default:
              break;
          }
        }
      },

      /**
       *
       * @param {*} data
       */
      onQuery: function(data) {
        var result = {
          queryId: data.queryId
        };
        switch (data.queryId) {
          case "getWidgetCoordinates":
            var app = context.SessionService.getCurrent().getCurrentApplication(),
              node = app.model.getNode(data.id),
              rect = node.getWidget().getElement().getBoundingClientRect();
            result.x = rect.left + rect.width / 2;
            result.y = rect.top + rect.height / 2;
            break;
          default:
            break;
        }
        context.__wrapper.queryResult(result);
      }
    });
  });
