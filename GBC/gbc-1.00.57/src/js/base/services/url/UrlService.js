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

modulum('UrlService', ['InitService'],
  function(context, cls) {

    /**
     * @class gbc.UrlService
     */
    context.UrlService = context.oo.StaticClass( /** @lends gbc.UrlService */ {
      __name: "UrlService",
      /** @type classes.Url */
      _current: null,
      init: function() {
        this._current = new cls.Url();
      },

      currentUrl: function() {
        return new cls.Url(this._current);
      },
      setCurrentUrl: function(url, forceLocation) {
        if (forceLocation) {
          window.location.href = url;
        } else {
          this._current = new cls.Url(url);
          if (window.isURLParameterEnabled("qainfo")) {
            this._current.addQueryString("qainfo", 1);
          }
          if (window.isURLParameterEnabled("noquitpopup")) {
            this._current.addQueryString("noquitpopup", 1);
          }
          window.history.pushState(null, "Genero Browser Client", this._current.toString());
        }
      },

      isValid: function(url) {
        var reWebUrl = new RegExp(
          "^" +
          // protocol identifier
          "(?:(?:https?|ftp)://)" +
          // user:pass authentication
          "(?:\\S+(?::\\S*)?@)?" +
          "(?:" +
          // IP address exclusion
          // private & local networks
          "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
          "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
          "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
          // IP address dotted notation octets
          // excludes loopback network 0.0.0.0
          // excludes reserved space >= 224.0.0.0
          // excludes network & broacast addresses
          // (first & last IP address of each class)
          "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
          "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
          "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
          "|" +
          // host name
          "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
          // domain name
          "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
          // TLD identifier
          "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
          ")" +
          // port number
          "(?::\\d{2,5})?" +
          // resource path
          "(?:/\\S*)?" +
          "$", "i"
        );

        return Boolean(url) && Boolean(url.match(reWebUrl));

      },
      goTo: function(urlString) {
        var url = new cls.Url(urlString);
        if (cls.Url.isValid(urlString)) {
          var params = url.getQueryStringObject() || {};
          var currentUrl = this.currentUrl();
          if (url.isUaR() && (url.hasSameOrigin(currentUrl) || window.isURLParameterEnabled("crossdomain"))) {
            var urlParts = url.toRawString().split("/ua/r/");
            params.customUA = urlParts[0];
            params.app = urlParts[1];
            var historyUrl = currentUrl.setQueryString("app", params.app);
            if (url.originString() !== params.customUA) {
              historyUrl.setQueryString("customUA", params.customUA);
            } else {
              historyUrl = url;
            }
            this.setCurrentUrl(historyUrl);
            context.SessionService.start(params.app, params);
          } else if (url.hasSameOrigin(currentUrl) && url.hasSamePath(currentUrl)) {
            if (params.app) {
              this.setCurrentUrl(url.toString());
              context.SessionService.start(params.app, params);
            }
          } else {
            this.setCurrentUrl(url.toString(), true);
          }

        } else {
          this.setCurrentUrl(this.currentUrl().setQueryString("app", encodeURIComponent(urlString)).toString(), true);
        }
      }
    });
    context.InitService.register(context.UrlService);
  });
