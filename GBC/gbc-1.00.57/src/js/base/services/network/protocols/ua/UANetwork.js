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
     * Standardized queries to access ua proxy
     * @namepace classes.UANetwork
     */
    cls.UANetwork = context.oo.StaticClass(function() {

      var httpQueries = /** @lends classes.UANetwork */ {
        /**
         * send start query
         * /ua/r?frontEndId1=...&frontEndId2=...
         */
        start: {
          verb: "GET",
          action: "r",
          /** @ignore */
          uriPart: function(application) {
            var info = application.info();
            var parts = [info.appId, "?Bootstrap=done"].join("");
            var keys = Object.keys(info.urlParameters),
              len = keys.length;
            for (var i = 0; i < len; i++) {
              var key = keys[i],
                id = "&" + key + "=";
              var args = info.urlParameters[key];
              if (args) {
                parts += id + (Array.isArray(args) ? args : [args]).join(id);
              }
            }
            return parts;
          }
        },

        /**
         * send wait new task
         * /ua/sua/session_id?appId=...
         */
        waitTask: {
          verb: "GET",
          action: "wait",
          /** @ignore */
          uriPart: function(application) {
            var info = application.info();
            return [info.session, "?appId=", (info.app || 0)].join("");
          }
        },

        /**
         * send start new task
         * /ua/sua/session_id?appId=...&pageId=1
         * post data : empty
         */
        runTask: {
          verb: "POST",
          action: "sua",
          /** @ignore */
          uriPart: function(application) {
            var info = application.info();
            if (info.app === application._session.__lastNewtaskRun) {
              return null;
            } else {
              application._session.__lastNewtaskRun = info.app;
            }
            return [info.session, "?appId=", (info.app || 0), "&pageId=1"].join("");
          }
        },

        /**
         * Get url for new task in new window
         * /ua/sua/session_id?appId=...
         */
        newApp: {
          urlOnly: true,
          action: "sua",
          /** @ignore */
          uriPart: function(application) {
            var info = application.info();
            var keys = Object.keys(info.urlParameters),
              len = keys.length,
              parts = [info.session, "?appId=", (info.app || 0)];
            for (var i = 0; i < len; i++) {
              var key = keys[i],
                id = "&" + key + "=";
              if (key !== "appId") {
                var args = info.urlParameters[key];
                if (args) {
                  parts.push(id + (Array.isArray(args) ? args : [args]).join(id));
                }
              }
            }
            return parts.join("");
          }
        },

        /**
         * send aui order(s)
         * /ua/sua/session_id?appId=...&pageId=...
         * post data : aui order(s)
         */
        auiOrder: {
          verb: "POST",
          action: "sua",
          appId: true,
          pageId: true
        },

        /**
         * send empty request
         * /ua/sua/session_id?appId=...&pageId=...
         * post data : empty
         */
        empty: {
          verb: "POST",
          action: "sua",
          appId: true,
          pageId: true
        },

        /**
         * send ping
         * /ua/ping/session_id?appId=...
         * post data : empty
         */
        ping: {
          verb: "POST",
          appId: true
        },

        /**
         * track prompt
         * /ua/sua/session_id
         */
        trackPrompt: {
          verb: "POST",
          action: "sua"
        },

        /**
         * send interrupt
         * /ua/interrupt/session_id?appId=...
         * post data : empty
         */
        interrupt: {
          verb: "POST",
          appId: true
        },

        /**
         * send close
         * /ua/close/session_id?appId=...
         * post data : empty
         */
        close: {
          verb: "POST",
          appId: true
        },

        /**
         * send close
         * /ua/close/session_id
         * post data : empty
         */
        closeSession: {
          action: "close",
          verb: "POST"
        },

        /**
         * send new task query
         * /ua/newtask/session_id
         */
        newTask: {
          verb: "POST",
          action: "newtask",
          sequence: true
        },

        /**
         * ft-lock-file
         */
        ftLockFile: {
          verb: "GET",
          customUrl: true,
          headers: {
            "X-FourJs-LockFile": true
          }
        }
      };
      var methods = {};
      var createQuery = function(query, info) {
        methods[query] = function(query, info, application, callback, data, httpOptions) {
          var appInfo = application.info(),
            url;
          if (info.customUrl) {
            url = httpOptions.customUrl;
          } else {
            var parts = [appInfo && (appInfo.customUA || appInfo.connector) || "", "/ua/", info.action || query, "/"],
              uriPart = cls.UANetwork._getUriPart(application, info);
            if (!uriPart) {
              return;
            } else {
              parts.push(uriPart);
            }
            url = parts.join("");
            if (info.urlOnly) {
              return url;
            }
          }
          var logMessage = [query, info.verb, url].join(" : ");
          context.LogService.networkProtocol.debug("HTTP REQUEST\n", logMessage, data);
          var xhr = new XMLHttpRequest();
          if (context.ThemeService.getValue("theme-network-use-credentials-headers")) {
            xhr.withCredentials = true;
          }
          xhr._tryCount = 0;
          xhr.open(info.verb, url, true);
          var defaultHeaders = Object.keys(context.constants.network.sentHeaders);
          for (var hk = 0; hk < defaultHeaders.length; hk++) {
            xhr.setRequestHeader(defaultHeaders[hk], context.constants.network.sentHeaders[defaultHeaders[hk]]);
          }

          if (info.headers) {
            var ikeys = Object.keys(info.headers);
            for (var ik = 0; ik < ikeys.length; ik++) {
              xhr.setRequestHeader(ikeys[ik], info.headers[ikeys[ik]]);
            }
          }
          if (httpOptions && httpOptions.headers) {
            var keys = Object.keys(httpOptions.headers);
            for (var k = 0; k < keys.length; k++) {
              xhr.setRequestHeader(keys[k], httpOptions.headers[keys[k]]);
            }
          }
          var invalid = false;
          xhr.onload = function(invalid, appInfo, logMessage, xhrEvent) {
            if (!invalid) {
              context.LogService.networkProtocol.debug("HTTP RESPONSE\n", logMessage, xhrEvent.target.response);
              if (callback) {
                callback.call(null, xhrEvent.target.response, null, xhrEvent.target);
              }
            }
          }.bind(null, invalid, appInfo, logMessage);
          xhr.onreadystatechange = function(appInfo, xhrEvent) {
            var error = true;
            if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status === 404) {
                if (application.protocolInterface && application.protocolInterface.isRunning) {
                  appInfo.ending = cls.ApplicationEnding.notok("Session does not exist.");
                } else {
                  appInfo.ending = cls.ApplicationEnding.notFound;
                }
              } else if (xhr.status === 403) {
                appInfo.ending = cls.ApplicationEnding.forbidden;
              } else if (xhr.status >= 400) {
                appInfo.ending = cls.ApplicationEnding.notok(xhr.responseText);
              } else if (xhr.status >= 500) {
                context.LogService.networkProtocol.debug("HTTP RESPONSE", logMessage, xhr.status, xhr.statusText, xhr
                  .responseText);
                if (application.protocolInterface && application.protocolInterface.isRunning) {
                  appInfo.ending = cls.ApplicationEnding.notok("Session does not exist.");
                } else {
                  appInfo.ending = cls.ApplicationEnding.notFound;
                }
              } else if (xhr.status !== 200) {
                context.LogService.networkProtocol.debug("HTTP RESPONSE", logMessage, xhr.status, xhr.statusText, xhr
                  .responseText);
                error = false;
              } else {
                error = false;
              }
              if (error) {
                context.LogService.networkProtocol.debug("HTTP REQUEST ERROR", xhr.statusText, xhr.responseText);
                application.error("HTTP", "Network error (" + xhr.statusText + ")", xhr);
                if (callback) {
                  callback.call(null, xhrEvent.target.response, null, xhrEvent.target);
                }
              }
            }
          }.bind(null, appInfo);
          xhr.onerror = function(invalid, appInfo, logMessage, xhrEvent, textStatus, errorThrown) {
            if (xhr._tryCount < 5) {
              ++xhr._tryCount;
              var timeout = (xhr._tryCount < 5 ? Math.pow(2, xhr._tryCount) : 16) * 500;
              window.setTimeout(function() {
                xhr.open(info.verb, url, true);
                xhr.send((data ? data : null));
              }, timeout);
            } else {
              if (!invalid) {
                context.LogService.networkProtocol.debug("HTTP REQUEST ERROR", textStatus, errorThrown);
                appInfo.ending = cls.ApplicationEnding.notok("Server unreachable");
                application.error("HTTP", "Network error (" + textStatus + ")", xhrEvent);
                if (callback) {
                  callback.call(null, xhrEvent.target.response, null, xhrEvent.target);
                }
              }
            }
          }.bind(null, invalid, appInfo, logMessage);
          xhr.send((data ? data : null));
        }.bind(null, query, info);
      };
      var queryKeys = Object.keys(httpQueries);
      for (var i = 0; i < queryKeys.length; i++) {
        var query = queryKeys[i];
        var info = httpQueries[query];
        /**
         * For each sub cited methods, the same signature
         * @param application the current application
         * @param callback the callback in case of success
         * @param data the payload to send
         * @param httpOptions the http request options (like headers) to send
         */
        createQuery(query, info);
      }
      var result =
        /** @lends classes.UANetwork */
        {
          __name: "UANetwork",
          __sequence: 0,
          _getUriPart: function(application, info) {
            var appInfo = application.info();
            var uriParts = [];
            // Manage server prefix for cgi
            if (info.uriPart) {
              uriParts.push(info.uriPart(application));
            } else {
              uriParts.push(appInfo.session);
              var queryStarted = false;
              if (info.appId) {
                queryStarted = true;
                uriParts.push("?appId=", appInfo.app || 0);
                if (info.pageId) {
                  uriParts.push("&pageId=", appInfo.page++);
                }
              }
              if (info.sequence) {
                uriParts.push(queryStarted ? "&" : "?", "seq=", this.__sequence++);
              }
            }
            var uriPart = uriParts.join("");
            if (!uriPart) {
              return null;
            }
            return uriPart;
          }
        };

      var keys = Object.keys(methods);
      for (var k = 0; k < keys.length; k++) {
        result[keys[k]] = methods[keys[k]];
      }

      return result;

    });
  })(gbc, gbc.classes);
