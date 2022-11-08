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

(
  function(context, cls) {
    /**
     * @class UAConnectionString
     * @memberOf classes
     */
    cls.UAConnectionString = context.oo.StaticClass(
      /** @lends classes.UAConnectionString */
      {
        run: function(data, headers, application) {
          application.model.logDvm(data);
          try {
            if (!application.info().session || application.info().task || application.getSession()._browserMultiPageModeAsChild) {
              if (!application.info().session) {
                var headersKeys = Object.keys(context.constants.network.startHeaders);
                for (var i = 0; i < headersKeys.length; i++) {
                  var key = headersKeys[i];
                  var value = context.constants.network.startHeaders[key];
                  var hvalue = headers[key];
                  if (hvalue === null) {
                    throw value.error;
                  }
                  application.info()[value.prop || key] = hvalue;
                }
                application.getSession().setSessionId(application.info().session);
                application.info().serverVersion = headers.server;
              }
              var t = application.info().timeout;
              application.info().pingTimeout = (t > 1 ? t > 5 ? t - 5 : t - 1 : t) * 1000;

              if (!application.getSession()._browserMultiPageModeAsChild) {
                //Update history to handle session number
                window.requestAnimationFrame(gbc.HistoryService.addHistory.bind(gbc.HistoryService, application, window.document.URL));
              }

              var vmMessages = cls.AuiProtocolReader.translate(data);

              if (vmMessages.length === 0 || vmMessages.length !== 1 && vmMessages[0].type !== "meta" || vmMessages[0].verb !==
                "Connection") {
                if (!data) {
                  throw "No connectionString received. Ensure your application is compiled and published.";
                } else {
                  throw "Received connectionString bad format : \"" + data + "\"";
                }
              }

              application.info().connectionInfo = vmMessages[0].attributes;
            }
          } catch (e) {
            var message = "" + e.toString();
            if (application && application.info()) {
              application.info().ending = cls.ApplicationEnding.notok(message);
            }
          }
        }
      });
  })(gbc, gbc.classes);
