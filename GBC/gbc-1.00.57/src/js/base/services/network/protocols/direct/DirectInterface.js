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
     * Direct protocol interface. manages the full protocol as a state machine
     * @class DirectInterface
     * @memberOf classes
     * @extends classes.ProtocolInterface
     */
    cls.DirectInterface = context.oo.Class({
      base: cls.ProtocolInterface
    }, function() {
      return /** @lends classes.DirectInterface.prototype */ {
        __name: "DirectInterface",
        /**
         * @type {classes.VMApplication}
         */
        application: null,
        /**
         * The Direct protocol is managed by Finite State Machine
         * @see https://github.com/jakesgordon/javascript-state-machine
         */
        directProtocol: null,
        _incomingData: null,
        eventQueue: null,
        eventInterval: null,
        eventIntervalTimeout: 30,
        onFirstGuiReady: null,
        /** @type {window.gbcWrapper} */
        _wrapper: null,
        /**
         * @constructs
         * @param application
         */
        constructor: function(application) {
          this.application = application;
          //application.encapsulation = true;
          this._incomingData = [];
          this.onFirstGuiReady = [];
          this.eventQueue = [];
          this._wrapper = application.info().wrapper;
          var directInterface = this;
          var directProtocol = this.directProtocol = context.StateMachine.create(
            /** @lends classes.DirectInterface#directProtocol */
            {
              /**
               * the general error handler
               */
              error: function(eventName, from, to, args, errorCode, errorMessage) {
                application.info().ending = cls.ApplicationEnding.notok("" + errorCode + ". " + errorMessage);
              },
              initial: "Start",
              /**
               * the different events of the state machine
               * @see the directStates constant
               */
              events: context.constants.network.directStates,
              callbacks: {
                /**
                 * whenever we leave a state
                 */
                onleavestate: function(action, from, to) {
                  context.LogService.networkProtocol.debug("PROTOCOL", from, " -> [", action, "] -> ", to);
                },
                onleaveStart: function(event, from, to, ending) {
                  directInterface.read(function(data) {
                    cls.DirectInitialAUI.run(data, application, function() {
                      window.setTimeout(function() {
                        application.setRunning(true);
                        directProtocol.transition();
                      }, 10);
                    });
                  });
                  return context.StateMachine.ASYNC;
                },
                onenterRecvInitialAUI: function() {
                  if (application.isProcessing()) {
                    directProtocol.waitForMoreInitialAUI();
                  } else {
                    window.setTimeout(function() {
                      directProtocol.guiMode();
                    }, 10);
                  }
                },
                onenterSendEmpty: function() {
                  directProtocol.getMoreOrder();
                },
                onleaveSendEmpty: function() {
                  if (!directInterface.application.hasError && !directInterface.application.ending) {
                    directInterface.read(function(data) {
                      cls.DirectRecvOrder.run(data, application, function() {
                        directProtocol.transition();
                      });
                    });
                    return StateMachine.ASYNC;
                  }
                },
                onenterRecvOrder: function() {
                  if (application.isProcessing()) {
                    directProtocol.waitForMoreOrder();
                  } else {
                    directProtocol.guiMode();
                  }
                },
                onenterGUI: function() {
                  if (directInterface.application.ending) {
                    if (directProtocol.transition) {
                      directProtocol.transition.cancel();
                    }
                    directProtocol.waitForEnd();
                  } else {
                    if (directInterface.onFirstGuiReady) {
                      var callbacks = directInterface.onFirstGuiReady;
                      directInterface.onFirstGuiReady = null;
                      while (callbacks.length) {
                        callbacks.splice(0, 1)[0]();
                      }
                    }

                    directInterface.eventInterval = window.setInterval(function() {
                      if (directInterface.eventQueue.length) {
                        directInterface.application.setProcessing();
                        window.setTimeout(function() {
                          directProtocol.sendOrder();
                        }, 10);
                        window.clearInterval(directInterface.eventInterval);
                      }
                    }, directInterface.eventIntervalTimeout);
                  }
                },
                onleaveGUI: function() {
                  window.clearInterval(directInterface.eventInterval);
                },
                onenterSendOrder: function() {
                  directProtocol.getOrderAnswer();
                },
                onleaveSendOrder: function(event, from, to) {
                  if (to !== "ApplicationEnd") {
                    var orders = directInterface.eventQueue;
                    directInterface.eventQueue = [];
                    cls.DirectSendOrders.run(orders.flatten(), application, directInterface);
                    directInterface.read(function(data) {
                      cls.DirectRecvOrder.run(data, application, function() {
                        directProtocol.transition();
                      });
                    });
                    return StateMachine.ASYNC;
                  }
                },
                /**
                 * when the application ends, we wait for a confirmation close
                 */
                onenterApplicationEnding: function() {
                  directProtocol.endApp();
                },
                /**
                 * until we  the application ends, we wait for a confirmation close
                 */
                onleaveApplicationEnding: function(event, from, to, closed) {
                  if (!closed) {
                    directInterface._wrapper.send("");
                    directInterface.read(function(data) {
                      cls.DirectRecvOrder.run(data, application, function() {
                        directProtocol.transition();
                      });
                    });
                    return StateMachine.ASYNC;
                  }
                },
                onenterApplicationEnd: function() {
                  application.stop();
                }
              }
            });
        },
        start: function() {
          this._wrapper.on(this._wrapper.events.RECEIVE, this._onReceive.bind(this));
          this._wrapper.URReady({
            UCName: "GBC",
            UCVersion: gbc.version,
            mobileUI: context.ThemeService.getValue("aui-mobileUI-default") ? 1 : 0
          });
          this.directProtocol.start();
        },
        event: function(events) {
          if (events) {
            if (this.application && !this.application.ending) {
              // detect short time when we are going to send a request to the VM but we didn't send yet
              this.application.pendingRequest = true;
              this.eventQueue.push(events);
              window.clearInterval(this.eventInterval);
              this.eventInterval = null;
              if (this.eventInterval === null) {
                this.eventInterval = window.setInterval(this._manageEvents.bind(this), this.eventIntervalTimeout);
              }
            } else {
              window.clearInterval(this.eventInterval);
              this.eventInterval = null;
            }
          }
        },
        /**
         * @returns {number} the delay in ms between network requests
         */
        getNetworkDelay: function() {
          return this._networkDelay;
        },
        /**
         * @param {number} delay the delay in ms between network requests
         */
        setNetworkDelay: function(delay) {
          this._networkDelay = delay;
        },
        _manageEvents: function() {
          if (this.application) {
            this.application.pendingRequest = false;
            if (this.application.isIdle() && this.directProtocol.can("sendOrder")) {
              if (this.eventQueue.length) {
                this.application.setProcessing();
                if (this._networkDelay > 0) {
                  window.setTimeout(this.directProtocol.sendOrder.bind(this.directProtocol), this._networkDelay);
                } else {
                  this.directProtocol.sendOrder();
                }
                window.clearInterval(this.eventInterval);
                this.eventInterval = null;
              } else {
                window.clearInterval(this.eventInterval);
                this.eventInterval = null;
              }
            }
          } else {
            window.clearInterval(this.eventInterval);
            this.eventInterval = null;
          }
        },
        newTask: function() {
          this._wrapper.childStart();
        },
        waitForNewApp: function(onSuccess, onFailure) {
          onSuccess();
        },
        interrupt: function() {
          this._wrapper.interrupt();
        },
        close: function() {
          this._wrapper.close();
        },
        destroy: function() {
          window.clearInterval(this.eventInterval);
          this.application = null;
          this.eventQueue = null;
          this._wrapper.close();
          this.directProtocol = null;
        },

        read: function(cb) {
          if (this._incomingData.length) {
            window.requestAnimationFrame(function() {
              cb(this._incomingData.shift());
            }.bind(this));
          } else {
            setTimeout(function() {
              this.read(cb);
            }.bind(this), 10);
          }
        },
        write: function(data, options) {
          this._wrapper.send(data, options);
        },
        _onReceive: function(event, src, data) {
          context.LogService.networkProtocol.debug("HTTP RESPONSE\n", "NATIVE RECEIVE", data);
          this._incomingData.push(data);
        }

      };
    });

  })(gbc, gbc.classes);
