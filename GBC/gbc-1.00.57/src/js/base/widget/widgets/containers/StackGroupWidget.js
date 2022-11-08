/// FOURJS_START_COPYRIGHT(D,2017)
/// Property of Four Js*
/// (c) Copyright Four Js 2017, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('StackGroupWidget', ['StackLayoutWidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Group widget.
     * @class StackGroupWidget
     * @memberOf classes
     * @extends classes.StackLayoutWidgetBase
     */
    cls.StackGroupWidget = context.oo.Class(cls.StackLayoutWidgetBase, function($super) {
      return /** @lends classes.StackGroupWidget.prototype */ {
        __name: "StackGroupWidget",
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
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.StackGroupLayoutEngine(this);
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

          this._groupWidgetContent = null;
          $super.destroy.call(this);
        },
        /**
         * @param {string} text text describing the group content
         */
        setText: function(text) {
          this._title.setText(text);
          this.getLayoutEngine().forceMeasurement();
          this.getLayoutEngine().invalidateMeasure();
        },

        /**
         * @returns {string} text describing the group content
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
         * update the layout engine collapsed information
         * @private
         */
        _updateCollapsedState: function() {
          this._layoutEngine._willRenderContent = !this._title.isCollapsed();
          this._containerElement.toggleClass("hidden", this._title.isCollapsed());
          context.StoredSettingsService.setGroupCollapsedState(this._groupIdentifier.formName,
            this._groupIdentifier.id, Boolean(this._title.isCollapsed()));
          this.getLayoutEngine().forceMeasurement();
          this.getLayoutEngine().invalidateMeasure();
        }
      };
    });
    cls.WidgetFactory.registerBuilder('Stack Group', cls.StackGroupWidget);
  });
