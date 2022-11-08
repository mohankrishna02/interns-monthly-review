/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('ChromeRightBarWidget', ['DropDownWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * SideBar for devices with style 'chromeBar' enabled
     * This widget will display all actions/toolbar that doesn't fit in the chromeTopBar
     * @class ChromeRightBarWidget
     * @memberOf classes
     * @extends classes.DropDownWidget
     */
    cls.ChromeRightBarWidget = context.oo.Class(cls.DropDownWidget, function($super) {
      return /** @lends classes.ChromeRightBarWidget.prototype */ {
        __name: "ChromeRightBarWidget",
        __templateName: "ChromeRightBarWidget",

        /** @type {Boolean} */
        _firstItemSelected: false, // flag to keep track of first item (for styling)

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          // Setup of the DropDown
          this.reverseX = true;
          //this.setFullHeight(); // display as a panel if set, otherwise, displays as a dropdown
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);

          // Swipe to Right on opened sidebar to close it
          this.getElement().onSwipe("ChromeRightBarWidget", this.hide.bind(this), {
            direction: ["right"]
          });
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          // Close the chromebar on click on any part of it
          this.hide();
          return true;
        },

        /**
         * Overrided to allow one to click on items of the top chromebar in one click
         * @inheritDoc
         */
        shouldClose: function(targetElement) {
          var topChromeBar = this.getParentWidget();
          return !targetElement.isElementOrChildOf(topChromeBar.getElement());
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this.getElement().offSwipe("ChromeRightBarWidget");
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        addChildWidget: function(widget, options) {
          // Force a text (aui name) if not defined
          if (widget.getText && widget.getText().length <= 0) {
            widget.setText(widget._auiName);
          }
          $super.addChildWidget.call(this, widget, options);
        },

        /**
         * @inheritDoc
         */
        adoptChildWidget: function(widget) {
          $super.adoptChildWidget.call(this, widget);

          // Select the first item of the type gbcItem to add some decoration
          if (!this._firstItemSelected && this.getChildren("gbcItem").length > 0) {
            this.getChildren("gbcItem")[0].addClass("chromebar-firstGbcItem");
            this._firstItemSelected = true;
          }
        },

        /**
         * @inheritDoc
         */
        show: function(multiple) {
          // Adding some sliding effect
          //this.addClass("slide-right");
          $super.show.call(this, multiple);
          //this.removeClass("slide-right");
        },

        /**
         * Get all children of this widget with filtering options
         * @param {string?} itemType - filter result on a given itemType
         * @returns {classes.WidgetBase[]} the list of children of this widget group
         * @publicdoc
         */
        getChildren: function(itemType) {
          if (!itemType) {
            return $super.getChildren.call(this);
          } else {
            return this._children.filter(function(child) {
              if (child.isInstanceOf(cls.ToolBarSeparatorWidget) || !child.getItemType) {
                return false;
              }
              return child.getItemType() === itemType;
            });
          }
        },

      };
    });
    cls.WidgetFactory.registerBuilder('ChromeRightBar', cls.ChromeRightBarWidget);
  });
