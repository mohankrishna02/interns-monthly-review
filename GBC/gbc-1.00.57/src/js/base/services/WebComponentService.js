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

modulum('WebComponentService', ['InitService'],
  function(context, cls) {

    /**
     * Proxy Service used to forward webcomponent api
     * @namespace gbc.WebComponentService
     * @gbcService
     */
    context.WebComponentService = context.oo.StaticClass(
      /** @lends gbc.WebComponentService */
      {
        __name: "WebComponentService",
        /**
         * List of proxies
         * @type {Object}
         */
        _proxies: {},

        /**
         * Keep track of webcomponent URL provided by the GAS
         * @type {url}
         */
        _webcomponentUrl: null,

        /**
         * Init function, called once and mandatory
         */
        init: function() {

        },

        /**
         * Add or edit a new proxy
         * @param uid
         * @param widget
         */
        setProxy: function(uid, widget) {
          this._proxies[uid] = this._api(widget);
        },

        /**
         * Get a registered proxy
         * @param uid
         * @returns {*}
         */
        getProxy: function(uid) {
          return this._proxies[uid];
        },

        /**
         * Get the webcomponent URL defined by the GAS
         * @returns {url}
         */
        getWebcomponentUrl: function() {
          return this._webcomponentUrl;
        },

        /**
         * Set the webcomponent URL
         * @param url
         */
        setWebcomponentUrl: function(url) {
          this._webcomponentUrl = url;
        },

        /**
         * Api that will be binded to webcomponent
         * @returns {{setFocus: function, setData: function, action: function}}
         * @private
         */
        _api: function() {
          return /** @ignore */ {
            //Generates a focus request
            /** @ignore */
            setFocus: function(element) {
              context.LogService.gICAPI.log("Emit a focus request");
              element.emit(context.constants.widgetEvents.requestFocus);
            },
            //Registers data to be sent to the program, in order to set the form field value in the program.
            /** @ignore */
            setData: function(element, dataStr) {
              //Ensure dataStr is a string
              if (typeof dataStr !== "string") {
                dataStr = JSON.stringify(dataStr);
                context.LogService.gICAPI.warn("Data sent is not of type string, it will be automatically stringified");
              }
              element.emit(cls.WebComponentWidget.dataEvent, dataStr);
            },
            //Triggers an action event, which will execute the corresponding ON ACTION code.
            /** @ignore */
            action: function(element, actionName) {
              //Ensure actionName is a string, cancel and log otherwise
              if (typeof actionName === "string") {
                context.LogService.gICAPI.log("Call Action(" + actionName + ")");
                element.emit(cls.WebComponentWidget.actionEvent, actionName);
              } else {
                context.LogService.gICAPI.error("Action identifier is not of type string, action canceled.");
              }
            }
          };
        }

      });
    context.InitService.register(context.WebComponentService);
  });
