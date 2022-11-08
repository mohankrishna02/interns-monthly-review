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

modulum('ModalWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Modal widget.
     * @class ModalWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.ModalWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.ModalWidget.prototype */ {
        __name: "ModalWidget",
        /**
         * header element
         * @type {HTMLElement}
         */
        _header: null,
        /**
         * header hidden state
         * @type {boolean}
         */
        _headerHidden: false,
        /**
         * footer element
         * @type {HTMLElement}
         */
        _footer: null,
        /**
         * title element
         * @type {HTMLElement}
         */
        _title: null,
        /**
         * dialog pane element
         * @type {HTMLElement}
         */
        _dialogPane: null,

        /**
         * header actions host element
         * @type {HTMLElement}
         */
        _actionsHost: null,
        /**
         * close button element
         * @type {HTMLElement}
         */
        _closeButton: null,

        /**
         * is displayed
         * @type {boolean}
         */
        _displayed: false,
        /**
         * is a system modal
         * @type {boolean}
         */
        _systemModal: false,
        /**
         * resize handler
         */
        _systemModalResizeHandler: null,

        /**
         * flag to set first fixed size
         * @type {boolean}
         */
        _hasInitialContainment: true,
        /**
         * is movable
         * @type {boolean}
         */
        _canMove: false,
        /**
         * has it moved
         * @type {boolean}
         */
        _hasBeenMoved: false,
        /**
         * internal computing information
         * @type {?{current:{x:number, y:number}, reference:{x:number, y:number}, minDelta:{x:number, y:number}, maxDelta:{x:number, y:number}, drag:{x:number, y:number}}}
         */
        _movingPositions: null,
        /**
         * is it moving
         * @type {boolean}
         */
        _isMoving: false,
        /**
         * move drag handle element
         * @type {HTMLElement}
         */
        _movableDragHandle: null,

        /**
         * is it sizable
         * @type {boolean}
         */
        _canSize: false,
        /**
         * has it resized
         * @type {boolean}
         */
        _hasBeenSized: false,
        /**
         * internal computing information
         * @type {?{current:{x:number, y:number}, size:{x:number, y:number}, min:{x:number, y:number}, max:{x:number, y:number}, contentMin:{x:number, y:number}, decoration:{x:number, y:number}, drag:{x:number, y:number}}}
         */
        _sizingPositions: null,
        /**
         * is it resizing
         * @type {boolean}
         */
        _isSizing: false,
        /**
         * resize drag handle element
         * @type {HTMLElement}
         */
        _sizableDragHandle: null,
        /**
         * resize drag indicator element
         * @type {HTMLElement}
         */
        _resizerIcon: null,
        /**
         * is modal closable. Yes by default.
         * @type {boolean}
         */
        _isClosable: true,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._header = this._element.getElementsByClassName('mt-dialog-header')[0];
          this._header.toggleClass("hidden", false);
          this._footer = this._element.getElementsByClassName('mt-dialog-footer')[0];
          this._title = this._header.getElementsByClassName('mt-dialog-title')[0];
          this._actionsHost = this._header.getElementsByClassName('mt-dialog-actions')[0];
          this._dialogPane = this._element.querySelector(".mt-dialog-pane");
          this._closeButton = this._actionsHost.getElementsByClassName('close')[0];
          this._resizerIcon = this._element.getElementsByClassName("mt-resizer-icon")[0];
          this._closeButton.on("click.ModalWidget", function() {
            this.emit(context.constants.widgetEvents.close);
          }.bind(this));
          this._element.on("click.ModalWidget", function(evt) {
            if (evt.target === evt.currentTarget) {
              this.emit(context.constants.widgetEvents.modalOut);
            }
          }.bind(this));
          this._initMovable();
          this._initSizable();
          this.setMovable(true);
        },

        resetLayout: function() {
          this._hasInitialContainment = true;
          this._hasBeenMoved = false;
          this._hasBeenSized = false;
          this._dialogPane.style.left = "";
          this._dialogPane.style.right = "";
          this._dialogPane.style.width = "";
          this._dialogPane.style.height = "";
          this._dialogPane.style.top = "";
          this._dialogPane.removeClass("moved");
          this._dialogPane.removeClass("sized");
          this._resetMovable();
          this._resetSizable();
          this.getLayoutEngine().reset(true);
          this.getLayoutInformation().reset(true);
        },
        /**
         * set first fixed size
         * @private
         */
        _removeInitialContainment: function() {
          if (this._hasInitialContainment) {
            this._hasInitialContainment = false;
            var containerRect = this.getElement().getBoundingClientRect(),
              dialogRect = this._dialogPane.getBoundingClientRect();
            this._setAsMoved(
              this.isReversed() ? containerRect.right - dialogRect.right : (dialogRect.left - containerRect.left),
              dialogRect.top - containerRect.top);
            this._dialogPane.removeClass("initial");
          }
        },

        /**
         * Make the modal window movable
         * @param {boolean} movable will it be movable
         */
        setMovable: function(movable) {
          this._canMove = movable;
          this._element.toggleClass("movable", movable);
        },

        /**
         * Start the movable process
         * @private
         */
        _initMovable: function() {
          this._resetMovable();
          this._movableDragHandle = this._element.getElementsByClassName("movable_firefox_placekeeper")[0];
          this._header.setAttribute("draggable", "true");
          this._header.on("dragstart.MovableModalWidget", this._onMovableDragStart.bind(this));
          this._header.on("dragend.MovableModalWidget", this._onMovableDragEnd.bind(this));
          this._header.on("drag.MovableModalWidget", this._onMovableDrag.bind(this));
        },

        _resetMovable: function() {
          this._movingPositions = {
            reference: {
              x: 0,
              y: 0
            },
            current: {
              x: 0,
              y: 0
            },
            minDelta: {
              x: 0,
              y: 0
            },
            maxDelta: {
              x: 0,
              y: 0
            },
            drag: {
              x: 0,
              y: 0
            }
          };
        },

        /**
         * handle on drag over for move
         * @param {MouseEvent} evt the event
         * @private
         */
        _onMovableDragOver: function(evt) {
          this._movingPositions.current.x = evt.pageX;
          this._movingPositions.current.y = evt.pageY;
          evt.preventCancelableDefault();
        },
        /**
         * move at given position
         * @param {number} x x position
         * @param {number} y y position
         * @private
         */
        _setAsMoved: function(x, y) {
          this._dialogPane.addClass("moved");
          this._removeInitialContainment();
          this._movingPositions.reference.x = x;
          this._movingPositions.reference.y = y;
          this._dialogPane.style.left = this.isReversed() ? "" :
            ("" + Math.max(context.ThemeService.getValue("theme-margin-ratio") * 8, this._movingPositions.reference.x) + "px");
          this._dialogPane.style.right = !this.isReversed() ? "" :
            ("" + Math.max(context.ThemeService.getValue("theme-margin-ratio") * 8, this._movingPositions.reference.x) + "px");
          this._dialogPane.style.top = "" + Math.max(context.ThemeService.getValue("theme-margin-ratio") * 8, this._movingPositions
              .reference
              .y) +
            "px";
          this._hasBeenMoved = true;
        },
        /**
         * set first position
         * @private
         */
        _initMoved: function() {
          var containerRect = this.getElement().getBoundingClientRect(),
            dialogRect = this._dialogPane.getBoundingClientRect();
          var min = context.ThemeService.getValue("theme-margin-ratio") * 8,
            x = Math.max(min, this.isReversed() ? containerRect.right - dialogRect.right : (dialogRect.left - containerRect.left)),
            y = Math.max(min, dialogRect.top - containerRect.top);
          this._setAsMoved(x, y);
        },

        /**
         * handle on drag start for move
         * @param {MouseEvent} evt the event
         * @private
         */
        _onMovableDragStart: function(evt) {
          if (this._canMove) {
            this._element.addClass("moving");
            var containerRect = this.getElement().getBoundingClientRect(),
              dialogRect = this._dialogPane.getBoundingClientRect();
            if (!this._hasBeenMoved) {
              this._setAsMoved(this.isReversed() ? containerRect.right - dialogRect.right : (dialogRect.left - containerRect.left),
                dialogRect.top - containerRect.top);
            }
            this._movingPositions.minDelta.x =
              (this.isReversed() ? dialogRect.right - containerRect.right : (containerRect.left - dialogRect.left)) +
              context.ThemeService.getValue("theme-margin-ratio") * 8;
            this._movingPositions.minDelta.y = containerRect.top - dialogRect.top + context.ThemeService.getValue(
              "theme-margin-ratio") * 8;
            this._movingPositions.maxDelta.x =
              (this.isReversed() ?
                dialogRect.right - containerRect.right + containerRect.width - dialogRect.width :
                (containerRect.left - dialogRect.left + containerRect.width - dialogRect.width)) -
              context.ThemeService.getValue("theme-margin-ratio") * 8;
            this._movingPositions.maxDelta.y = containerRect.height + containerRect.top - dialogRect.height - dialogRect.top -
              context.ThemeService.getValue("theme-margin-ratio") * 8;
            this.getElement().on("dragover.MovableModalWidget", this._onMovableDragOver.bind(this));
            this._isMoving = true;
            if (window.browserInfo.isFirefox) {
              evt.dataTransfer.setData('text', ''); // for Firefox compatibility
            }
            if (evt.dataTransfer.setDragImage) {
              evt.dataTransfer.setDragImage(this._movableDragHandle, 0, 0);
            }
            evt.dataTransfer.effectAllowed = "move";
            this._movingPositions.current.x = evt.pageX;
            this._movingPositions.current.y = evt.pageY;
            this._movingPositions.drag.x = evt.pageX;
            this._movingPositions.drag.y = evt.pageY;
          } else {
            evt.preventCancelableDefault();
          }
          return false;
        },

        /**
         * handle on drag end for move
         * @param {MouseEvent} evt the event
         * @private
         */
        _onMovableDragEnd: function(evt) {
          this._element.removeClass("moving");
          this.getElement().off("dragover.MovableModalWidget");
          var deltaX = (this._movingPositions.current.x - this._movingPositions.drag.x) * (this.isReversed() ? -1 : 1);
          var deltaY = this._movingPositions.current.y - this._movingPositions.drag.y;
          if (deltaX * deltaX + deltaY * deltaY > 16 * 16) {
            this._movingPositions.reference.x =
              Math.max(context.ThemeService.getValue("theme-margin-ratio") * 8, this._movingPositions.reference.x +
                Math.min(Math.max(deltaX, this._movingPositions.minDelta.x), this._movingPositions.maxDelta.x));
            this._movingPositions.reference.y =
              Math.max(context.ThemeService.getValue("theme-margin-ratio") * 8, this._movingPositions.reference.y +
                Math.min(Math.max(deltaY, this._movingPositions.minDelta.y), this._movingPositions.maxDelta.y));
            this._isMoving = false;
          }
        },

        /**
         * handle on drag for move
         * @param {MouseEvent} evt the event
         * @private
         */
        _onMovableDrag: function(evt) {
          if (this._isMoving) {
            var deltaX = (this._movingPositions.current.x - this._movingPositions.drag.x) * (this.isReversed() ? -1 : 1);
            var deltaY = this._movingPositions.current.y - this._movingPositions.drag.y;
            if (deltaX * deltaX + deltaY * deltaY > 100) {
              this._updateMovablePosition(
                Math.min(Math.max(deltaX, this._movingPositions.minDelta.x), this._movingPositions.maxDelta.x),
                Math.min(Math.max(deltaY, this._movingPositions.minDelta.y), this._movingPositions.maxDelta.y)
              );
            }
          }
        },

        /**
         * update visual position when moving
         * @param {number} deltaX x position delta
         * @param {number} deltaY y position delta
         * @private
         */
        _updateMovablePosition: function(deltaX, deltaY) {
          this._dialogPane.style.left = this.isReversed() ? "" :
            ("" + Math.max(context.ThemeService.getValue("theme-margin-ratio") * 8, this._movingPositions.reference.x + deltaX) +
              "px");
          this._dialogPane.style.right = !this.isReversed() ? "" :
            ("" + Math.max(context.ThemeService.getValue("theme-margin-ratio") * 8, this._movingPositions.reference.x + deltaX) +
              "px");
          this._dialogPane.style.top = "" + Math.max(context.ThemeService.getValue("theme-margin-ratio") * 8, this._movingPositions
            .reference
            .y +
            deltaY) + "px";
        },

        /**
         * Make the modal window resizable
         * @param {boolean} sizable will it be sizable
         */
        setSizable: function(sizable) {
          this._canSize = sizable;
          this._element.toggleClass("sizable", sizable);
        },
        /**
         * init sizable data
         * @private
         */
        _initSizable: function() {
          this._resetSizable();
          this._resizer = this._element.querySelector(".mt-dialog-resizer");
          this._sizableDragHandle = this._element.getElementsByClassName("sizable_firefox_placekeeper")[0];
          this._resizer.setAttribute("draggable", "true");
          this._resizer.on("dragstart.SizableModalWidget", this._onSizableDragStart.bind(this));
          this._resizer.on("dragend.SizableModalWidget", this._onSizableDragEnd.bind(this));
          this._resizer.on("drag.SizableModalWidget", this._onSizableDrag.bind(this));
        },

        _resetSizable: function() {
          this._sizingPositions = {
            size: {
              x: 0,
              y: 0
            },
            reference: {
              x: 0,
              y: 0
            },
            current: {
              x: 0,
              y: 0
            },
            min: {
              x: 0,
              y: 0
            },
            contentMin: {
              x: 0,
              y: 0
            },
            max: {
              x: 0,
              y: 0
            },
            drag: {
              x: 0,
              y: 0
            },
            decoration: {
              x: 0,
              y: 0
            }
          };
        },

        /**
         * handle on drag over for resize
         * @param {MouseEvent} evt the event
         * @private
         */
        _onSizableDragOver: function(evt) {
          this._sizingPositions.current.x = evt.pageX;
          this._sizingPositions.current.y = evt.pageY;
          evt.preventCancelableDefault();
        },
        /**
         * handle on drag start for resize
         * @param {MouseEvent} evt the event
         * @private
         */
        _onSizableDragStart: function(evt) {
          if (this._canSize) {
            this._element.addClass("sizing");
            var containerRect = this.getElement().getBoundingClientRect(),
              dialogRect = this._dialogPane.getBoundingClientRect(),
              contentRect = (this._element.querySelector(".gbc_WindowContent") || this._containerElement).getBoundingClientRect();
            if (!this._hasBeenMoved) {
              this._setAsMoved(dialogRect.left - containerRect.left, dialogRect.top - containerRect.top);
            }
            if (!this._hasBeenSized) {
              this._dialogPane.addClass("sized");
              this._removeInitialContainment();
              this._sizingPositions.min.x = dialogRect.width;
              this._sizingPositions.min.y = dialogRect.height;
              this._hasBeenSized = true;
            }
            this._sizingPositions.decoration.x = dialogRect.width - contentRect.width;
            this._sizingPositions.decoration.y = dialogRect.height - contentRect.height;

            this._sizingPositions.min.x = this._sizingPositions.contentMin.x ?
              this._sizingPositions.contentMin.x + this._sizingPositions.decoration.x + window.scrollBarSize : dialogRect.width;
            this._sizingPositions.min.y = this._sizingPositions.contentMin.y ?
              this._sizingPositions.contentMin.y + this._sizingPositions.decoration.y + window.scrollBarSize : dialogRect.height;
            this._sizingPositions.size.x = this._sizingPositions.reference.x = dialogRect.width;
            this._sizingPositions.size.y = this._sizingPositions.reference.y = dialogRect.height;

            this._sizingPositions.max.x = (this.isReversed() ?
                containerRect.width + dialogRect.right - containerRect.right :
                (containerRect.width - dialogRect.left + containerRect.left)) - context.ThemeService.getValue(
                "theme-margin-ratio") *
              8;
            this._sizingPositions.max.y = containerRect.height - dialogRect.top +
              containerRect.top - context.ThemeService.getValue("theme-margin-ratio") * 8;
            this.getElement().on("dragover.SizableModalWidget", this._onSizableDragOver.bind(this));
            this._isSizing = true;
            if (window.browserInfo.isFirefox) {
              evt.dataTransfer.setData('text', ''); // for Firefox compatibility
            }
            if (evt.dataTransfer.setDragImage) {
              evt.dataTransfer.setDragImage(this._sizableDragHandle, 0, 0);
            }
            evt.dataTransfer.effectAllowed = "move";
            this._sizingPositions.current.x = evt.pageX;
            this._sizingPositions.current.y = evt.pageY;
            this._sizingPositions.drag.x = evt.pageX;
            this._sizingPositions.drag.y = evt.pageY;
          } else {
            evt.preventCancelableDefault();
          }
          return false;
        },

        /**
         * handle on drag end for resize
         * @param {MouseEvent} evt the event
         * @private
         */
        _onSizableDragEnd: function(evt) {
          this._element.removeClass("sizing");
          this.getElement().off("dragover.SizableModalWidget");
          var deltaX = this._sizingPositions.reference.x + (this._sizingPositions.current.x - this._sizingPositions.drag.x) * (this
            .isReversed() ? -1 : 1);
          var deltaY = this._sizingPositions.reference.y + this._sizingPositions.current.y - this._sizingPositions.drag.y;
          this._sizingPositions.reference.x = Math.min(Math.max(deltaX, this._sizingPositions.min.x), this._sizingPositions.max.x);
          this._sizingPositions.reference.y = Math.min(Math.max(deltaY, this._sizingPositions.min.y), this._sizingPositions.max.y);
          this._sizingPositions.size.x = this._sizingPositions.reference.x;
          this._sizingPositions.size.y = this._sizingPositions.reference.y;
          this._isSizing = false;

          this.emit(context.constants.widgetEvents.modalResize);
        },

        /**
         * handle on drag for resize
         * @param {MouseEvent} evt the event
         * @private
         */
        _onSizableDrag: function(evt) {
          if (this._isSizing) {
            var deltaX = this._sizingPositions.reference.x + (this._sizingPositions.current.x - this._sizingPositions.drag.x) * (
              this.isReversed() ? -1 : 1);
            var deltaY = this._sizingPositions.reference.y + this._sizingPositions.current.y - this._sizingPositions.drag.y;
            this._sizingPositions.size.x = Math.min(Math.max(deltaX, this._sizingPositions.min.x), this._sizingPositions.max.x);
            this._sizingPositions.size.y = Math.min(Math.max(deltaY, this._sizingPositions.min.y), this._sizingPositions.max.y);
            this._updateSizablePosition(this._sizingPositions.size.x, this._sizingPositions.size.y);
          }
        },
        /**
         * update visual size when resizing
         * @param {number} deltaX x position delta
         * @param {number} deltaY y position delta
         * @private
         */
        _updateSizablePosition: function(deltaX, deltaY) {
          this._dialogPane.style.width = "" + deltaX + "px";
          this._dialogPane.style.height = "" + deltaY + "px";
          this.emit(context.constants.widgetEvents.modalResize);
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._closeButton.off("click.ModalWidget");
          if (this._element) {
            this._element.off("click.ModalWidget");
            this._element.off("keydown.ModalWidget");
          }
          if (this._image) {
            this._image.destroy();
            this._image = null;
          }
          if (this._systemModalResizeHandler) {
            this._systemModalResizeHandler();
            this._systemModalResizeHandler = null;
          }

          $super.destroy.call(this);
        },

        /**
         * Set that the modal is only for GBC
         */
        _gbcSystemModal: function() {
          this._systemModal = true;
          this._element.addClass("gbc_SystemModal");
          this._element.setAttribute("tabindex", "0");
          if (!this._systemModalResizeHandler) {
            this._systemModalResizeHandler = context.HostService.onScreenResize(this.resizeHandler.bind(this));
          }
          this._element.domFocus();
          // do not propagate key event  to avoid sending them to VM
          this._element.on("keydown.ModalWidget", function(evt) {
            if (evt.keyCode === 27) {
              this.hide();
              if (!this.isDestroyed()) {
                this.destroy();
              }
            }
            evt.stopPropagation();
            // TODO we should prevent default browser behavior for CTRL+A, CTRL+P, CTRL+S, BACKSPACE
            // like in gbc.js document.body.addEventListener('keydown', function(event) {
          }.bind(this));
          gbc.LogService.ui.log("SystemModal open", true, this.__name, this);
        },
        /**
         * fired when resizing
         */
        resizeHandler: function() {
          if (this._element) {
            this._element.toggleClass("left-realign", this._dialogPane.offsetWidth > this._element.offsetWidth);
            this._element.toggleClass("top-realign", this._dialogPane.offsetHeight > this._element.offsetHeight);
          }
        },

        /**
         * @inheritDoc
         */
        setBackgroundColor: function(color) {
          this._backgroundColor = color;
          this.setStyle('.mt-dialog-pane', {
            "background-color": color && !this._ignoreBackgroundColor ? color : null
          });
        },

        /**
         * set the modal header
         * @param {string|HTMLElement} header the header
         */
        setHeader: function(header) {
          if (Object.isString(header)) {
            this._header.toggleClass("hidden", (header.length === 0) || this._headerHidden);
            this._title.textContent = header;
          } else {
            this._title.empty();
            if (header) {
              this._title.appendChild(header);
            }
          }
        },
        /**
         * set header raw hidden state
         * @param {boolean} headerHidden is header hidden
         */
        setHeaderHidden: function(headerHidden) {
          if (headerHidden !== this._headerHidden) {
            this._headerHidden = Boolean(headerHidden);
            this._header.toggleClass("hidden", (this._title.textContent.length === 0) || this._headerHidden);
          }
        },
        /**
         * Set the image of the modal widget
         * @param {string} image the image src
         */
        setImage: function(image) {
          if (image && image !== "") {
            if (!this._image) {
              this._image = cls.WidgetFactory.createWidget("ImageWidget", this.getBuildParameters());
              this._title.parentNode.insertBefore(this._image.getElement(), this._title);
            }
            this._image.setSrc(image);
          }
        },

        /**
         * set the modal footer
         * @param {string|HTMLElement} footer - the footer
         */
        setFooter: function(footer) {
          if (Object.isString(footer)) {
            this._footer.textContent = footer;
          } else {
            this._footer.empty();
            if (footer) {
              this._footer.appendChild(footer);
            }
          }
        },

        /**
         * set the modal content
         * @param {string|HTMLElement} content - the content
         */
        setContent: function(content) {
          if (Object.isString(content)) {
            this._containerElement.textContent = content;
          } else {
            if (this._containerElement.children.length !== 1 ||
              this._containerElement.children[0] !== content) {
              // Setting this._containerElement.innerHTML = "" can cause unwanted cleaning under IE11. In our case content.innerHTML gets cleaned (GBC-727). Prefer cleaning by looping on children
              this._containerElement.empty();
              if (content) {
                this._containerElement.appendChild(content);
              }
            }
          }
        },

        /**
         * Set the modal closable
         * @param {boolean} closable -  true if the dialog is closable, false otherwise
         * @param {boolean} directlyHide -
         * @param {boolean} hideOnClickOut - true if dialg should be hidden when user click outside of modal
         */
        setClosable: function(closable, directlyHide, hideOnClickOut) {
          if (closable) {
            this._closeButton.removeClass("hidden");
          } else {
            this._closeButton.addClass("hidden");
          }
          this._isClosable = closable;

          if (directlyHide) {
            this._closeButton.on("click.ModalWidget", function() {
              this.hide();
            }.bind(this));
          }
          if (hideOnClickOut) {
            this._element.on("click.ModalWidget", function(evt) {
              if (evt.target === evt.currentTarget) {
                this.hide();
              }
            }.bind(this));
          }
        },

        /**
         * is the modal closable
         * @returns {boolean} true if the dialog is closable, false otherwise
         */
        isClosable: function() {
          return this._isClosable;
        },
        /**
         * show the modal
         */
        show: function() {
          if (this._element) {
            this._element.addClass("displayed");
          }
          this._displayed = true;

          if (this._systemModal) {
            gbc.systemModalOpened = true;
            this._element.domFocus();
            this.resizeHandler();
          }
        },
        /**
         * hide the modal
         */
        hide: function() {
          if (this._element && this.isVisible()) {
            this._element.removeClass("displayed");
            this._displayed = false;
            this.emit(context.constants.widgetEvents.close);
            //Restore the window icon
            if (gbc.HostService.getCurrentWindow()) {
              gbc.HostService.setDisplayedWindow(gbc.HostService.getCurrentWindow());
            }
          }
          if (this._systemModal) {
            gbc.systemModalOpened = false;
            gbc.LogService.ui.log("SystemModal open", false, this.__name);
          }
        },
        /**
         * test if the modal is visible
         * @return {boolean} true if the modal is visible
         */
        isVisible: function() {
          return this._displayed;
        },
        /**
         * register a hook when modal is closed
         * @param {Hook} hook the hook to fire
         * @param {boolean=} once - if true, will only fire once
         * @return {HandleRegistration} a handle registration to free the hook
         */
        onClose: function(hook, once) {
          this.when(context.constants.widgetEvents.close, hook, once);
        },
        /**
         * set the header max width
         * @param {number} width the width
         */
        setHeaderMaxWidth: function(width) {
          this.setStyle(".mt-dialog-header", {
            "max-width": width + 'px'
          });
        }
      };
    });
    cls.WidgetFactory.registerBuilder('Modal', cls.ModalWidget);
  });
