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

modulum('GroupTitleWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Group title widget.
     * @class GroupTitleWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     * @publicdoc
     */
    cls.GroupTitleWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.GroupTitleWidget.prototype */ {
        __name: "GroupTitleWidget",

        /**
         * @type {HTMLElement}
         */
        _textContainer: null,

        /**
         * is owner group collapsible
         * @type {boolean}
         */
        _isCollapsible: false,
        /**
         * @type {HTMLElement}
         */
        _collapser: null,
        /**
         * @type {HTMLElement}
         */
        _collapserIcon: null,

        /**
         * is owner group collapsed
         * @type {boolean}
         */
        _collapsed: false,

        /**
         * has text
         * @type {boolean}
         */
        _isEmpty: true,

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.LeafLayoutEngine(this);
          this._layoutInformation.getSizePolicyConfig().setMode('dynamic');
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._textContainer = this._element.getElementsByTagName('span')[0];
          this._collapser = this._element.getElementsByTagName('span')[1];
          this._collapserIcon = this._element.getElementsByTagName('i')[0];
        },
        /**
         * @inheritDoc
         */
        destroy: function() {
          this._textContainer = null;
          this._collapser = null;
          this._collapserIcon = null;
          $super.destroy.call(this);
        },
        /**
         * Defines group title text
         * @param {string} text - text describing the group
         * @publicdoc
         */
        setText: function(text) {
          this.domAttributesMutator(function() {
            if (/^[ \t]+$/.test(text)) {
              this._textContainer.innerHTML = "&nbsp;";
            } else {
              this._textContainer.textContent = text;
            }
            this._element.toggleClass("empty", !text);
          }.bind(this));
          this._isEmpty = !text;
          this.getLayoutEngine().forceMeasurement();
          this.getLayoutEngine().invalidateMeasure();
        },

        /**
         * Returns group title text
         * @returns {string} text describing the group
         * @publicdoc
         */
        getText: function() {
          return this._textContainer.textContent;
        },

        /**
         * Display collapsible control if needed
         * @param {boolean} collapsible
         */
        setCollapsible: function(collapsible) {
          this._isCollapsible = Boolean(collapsible);
          this._element.toggleClass("collapsible", this._isCollapsible);
        },

        /**
         * whether or not owner group is collapsed
         * @return {boolean}
         */
        isCollapsed: function() {
          return this._collapsed;
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          if (!this._isEmpty) {
            this._collapsed = !this._collapsed;
            this._updateToggle();
            this.emit(context.constants.widgetEvents.click);
          }
          return true;
        },

        /**
         * set the collapsed state
         * @param {boolean} collapsed the collapsed state
         */
        setCollapsed: function(collapsed) {
          if (this._collapsed !== Boolean(collapsed)) {
            this._collapsed = Boolean(collapsed);
            this._updateToggle();
          }
        },
        /**
         * update the toggle icon
         * @private
         */
        _updateToggle: function() {
          this._collapserIcon.toggleClass("zmdi-chevron-down", !this._collapsed).toggleClass("zmdi-chevron-right", this._collapsed);
        },

        /**
         * Define the position of the collapser
         * @param {string} pos - could be 'left' or 'right' (default)
         */
        setCollapserPosition: function(pos) {
          this.removeClass("collapser-position-right");
          this.removeClass("collapser-position-left");
          this.addClass("collapser-position-" + pos);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('GroupTitle', cls.GroupTitleWidget);
  });
