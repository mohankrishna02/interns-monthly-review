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

modulum('Url',
  function(context, cls) {

    /**
     *
     * @class Url
     * @memberOf classes
     */
    cls.Url = context.oo.Class(function() {
      return /** @lends classes.Url.prototype */ {
        $static: /** @lends classes.Url */ {
          _defaultsPorts: {
            http: "80",
            https: "443"
          },
          isValid: function(urlString) {
            return Boolean(window.RegExpUrl.test(urlString));
          },
          protocolDefaultPort: function(protocol) {
            return this._defaultsPorts[protocol] || "80";
          }
        },
        /**
         * @type {?string}
         */
        _protocol: null,
        /**
         * @type {?string}
         */
        _username: null,
        /**
         * @type {?string}
         */
        _password: null,
        /**
         * @type {?string}
         */
        _host: null,
        /**
         * @type {?string}
         */
        _port: null,
        /**
         * @type {?string}
         */
        _path: null,
        /**
         * @type {classes.QueryString}
         */
        _queryString: null,
        /**
         * @type {?string}
         */
        _hash: null,
        /**
         * @type {boolean}
         */
        _invalid: false,
        constructor: function(urlString) {
          this._queryString = new cls.QueryString();
          if (urlString instanceof cls.Url) {
            this.fromUrl(urlString);
          } else {
            this.fromUrlString(urlString);
          }
        },
        fromUrl: function(url) {
          this._protocol = url._protocol;
          this._username = url._username;
          this._password = url._password;
          this._host = url._host;
          this._port = url._port;
          this._path = url._path;
          this._queryString.fromRaw(url._queryString);
          this._hash = url._hash;
        },
        fromUrlString: function(urlString) {
          urlString = urlString || window.location.href;
          var parts = window.RegExpUrl.exec(urlString);
          this._invalid = !parts;
          if (parts) {
            this._protocol = parts[1];
            this._username = parts[2];
            this._password = parts[3];
            this._host = parts[4];
            this._port = parts[5];
            this._path = parts[6];
            this._queryString.fromRaw(parts[7]);
            this._hash = parts[8];
          }
        },
        originString: function() {
          return [
            (this._protocol || context.UrlService.currentUrl()._protocol), "://", (this._username ? (this._username + (this
              ._password ?
              (":" + this._password) : "") + "@") : ""),
            this._host, (this._port ? (":" + this._port) : "")
          ].join("");
        },
        toRawString: function() {
          return this.originString() + (this._path || "");
        },
        toString: function() {
          var queryString = this._queryString && this._queryString.toString();
          return this.toRawString() +
            (queryString ? "?" + queryString : "") +
            (this._hash ? "#" + this._hash : "");
        },
        setQueryString: function(key, value) {
          this.removeQueryString(key);
          return this.addQueryString(key, value);
        },
        addQueryString: function(key, value) {
          (this._queryString = this._queryString || new cls.QueryString()).add(key, value);
          return this;
        },
        removeQueryString: function(key, value) {
          if (this._queryString) {
            this._queryString.remove(key, value);
            if (!this._queryString.toString().length) {
              this._queryString = null;
            }
          }
          return this;
        },
        hasSameOrigin: function(url) {
          if (!(url instanceof cls.Url)) {
            if (Object.isString(url)) {
              url = new cls.Url(url);
            } else {
              return false;
            }
          }
          return (url._protocol === this._protocol) &&
            (url._username === this._username) &&
            (url._password === this._password) &&
            (url._host === this._host) &&
            (
              (url._port || cls.Url.protocolDefaultPort(url._protocol)) ===
              (this._port || cls.Url.protocolDefaultPort(this._protocol))
            );
        },
        hasSamePath: function(url) {
          if (!(url instanceof cls.Url)) {
            if (Object.isString(url)) {
              url = new cls.Url(url);
            } else {
              return false;
            }
          }
          return (url._path === this._path);
        },
        isUaR: function() {
          return this._path.indexOf("/ua/r/") >= 0;
        },
        getQueryStringObject: function() {
          return this._queryString.copyContentsObject();
        }
      };
    });
  });
