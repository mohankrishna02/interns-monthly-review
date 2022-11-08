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

modulum('LogPlayerWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Widget used to replay logs from VM, GBC, GDC and so
     * @class LogPlayerWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.LogPlayerWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.LogPlayerWidget.prototype */ {
        __name: "LogPlayerWidget",

        /** @type {Element} **/
        _fileInput: null,
        /** @type {Element} **/
        _delayInput: null,
        /** @type {Element} **/
        _delayFromLogElement: null,
        /** @type {classes.ToggleCheckBoxWidget} **/
        _delayFromLogWidget: null,
        /** @type {Element} **/
        _showHelpersElement: null,
        /** @type {classes.ToggleCheckBoxWidget} **/
        _showHelpersWidget: null,
        /** @type {Element} **/
        _resetButton: null,
        /** @type {Element} **/
        _nextStepButton: null,
        /** @type {Element} **/
        _playAllButton: null,
        /** @type {Element} **/
        _pauseButton: null,
        /** @type {Element} **/
        _forwardInput: null,
        /** @type {Element} **/
        _forwardButton: null,
        /** @type {classes.ToggleCheckBoxWidget} **/
        _statsCheckWidget: null,
        /** @type {Element} **/
        _statsElement: null,
        /** @type {Array} **/
        _log: null,
        /** @type {Number} **/
        _currentLogLine: 0,
        /** @type {Number} **/
        _currentDvmOrder: 0,
        /** @type {Number} **/
        _numberOfDvmOrdersToProcess: 0,
        /** @type {Number} **/
        _processedDvmOrders: 0,
        /** @type {Number} **/
        _startTime: null,
        /** @type {Number} **/
        _maxNumberOfElements: null,
        /** @type {Number} **/
        _maxNumberOfWidgets: null,
        /** @type {Element} **/
        _debugCursorElement: null,
        /** @type {Element} **/
        _keyPressedElement: null,
        /** @type {Element} **/
        _mousePressedElement: null,
        /** @type {Element} **/
        _headerElement: null,
        /** @type {Object} **/
        _gbcBrowserInfo: null,
        /** @type {classes.LogInfoWidget} **/
        _logInfoWidget: null,
        /** @type {Boolean} **/
        _isPaused: false,
        /** @type {Object} **/
        _userInteractionElement: null,
        /** @type {Boolean} **/
        _userInteractionAllowed: false,
        /** @type {classes.ToggleCheckBoxWidget} **/
        _userInteractionWidget: null,

        /** @type {Element} **/
        _customStyle: null,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);

          window._logplayer = this;

          var root = this.getElement();

          this._fileInput = root.querySelector(".logplayer-fileinput");
          this._fileInput.on('change.LogPlayerWidget', this.loadFile.bind(this));

          this._headerElement = root.querySelector("header");
          this._resetButton = root.querySelector(".logplayer-reset");
          this._nextStepButton = root.querySelector(".logplayer-step");
          this._playAllButton = root.querySelector(".logplayer-play");
          this._pauseButton = root.querySelector(".logplayer-pause");
          this._forwardInput = root.querySelector(".logplayer-forward-count");
          this._forwardButton = root.querySelector(".logplayer-forward");
          this._delayInput = root.querySelector(".logplayer-delay");
          this._delayFromLogElement = root.querySelector(".logplayer-delayfromlog");
          this._statsElement = root.querySelector(".logplayer-stats");
          this._showHelpersElement = root.querySelector(".logplayer-showHelpers");
          this._debugCursorElement = root.querySelector(".logplayer-cursor");
          this._keyPressedElement = root.querySelector(".logplayer-keypressed");
          this._mousePressedElement = root.querySelector(".logplayer-mousepressed");
          this._userInteractionElement = root.querySelector(".logplayer-userInteraction");

          // Default value
          this.setDelayInputValue(500);

          this._gbcTitle = document.querySelector(".mt-toolbar-title");

          this.setButtonEnabled(this._resetButton, false);
          this.setButtonEnabled(this._nextStepButton, false);
          this.setButtonEnabled(this._playAllButton, false);
          this.setButtonEnabled(this._pauseButton, false);
          this.setButtonEnabled(this._forwardButton, false);

          this._statsCheckWidget = cls.WidgetFactory.createWidget("ToggleCheckBox", this.getBuildParameters());
          this._statsCheckWidget.setEnabled(true);
          this._statsCheckWidget.setText(i18next.t("gwc.logPlayer.topBar.statistics"));
          this._statsCheckWidget.setTitle(i18next.t("gwc.logPlayer.topBar.statisticsTitle"));
          this._statsCheckWidget.setValue(false);
          this._statsElement.appendChild(this._statsCheckWidget.getElement());

          this._delayFromLogWidget = cls.WidgetFactory.createWidget("ToggleCheckBox", this.getBuildParameters());
          this._delayFromLogWidget.setEnabled(true);
          this._delayFromLogWidget.setText(i18next.t("gwc.logPlayer.topBar.delayFromLog"));
          this._delayFromLogWidget.setValue(false);
          this._delayFromLogElement.appendChild(this._delayFromLogWidget.getElement());

          this._showHelpersWidget = cls.WidgetFactory.createWidget("ToggleCheckBox", this.getBuildParameters());
          this._showHelpersWidget.setEnabled(true);
          this._showHelpersWidget.setText(i18next.t("gwc.logPlayer.topBar.showHelpers"));
          this._showHelpersWidget.setTitle(i18next.t("gwc.logPlayer.topBar.showHelpersTitle"));
          this._showHelpersWidget.setValue(true);
          this._showHelpersElement.appendChild(this._showHelpersWidget.getElement());

          if (gbc.DebugService.isActive()) {
            this._userInteractionWidget = cls.WidgetFactory.createWidget("ToggleCheckBox", this.getBuildParameters());
            this._userInteractionWidget.setEnabled(true);
            this._userInteractionWidget.setText("User Interaction");
            this._userInteractionWidget.setValue(false);
            this._userInteractionWidget.when(context.constants.widgetEvents.change, function() {
              this.addOverlay(!this._userInteractionWidget.getValue(), false, true);
            }.bind(this));
            this._userInteractionElement.appendChild(this._userInteractionWidget.getElement());
          }
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._statsCheckWidget) {
            this._statsCheckWidget.destroy();
            this._statsCheckWidget = null;
          }
          if (this._delayFromLogWidget) {
            this._delayFromLogWidget.destroy();
            this._delayFromLogWidget = null;
            this._delayFromLogElement = null;
          }
          if (this._showHelpersWidget) {
            this._showHelpersWidget.destroy();
            this._showHelpersWidget = null;
          }
          if (this._logInfoWidget) {
            this._logInfoWidget.destroy();
            this._logInfoWidget = null;
          }
          if (this._customStyle) {
            document.getElementsByTagName('head')[0].removeChild(this._customStyle);
          }

          $super.destroy.call(this);
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
        manageMouseClick: function(domEvent) {
          var target = domEvent.target;
          if (target.isElementOrChildOf(this._resetButton)) {
            this.reset();
          } else if (target.isElementOrChildOf(this._nextStepButton)) {
            this.nextStep();
          } else if (target.isElementOrChildOf(this._playAllButton)) {
            this.play();
          } else if (target.isElementOrChildOf(this._forwardButton)) {
            this.forward();
          } else if (target.isElementOrChildOf(this._pauseButton)) {
            this.pause();
          }
          return true;
        },

        /**
         * Define a delay between orders
         * @param {Number} value - value in ms
         */
        setDelayInputValue: function(value) {
          this._delayInput.value = value;
        },

        /**
         * Define the step to go forward to
         * @param {Number} value - step number to go to
         */
        setForwardInputValue: function(value) {
          this._forwardInput.value = value;
        },

        /**
         * Method called when content is read from a log file
         * @param {String|String[]} content
         */
        loadContent: function(content) {
          this._nextStepButton.removeAttribute('disabled');
          this._playAllButton.removeAttribute('disabled');
          this._log = null;
          this.reset();
          var rawContent = content;

          content = content.split('\n').map(function(line) {
            return line.trim();
          });
          if (content.length > 0) {
            if (rawContent.indexOf('gbcLog') < 0 && this._logInfoWidget) {
              this._logInfoWidget.destroy();
            }
            var firstLine = content[0];
            if (firstLine === 'LOGVERSION=2') {
              this.parseGdcLog(content);
            } else if (firstLine.substr(0, 5) === 'om 0 ') {
              this.parseFglLog(content);
            } else if (firstLine === 'guilog v2') {
              this.parseFglLogV2(content);
            } else if (firstLine === '#Version: 1.0') {
              this.parseUaproxyLog(content);
            } else if (rawContent.indexOf('gbcLog') >= 0) {
              this.parseGbcLog(JSON.parse(rawContent));
            }
            this.setButtonEnabled(this._resetButton, true);
            this.setButtonEnabled(this._nextStepButton, true);
            this.setButtonEnabled(this._playAllButton, true);
            this.setButtonEnabled(this._forwardButton, true);
          }
        },

        /**
         * Method called when a file has been inputed
         * @param event
         */
        loadFile: function(event) {
          if (event.target.files.length > 0) {
            context.LogPlayerService.cleanApplications(); //Reset all current applications
            this._fileInput.setAttribute("title", event.target.files[0].name + " loaded");
            this._gbcTitle = document.querySelector(".mt-toolbar-title");
            this._gbcTitle.innerHTML = "<b>Log Player : </b> " + event.target.files[0].name;

            var reader = new FileReader();
            reader.onload = function(fEvent) {
              this.loadContent(fEvent.target.result);
            }.bind(this);
            reader.readAsText(event.target.files[0]);
          }
        },

        /**
         * Reset logPlayer at first instruction
         */
        reset: function() {
          // Current app reset
          if (gbc.SessionService.getCurrent()) {
            gbc.SessionService.getCurrent().closeSession();
            gbc.SessionService.getCurrent().destroy();
          }
          if (this._logInfoWidget) {
            this._logInfoWidget.setHidden(false);
          }

          this.setButtonEnabled(this._resetButton, true);
          this.setButtonEnabled(this._nextStepButton, true);
          this.setButtonEnabled(this._playAllButton, true);
          this.setButtonEnabled(this._forwardButton, true);
          this.addOverlay(false, true);

          this._currentLogLine = 0;
          this._currentDvmOrder = 0;
          this._numberOfDvmOrdersToProcess = 0;
          this._processedDvmOrders = 0;

          gbc.LogPlayerService.cleanApplications();
          var appElement = document.querySelector(".gbc_ApplicationWidget");
          if (appElement) {
            appElement.innerHTML = "";
          }
          if (this._gbcTitle) {
            this._gbcTitle.parent("gbc_ApplicationLauncherWidget").removeClass("hidden");
          }
          this._cleanDebugHelper();
          this.setButtonEnabled(this._fileInput, true);

        },

        /**
         * Parse a GDC formatted log
         * @param log
         */
        parseGdcLog: function(log) {
          this._log = [];
          for (var i = 0; i < log.length; ++i) {
            if (i !== 0) {
              var line = log[i];
              if (line.length > 0) {
                var appEnd = line.indexOf(':');
                var senderEnd = line.indexOf(':', appEnd + 1);
                var delayEnd = line.indexOf(':', senderEnd + 1);

                var entry = {};
                entry.app = line.substring(0, appEnd);
                entry.sender = line.substring(appEnd + 1, senderEnd);
                entry.delay = line.substring(senderEnd + 1, delayEnd);
                entry.content = context.LogPlayerService.mockOrderResources(line.substring(delayEnd + 1));

                this._log.push(entry);
              }
            }
          }
        },

        /**
         * Parse a GBC formatted Log
         * @param {Object} log - json Formated log
         */
        parseGbcLog: function(log) {
          this._currentLogType = log.logType;
          this._delayFromLogWidget.setValue(true);
          this.setDelayInputValue(5); // if gbcLog: put some small value in this field
          this._log = [];
          var lastKnownTimestamp = 0;
          var style = 'color: #007da0'; // console style

          this._gbcBrowserInfo = log.browserInfos;
          // Show info in the page when parsing log
          if (this._logInfoWidget) {
            this._logInfoWidget.destroy();
          }
          this._logInfoWidget = cls.WidgetFactory.createWidget("LogInfo", this.getBuildParameters());
          window.document.querySelector(".gbc_ApplicationLauncherWidget>.containerElement").appendChild(this._logInfoWidget.getElement());
          this._logInfoWidget.setGBCInfo(log.gbcInfos);
          this._logInfoWidget.setBrowserInfo(log.browserInfos);
          this._logInfoWidget.setTheme(log.themeVariables);
          this._logInfoWidget.setSettings(log.storedSettings);

          this._customStyle = document.createElement('style');
          this._customStyle.type = 'text/css';
          document.getElementsByTagName('head')[0].appendChild(this._customStyle);

          // Ensure messages are well positioned
          context.HostService.onScreenResize(function() {
            var margin = document.body.clientWidth - log.browserInfos.dimension.width;
            this._customStyle.innerHTML = '.gbc_ApplicationHostWidget .mt-centralcontainer{ left: 0px!important}\n';
            this._customStyle.innerHTML += '.gbc_MessageWidget.bottom-right, .gbc_MessageWidget.top-right{ margin-right: ' +
              margin + 'px }\n';
          }.bind(this));

          var margin = document.body.clientWidth - log.browserInfos.dimension.width;
          this._customStyle.innerHTML = '.gbc_MessageWidget.bottom-right, .gbc_MessageWidget.top-right{ margin-right: ' + margin +
            'px; }\n';
          this._customStyle.innerHTML +=
            '.gbc_ChromeBarWidget.mt-toolbar .mt-sidebar-toggle, .gbc_ApplicationHostSidebarWidget .mt-sidebar-toggle { display:inherit!important; pointer-events:all!important;}\n';

          // If log specifically said: no sidebar
          if (!log.gbcInfos.isSideBarVisible) {
            var st = document.createElement('style');
            st.type = 'text/css';
            st.innerHTML = '.mt-sidebar:not(.mt-sidebar-unavailable){ left: -100%; }';
            document.getElementsByTagName('head')[0].appendChild(st);
            gbc.HostService.getApplicationHostWidget().hideSidebar();
            this._customStyle.innerHTML += ".gbc_ApplicationHostWidget .mt-centralcontainer{ left: 0px!important}";
          }
          // Header part in console
          console.log('%c ~~~~~~~~~~~~~~~~~~~   Starting GBC log   ~~~~~~~~~~~~~~~~~~~', style);
          console.log('%c Recorded date : ', style, new Date(log.runDate));
          console.log('%c GBC ' + log.gbcInfos.version + '-' + log.gbcInfos.build + ' - Platform: ' + log.gbcInfos.platformName +
            ' - Protocol: ' + log.gbcInfos.protocolType, style);
          console.log('%c   - Theme: ' + log.gbcInfos.activeTheme, style);
          console.log('%c   - Available themes: ', style, log.gbcInfos.availableThemes);
          console.log('%c BROWSER ', style);
          console.log('%c   - User Agent: ', style, log.browserInfos.userAgent);
          console.log('%c   - OS: ', style, log.browserInfos.os);
          console.log('%c   - Language: ', style, log.browserInfos.activeLanguage, log.browserInfos.availableLanguages);
          console.log('%c   - Dimension: ', style, log.browserInfos.dimension);
          console.log('%c   - URL: ', style, log.browserInfos.url);
          console.log('%c THEME VARIABLES: ', style, log.themeVariables);
          console.log('%c STORED SETTINGS: ', style, log.storedSettings);

          // Activate debug mode if log has been recorded with it
          if (log.gbcInfos.debugMode) {
            gbc.DebugService.activate(true);
          }

          var line = null,
            entry = {};

          // Pre-Process every log when parsing
          for (var i = 1; i < log.logs.length; ++i) { // start at 1 since 0 is "gbclog"
            line = log.logs[i];
            entry = {};
            entry.delay = 0;
            entry.app = "" + line.appId;

            // Get info about timestamp
            lastKnownTimestamp = line.t ? line.t : lastKnownTimestamp;
            entry.timestamp = lastKnownTimestamp;

            // Timestamp / delay calculation
            if (this._log.length >= 1) {
              if (lastKnownTimestamp !== this._log[this._log.length - 1].timestamp) {
                if (this._log[this._log.length - 1].timestamp > 0) {
                  entry.delay = lastKnownTimestamp - this._log[this._log.length - 1].timestamp;
                }
              }
            }

            // In this case, it should be treated as a DVM RESPONSE
            if (line.provider === "[NETWORK]") {
              if (line.httpType === "HTTP RESPONSE") {
                entry.sender = "DVM";
                entry.app = "" + line.appId;
                entry.content = context.LogPlayerService.mockOrderResources(line.data, log.images);
                this._log.push(entry);
              } else if (line.httpType === "HTTP REQUEST") {
                entry.sender = "GBC-NETWORK";
                entry.content = line.type;
                if (line.uaDetails === "auiOrder") {
                  entry.content = line.data;
                } else {
                  entry.app = "?";
                }

                this._log.push(entry);
              }
            } else if (line.provider === "[MOUSE]") {
              // Add a move entry delay 500ms before the click
              entry.sender = "GBC";
              entry.data = line;
              entry.data.move = true;
              entry.data.click = false;
              var entryClick = JSON.parse(JSON.stringify(entry)); // deep copy the first entry
              entry.data.rightClick = false;
              this._log.push(entry);
              // Add the click entry
              entryClick.data.move = false;
              entryClick.data.click = true;
              this._log.push(entryClick);
            } else {
              entry.sender = "GBC";
              entry.data = line;
              this._log.push(entry);
            }
          }
        },

        /**
         * Parse a FGL formatted log
         * @param log
         */
        parseFglLog: function(log) {
          this._log = [];
          for (var i = 0; i < log.length; ++i) {
            var line = log[i];
            if (line.length > 0) {
              var entry = {};
              entry.app = "0";
              entry.delay = 1000;
              if (line[0] === '#') {
                if (line.substr(0, 7) === '#event ') {
                  entry.sender = "FE";
                } else {
                  entry.sender = "COMMENT";
                }
                entry.content = context.LogPlayerService.mockOrderResources(line.substring(1));
              } else {
                entry.sender = "DVM";
                entry.content = context.LogPlayerService.mockOrderResources(line);
              }
              this._log.push(entry);
            }
          }
        },

        /**
         * Parse a FGL with new log format
         * @param log
         */
        parseFglLogV2: function(log) {
          this._log = [];
          var lastOrderTime = 0;
          for (var i = 1; i < log.length; ++i) {
            var line = log[i];
            if (line.length > 0) {
              var colonIndex = line.indexOf(':');
              var info = line.substr(0, colonIndex).split(' ');
              var entry = {};
              entry.app = info[0];
              var timestamp = parseInt(info[1]);
              entry.delay = timestamp - lastOrderTime;
              lastOrderTime = timestamp;
              entry.sender = info[2] === 'i' ? "FE" : "DVM";
              entry.content = context.LogPlayerService.mockOrderResources(line.substr(colonIndex + 1));
              this._log.push(entry);
            }
          }
        },

        /**
         * Parse UA proxy formatted log
         * @param log
         */
        parseUaproxyLog: function(log) {
          this._log = [];
          var fieldsCount = null;
          var relativeTimeFieldIndex = null;
          var contextsFieldIndex = null;
          var eventTypeFieldIndex = null;
          var eventParamsFieldIndex = null;
          var timeSinceLastDvmOrder = 0;

          for (var i = 0; i < log.length; ++i) {
            var line = log[i];
            if (line.length !== 0) {
              if (line[0] === '#') {
                if (line.substr(0, 9) === '#Fields: ') {
                  var fields = line.substr(9).split(' ');
                  fieldsCount = fields.length;
                  relativeTimeFieldIndex = fields.indexOf('relative-time');
                  contextsFieldIndex = fields.indexOf('contexts');
                  eventTypeFieldIndex = fields.indexOf('event-type');
                  eventParamsFieldIndex = fields.indexOf('event-params');
                  if (relativeTimeFieldIndex === -1 || contextsFieldIndex === -1 || eventTypeFieldIndex === -1 ||
                    eventParamsFieldIndex === -1) {
                    this.addLog(" ", '<b>Log fields missing. Enable "ALL DEBUG" categories</b>');
                    return;
                  }
                }
              } else {
                var sectionStart = -1;
                var sections = [];
                for (var j = 0; j < line.length; ++j) {
                  var c = line[j];
                  if (c === ' ') {
                    sections.push(line.substring(sectionStart + 1, j));
                    sectionStart = j;
                  } else if (c === '"') {
                    j = line.indexOf('"', j + 1);
                  }
                  if (sections.length === fieldsCount - 1) {
                    sections.push(line.substr(j + 1));
                    break;
                  }
                }
                timeSinceLastDvmOrder += parseFloat(sections[relativeTimeFieldIndex]);
                var contexts = sections[contextsFieldIndex];
                var eventType = sections[eventTypeFieldIndex];
                var eventParams = sections[eventParamsFieldIndex];
                var vmIdIndex = contexts.indexOf('VM=');
                var vmId = null;
                if (vmIdIndex !== -1) {
                  var semiColonIndex = contexts.indexOf(';', vmIdIndex);
                  if (semiColonIndex === -1) {
                    semiColonIndex = undefined;
                  }
                  vmId = contexts.substring(vmIdIndex + 3, semiColonIndex);
                }
                if (vmId !== null) {
                  if (eventType === '"Sending VM"' || eventType === '"Sending UA"') {
                    if ((eventParams.indexOf("meta Connection") === 0 || eventParams.indexOf("om") === 0 || eventParams.indexOf(
                        "event _om") === 0)) {
                      var sender = eventType === '"Sending UA"' ? "DVM" : "FE";
                      var orders = eventParams;
                      var crIndex = -1;
                      do {
                        crIndex = orders.indexOf('\\n', crIndex + 1);
                        if (crIndex > 1 && orders[crIndex - 1] !== '\\') {
                          orders = orders.substr(0, crIndex) + '\n' + orders.substr(crIndex + 2);
                        }
                      } while (crIndex !== -1);
                      var order = this.detachString(orders);
                      order = order.replace(/([^\\])\\t/g, '$1\t');
                      order = order.replace(/\\\\n/g, '\\n');
                      order = order.replace(/\\\\\\\\/g, '//');
                      order = order.replace(/\\\\"/g, '\\"');
                      order = order.replace(/\\r/g, '');
                      order = order.replace(/%/g, "%25");
                      order = decodeURIComponent(order.replace(/\\x/g, "%"));
                      order = context.LogPlayerService.mockOrderResources(order);

                      if (order !== '-') { // '-' marks the DVM deconection
                        var entry = {};
                        entry.app = this.detachString(vmId);
                        entry.sender = sender;
                        entry.content = order;
                        entry.delay = sender === 'DVM' ? Math.round(timeSinceLastDvmOrder * 1000) : 0;
                        timeSinceLastDvmOrder = 0;
                        this._log.push(entry);
                      }
                      orders = orders.substring(crIndex + 2);
                    } else if (/X-FourJs-Closed: true/.test(line)) {
                      var closeEntry = {};
                      closeEntry.app = this.detachString(vmId);
                      closeEntry.sender = "";
                      closeEntry.content = "";
                      closeEntry.close = true;
                      closeEntry.delay = 0;
                      timeSinceLastDvmOrder = 0;
                      this._log.push(closeEntry);

                    }
                  }
                }
              }
            }
          }
        },

        /**
         * Go to the next step
         */
        nextStep: function() {
          if (this._log) {
            this._processedDvmOrders = 0;
            this._numberOfDvmOrdersToProcess = 1;
            this.run();
          }
        },

        /**
         * Play the log at current step
         */
        play: function() {
          if (this._log) {
            this._startTime = performance.now();
            this._processedDvmOrders = 0;
            this._numberOfDvmOrdersToProcess = this._log.length;
            this.run();
          }
        },

        /**
         * Pause the log execution
         */
        pause: function() {
          this._isPaused = true;
          this.setButtonEnabled(this._playAllButton, true);
          this.setButtonEnabled(this._pauseButton, false);
          this.setButtonEnabled(this._nextStepButton, true);
          this.setButtonEnabled(this._resetButton, true);
          this.addOverlay(false);
        },

        /**
         * FastForward at a given step
         * @see this.setForwardInputValue method
         */
        forward: function() {
          if (this._log) {
            this._processedDvmOrders = 0;
            this._numberOfDvmOrdersToProcess = this._forwardInput.value;
            this.run();
          }
        },

        /**
         * Rework an entry to add some extra info in case of gbcLog
         * @param {Object} entry - log entry to re-format
         * @return {Object} return the modified entry
         * @private
         */
        _handleGBCLog: function(entry) {
          var entryData = entry.data;
          if (entryData) {
            // get category
            var mouseMatch = entryData.provider.match(/\[MOUSE\]/);
            var keyboardMatch = entryData.provider.match(/\[KEYBOARD\]/);
            var uiMatch = entryData.provider.match(/\[UI\]/);
            var outstr = "";

            // Anything MOUSE related
            if (mouseMatch) {
              var x = entryData.clientX - 16; // 16px is the half of the cursor image
              var y = entryData.clientY + this._headerElement.clientHeight - 16;

              var action = entryData.click ? "click" : "move";
              action = entryData.rightClick ? "rightClick" : action;

              outstr = action + ' at x:' + x + ' y:' + y;
              console.log('%c ' + outstr + ' on', 'color: #007da0', entryData.itemId, entryData.itemElement);

              var clickDelay = action === "click" ? entry.delay : 100;
              entry.delay = action === "move" ? 0 : entry.delay;

              this.setDebugMouse(x, y, action, clickDelay);
              // Anything KEYBOARD related
            } else if (keyboardMatch) {
              outstr = 'Keyboard key pressed: ';
              console.log('%c ' + outstr, 'color: #007da0', entryData.eventKey || entryData.bufferedKey);
              if (entryData.bufferedKey && entryData.eventKey && entryData.type === "onKeyDown") {
                this.setDebugKeyboardKey(entryData.bufferedKey);
              }
              // Anything UI related
            } else if (uiMatch) {
              if (entryData.type === "sidebar") {
                if (entryData.status) {
                  gbc.HostService.getApplicationHostWidget().showSidebar();
                } else {
                  gbc.HostService.getApplicationHostWidget().hideSidebar();
                }
              } else if (entryData.type === "dropdown") {
                if (entryData.name === "ChromeRightBarWidget") {
                  console.log("chromebar open");
                  var rb = gbc.SessionService.getCurrent().getCurrentApplication().getChromeBar().getRightBarWidget();
                  if (entryData.status) {
                    rb.show();
                  } else {
                    rb.hide();
                  }
                } else if (entryData.name === "ContextMenuWidget") {
                  if (entryData.data.parentName === "TableColumnTitleWidget") {
                    var tbColumn = window.gbcWidget(entryData.data.auiTag);
                    var titleWidget = tbColumn.getTitleWidget();
                    if (entryData.status) {
                      titleWidget.showContextMenu(entryData.data.x);
                    } else if (titleWidget._contextMenu) {
                      titleWidget._contextMenu.hide();
                    }
                  }
                }
              }
            }
          }
          if (entry.content && entry.content.substr(0, 4) === "om 0") {
            entry.dimension = this._gbcBrowserInfo.dimension;
          }
          return entry;
        },

        /**
         * Run the Log player
         */
        run: function() {
          this.addOverlay(true);
          // Set the control button accordingly
          if (!this._isPaused) {
            this.setButtonEnabled(this._resetButton, false);
          }
          this.setButtonEnabled(this._nextStepButton, this._isPaused);
          this.setButtonEnabled(this._playAllButton, this._isPaused);
          this.setButtonEnabled(this._pauseButton, !this._isPaused);
          this.setButtonEnabled(this._forwardButton, false);

          // Prevent file upload while processing
          this.setButtonEnabled(this._fileInput, false);

          // While there are instruction to process
          while (this._currentLogLine < this._log.length) {
            if (this._isPaused) {
              this._isPaused = false;
              return;
            }
            var entry = this._log[this._currentLogLine];
            ++this._currentLogLine;
            var isDvm = entry.sender === 'DVM' && entry.content.substr(0, 5) !== 'meta ';
            if (this._currentLogType === "gbcLog") {
              entry = this._handleGBCLog(entry);
            }
            // Handle delay from log if option is activated
            if (!this._delayFromLogWidget.getValue()) {
              entry.delay = isDvm ? parseInt(this._delayInput.value, 10) : 5;
            }

            if (entry.content) {
              this.addLog(entry.app + ':' + entry.sender, entry.content, isDvm);
              if (isDvm) {
                this.setForwardInputValue(this._currentDvmOrder);
                ++this._processedDvmOrders;
                ++this._currentDvmOrder;

                var callback = null;
                if (this._processedDvmOrders < this._numberOfDvmOrdersToProcess && this._currentLogLine < this._log.length) {
                  callback = this._delayRunner(entry.delay);
                } else {
                  callback = this._setPlayerEnabled.bind(this);
                  this.emit(context.constants.widgetEvents.logForwardDone);
                }
                var app = context.LogPlayerService.getApplication(0, entry.app);
                context.LogPlayerService.setVisibleApplication(app);
                app.dvm.manageAuiOrders(entry.content, callback);
                // Entry provides a dimension: use it to change the app width!
                if (entry.dimension) {
                  document.querySelector(".gbc_ApplicationWidget").style.width = entry.dimension.width + "px";
                  document.querySelector(".gbc_ApplicationWidget").style.height = entry.dimension.height + "px";
                  document.querySelector(".gbc_SessionWidget").style.overflow = "auto"; // allow scrolling
                }
                this.emit(context.constants.widgetEvents.logStepDone, this._processedDvmOrders);
                break;
              } else if (entry.close) {
                var closeApp = context.LogPlayerService.getApplication(0, entry.app);
                if (closeApp) {
                  closeApp.setEnding();
                  closeApp.stop();
                  context.LogPlayerService.removeApplication(0, entry.app);
                }
              } else {
                this._delayRunner(entry.delay)();
                break;
              }
            } else {
              this._delayRunner(entry.delay)();
              break; // no entry
            }
          }

          // Update the statistics widget
          if (this._statsCheckWidget.getValue()) {
            var elementNumber = document.getElementsByTagName('*').length;
            if (this._maxNumberOfElements === null || elementNumber > this._maxNumberOfElements) {
              this._maxNumberOfElements = elementNumber;
            }
            var widgetNumber = gbc.WidgetService.getAllWidgetsCount();
            if (this._maxNumberOfWidgets === null || widgetNumber > this._maxNumberOfWidgets) {
              this._maxNumberOfWidgets = widgetNumber;
            }
          }

          // End of the log
          if (this._currentLogLine >= this._log.length) {
            // Generate the log report
            var reportTime = "";
            if (this._startTime !== null) {
              var t1 = performance.now();
              reportTime = "Duration: " + parseInt(t1 - this._startTime) + " milliseconds.";
              this.addLog(" ", reportTime);
              this._startTime = null;
            }
            var reportDOM = "";
            if (this._maxNumberOfElements !== null) {
              reportDOM = "Max number of DOM elements: " + this._maxNumberOfElements;
              this.addLog(" ", reportDOM);
              this._maxNumberOfElements = null;
            }
            var reportWidget = "";
            if (this._maxNumberOfWidgets !== null) {
              reportWidget = "Max number of widgets: " + this._maxNumberOfWidgets;
              this.addLog(" ", reportDOM);
              this._maxNumberOfWidgets = null;
            }
            if (!gbc.qaMode && (reportDOM !== "" || reportTime !== "")) {
              gbc.alert(reportTime + "\n" + reportDOM + "\n" + reportWidget, "LogPlayer", function() {
                this.addOverlay(false);
              }.bind(this));

              if (this._logInfoWidget) {
                this._logInfoWidget.setHidden(true);
              }

            }

            // End of log, set the button accordingly
            this.setButtonEnabled(this._resetButton, true);
            this.setButtonEnabled(this._nextStepButton, false);
            this.setButtonEnabled(this._playAllButton, false);
            this.setButtonEnabled(this._pauseButton, false);
            this.setButtonEnabled(this._forwardButton, false);
            this.setButtonEnabled(this._fileInput, true);
            this.log = [];

            context.SessionService.getCurrent().closeSession();
            this.addLog(" ", '<b>== LOG FINISHED ==</b>');
            context.LogPlayerService.cleanApplications();
            this._cleanDebugHelper();
            this.emit(context.constants.widgetEvents.ready);
          }
        },

        /**
         * Wrapper to delay the logPlayer instructions
         * @param {Number} delay - in ms
         * @return {function} callback
         * @private
         */
        _delayRunner: function(delay) {
          return function() {
            this._registerTimeout(function() {
              this.run();
            }.bind(this), delay || this._delayInput.value);
          }.bind(this);
        },

        /**
         * Set player enabled
         * @private
         */
        _setPlayerEnabled: function() {
          this.setButtonEnabled(this._resetButton, true);
          this.setButtonEnabled(this._nextStepButton, true);
          this.setButtonEnabled(this._playAllButton, true);
          this.setButtonEnabled(this._pauseButton, false);
          this.setButtonEnabled(this._forwardButton, true);
          this.setButtonEnabled(this._fileInput, false);
        },

        /**
         * Display a log in the console
         * @param context
         * @param content
         * @param withOrderNumber
         */
        addLog: function(context, content, withOrderNumber) {
          var orderNr = withOrderNumber ? this._currentDvmOrder : ' ';
          console.log("LOGPLAYER", orderNr, context, content);
        },

        /**
         * Change the state of a given button
         * @param {Element} button - button element to change
         * @param {Boolean} enabled - true to activate the button, false otherwise
         */
        setButtonEnabled: function(button, enabled) {
          if (enabled) {
            button.removeClass("disabled");
            button.removeAttribute("disabled");
            if (button === this._fileInput) {
              this._fileInput.querySelector("input").removeAttribute("disabled");
            }
          } else {
            button.addClass("disabled");
            button.setAttribute("disabled", "disabled");
            if (button === this._fileInput) {
              this._fileInput.querySelector("input").setAttribute("disabled", "disabled");
            }
          }
        },

        /**
         * Detaches the huge uaproxy log string from chunks we really need for memory optimi
         * @param {string} s
         * @return {string}
         */
        detachString: function(s) {
          return (' ' + s).slice(1);
        },

        /**
         * Method to put a visual mouse pointer at a given position
         * @param {Number|Boolean} x - horizontal position or false to hide it
         * @param {Number?} y - vertical position
         * @param {String?} action - click or move
         * @param {Number?} clickDelay - delay the click effect (in ms)
         */
        setDebugMouse: function(x, y, action, clickDelay) {
          if (this._showHelpersWidget.getValue()) {
            this._cleanDebugHelper();
            if (x && y) {
              this._debugCursorElement.removeClass("hidden");
              if (action === "move") {
                this._debugCursorElement.style.top = y + "px";
                this._debugCursorElement.style.left = x + "px";
              }
              if (action.toLowerCase().indexOf("click") >= 0) {
                this._mousePressedElement.removeClass("hidden");
                var left = this._mousePressedElement.querySelector(".key-left");
                var right = this._mousePressedElement.querySelector(".key-right");

                this._registerTimeout(function() {
                  this._debugCursorElement.addClass("highlight");
                  if (action === "click") {
                    left.addClasses("pressed");
                  } else if (action === "rightClick") {
                    right.addClasses("pressed");
                  }
                  this._registerTimeout(function() {
                    this._debugCursorElement.removeClass("highlight");
                    left.removeClass("pressed");
                    right.removeClass("pressed");
                  }.bind(this), 500);
                }.bind(this), clickDelay);
              }
            } else {
              this._mousePressedElement.addClass("hidden");
              this._debugCursorElement.addClass("hidden");
            }
          }
        },

        /**
         * Method to add a visual info about pressed key
         * @param {String} key - key to display
         */
        setDebugKeyboardKey: function(key) {
          if (this._showHelpersWidget.getValue()) {
            this._cleanDebugHelper();
            this._keyPressedElement.removeClass("hidden");
            var keyletter = this._keyPressedElement.querySelector(".key-letter");
            var keymod = this._keyPressedElement.querySelector(".key-modifier");

            var keyMatch = key.match(/(ctrl|alt|mod|shift)*\+*(.*)/);

            if (keyMatch[1]) { // has modifier
              keymod.innerHTML = "<span>" + keyMatch[1] + "</span>";
              keymod.addClass("pressed");
              keymod.removeClass("hidden");
              key = keyMatch[2];
            } else {
              key = keyMatch[2];
              keymod.addClass("hidden");
            }
            switch (key) {
              case "up":
                key = "⬆";
                break;
              case "down":
                key = "⬇";
                break;
              case "left":
                key = "⬅";
                break;
              case "right":
                key = "⮕";
                break;
              default:
                break;
            }

            keyletter.innerHTML = "<span>" + key + "</span>";
            keyletter.addClass("pressed");

            this._registerTimeout(function() {
              keymod.removeClass("pressed");
              keyletter.removeClass("pressed");
            }, 500);
          }
        },

        /**
         * Clear screen of mouse and keyboard info
         * @private
         */
        _cleanDebugHelper: function() {
          this._keyPressedElement.addClass("hidden");
          this._debugCursorElement.addClass("hidden");
          this._mousePressedElement.addClass("hidden");
        },

        /**
         * Add / remove an overlay to prevent any user interaction while playing a log
         * @param {Boolean} overlay - true to prevent user interaction, false otherwise
         * @param {Boolean} [force] - true to force the given value without check
         */
        addOverlay: function(overlay, force) {
          // Only if overlay status is not forced
          if (!force) {
            if (this._userInteractionWidget) {
              overlay = !this._userInteractionWidget.getValue();
            } else {
              overlay = true;
            }
          }
          gbc.OverlayService.setCursor("logplayer", "not-allowed");

          if (overlay) {
            this.addClass("running");
            gbc.OverlayService.enable("logplayer", this.getContainerElement());
          } else {
            this.removeClass("running");
            gbc.OverlayService.disable("logplayer");
          }
        }

      };
    });
    cls.WidgetFactory.registerBuilder('LogPlayer', cls.LogPlayerWidget);
  });
