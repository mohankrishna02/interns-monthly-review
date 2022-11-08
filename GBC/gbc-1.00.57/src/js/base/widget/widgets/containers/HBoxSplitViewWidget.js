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

modulum('HBoxSplitViewWidget', ['HBoxWidget', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * HBoxSplitViewWidget widget is an advanced HBox widget. It can acts as a normal HBox or as SplitView
     * with each child group displayed full viewport
     * @class HBoxSplitViewWidget
     * @memberOf classes
     * @extends classes.HBoxWidget
     * @publicdoc Widgets
     */
    cls.HBoxSplitViewWidget = context.oo.Class(cls.HBoxWidget, function($super) {
      return /** @lends classes.HBoxSplitViewWidget.prototype */ {
        __name: "HBoxSplitViewWidget",
        /**
         * index of current hbox child group being visible.
         * @type {number}
         */
        _currentDisplayedGroupIndex: 0,
        /**
         * current group widget being displayed
         * @type {classes.WidgetBase}
         */
        _currentGroupWidget: null,
        /**
         * group active listeners (focus + visibility)
         * @type {Map<string, Function>}
         */
        _displayGroupActiveHandlers: null,
        /**
         * swipe event handler
         * @type {Function}
         */
        _swipeHandler: null,
        /**
         * screen size/orientation handler. Disable or enable SplitView mechanism depending of screen size
         * @type {Function}
         */
        _screenSizeHandler: null,
        /**
         * resize handler used in screen resize setTimeout
         * @type {Function}
         */
        _resizeHandle: null,
        /**
         * UserInterface widget of current HBoxSplitView
         * @type {classes.UserInterfaceWidget}
         */
        _uiWidget: null,
        /**
         * Flag to indicate current state of HBox
         * @type {boolean}
         */
        _isSplitView: false,
        /**
         * Flag to indicate we are currently swiping
         * @type {boolean}
         */
        _isSwiping: false,
        /**
         * Index of previewed group. This index is going to become the current one if swipe is executed successfully
         * @type {number}
         */
        _previewedIndex: -1,
        /**
         * Flag to indicate if we are currently scrolling instead of swiping
         * @type {boolean}
         */
        _isScrolling: false,
        /**
         * Indicates if current group has horizontal scrollbars (only set for mobiles)
         * @type {boolean}
         */
        _currentGroupOverflowing: false,
        /**
         * Main SplitView element on which is bound swipe
         * @type {HTMLElement}
         */
        _splitViewContent: null,
        /**
         * Left arrow element (visual assistant to swipe)
         * @type {HTMLElement}
         */
        _leftArrow: null,
        /**
         * Right arrow element (visual assistant to swipe)
         * @type {HTMLElement}
         */
        _rightArrow: null,
        /**
         * Dots elements container (visual assistant to swipe)
         * @type {HTMLElement}
         */
        _dots: null,
        /**
         * 4ST attribute value for arrows. By default it's disabled and hidden
         * @type {string}
         */
        _arrowsStyle: "no",
        /**
         * 4ST attribute value for dots. By default it's disabled and hidden
         * @type {boolean}
         */
        _withDots: false,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          opts = opts || {};
          this._uiWidget = opts.uiWidget;
          $super.constructor.call(this, opts);
        },

        /**
         * @inheritDoc
         */
        _initContainerElement: function() {
          $super._initContainerElement.call(this);
          this._displayGroupActiveHandlers = new Map();

          this._splitViewContent = this.getElement().getElementsByClassName("splitViewContent")[0];
          this._leftArrow = this.getElement().getElementsByClassName("left_arrow")[0];
          this._rightArrow = this.getElement().getElementsByClassName("right_arrow")[0];
          this._dots = this.getElement().getElementsByClassName("dots")[0];

          // Listen to mobile orientation and disable/enable splitview mechanism if screen size condition is met
          this._screenSizeHandler = context.HostService.onScreenResize(function() {
            if (this._resizeHandle) {
              this._clearTimeout(this._resizeHandle);
            }
            this._resizeHandle = this._registerTimeout(this._initSplitView.bind(this), 100);
          }.bind(this));

          // add left/right arrows events
          this._leftArrow.on("click.SplitViewLeftArrow", function() {
            var newIndex = this._currentDisplayedGroupIndex - 1;
            if (newIndex >= 0) {
              this._displayGroupByIndex(newIndex);
            }
          }.bind(this));

          this._rightArrow.on("click.SplitViewRightArrow", function() {
            var newIndex = this._currentDisplayedGroupIndex + 1;
            if (newIndex < this.getGroupsLength()) {
              this._displayGroupByIndex(newIndex);
            }
          }.bind(this));

        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._resizeHandle) {
            this._clearTimeout(this._resizeHandle);
            this._resizeHandle = null;
          }
          if (this._screenSizeHandler) {
            this._screenSizeHandler();
            this._screenSizeHandler = null;
          }
          this._uiWidget = null;
          this._releaseSplitViewHandlers();
          for (var i = 0; i < this._dots.children.length; i++) {
            this._dots.children[i].off("click.SplitViewDot");
          }
          this._leftArrow.off("click.SplitViewLeftArrow");
          this._rightArrow.off("click.SplitViewRightArrow");
          this._leftArrow = null;
          this._rightArrow = null;
          this._dots = null;
          this._currentDisplayedGroupIndex = 0;
          this._currentGroupWidget = null;
          this._splitViewContent = null;
          this._displayGroupActiveHandlers = null;

          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          // attach corresponding layout engine
          if (this.isSplitView()) {
            this._layoutEngine = new cls.SplitViewLayoutEngine(this);
            this._layoutInformation.getStretched().setDefaultX(true);
            this._layoutInformation.getStretched().setDefaultY(true);
            if (this.areArrowsSolid()) {
              this.enableSolidArrows();
            }
          } else {
            this._layoutEngine = new cls.HBoxLayoutEngine(this);
          }

          // disable/enable splitview mechanism if screen size condition is met
          this._initSplitView();
        },

        /**
         * @inheritDoc
         */
        addChildWidget: function(widget, options) {
          $super.addChildWidget.call(this, widget, options);
          if (this.isSplitView()) {
            this._prepareGroup(widget, true);
            this._listenToGroupVisibilityChange(widget);
          }
        },

        /**
         * Returns true if HBox is a SplitView
         * @returns {boolean}
         */
        isSplitView: function() {
          return window.innerWidth <= context.ThemeService.getValue("mt-responsive-screen-width-breakpoint");
        },

        /**
         * Initialise SplitView or HBox depending of splitview condition match
         * @private
         */
        _initSplitView: function() {
          this._resizeHandle = null;

          if (this.isSplitView()) {
            this._enableSplitView();
            this._isSplitView = true;
          } else {
            this._disableSplitView();
            this._isSplitView = false;
          }
        },

        /**
         * Transform normal HBox into a SplitView
         * @private
         */
        _enableSplitView: function() {
          if (!this._isSplitView) {

            this._displayGroupActiveHandlers.clear();

            // Update the layout engine and register children in it.
            var oldEngine = this._layoutEngine;
            this._layoutEngine = new cls.SplitViewLayoutEngine(this);
            this._layoutInformation.getStretched().setDefaultX(true);
            this._layoutInformation.getStretched().setDefaultY(true);
            if (this.areArrowsSolid()) {
              this.enableSolidArrows();
            }

            for (var i = 0; i < this.getChildren().length; i++) {
              var child = this.getChildren()[i];
              this._prepareGroup(child);
              if (!child.isHidden()) {
                oldEngine.unregisterChild(child);
                this._layoutEngine.registerChild(child);
              }
              this._listenToGroupVisibilityChange(child);
            }

            // measures new layout
            context.SessionService.getCurrent().getCurrentApplication().layout.refreshLayout();

            // global listening to focus change
            if (this._uiWidget) {
              this._displayGroupActiveHandlers.set(this._uiWidget.getUniqueIdentifier() + "_focus", this._uiWidget.when(context
                .constants
                .widgetEvents.splitViewChange,
                this._displayFocusedGroup.bind(this)));
            }
            // add swipe mechanism
            this._swipeHandler = this._displayGroupByDirection.bind(this);

            // IMPORTANT : bind swipe on element and not containerElement otherwise swipe won't work on iOS because containerElement is being translated and is considered out of view
            this._splitViewContent.onSwipe("HBoxSplitViewWidget", this._swipeHandler, {
              direction: ["left", "right"],
              velocity: 0.6,
              distance: 0.45,
              startCallback: this._beforeSwipe.bind(this),
              moveCallback: this._duringSwipe.bind(this),
              endCallback: this._afterSwipe.bind(this),
            });
            // display current group
            this._moveGroup(this._currentDisplayedGroupIndex);

            this.getElement().addClass("isSplitView");

            // show arrows or dots if enabled by 4ST
            this._showArrowsDots();
          }
        },

        /**
         * Transform a SplitView into an HBox
         * @private
         */
        _disableSplitView: function() {
          if (this._isSplitView) {
            // Update the layout engine and register children in it.
            this._hideArrowsDots();

            this.getElement().removeClass("isSplitView");
            // remove transition styles
            this._removeSplitViewStyles();

            var oldEngine = this._layoutEngine;
            this._layoutEngine = new cls.HBoxLayoutEngine(this);
            this._layoutInformation.getStretched().setDefaultX(false);
            this._layoutInformation.getStretched().setDefaultY(false);

            this.disableSolidArrows();
            // need to loop from end in order to layout properly splitters (check DBoxLayoutEngine)
            for (var i = this.getChildren().length - 1; i >= 0; i--) {
              var child = this.getChildren()[i];
              if (child instanceof cls.SplitterWidget) {
                child.setHidden(false);
              }
              oldEngine.unregisterChild(child);
              this._layoutEngine.registerChild(child);
              if (child.getElement().parentNode.hasClass("hidden")) {
                child.getElement().parentNode.removeClass("hidden");
              }
            }
            // relayout splitters
            this.initSplitterLayoutEngine();
            // measure new layout
            context.SessionService.getCurrent().getCurrentApplication().layout.refreshLayout();
            // destroy previous splitview handlers
            this._releaseSplitViewHandlers();
          }
        },

        /**
         * Delete SplitView focus & swipe related listeners
         * @private
         */
        _releaseSplitViewHandlers: function() {
          if (this._swipeHandler) {
            this._splitViewContent.offSwipe("HBoxSplitViewWidget");
            this._swipeHandler = null;
          }
          if (this._displayGroupActiveHandlers) {
            this._displayGroupActiveHandlers.forEach(function(handler) {
              handler();
              handler = null;
            });
            this._displayGroupActiveHandlers.clear();
          }
        },

        /**
         * Remove preview transition styles from SplitView container element
         * @private
         */
        _removeSplitViewStyles: function() {
          this.getContainerElement().style.removeProperty("transform");
          this.getContainerElement().style.removeProperty("transition-duration");
        },

        /**
         * Hide group if splitter. Otherwise bind group to focus change
         * @param {classes.WidgetBase} widget - SplitView child group
         * @param {boolean=} firstCreation - indicates if it's first group creation
         * @private
         */
        _prepareGroup: function(widget, firstCreation) {
          if (widget instanceof cls.SplitterWidget) { // hide splitter in splitview
            widget.setHidden(true);
          } else if (!widget.isHidden()) {
            // each child group need to listen to focus to display. Mostly needed for folder pages.
            this._displayGroupActiveHandlers.set(widget.getUniqueIdentifier() + "_focus", widget.when(context.constants.widgetEvents
              .splitViewChange, this
              ._displayFocusedGroup
              .bind(this)));

            if (firstCreation) {
              this._addDot();
            }
          }
          if (widget.isHidden()) {
            if (widget.getElement().parentNode) {
              widget.getElement().parentNode.addClass("hidden");
            }
          }
        },

        /**
         * Listen to group visibility change to be able to add/remove it from swipeable element
         * @param {classes.WidgetBase} widget - SplitView child group
         * @private
         */
        _listenToGroupVisibilityChange: function(widget) {
          if (!(widget instanceof cls.SplitterWidget)) {
            this._displayGroupActiveHandlers.set(widget.getUniqueIdentifier() + "_visibility", widget.when(context.constants
              .widgetEvents.visibilityChange, this._addRemoveGroup.bind(this, widget)));
          }
        },

        /**
         * Add or remove a group in the list of swipeable groups of the HBox SplitView depending of group visibility
         * @param {classes.WidgetBase} widget - SplitView child group
         * @private
         */
        _addRemoveGroup: function(widget) {
          if (widget.isHidden()) {
            this._removeGroup(widget);
          } else {
            this._addGroup(widget);
          }
        },

        /**
         * Dynamically add a group in the list of swipeable groups of the HBox SplitView
         * @param {classes.WidgetBase} widget - SplitView child group
         * @private
         */
        _addGroup: function(widget) {
          this._prepareGroup(widget);
          this._layoutEngine.registerChild(widget);
          widget.getElement().parentNode.removeClass("hidden");
        },

        /**
         * Dynamically remove a group in the list of swipeable groups of the HBox SplitView
         * @param {classes.WidgetBase} widget - SplitView child group
         * @private
         */
        _removeGroup: function(widget) {
          // if we are currently displaying the last group and one of the splitview group gets hidden we need to display previous group which becomes the last one
          if (this._currentDisplayedGroupIndex === this.getGroupsLength() - 1 && this._currentDisplayedGroupIndex > 0) {
            this._displayGroupByIndex(this._currentDisplayedGroupIndex - 1);
          }
          var handler = this._displayGroupActiveHandlers.get(widget.getUniqueIdentifier() + "_focus");
          if (handler) {
            handler();
          }
          this._displayGroupActiveHandlers.delete(widget.getUniqueIdentifier() + "_focus");
          this._layoutEngine.unregisterChild(widget);
          widget.getElement().parentNode.addClass("hidden");
        },

        /**
         * Display parent group of the VM focused widget
         * @param {object} data - event data
         * @param {classes.WidgetBase} caller - event caller
         * @param {classes.WidgetBase} focusedWidget - new focused widget
         * @private
         */
        _displayFocusedGroup: function(data, caller, focusedWidget) {
          var newGroupIndex = this._currentDisplayedGroupIndex;

          var newVmFocusWidget = focusedWidget ? focusedWidget : this.getUserInterfaceWidget().getVMFocusedWidget();
          if (newVmFocusWidget) {
            var i = 0;
            var child = null;
            // detect new focused element group position
            for (i = 0; i < this.getLayoutEngine().getRegisteredWidgets().length; i++) {
              child = this.getLayoutEngine().getRegisteredWidgets()[i];
              if (newVmFocusWidget === child || newVmFocusWidget.isChildOf(child)) {
                // index of current group subtracted by number of previous splitters
                newGroupIndex = i;
                break;
              }
            }
          }

          // Display current focused group or first group by default (if none focused)
          this._displayGroupByIndex(newGroupIndex);
        },

        /**
         * Display a group by it's index position
         * @param {number} groupIndex
         * @private
         */
        _displayGroupByIndex: function(groupIndex) {
          if (this._currentDisplayedGroupIndex !== groupIndex) {
            this._currentDisplayedGroupIndex = groupIndex;
            this._currentGroupWidget = this.getLayoutEngine().getRegisteredWidgets()[groupIndex];
            // generate group transition
            this._moveGroup(groupIndex, 0.5);
          }
        },

        /**
         * On swipe start
         * @param {object} evt - event data
         * @private
         */
        _beforeSwipe: function(evt) {
          // disable swipe animation
          this.getContainerElement().addClass('disableAnimation');
          this._previewedIndex = -1;

          // save splitview current width for upcoming preview calculation
          this._splitViewWidth = this.getLayoutInformation().getAllocated().getWidth();
          // detect if current group has horizontal scrollbars which could conflict with swipe
          this._currentGroupOverflowing = false;
          if (evt.touches) {
            var clickedElement = evt.target;
            // exclude arrows and dots elements which are direct children of splitview
            if (clickedElement && clickedElement.parentNode && !clickedElement.parentNode.hasClass("isSplitView")) {
              this._currentGroupOverflowing = this._currentGroupWidget && this._currentGroupWidget.getLayoutInformation()
                .getAllocated()
                .getWidth() > (this._splitViewWidth +
                  2); // add 2px for margins
            }
          }
        },

        /**
         * Preview next group and adjust transition during whole swipe
         * @param {object} evt - data
         * @param {number} startX - starting swipe position
         * @private
         */
        _duringSwipe: function(evt, startX) {
          if (evt) {
            var clientX = evt.changedTouches ? evt.changedTouches[0].clientX : evt.clientX;
            var distance = Math.round(clientX - startX);
            var directionSign = Math.sign(distance);

            // Detect scroll
            this._isScrolling = false;
            if (this
              ._currentGroupOverflowing) { // if current group has horizontal scrollbars we give priority to scroll before swipe
              var rect = this._currentGroupWidget.getElement().getBoundingClientRect();
              if ((directionSign < 0 && rect.right > window.innerWidth) || (directionSign >= 0 && rect.left <
                  0)) { // need to scroll
                this._isScrolling = true;
              }
            }

            // Prepare for swipe if no scroll
            // get previewed group to see if we have something to preview
            this._previewedIndex = this._currentDisplayedGroupIndex - directionSign;
            // if we have nothing to preview on current SplitView bubble event we let parent SplitView (if it exists) to preview itself
            this._isSwiping = !this._isScrolling && this._previewedIndex >= 0 && this._previewedIndex < this.getGroupsLength();
            if (this._isSwiping) { // we have a group to preview
              evt.stopPropagation(); // don't bubble event to parent
              this._previewGroup(this._currentDisplayedGroupIndex, distance);
            }
          }
        },

        /**
         * Returns number of groups which are swipeable
         * @returns {number}
         */
        getGroupsLength: function() {
          return this.getLayoutEngine().getRegisteredWidgets().length;
        },

        /**
         * On successful swipe we update current group index. This callback is executed right before touch release callback and only on a completed swipe.
         * @param {string} direction - direction of the swipe
         * @private
         */
        _displayGroupByDirection: function(direction) {
          if (this._isSwiping && this._previewedIndex >= 0 && (direction === "left" || direction === "right")) {
            // display new group as a slide from right/left depending of current group related position
            this._currentDisplayedGroupIndex = this._previewedIndex;
            this._currentGroupWidget = this.getLayoutEngine().getRegisteredWidgets()[this._previewedIndex];
          }
        },

        /**
         * On each touch/mouse release we update current group or reset preview
         * @param {object} evt - event data
         * @param {number} swipedVelocity - swipe velocity (swipe speed)
         * @param {number} swipedFraction - distance of swipe
         * @private
         */
        _afterSwipe: function(evt, swipedVelocity, swipedFraction) {
          this._isSwiping = false;

          if (this._previewedIndex !== -1) {
            // focus group (can generate a transition if group index has changed or simply reset preview if swipe wasn't complete)
            this._previewedIndex = -1;
            var duration = (swipedVelocity > 0 ? swipedFraction : "1") * 0.5;
            // update style to generate transition
            this._moveGroup(this._currentDisplayedGroupIndex, duration);
          }
          // enable transition animation
          this.getContainerElement().removeClass('disableAnimation');
        },

        /**
         * Display group by index
         * @param {Number} index - index of current group in parent children list
         * @param {Number=} duration - duration of transition in seconds. If none we don't animate.
         * @private
         */
        _moveGroup: function(index, duration) {
          var current = index * -100; // convert position into percentage
          // perf note : setProperty method not used because 60% slower under IE11

          // first update arrows & dots 4ST before generating transition to avoid css animation conflicts
          this._updateCurrentDot();
          if (this.areArrowsVisible()) {
            this._showArrows();
          }

          if (duration) {
            this.getContainerElement().style.transitionDuration = duration + "s";
          } else {
            this.getContainerElement().style.removeProperty("transition-duration");
          }
          // translate splitview
          this.getContainerElement().style.transform = "translate(" + current + "%)";
        },

        /**
         * Preview group by index
         * @param {Number} index - index of current group in parent children list
         * @param {Number} previewDistance - distance of current previewed group
         * @private
         */
        _previewGroup: function(index, previewDistance) {
          var preview = -(index * this._splitViewWidth) + previewDistance;
          // translate splitview
          this.getContainerElement().style.transform = "translate(" + preview + "px)";
        },

        /******** 4ST styles methods *********/

        /**
         * Create a dot element and add it in the DOM
         * @private
         */
        _addDot: function() {
          var div = document.createElement("div");
          div.addClass("dot");
          div.on("click.SplitViewDot", this._displayGroupByIndex.bind(this, this._dots.children.length));
          // add listener
          this._dots.appendChild(div);
        },

        /**
         * Update current dot status
         * @private
         */
        _updateCurrentDot: function() {
          for (var i = 0; i < this._dots.children.length; i++) {
            var dot = this._dots.children[i];
            if (i === this._currentDisplayedGroupIndex) {
              if (!dot.hasClass("current")) {
                dot.addClass("current");
              }
            } else {
              dot.removeClass("current");
            }
          }
        },

        /**
         * Returns true if arrows should be visible/enabled
         * @returns {boolean}
         */
        areArrowsVisible: function() {
          return this.isSplitView() && (this.areArrowsOverlay() || this.areArrowsSolid());
        },

        /**
         * Returns true if arrows should be displayed as overlay on splitview content
         * @returns {boolean}
         */
        areArrowsOverlay: function() {
          return this._arrowsStyle === "overlay";
        },

        /**
         * Returns true if arrows should be displayed as solid next to splitview content
         * @returns {boolean}
         */
        areArrowsSolid: function() {
          return this._arrowsStyle === "solid";
        },

        enableSolidArrows: function() {
          this._layoutInformation.setDecorating(60, 0);
          this._layoutInformation.setDecoratingOffset(30, 0);
          if (!this._leftArrow.hasClass("solid")) {
            this._leftArrow.addClass("solid");
          }
          if (!this._rightArrow.hasClass("solid")) {
            this._rightArrow.addClass("solid");
          }
        },

        disableSolidArrows: function() {
          this._layoutInformation.setDecorating(0, 0);
          this._layoutInformation.setDecoratingOffset(0, 0);
          this._leftArrow.removeClass("solid");
          this._rightArrow.removeClass("solid");
        },

        /**
         * Returns true if dots should be visible/enabled
         * @returns {boolean}
         */
        areDotsVisible: function() {
          return this.isSplitView() && this._withDots;
        },

        /**
         * Display arrows and dots depending of current group being focused
         * @private
         */
        _showArrowsDots: function() {
          if (this.areArrowsVisible()) {
            this._showArrows();
          }
          if (this.areDotsVisible()) {
            this._showDots();
          }
        },

        /**
         * Hide arrows and dots
         * @private
         */
        _hideArrowsDots: function() {
          this._hideArrows();
          this._hideDots();
        },

        /**
         * Display arrows and synchronize their visibility with current group
         * @private
         */
        _showArrows: function() {
          if (this._currentDisplayedGroupIndex > 0) {
            this._leftArrow.removeClass("disabled");
          } else {
            if (!this._leftArrow.hasClass("disabled")) {
              this._leftArrow.addClass("disabled");
            }
          }
          if (this._currentDisplayedGroupIndex < this.getGroupsLength() - 1) {
            this._rightArrow.removeClass("disabled");
          } else {
            if (!this._rightArrow.hasClass("disabled")) {
              this._rightArrow.addClass("disabled");
            }
          }
        },

        /**
         * Display dots
         * @private
         */
        _showDots: function() {
          this._dots.removeClass("disabled");
          this._updateCurrentDot();
        },

        /**
         * Hide arrows
         * @private
         */
        _hideArrows: function() {
          if (!this._leftArrow.hasClass("disabled")) {
            this._leftArrow.addClass("disabled");
          }
          if (!this._rightArrow.hasClass("disabled")) {
            this._rightArrow.addClass("disabled");
          }
        },

        /**
         * Hide dots
         * @private
         */
        _hideDots: function() {
          if (!this._dots.hasClass("disabled")) {
            this._dots.addClass("disabled");
          }
        },

        /**
         * Set current arrows style
         * @param {string} style
         */
        setArrowsStyle: function(style) {
          this._arrowsStyle = style;
          if (this.areArrowsVisible()) {
            this._showArrows();
          } else {
            this._hideArrows();
          }

          if (this.areArrowsSolid()) {
            this.enableSolidArrows();
          } else {
            this.disableSolidArrows();
          }
        },

        /**
         * Set current dots style
         * @param {string} style
         */
        setWithDots: function(style) {
          this._withDots = style === 'yes';
          if (this.areDotsVisible()) {
            this._showDots();
          } else {
            this._hideDots();
          }
        }
      };
    });
    cls.WidgetFactory.registerBuilder("HBoxSplitView", cls.HBoxSplitViewWidget);
  });
