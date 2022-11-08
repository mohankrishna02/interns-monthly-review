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

modulum('TopMenuGroupWidget', ['WidgetGroupBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * TopMenuGroup widget.
     * @class TopMenuGroupWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     * @publicdoc Widgets
     */
    cls.TopMenuGroupWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.TopMenuGroupWidget.prototype */ {
        __name: 'TopMenuGroupWidget',

        /** @type {classes.ImageWidget} */
        _image: null,
        /** @type {classes.DropDownWidget} */
        _dropDown: null,
        /** @type {HTMLElement} */
        _textElement: null,
        /**
         * Top div element used as main container to disable pointer events on topmenu opening
         * @type {HTMLElement}
         */
        _mainContainerWidget: null,
        /**
         * Indicates if topmenugroup is a sub menu (child of another topmenugroup) or not
         * @type {?boolean}
         */
        _isSubMenu: null,

        /**
         * @inheritDoc
         */
        _initContainerElement: function() {
          $super._initContainerElement.call(this);

          this._mainContainerWidget = window.document.getElementsByClassName("gbc_MainContainerWidget")[0];

          this._textElement = this._element.getElementsByTagName('span')[0];

          this._image = cls.WidgetFactory.createWidget('ImageWidget', this.getBuildParameters());
          this._image.setAutoScale(true);
          this._element.prependChild(this._image.getElement());

          this._dropDown = cls.WidgetFactory.createWidget('ChoiceDropDown', this.getBuildParameters());
          this._dropDown.setParentWidget(this);
          this._dropDown.setBackgroundColor(this.getBackgroundColor());

          // on dropdown opening we set 'current' class for top level topmenugroup item
          this._dropDown.onOpen(function() {
            if (!this.isSubMenu()) {
              this.addClass("current");
              this.getParentWidget().addClass("open");
            }
          }.bind(this));
          // on dropdown close we remove 'current' class for top level topmenugroup item
          this._dropDown.onClose(function() {
            if (!this.isSubMenu()) {
              if (this.getElement()) {
                this.removeClass("current");
              }
              if (this.getParentWidget()) {
                this.getParentWidget().removeClass("open");
              }
            }
          }.bind(this));

          if (!window.isMobile()) {
            this._element.on('mouseover.TopMenuGroupWidget', this._displayTopMenuDropDown.bind(this));
          } else { // for mobile, topmenus are being displayed on touch
            // when a topmenu dropdown is displayed and we press on another sibling topmenugroup, we need to cancel close of current menu to be able to display other one right after press
            this._dropDown.shouldClose = function(targetElement) {
              return !targetElement.isElementOrChildOf(this.getParentWidget().getElement());
            }.bind(this);
          }
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (!window.isMobile()) {
            this._element.off('mouseover.TopMenuGroupWidget');
          }
          if (this._image) {
            this._image.destroy();
            this._image = null;
          }
          $super.destroy.call(this);
          this._dropDown.destroy();
          this._dropDown = null;
        },

        /**
         * @inheritDoc
         */
        managePriorityKeyDown: function(keyString, domKeyEvent, repeat) {
          var keyProcessed = false;

          if (this.isVisible()) {
            var currentChild = this._dropDown.getCurrentChildren();
            var parent = this.getParentWidget();
            keyProcessed = true;
            switch (keyString) {
              case "esc":
                this._dropDown.hide();
                break;
              case this.getStart():
                if (!this.isSubMenu()) { // navigate between topmenu groups
                  var previousMenu = parent.getPreviousMenu(this);
                  if (previousMenu) {
                    this.removeClass("current");
                    if (previousMenu.getName().endsWith("TopMenuGroupWidget")) {
                      previousMenu._displayTopMenuDropDown(null);
                    }
                  }
                } else { // hide sub menu
                  this._dropDown.remove();
                }
                break;
              case this.getEnd():
                if (currentChild && currentChild.getName().endsWith("TopMenuGroupWidget")) {
                  // display sub menu
                  currentChild._displayTopMenuDropDown(null);
                } else {
                  if (!this.isSubMenu()) { // navigate between topmenu groups
                    var nextMenu = parent.getNextMenu(this);
                    if (nextMenu) {
                      this.removeClass("current");
                      if (nextMenu.getName().endsWith("TopMenuGroupWidget")) {
                        nextMenu._displayTopMenuDropDown(null);
                      }
                    }
                  }
                }
                break;
              case "enter":
              case "return":
                if (currentChild) {
                  if (currentChild.getName().endsWith("TopMenuGroupWidget")) {
                    // display sub menu
                    currentChild._displayTopMenuDropDown(null);
                  } else if (currentChild.getName().endsWith("TopMenuCommandWidget")) {
                    currentChild.emit(context.constants.widgetEvents.click);
                  }
                }
                break;
              default:
                keyProcessed = false;
            }
          }
          if (keyProcessed) {
            return true;
          } else {
            return this._dropDown.managePriorityKeyDown(keyString, domKeyEvent, repeat);
          }
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          if (!this.isSubMenu()) {
            this._dropDown.toggle();
            return false;
          } else if (window.isMobile()) { // for mobile, execute mouseover logic on click
            this._displayTopMenuDropDown();
          }
          return true;
        },

        /**
         * Display topmenu or submenus dropdown (only if it was initially displayed using a click)
         * @param {?object} [event] - source event handler. If null we take current topmenu element as target element
         * @protected
         */
        _displayTopMenuDropDown: function(event) {
          if (cls.DropDownWidget.hasAnyVisible()) {
            // 1. eventually hide previous sub menu
            var element = event ? event.target : this.getElement();
            var lastDropDown = cls.DropDownWidget.getActiveDropDown();

            // don't re display if same dropdown
            if (lastDropDown.getParentWidget() !== this) {

              if (!lastDropDown.getElement().contains(element)) {
                lastDropDown.remove();
              }

              // 2. display new sub menu
              if (this.isSubMenu()) {
                var parentRect = this.getElement().getBoundingClientRect();
                this._dropDown.x = parentRect.right;
                this._dropDown.y = parentRect.top;
              }
              this._dropDown.show(this.isSubMenu());
            }
          }
        },

        /**
         * Check if current topmenugroup is a child of another topmenugroup
         * @returns {boolean} true if current topmenugroup is a child of another topmenugroup
         */
        isSubMenu: function() {
          if (this._isSubMenu === null && this.getParentWidget()) {
            // usage of endsWidth to manage startmenu names
            this._isSubMenu = !this.getParentWidget().getName().endsWith("TopMenuWidget");
          }
          return this._isSubMenu;
        },

        /**
         * @inheritDoc
         */
        addChildWidget: function(widget) {
          this._dropDown.adoptChildWidget(widget);
        },
        /**
         * @inheritDoc
         */
        removeChildWidget: function(widget) {
          this._dropDown.removeChildWidget(widget);
        },

        /**
         * Get all children of TopMenuGroup DropDown
         * @returns {classes.WidgetBase[]} the list of children being added in dropDown
         * @publicdoc
         */
        getChildren: function() {
          return this._dropDown.getChildren();
        },

        /**
         * Set the text of the group item
         * @param {string} text - Text to display
         * @publicdoc
         */
        setText: function(text) {
          this._setTextContent(text, "_textElement");
        },

        /**
         * Get the text of the group item
         * @return {string} - Text displayed
         * @publicdoc
         */
        getText: function() {
          return this._textElement.textContent;
        },

        /**
         * Define the group item image
         * @param {string} image - image source url
         * @publicdoc
         */
        setImage: function(image) {
          this._image.setSrc(image);
          this._image.toggleClass("hidden", !this.isSubMenu() && !image);
        },

        /**
         * Get image of the group item
         * @return {?string} - source of the image, null if not set
         * @publicdoc
         */
        getImage: function() {
          if (this._image) {
            return this._image.getSrc();
          }
          return null;
        },

        /**
         * @inheritDoc
         */
        setBackgroundColor: function(color) {
          if (this._dropDown) {
            this._dropDown.setBackgroundColor(color);
          }
        },

        /**
         * @inheritDoc
         */
        setColor: function(color) {
          $super.setColor.call(this, color);
          if (this._dropDown) {
            this._dropDown.setColor(color);
          }
        },

        /**
         * Always true to be able to have dropdown associated with topmenugroup
         * @return {boolean} - always true
         */
        hasFocus: function() {
          return true;
        }
      };
    });
    cls.WidgetFactory.registerBuilder('TopMenuGroup', cls.TopMenuGroupWidget);
  });
