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

modulum('MessageApplicationService', ['ApplicationServiceBase', 'ApplicationServiceFactory'],
  function(context, cls) {

    /**
     * @class MessageApplicationService
     * @memberOf classes
     * @extends classes.ApplicationServiceBase
     */
    cls.MessageApplicationService = context.oo.Class(cls.ApplicationServiceBase, function($super) {
      return /** @lends classes.MessageApplicationService.prototype */ {
        __name: "MessageApplicationService",

        /**
         * @type classes.EventListener
         */
        _eventListener: null,

        _messageList: null,
        _maxMessageStack: 10,

        constructor: function() {
          this._messageList = {};
        },

        /**
         * Add a message to the stack
         * @param {string} id - count param
         * @param {classes.MessageWidget} widget - message to add
         */
        addMessage: function(id, widget) {
          this._messageList[id] = widget;
        },

        /**
         * Remove a message by its id
         * @param {string} id - count param
         */
        removeMessage: function(id) {
          if (this._messageList[id]) {
            delete(this._messageList[id]);
          }
          this.handlePositions();
        },

        /**
         * Allow messages and error defined at same position to stack
         * @private
         */
        handlePositions: function() {
          if (this._messageList) {
            var messageKeys = Object.keys(this._messageList).sort(function(a, b) {
              return a - b;
            });
            if (messageKeys.length <= 0) {
              return;
            }
            var bodyRect = document.body.getBoundingClientRect();

            var stack = context.ThemeService.getValue("theme-message-display-position") === context.ThemeService.getValue(
              "theme-error-display-position");

            for (var i = 0; i < messageKeys.length; i++) {
              var messageWidget = this._messageList[messageKeys[i]];
              if (messageWidget && messageWidget.getElement()) {
                var prevWidget = i >= 1 && messageKeys[i - 1] && this._messageList[messageKeys[i - 1]];
                var positionName = messageWidget.getPosition();
                var style = {};
                // TODO : Need to remove margins if screen is really small;
                var margin = context.ThemeService.getValue("theme-margin-ratio") * 14;
                var drift = {
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0
                };

                var uiWidget = messageWidget.getUserInterfaceWidget();
                if (uiWidget && !uiWidget._destroyed && uiWidget.getContainerElement()) {
                  var userInterfaceRect = uiWidget.getContainerElement().getBoundingClientRect();
                  var messageRect = messageWidget.getElement().getBoundingClientRect();

                  // Use body and ui RECT for position calculations
                  drift.bottom = bodyRect.height - userInterfaceRect.height - userInterfaceRect.top;
                  drift.top = userInterfaceRect.top;
                  drift.left = bodyRect.left + userInterfaceRect.left;
                  drift.center = drift.left + (userInterfaceRect.width / 2) - (messageRect.width / 2);

                  var overlap = prevWidget && this._checkOverlap(messageWidget, prevWidget);
                  var anyHidden = messageWidget.isHidden() || (prevWidget && prevWidget.isHidden());

                  // Handle stack if more than 1 message and none of the widgets is hidden
                  if ((i >= 1 && (stack || overlap)) && !anyHidden) {
                    drift.bottom += messageRect.height + (margin / 2);
                    drift.top += messageRect.height + (margin / 2);
                  }

                  if (positionName.indexOf("top") >= 0) {
                    style.top = (margin + drift.top).toFixed() + "px";
                    style.bottom = null;
                  }
                  if (positionName.indexOf("bottom") >= 0) {
                    style.top = null;
                    style.bottom = (margin + drift.bottom).toFixed() + "px";
                  }
                  if (positionName.indexOf("right") >= 0) {
                    style.left = null;
                    style["margin-left"] = margin.toFixed() + "px";
                    style.right = margin.toFixed() + "px";
                  }
                  if (positionName.indexOf("left") >= 0) {
                    style.left = (margin + drift.left).toFixed() + "px";
                    style.right = null;
                    style["margin-right"] = margin.toFixed() + "px";
                  }
                  if (positionName.indexOf("center") >= 0) {
                    style.left = (margin + drift.center).toFixed() + "px";
                    style.right = null;
                    style["margin-right"] = margin.toFixed() + "px";
                  }

                  if (!messageWidget.isHidden()) {
                    style.opacity = 1;
                    style["z-index"] = context.ThemeService.getValue("gbc-MessageWidget-z-index");
                  } else {
                    style.opacity = 0;
                    style["z-index"] = -1;
                  }
                  messageWidget.setStyle(style);
                }
              }
            }
          }
        },

        /**
         * Check if 2 widgets overlap in the view
         * @param w1 - first widget to compare
         * @param w2 - second widget to compare
         * @return {boolean} - true if overlap, false otherwise
         * @private
         */
        _checkOverlap: function(w1, w2) {
          if (w1.isHidden() || w2.isHidden()) {
            return false;
          }
          var rect1 = w1.getElement().getBoundingClientRect();
          var rect2 = w2.getElement().getBoundingClientRect();
          return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._messageList = null;
          $super.destroy.call(this);
        }
      };
    });
    cls.ApplicationServiceFactory.register("Message", cls.MessageApplicationService);
  });
