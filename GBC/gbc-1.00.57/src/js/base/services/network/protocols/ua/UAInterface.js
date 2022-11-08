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
     * populates the headers from the response object
     * @memberOf UAInterface
     * @private
     * @param jqXHR the $.ajax jqXHR response
     * @returns {Object} a map of gbc aware headers
     * @ignore
     */
    var getHeaders = function(jqXHR) {
      var result = {};
      var keys = Object.keys(context.constants.network.headers);
      for (var k = 0; k < keys.length; k++) {
        var headerName = context.constants.network.headers[keys[k]];
        result[keys[k]] = jqXHR.getResponseHeader(headerName);
      }
      return result;
    };
    /**
     *
     * @param session
     * @param taskId
     * @param callback
     * @ignore
     */
    var runNewTask = function(session, taskId, callback) {
      window.setTimeout(function(session, taskId, callback) {
        var sessionInstance = (session instanceof cls.VMSession) ? session :
          context.SessionService.getSession(session);
        if (sessionInstance) {
          sessionInstance.startTask(taskId, callback);
        }
      }.bind(null, session, taskId, callback), 10);
    };

    /**
     * manages special headers from sever whenever a response is received
     * @memberOf UAInterface
     * @private
     * @param args the arguments of the $.ajax callback (data, status, jqXHR)
     * @param uaProtocol the uaProtocol instance
     * @param {classes.VMApplication} application
     * @param onSuccess the callback in case of success
     * @param {?boolean} fromNewTask
     * @ignore
     */
    var canRun = function(args, uaProtocol, application, onSuccess, fromNewTask) {
      if (!application) {
        if (uaProtocol.transition) {
          uaProtocol.transition.cancel();
        }
      } else {
        if (application.info() && application.info().ending) {
          application.setError();
          if (uaProtocol.transition) {
            uaProtocol.transition.cancel();
          }
          uaProtocol.headerError();
        } else {
          var headers = getHeaders(args[2]);
          if (headers.serverFeatures) {
            application.getSession().addServerFeatures((headers.serverFeatures || "").split(","));
          }
          if (headers.endUrl) {
            window.__desactivateEndingPopup = true;
            application.getSession().setEndUrl(headers.endUrl);
          }
          if (headers.sessionClosed) {
            application.getSession().closeSession();
            return;
          }
          if (fromNewTask && !headers.newTask) {
            application.getSession().waitedForNewTask();
          }
          if (headers.devmode === "true") {
            context.DebugService.activate();
          }
          if (headers.webComponent) {
            context.WebComponentService.setWebcomponentUrl(headers.webComponent);
          }
          if (headers.error) {
            application.setError();
            if (uaProtocol.transition) {
              uaProtocol.transition.cancel();
            }
            uaProtocol.headerError(headers.error);
          } else if (headers.closed) {
            if (uaProtocol.transition) {
              uaProtocol.transition.cancel();
            }
            application.setEnding();
            uaProtocol.endApp(headers.closed);
          } else if (headers.newTask) {
            runNewTask(application.getSession(), headers.newTask, function() {
              onSuccess(args[0], headers);
            });
          } else if (headers.contentType === "text/html") {
            window.__desactivateEndingPopup = true;
            window.location.reload();
          } else {
            onSuccess(args[0], headers);
          }
          if (!application.hasError && !application.ending) {
            application.getSession().displayLogPrompt(headers.prompt);
          }
        }
      }
    };
    /**
     * UAProxy protocol interface. manages the full protocol as a state machine
     * @class UAInterface
     * @memberOf classes
     * @extends classes.ProtocolInterface
     */
    cls.UAInterface = context.oo.Class({
      base: cls.ProtocolInterface
    }, function() {
      return /** @lends classes.UAInterface.prototype */ {
        __name: "UAInterface",
        sessionId: null,
        /** @type classes.VMApplication */
        application: null,
        uaProtocol: null,
        ping: null,
        eventQueue: null,
        eventInterval: null,
        eventIntervalTimeout: 30,
        _networkDelay: 0,
        onFirstGuiReady: null,
        applicationEnding: null,
        taskCount: 0,

        /**
         * @constructs
         * @param {classes.VMApplication} application
         */
        constructor: function(application) {
          this.application = application;
          this.sessionId = application.getSession()._identifier;
          this.onFirstGuiReady = [];
          this.eventQueue = [];
          var uaInterface = this;
          /**
           * The ua protocol is managed by Finite State Machine
           * @memberOf UAInterface
           * @see https://github.com/jakesgordon/javascript-state-machine
           */
          var uaProtocol = this.uaProtocol = context.StateMachine.create({
            /**
             * the general error handler
             * @ignore
             */
            error: function(eventName, from, to, args, errorCode, errorMessage, e) {
              console.error(eventName, from, to, args, errorCode, errorMessage);
              context.error(errorMessage, e);
              if (!application.ended) {
                application.info().ending = cls.ApplicationEnding.notok("" + errorCode + ". " + errorMessage);
              }
            },
            /**
             * the different events of the state machine
             * @see the uaStates constant
             * @ignore
             */
            events: context.constants.network.uaStates,
            callbacks: /** @ignore */ {
              /**
               * whenever we leave a state
               * @ignore
               */
              onleavestate: function(action, from, to) {
                context.LogService.networkProtocol.debug("STATE MACHINE(", application.applicationHash, ")", from,
                  " -> [", action, "] -> ", to);
              },
              /**
               * leave sendStart state
               * * if data is defined, it is either true if the app is closing, or an error message
               * * else we read the returning connection string
               * @ignore
               */
              onleaveSendStart: function(event, from, to, data) {
                if (!application.info().ending && !data) {
                  cls[application.info().task ? "UAStartupTask" : "UAStartup"].run(application, function(arg1, arg2, arg3, arg4,
                    arg5, arg6, arg7, arg8, arg9) {
                    canRun([arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9], uaProtocol, uaInterface.application,
                      function(data, headers) {
                        cls.UAConnectionString.run(data, headers, application);
                        uaProtocol.transition();
                      });
                  });
                  return context.StateMachine.ASYNC;
                }
              },
              /**
               * leave sendStartTask state (new task)
               * * if data is defined, it is either true if the app is closing, or an error message
               * * else we read the returning connection string
               * @ignore
               */
              onleaveSendStartTask: function(event, from, to, data) {
                if (!application.info().ending && !data) {
                  cls.UAStartupTask.run(application, function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
                    canRun([arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9], uaProtocol, uaInterface.application,
                      function(data, headers) {
                        cls.UAConnectionString.run(data, headers, application);
                        uaProtocol.transition();
                      });
                  });
                  return StateMachine.ASYNC;
                }
              },
              /**
               * When the connection string is ok, we handshake the server
               * @ignore
               */
              onenterRecvConnectionString: function() {
                uaProtocol.handShake();
              },
              /**
               * As we handshake the server, we ask for the initial aui tree
               * @ignore
               */
              onenterSendHandShake: function() {
                if (!application.info().ending) {
                  uaInterface.isRunning = true;
                  application.setProcessing();
                  uaProtocol.getInitialAUI();
                } else {
                  uaProtocol.headerError(";");
                }
              },
              /** @ignore */
              onleaveSendHandShake: function(event, from, to, ending) {
                if (!ending) {
                  if (uaInterface.application.ending) {
                    if (event !== "waitForEnd") {
                      if (uaProtocol.transition) {
                        uaProtocol.transition.cancel();
                      }
                      uaProtocol.waitForEnd();
                    }
                  } else {
                    cls.UAHandShake.run(application, function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
                      canRun([arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9], uaProtocol, uaInterface.application,
                        function(data, headers) {
                          cls.UAInitialAUI.run(data, headers, application, function() {
                            application.setRunning(true);
                            uaProtocol.transition();
                          });
                        });
                    });
                    return StateMachine.ASYNC;
                  }
                }
              },
              /** @ignore */
              onenterRecvInitialAUI: function() {
                if (application.isProcessing()) {
                  uaProtocol.waitForMoreInitialAUI();
                } else {
                  window.setTimeout(function() {
                    uaProtocol.guiMode();
                  }, 10);
                }
              },
              /** @ignore */
              onenterSendEmpty: function() {
                uaProtocol.getMoreOrder();
              },
              /** @ignore */
              onleaveSendEmpty: function() {
                if (!uaInterface.application.hasError && !uaInterface.application.ending) {
                  cls.UASendEmpty.run(application, function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
                    canRun([arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9], uaProtocol, uaInterface.application,
                      function(data, headers) {
                        cls.UARecvOrder.run(data, headers, application, function() {
                          uaProtocol.transition();
                        });
                      });
                  });
                  return StateMachine.ASYNC;
                }
              },
              /** @ignore */
              onenterRecvOrder: function() {
                if (application.isProcessing()) {
                  uaProtocol.waitForMoreOrder();
                } else {
                  uaProtocol.guiMode();
                }
              },
              /** @ignore */
              onenterGUI: function() {
                if (!uaInterface.application) {
                  uaProtocol.transition.cancel();
                  return;
                }
                if (uaInterface.application.ending) {
                  if (uaProtocol.transition) {
                    uaProtocol.transition.cancel();
                  }
                  uaProtocol.waitForEnd();
                } else {
                  if (uaInterface.onFirstGuiReady) {
                    var callbacks = uaInterface.onFirstGuiReady;
                    uaInterface.onFirstGuiReady = null;
                    while (callbacks.length) {
                      callbacks.splice(0, 1)[0]();
                    }
                  }
                  uaInterface.ping = window.setTimeout(function() {
                    uaProtocol.ping();
                  }, application.info().pingTimeout);

                  /** @ignore */
                  var localManageEvents = function(fireIndex) {
                    if (uaInterface.eventQueue && uaInterface.eventQueue.length) {
                      if (uaInterface.application.isIdle() && uaProtocol.can("sendOrder")) {
                        uaInterface.application.setProcessing();
                        uaProtocol.sendOrder(fireIndex);
                        window.clearInterval(uaInterface.eventInterval);
                        uaInterface.eventInterval = null;
                      }
                    }
                  };
                  if (uaInterface.eventQueue && uaInterface.eventQueue.length) {
                    if (uaInterface.eventInterval === null) {
                      uaInterface.eventInterval = window.setInterval(localManageEvents.bind(uaInterface), uaInterface
                        .eventIntervalTimeout);
                    }
                  }
                }
              },
              /** @ignore */
              onleaveGUI: function() {
                window.clearTimeout(uaInterface.ping);
                window.clearInterval(uaInterface.eventInterval);
                uaInterface.eventInterval = null;
              },
              /** @ignore */
              onenterSendOrder: function(event, from, to, count) {
                uaProtocol.getOrderAnswer();
              },
              /** @ignore */
              onleaveSendOrder: function(event, from, to) {
                if (to !== "ApplicationEnd" && to !== "HeaderError") {
                  var orders = uaInterface.eventQueue;
                  uaInterface.eventQueue = [];
                  orders = orders.flatten();
                  var httpOptions = null;
                  if (orders.find(function(item) {
                      return item.noUserActivity;
                    })) {
                    httpOptions = {
                      headers: {
                        "X-FourJs-User-Activity": "no"
                      }
                    };
                  }
                  cls.UASendOrders.run(orders, application, function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8,
                    arg9) {
                    canRun([arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9], uaProtocol, uaInterface.application,
                      function(data, headers) {
                        cls.UARecvOrder.run(data, headers, application, function() {
                          uaProtocol.transition();
                        });
                      });
                  }, httpOptions);
                  return StateMachine.ASYNC;
                }
              },
              /**
               * the ping doesn't take care of the answer (apart from the headers)
               * @ignore
               */
              onenterPing: function() {
                cls.UAPing.run(application, function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
                  canRun([arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9], uaProtocol, uaInterface.application,
                    function() {
                      // no need to manage ping answer
                    });
                });
                uaProtocol.pingSent();
              },
              /**
               * when the application ends, we wait for a confirmation close
               * @ignore
               */
              onenterApplicationEnding: function(event, from, to) {
                uaProtocol.endApp(from === "SendHandShake");
              },
              /**
               * until we  the application ends, we wait for a confirmation close
               * @ignore
               */
              onleaveApplicationEnding: function(event, from, to, closed) {
                if (!closed && !uaInterface.application.hasError) {
                  cls.UASendEndingEmpty.run(application, function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
                    canRun([arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9], uaProtocol, uaInterface.application,
                      function(data, headers) {
                        cls.UARecvOrder.run(data, headers, application, function() {
                          if (application.ending) {
                            uaProtocol.transition();
                          } else {
                            uaProtocol.transition.cancel();
                            window.setTimeout(function() {
                              uaProtocol.waitForEnd();
                            }, 1000);
                          }
                        });
                      });
                  });
                  return StateMachine.ASYNC;
                }
              },
              /** @ignore */
              onenterHeaderError: function(event, from, to, msg) {
                if (msg && msg.indexOf("Auto Logout") === 0) {
                  application.info().ending = cls.ApplicationEnding.autoLogout(msg);
                } else {
                  application.info().ending = application.info().ending || cls.ApplicationEnding.uaProxy(msg);
                }
                uaProtocol.endApp();
              },
              /** @ignore */
              onenterApplicationEnd: function() {
                var session = application.getSession();
                var applicationInfo = application.info();
                if (applicationInfo) {
                  applicationInfo.ending = applicationInfo.ending || cls.ApplicationEnding.ok;
                }
                application.stop();
                var nextApp = session.getCurrentApplication();
                if (nextApp) {
                  session.getWidget().setCurrentWidget(nextApp.getUI().getWidget());
                }
              }
            }
          });
          uaProtocol.start();
        },
        start: function() {
          this.uaProtocol.getConnectionString();
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
            if (this.application.isIdle() && this.uaProtocol.can("sendOrder")) {
              if (this.eventQueue.length) {
                this.application.setProcessing();
                if (this._networkDelay > 0) {
                  window.setTimeout(this.uaProtocol.sendOrder.bind(this.uaProtocol), this._networkDelay);
                } else {
                  this.uaProtocol.sendOrder();
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
          var session = this.application;
          if (this.application) {
            session = this.application.getSession();
          } else {
            session = context.SessionService.getCurrent();
          }
          session.waitingForNewTask();
          var uaProtocol = this.uaProtocol;
          cls.UANetwork.newTask(this.application || session, function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            if (this.application) {
              canRun([arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9], uaProtocol, this.application, Function.noop, true);
            } else {
              var headers = getHeaders(arg3);
              if (headers.newTask) {
                runNewTask(this.sessionId, headers.newTask, Function.noop);
              } else {
                session.waitedForNewTask();
              }
            }
          }.bind(this));
        },
        interrupt: function() {
          cls.UANetwork.interrupt(this.application);
        },
        close: function() {
          if (this.application.info().session) {
            // if we sent a session ua/close there is no need to send app ua/close
            if (!this.application.info().sessionIsClosing) {
              cls.UANetwork.close(this.application);
            }
            if (this.uaProtocol.transition) {
              this.uaProtocol.transition.cancel();
            }
            this.uaProtocol.waitForEnd();
          }
        },
        closeSession: function() {
          if (this.application.info().session) {
            this.application.info().sessionIsClosing = true;
            cls.UANetwork.closeSession(this.application);
          }
        },
        destroy: function() {
          window.clearTimeout(this.ping);
          window.clearInterval(this.eventInterval);
          this.eventInterval = null;
          this.application = null;
          this.eventQueue = null;
          this.uaProtocol = null;
        },
        isAlive: function() {
          return Boolean(this.uaProtocol);
        },
        trackPrompt: function() {
          var session = this.application && this.application.getSession();
          if (session && !session._isTrackingPrompt) {
            session._isTrackingPrompt = true;
            cls.UANetwork.trackPrompt(this.application, function(arg1, arg2, arg3) {
              var headers = getHeaders(arg3),
                session = this.application && this.application.getSession();
              if (session) {
                if (headers.sessionClosed) {
                  session.closeSession();
                }
                session._isTrackingPrompt = false;
                session.displayLogPrompt(headers.prompt);
              }
            }.bind(this));
          }
        },

        _waitChildWindowReadyness: function(win, timeLimit, cb) { // IE11...
          window.setTimeout(function() {
            if ((typeof win.addEventListener) !== "function") {
              if (Date.now() > timeLimit) {
                cb(true);
              } else {
                this._waitChildWindowReadyness(win, timeLimit, cb);
              }
            } else {
              cb(false);
            }
          }.bind(this), 50);
        },

        waitForNewApp: function(onSuccess, onFailure) {
          this.application.getSession()._addWaitingApplication(this.application);
          cls.UANetwork.waitTask(this.application, function(response, none, jqXhr) {
            var headers = getHeaders(jqXhr);
            if (headers.vmReady) {
              this.application.getSession()._removeWaitingApplication(this.application);
              var win = cls.WindowHelper.openWindow(cls.UANetwork.newApp(this.application), true);
              this._waitChildWindowReadyness(win,
                Date.now() + 2 * 60 * 1000, // maximum wait for new window of 2 minutes, after that should be considered as lost
                function(w, timeout) { // thank you IE
                  if (!timeout) {
                    this.application.getSession()._registerChildWindow(w);
                  }
                  onSuccess();
                }.bind(this, win));
            } else {
              if (this.application.info().ending) {
                onFailure();
              } else if (!headers.closed) {
                window.requestAnimationFrame(this.waitForNewApp.bind(this, onSuccess, onFailure));
              } else {
                onFailure();
              }
            }
          }.bind(this));
        }
      };
    });

  })(gbc, gbc.classes);
