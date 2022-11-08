/// FOURJS_START_COPYRIGHT(D,2015)
/// Property of Four Js*
/// (c) Copyright Four Js 2015, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('SessionEndWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Widget displayed at the end of a session
     * @class SessionEndWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     * @publicdoc Widgets
     */
    cls.SessionEndWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.SessionEndWidget.prototype */ {
        __name: "SessionEndWidget",
        _closeApplicationEnd: null,
        _restartApp: null,
        /** @type {HTMLElement} */
        _getGbcLog: null,

        /** @type {classes.ChromeBarWidget} **/
        _chromeBar: null,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._closeApplicationEnd = this._element.getElementsByClassName("closeApplicationEnd")[0];
          this._restartApp = this._element.getElementsByClassName("restartApp")[0];
          this._getGbcLog = this._element.querySelector(".gbcLogLink");
          if (!gbc.ThemeService.getValue("theme-legacy-topbar")) {
            var chromeBarOpt = this.getBuildParameters();
            chromeBarOpt.lightmode = true;
            this._chromeBar = cls.WidgetFactory.createWidget("ChromeBar", chromeBarOpt);
            this._element.prependChild(this._chromeBar.getElement());
            this._chromeBar.setLightMode(true);
          }
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          // no layout
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._closeApplicationEnd = null;
          this._restartApp = null;
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          var target = domEvent.target;
          if (target.isElementOrChildOf(this._closeApplicationEnd)) {
            this.emit(context.constants.widgetEvents.close);
          } else if (target.isElementOrChildOf(this._restartApp)) {
            this.emit(context.constants.widgetEvents.restart);
          } else if (target.isElementOrChildOf(this._getGbcLog)) {
            gbc.LogService.download();
          }
          return true;
        },

        /**
         * Show all session actions
         * VM logs, Proxy logs
         * @publicdoc
         */
        showSessionActions: function() {
          var elements = this._element.getElementsByClassName('from-session') || [];
          for (var i = 0; i < elements.length; i++) {
            elements[i].removeClass('hidden');
          }
          if (gbc.LogService.isRecordingEnabled()) {
            this._getGbcLog.removeClass('hidden');
          }
        },

        /**
         * Show user actions
         * restart, quit ...
         * @publicdoc
         */
        showUAActions: function() {
          this._element.getElementsByClassName('from-ua')[0].removeClass('hidden');
        },

        /**
         * Defines header message
         * @param {string} header the header content
         * @publicdoc
         */
        setHeader: function(header) {
          this._element.getElementsByClassName('mt-card-header-text')[0].innerHTML = header;
        },

        /**
         * Defines message to display at the end of the session
         * @param {string} message - text to display
         * @publicdoc
         */
        setMessage: function(message) {
          var messageElt = this._element.getElementsByClassName('message')[0];
          messageElt.removeClass('hidden');
          messageElt.innerHTML = message;
        },

        /**
         * Set the session id
         * @param {number} id - identifier of the session
         * @publicdoc
         */
        setSessionID: function(id) {
          this._element.getElementsByClassName('session')[0].removeClass('hidden');
          this._element.getElementsByClassName('sessionID')[0].textContent = id;
        },

        /**
         * Set the links of the session
         * @param {string} base - url base (hostname)
         * @param {string|number} session - identifier for this session
         * @publicdoc
         */
        setSessionLinks: function(base, session) {
          this._element.querySelector('.uaLink>a').setAttribute('href', base + '/monitor/log/uaproxy-' + session);
          this._element.querySelector('.vmLink>a').setAttribute('href', base + '/monitor/log/vm-' + session);
          if (!context.DebugService.isActive()) {
            this._element.querySelector('.uaLink').style.display = 'none';
            this._element.querySelector('.vmLink').style.display = 'none';
          }
        },

        /**
         * Defines the aui log url
         * @param {string|number} session - identifier for this session
         * @param file
         */
        setAuiLogUrl: function(session, file) {
          this._element.querySelector('.auiLink>a').setAttribute('download', 'auiLog-' + session + '.log');
          this._element.querySelector('.auiLink>a').setAttribute('href', 'file');
        }
      };
    });
    cls.WidgetFactory.registerBuilder('SessionEnd', cls.SessionEndWidget);
  });
