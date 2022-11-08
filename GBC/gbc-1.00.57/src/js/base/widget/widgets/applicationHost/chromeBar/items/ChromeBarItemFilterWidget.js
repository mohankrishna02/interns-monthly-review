/// FOURJS_START_COPYRIGHT(D,2019)
/// Property of Four Js*
/// (c) Copyright Four Js 2019, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('ChromeBarItemFilterWidget', ['ChromeBarItemWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Filter button in ChromeBar
     * @class ChromeBarItemFilterWidget
     * @memberOf classes
     * @extends classes.ChromeBarItemWidget
     */
    cls.ChromeBarItemFilterWidget = context.oo.Class(cls.ChromeBarItemWidget, function($super) {
      return /** @lends classes.ChromeBarItemFilterWidget.prototype */ {
        __name: "ChromeBarItemFilterWidget",
        __templateName: "ChromeBarItemWidget",

        /** @type {Element} */
        _filter: null,
        /** @type {Element} */
        _input: null,
        /** @type {Element} */
        _back: null,
        /** @type {Element} */
        _clear: null,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);

          this.setItemType("item");
          this.setText(i18next.t('gwc.main.chromebar.filter'));
          this.setTitle(i18next.t('gwc.main.chromebar.filter'));
          this.setImage("zmdi-filter-variant");

          this._filter = document.createElement("span");
          this._filter.addClass("gbc_Filter");

          this._input = document.createElement("input");
          this._input.addClass("gbc_FilterInput");
          this._input.setAttribute("type", "text");
          this._input.setAttribute("placeholder", i18next.t('gwc.main.chromebar.filter'));

          this._back = document.createElement("i");
          this._back.addClasses("zmdi", "zmdi-arrow-left");

          this._clear = document.createElement("i");
          this._clear.addClasses("zmdi", "zmdi-close", "filter-clear");

          this._filter.appendChild(this._back);
          this._filter.appendChild(this._input);
          this._filter.appendChild(this._clear);

          this._input.on('keydown', function(evt) {
            evt.stopPropagation();
            if (evt.key.toLowerCase() === "enter") {
              this.getUserInterfaceWidget().getFocusedWidget().setFocus();
            }
          }.bind(this));

          this._input.on('input', this.updateFilter.bind(this));
        },

        /**
         * @inheritDoc
         */
        destroy: function() {

          this._input.off("keydown");
          this._input.off("input");

          this._filter = null;
          this._input = null;
          this._back = null;
          this._clear = null;

          $super.destroy.call(this);
        },

        /**
         * Update and send filter value to DVM
         */
        updateFilter: function() {
          var app = gbc.SessionService.getCurrent() && gbc.SessionService.getCurrent().getCurrentApplication();
          var focusedNode = app.focus.getFocusedNode();
          var event = new cls.VMConfigureEvent(focusedNode.getId(), {
            filter: this._input.value
          });
          app.typeahead.event(event, focusedNode);
        },

        /**
         * Set filter value in the input element
         * @param {String} value - filter value
         */
        setFilterValue: function(value) {
          this._input.value = value;
        },

        /**
         * Say if we have the focus
         * @returns {boolean}
         */
        hasFocusOnInput: function() {
          return this._filter.isInDOM() && this._input === document.activeElement;
        },

        /**
         * Put the focus to the input filter
         */
        setFocusOnInput: function() {
          if (this._filter.isInDOM()) {
            this._input.domFocus();
          }
        },

        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {

          // click on input filter does nothing
          if (domEvent.target.isElementOrChildOf(this._input)) {
            return false;
          }

          // click on clear button, just clear the input
          if (domEvent.target.isElementOrChildOf(this._clear)) {
            this._input.value = "";
            this.updateFilter();
            this._input.domFocus();
            return false;
          }

          // hide or show input filter
          if (this._filter.isInDOM()) {
            this._image.setHidden(false);
            this._filter.remove();
          } else {
            this._image.setHidden(true);
            this._element.appendChild(this._filter);
            this._input.domFocus();
          }

          return false;
        }

      };
    });
    cls.WidgetFactory.registerBuilder('ChromeBarItemFilter', cls.ChromeBarItemFilterWidget);
  });
