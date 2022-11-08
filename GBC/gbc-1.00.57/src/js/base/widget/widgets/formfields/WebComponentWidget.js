/// FOURJS_START_COPYRIGHT(D,2015)
/// Property of Four Js*
/// (c) Copyright Four Js 2015, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

'use strict';

modulum('WebComponentWidget', ['FieldWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * WebComponent widget.
     * @class WebComponentWidget
     * @memberOf classes
     * @extends classes.FieldWidgetBase
     * @publicdoc Widgets
     */
    cls.WebComponentWidget = context.oo.Class(cls.FieldWidgetBase, function($super) {
      return /** @lends classes.WebComponentWidget.prototype */ {
        $static: {
          gICAPIVersion: '1.0',
          focusEvent: context.constants.widgetEvents.focus,
          dataEvent: 'wc_data',
          actionEvent: 'wc_action',
          ready: 'wc_ready'
        },

        __name: 'WebComponentWidget',
        __dataContentPlaceholderSelector: cls.WidgetBase.selfDataContent,
        _webComponentType: null,
        /**
         * @type {Window}
         */
        _webComponentWindow: null,
        _webComponentProxy: null,
        _webComponentWindowKeyDown: null,
        _flushValue: '',
        _flushingData: false,
        _url: null,
        _isReady: false,
        _value: null,
        _stopOnError: true,

        /**
         * @type HTMLElement
         */
        _iframeElement: null,

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutInformation.shouldFillStack = true;
            this._layoutEngine = new cls.LeafLayoutEngine(this);
            this._layoutInformation.forcedMinimalWidth = 20;
            this._layoutInformation.forcedMinimalHeight = 20;
          }
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._iframeElement = this._element.getElementsByTagName('iframe')[0];
          this._iframeElement.on('load.WebComponentWidget', this._onLoad.bind(this));
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._delegatesKeyboard(false);
          try {
            this._webComponentWindow.gICAPI = null;
          } catch (e) {}
          this._webComponentWindow = null;
          this._iframeElement.off('load.WebComponentWidget');
          this._iframeElement = null;
          $super.destroy.call(this);
        },

        /**
         * Handler for onData when iframe is loaded
         * @private
         */
        _onReadyData: function() {
          if (this.value !== this._flushValue) {
            this._toICAPI('onData', this._value ? this._value : '');
          }
        },

        /**
         * Handler called once iframe has loaded its content
         * @private
         */
        _onLoad: function() {
          if (this.getUrl()) {
            if (this._webComponentType === 'api') {
              this._injectApi();
              this._delegatesKeyboard(true);
            } else if (this._webComponentType === 'url') {
              this.emit(context.constants.widgetEvents.change);
            }
            this._onReady();
          }
        },

        /**
         * Handler for onFocus when iframe is loaded
         * @private
         */
        _onReadyFocus: function() {
          if (this._uiWidget && this._uiWidget.getVMFocusedWidget() !== this) {
            this.emit(context.constants.widgetEvents.change);
            this._toICAPI('onFocus', false);
          } else {
            if (this._iframeElement !== document.activeElement) {
              this._toICAPI('onFocus', true);
            } else {
              this._toICAPI('onFocus', false);
            }
          }
        },

        /**
         * Handler for onBlur when iframe is loaded
         * @private
         */
        _onReadyBlur: function() {
          this.getValue();
          this.emit(context.constants.widgetEvents.blur);
          this._toICAPI('onFocus', false);
        },

        /**
         * OnStateChanged handler once iframe is ready
         * @param {boolean} active - form state
         * @param {string} dialogType - form display type (display, input ...)
         * @private
         */
        _onReadyStateChanged: function(active, dialogType) {
          this._toICAPI('onStateChanged', JSON.stringify({
            'active': parseInt(active),
            'dialogType': dialogType.toString()
          }));
        },

        /**
         * Set the property of the webcomponent
         * @param {string} property - stringified json object of properties
         * @private
         */
        _setProperty: function(property) {
          var pty = property;
          if (this._isReady) {
            this._toICAPI('onProperty', pty);
          } else {
            this.when(cls.WebComponentWidget.ready, this._onReadyProperty.bind(this, pty));
          }
        },

        /**
         * When the iframe is loaded handler
         * @private
         */
        _onReady: function() {
          this._isReady = true;
          this.emit(context.constants.widgetEvents.ready);
        },

        /**
         * onProperty handler once iframe is ready
         * @param {string} property - stringified json object of properties
         * @private
         */
        _onReadyProperty: function(property) {
          this._toICAPI('onProperty', property);
        },

        /**
         * Inject the API on the webcomponent
         * @returns {boolean} false if not applicable
         * @private
         */
        _injectApi: function() {
          //Add a new proxy for this webcomponent
          context.WebComponentService.setProxy(this.getUniqueIdentifier());
          this._webComponentProxy = context.WebComponentService.getProxy(this.getUniqueIdentifier());
          //Get the content of the iframe window to put api on
          this._webComponentWindow = this._iframeElement.contentWindow;

          // This try/catch statement is used to prevent IE to crash too early
          try {
            Function.noop(this._webComponentWindow.DocURL);
          } catch (e) {
            context.LogService.gICAPI.error('Webcomponent not found:', this._url);
            context.LogService.gICAPI.error('onICHostReady no present in webcomponent, cannot continue!');
            this.webComponentNotFound();
            return false;
          } // end IE fix

          try {
            this._webComponentWindow.gICAPIVersion = cls.WebComponentWidget.gICAPIVersion;
            // Bind WebComponent API to the iframe
            this._webComponentWindow.gICAPI = this._gICAPI();
            // Tell the WebComponent that host is ready
            if (this._webComponentWindow.onICHostReady) {
              this._webComponentWindow.onICHostReady('1.0');
            } else {
              context.LogService.gICAPI.error('onICHostReady no present in webcomponent, cannot continue!');
              this.webComponentNotFound();
              return false;
            }
          } catch (e) {
            this.error(e, true);
            return false;
          }
          this.emit(cls.WebComponentWidget.ready);
        },

        /**
         * Api object to bind to the webcomponent window.
         * It will be used inside the webcomponent to interact with the VM
         * @private
         */
        _gICAPI: function() {
          return {
            SetFocus: function() {
              // Generates a focus change request. The focus is entirely managed by the runtime system
              this._webComponentProxy.setFocus(this);
            }.bind(this),
            SetData: function(dataStr) {
              this._webComponentProxy.setData(this, dataStr);
            }.bind(this),
            Action: function(actionName) {
              this._webComponentProxy.action(this, actionName);
            }.bind(this),
            version: '1.0' // Legacy, but mostly not used
          };
        },

        /**
         * Delegate the keyboard management to GBC keyboard service (for accelerators and so)
         * @warning This works only if webcomponent is on the same domain as GBC application
         * @param {boolean} delegate - true to delegate it, false to let the webcomponent live by itself
         * @private
         */
        _delegatesKeyboard: function(delegate) {
          try {
            if (!this._webComponentWindow) {
              this._webComponentWindow = this._iframeElement.contentWindow;
            }
            if (delegate) {
              // If handler already exists, remove it before creating it again
              if (this._webComponentWindowKeyDown) {
                this._webComponentWindow.document.body.removeEventListener('keydown', this._webComponentWindowKeyDown);
              }
              // Define the keyDown handler
              this._webComponentWindowKeyDown = function(evt) {
                this.emit(gbc.constants.widgetEvents.webcomponentKeyDown, evt);
              }.bind(this);
              // Bind the iframe keyDown event to the keyDown handler
              this._webComponentWindow.document.body.addEventListener('keydown', this._webComponentWindowKeyDown);
            } else {
              if (this._webComponentWindowKeyDown) {
                this._webComponentWindow.document.body.removeEventListener('keydown', this._webComponentWindowKeyDown);
                this._webComponentWindowKeyDown = null;
              }
            }
          } catch (error) {
            context.LogService.gICAPI.warn("Can not use GBC accelerators in a cross-domain Webcomponents (" + this._url + ")");
          }
        },

        /**
         * Function to transmit gICAPI orders to webcomponent
         * @param {string} verb - onData, onProperty, onChangeState, onFlushData
         * @param {string=} args - arguments passed to the gICAPI if any
         * @private
         */
        _toICAPI: function(verb, args) {
          try {
            var arg = args;
            if (verb === 'onData' && arg === null) {
              arg = [null];
            } else {
              if (!arg && arg !== false && arg !== '' && arg !== 0) {
                arg = [];
              }
              if (arg.prototype !== Array) {
                arg = [arg];
              }
            }
            if (this._webComponentWindow && this._webComponentWindow.gICAPI && this._webComponentWindow.gICAPI[verb]) {
              this._webComponentWindow.gICAPI[verb].apply(this._webComponentWindow.gICAPI, arg);
              if (verb === "onFlushData") {
                this._flushingData = false;
              }
            }
          } catch (e) {
            this.error(e);
          }
        },

        /**
         * Handler to execute a function only once the component is ready
         * @param callback
         * @protected
         */
        _onReadyExecute: function(callback) {
          if (this._isReady) {
            callback();
          } else {
            this.when(cls.WebComponentWidget.ready, function() {
              callback();
            }.bind(this));
          }
        },

        /**
         * @inheritDoc
         */
        managePriorityKeyDown: function(keyString, domKeyEvent, repeat) {
          if (keyString === "home" || keyString === "end") {
            return false; // consider home/end key as not processed to keep default from webcomponent
          } else {
            return $super.managePriorityKeyDown.call(this, keyString, domKeyEvent, repeat);
          }
        },

        /**
         * Report an error in webcomponent
         * @param e - error object
         * @param {boolean} stop - will stop the application if true
         */
        error: function(e, stop) {
          context.LogService.gICAPI.error(i18next.t('gwc.app.webcompError.message'));
          context.LogService.gICAPI.error(">>> " + ': ' + e.toString(), e);
          if (this._stopOnError || stop) {
            this.webComponentNotFound(i18next.t('gwc.app.webcompError.message') + ' : "' + e.toString() +
              '"--> see console for more details');
          } else {
            var errorLayer = document.createElement("div");
            var errorStyle =
              'position: fixed;top: 0; color: #721c24; background-color: #f8d7da;border-color: #f5c6cb;border: 1px solid; padding: 10px; border-radius: .25rem;';
            errorLayer.innerHTML = '<b>' + i18next.t('gwc.app.webcompError.message') + ' :</b> <i>' + e.toString() +
              '</i><br> See console for more info';
            errorLayer.setAttribute("style", errorStyle);
            errorLayer.addEventListener("click", function() {
              this.setAttribute("style", "display:none;");
            });
            this._webComponentWindow.document.querySelector("body").appendChild(errorLayer);
          }
        },

        /**
         *@inheritDoc
         */
        setFocus: function(fromMouse) {
          if (this._isReady) {
            this._iframeElement.domFocus(); //force focus to blur other elements
            this._toICAPI('onFocus', true);
          } else {
            this.when(cls.WebComponentWidget.ready, this._onReadyFocus.bind(this));
          }
          $super.setFocus.call(this, fromMouse);
        },

        hasDOMFocus: function() {
          return document.activeElement === this._iframeElement;
        },

        /**
         * Tell the WebComponent that typeahead lost the Focus on it
         * @publicdoc
         */
        loseFocus: function() {
          $super.loseFocus.call(this);
          this._onReadyExecute(function() {
            this._onReadyBlur();
          }.bind(this));
        },

        /**
         * Called when the WC formfield's state has changed
         * @param {boolean} active - form state
         * @param {string} dialogType - form display type (display, input ...)
         * @publicdoc
         */
        onStateChanged: function(active, dialogType) {
          this._onReadyExecute(function() {
            this._onReadyStateChanged(active, dialogType);
          }.bind(this));
        },

        /**
         * Defines the address of the WebComponent
         * @param {string} url - address
         * @publicdoc
         */
        setUrl: function(url) {
          this._url = url;
          url = url ? url : 'about:blank';
          this._iframeElement.setAttribute('src', url);
        },

        /**
         * Get the address of the WebComponent
         * If the webcomponent is url based, it will work only if url is on same domain as application
         * @returns {string} address of the webcomponent
         */
        getUrl: function() {
          var url = this._iframeElement.getAttribute('src') || this._url;
          var contentUrl = false;
          if (this._webComponentType === 'url') {
            try {
              contentUrl = this._iframeElement.contentWindow && this._iframeElement.contentWindow.location.href;
            } catch (e) {
              contentUrl = false;
            }
          }
          return contentUrl ? contentUrl : url;

        },

        /**
         * Set the WebComponent value
         * @param {string} value -value of the webcomponent, will be the url of it if WebComp is urlType
         * @param {boolean} fromVM - flag to define if value comes from the VM
         * @publicdoc
         */
        setValue: function(value, fromVM) {
          var empty = value === '';
          // Value should be a string to fit GDC/VM specs
          if (typeof value !== 'string') {
            value = JSON.stringify(value);
          }
          this._value = value;
          if (this._webComponentType === 'url') {
            this.setUrl(empty ? '' : value);
          } else {
            this._onReadyExecute(function() {
              this._toICAPI('onData', this._value ? this._value : '');
            }.bind(this));
          }
        },

        /**
         * Get The value of the webComponent
         * @returns {string} value or url of the webcomponent
         */
        getValue: function() {
          this.flushWebcomponentData();
          var result = this._webComponentType === 'api' ? this._flushValue ? this._flushValue : this._value : this.getUrl();
          this._flushValue = null; // reset value
          return result;
        },

        /**
         * Define the type of component
         * @param {string} type - should be 'api' or 'url'
         */
        setWebComponentType: function(type) {
          this._webComponentType = type;
        },

        /**
         * Get the type of component
         * @return {?string} type - should be 'api' or 'url'
         */
        getWebComponentType: function() {
          return this._webComponentType;
        },

        /**
         * Force webcomponent to get data
         * @public
         */
        flushWebcomponentData: function() {
          if (!this._flushingData) {
            this._flushingData = true;
            this._toICAPI('onFlushData');
          }
        },

        /**
         * Stop VMApplication with a message
         * @param {string=} message - message to give to the app close (default is defined in locales)
         * @public
         */
        webComponentNotFound: function(message) {
          if (!context.bootstrapInfo.ignoreWebComponentFails) {
            //VMApplication stop with a message
            var currentApp = gbc.SessionService.getCurrent() && gbc.SessionService.getCurrent().getCurrentApplication();
            if (currentApp) {
              currentApp.fail(message ? message : i18next.t('gwc.app.webcompNotFound.message'));
            }
          }
        }
      };
    });
    cls.WidgetFactory.registerBuilder('WebComponent', cls.WebComponentWidget);
  });
