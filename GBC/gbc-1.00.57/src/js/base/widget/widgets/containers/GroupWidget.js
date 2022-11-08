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

modulum('GroupWidget', ['WidgetGridLayoutBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Group widget.
     * @class GroupWidget
     * @memberOf classes
     * @extends classes.WidgetGridLayoutBase
     * @publicdoc
     */
    cls.GroupWidget = context.oo.Class(cls.WidgetGridLayoutBase, function($super) {
      return /** @lends classes.GroupWidget.prototype */ {
        __name: "GroupWidget",
        /**
         * @type {classes.GroupTitleWidget}
         */
        _title: null,

        /**
         * @type {HandleRegistration}
         */
        _titleClickHandler: null,

        /**
         * flag to determine if group is collapsible
         * @type {boolean}
         */
        _isCollapsible: false,

        /**
         * @type {HandleRegistration}
         */
        _gridWidthHandle: null,

        /**
         * @type {HTMLElement}
         */
        _groupWidgetContent: null,

        /**
         * @type {HTMLElement}
         */
        _groupContent: null,

        /**
         * @type {{formName:string, id:string}}
         */
        _groupIdentifier: null,
        /**
         * set the stored settings identifier
         * @param {{formName:string, id:string}} id
         */
        setGroupIdentifier: function(id) {
          this._groupIdentifier = id;
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);

          this._title = cls.WidgetFactory.createWidget("GroupTitle", this.getBuildParameters());
          this._titleClickHandler = this._title.when(context.constants.widgetEvents.click, this._onTitleClick.bind(this));
          this._groupWidgetContent = this._element.getElementsByClassName("gbc_GroupWidgetContent")[0];
          this._groupWidgetContent.prependChild(this._title.getElement());
          this._groupContent = this._groupWidgetContent.getElementsByClassName("containerElement")[0];
          // Set the default value of the collapsers to the theme definition
          this.setCollapserPosition(gbc.ThemeService.getValue("gbc-GroupWidget-collapser-position"));
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.GroupLayoutEngine(this);
          this._gridWidthHandle = this.getLayoutInformation().onGridInfoChanged(this._onGridWidthChanged.bind(this));
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._titleClickHandler) {
            this._titleClickHandler();
            this._titleClickHandler = null;
          }

          if (this._title) {
            this._title.destroy();
            this._title = null;
          }
          if (this._gridWidthHandle) {
            this._gridWidthHandle();
            this._gridWidthHandle = null;
          }
          this._groupWidgetContent = null;
          this._groupContent = null;
          $super.destroy.call(this);
        },

        /**
         * Handle grid width changes
         */
        _onGridWidthChanged: function() {
          this._title.getLayoutInformation().setGridWidth(this.getLayoutInformation().getGridWidth());
        },

        /**
         * @inheritDoc
         */
        setGridChildrenInParent: function(isGridChildrenInParent) {
          if (this._isGridChildrenInParent !== isGridChildrenInParent) {
            if (!isGridChildrenInParent) {
              this._groupContent.removeClass("gridChildrenInParent");
            }
            $super.setGridChildrenInParent.call(this, isGridChildrenInParent);
            if (isGridChildrenInParent) {
              this._groupContent.addClass("gridChildrenInParent");
            }
          }
        },
        /**
         * Defines group title text
         * @param {string} text - text describing the group
         * @publicdoc
         */
        setText: function(text) {
          this._title.setText(text);
          this.getLayoutEngine().forceMeasurement();
          this.getLayoutEngine().invalidateMeasure();
        },

        /**
         * Returns group title text
         * @returns {string} text describing the group
         * @publicdoc
         */
        getText: function() {
          return this._title.getText();
        },
        /**
         * when group title is clicked
         * @private
         */
        _onTitleClick: function() {
          if (this._isCollapsible) {
            this._updateCollapsedState();
            this.emit(context.constants.widgetEvents.toggleClick);
          }
        },

        /**
         * Set the group collapsible
         * @param {boolean} collapsible
         */
        setCollapsible: function(collapsible) {
          this._isCollapsible = Boolean(collapsible);
          this._title.setCollapsible(this._isCollapsible);
          if (this._isCollapsible) {
            this.setCollapsed(Boolean(context.StoredSettingsService
              .getGroupCollapsedState(this._groupIdentifier.formName, this._groupIdentifier.id)));
          }
        },

        /**
         * set the collapsed state
         * @param {boolean} collapsed the collapsed state
         * @return {boolean} true if collapsed state has changed
         */
        setCollapsed: function(collapsed) {
          var result = false;
          if (this._isCollapsible) {
            if (this._title.isCollapsed() !== Boolean(collapsed)) {
              this._title.setCollapsed(collapsed);
              this._updateCollapsedState();
              result = true;
            }
          }
          return result;
        },

        /**
         * Define the position of the collapser
         * @param {string} pos - could be 'left' or 'right' (default)
         */
        setCollapserPosition: function(pos) {
          this._title.setCollapserPosition(pos);
        },

        /**
         * update the layout engine collapsed information
         * @private
         */
        _updateCollapsedState: function() {
          this._layoutEngine._willRenderContent = !this._title.isCollapsed();
          context.StoredSettingsService.setGroupCollapsedState(this._groupIdentifier.formName,
            this._groupIdentifier.id, Boolean(this._title.isCollapsed()));
          this.getLayoutEngine().forceMeasurement();
          this.getLayoutEngine().invalidateMeasure();
        }

      };
    });
    cls.WidgetFactory.registerBuilder('Group', cls.GroupWidget);
  });
