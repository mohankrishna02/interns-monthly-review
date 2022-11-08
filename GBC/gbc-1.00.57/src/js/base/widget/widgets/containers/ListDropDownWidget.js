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

/**
 * @callback ListDropDownItemRenderer
 * @param {string[]} model splitted string model
 * @param {Object} item the object value
 * @return {string} rendered html
 */

/**
 * @typedef {Object} ListDropDownWidgetItem
 * @property {string} text
 * @property {string} value
 */

modulum('ListDropDownWidget', ['DropDownWidget', 'WidgetFactory'],
  function(context, cls) {
    /**
     * Choice DropDown widget.
     * @class ListDropDownWidget
     * @memberOf classes
     * @extends classes.DropDownWidget
     */
    cls.ListDropDownWidget = context.oo.Class(cls.DropDownWidget, function($super) {
      return /** @lends classes.ListDropDownWidget.prototype */ {
        /** @lends classes.ListDropDownWidget */
        $static: {
          /**
           *
           * @private
           */
          _defaultItemRenderer: null,
          /**
           * Produces the default item renderer
           * @return {ListDropDownItemRenderer}
           */
          getDefaultItemRenderer: function() {
            if (!cls.ListDropDownWidget._defaultItemRenderer) {
              var uiModel = context.TemplateService.renderDOM(
                cls.CheckBoxWidget.prototype.__name,
                cls.CheckBoxWidget.prototype.__ascendance
              );
              uiModel.className += " " + cls.CheckBoxWidget.prototype.__ascendanceClasses;
              uiModel.addClass("gbc_ListDropDownWidget_item");
              uiModel.setAttribute("combovalue", "#$value#");
              var labelElement = document.createElement('div');
              labelElement.addClass('label');
              labelElement.textContent = "#$text#";
              uiModel.getElementsByClassName('content')[0].appendChild(labelElement);
              var model = uiModel.outerHTML.split("#");
              cls.ListDropDownWidget._defaultItemRenderer = function(model, item) {
                var result = "",
                  len = model.length;
                for (var i = 0; i < len; i++) {
                  // escape HTML conflicting chars such as quote and double-quotes before adding it in the DOM
                  result += model[i][0] === "$" ? (item[model[i].substr(1)].escapeHTML() || "") : model[i];
                }
                return result;
              }.bind(null, model);
            }
            return cls.ListDropDownWidget._defaultItemRenderer;
          }
        },
        __name: "ListDropDownWidget",
        __templateName: "DropDownWidget",
        /**
         * @inheritDoc
         */
        autoSize: true,
        /**
         * whether or not this list will allow multiple value selection
         * @type {boolean}
         */
        _allowMultipleValues: false,
        /**
         * whether or not this list will allow null value
         * @type {boolean}
         */
        _notNull: false,
        /**
         * internal - used for positioning computation
         * @type {number}
         */
        _nullableShift: 0,
        /**
         * current items - raw data
         * @type {Object[]}
         */
        _items: null,
        /**
         * currently highlighted element
         * @type {number}
         */
        _currentIndex: -1,
        /**
         * currently set value
         * @type {string}
         */
        _currentValue: "",
        /**
         * item renderer
         * @type {ListDropDownItemRenderer}
         */
        _itemRenderer: null,
        /** styles */
        _cssSelector: ".gbc_ListDropDownWidget_item",

        /**
         * @inheritDoc
         */
        _initContainerElement: function() {
          $super._initContainerElement.call(this);

          this._items = [];
          this._itemRenderer = cls.ListDropDownWidget.getDefaultItemRenderer();
          this._containerElement.on("click.ListDropDownWidget", this._onClick.bind(this));
          if (!window.isMobile()) {
            this._containerElement.on('mouseover.ListDropDownWidget', this._onMouseover.bind(this));
          }

          this.onOpen(function() {
            if (this.getParentWidget().getEditValue) {
              var currentValue = this.getParentWidget().getValue() || this.getParentWidget().getEditValue();
              this.setCurrentValue(currentValue);
            }
          }.bind(this));
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._containerElement.off("click.ListDropDownWidget");
          if (!window.isMobile()) {
            this._containerElement.off('mouseover.ListDropDownWidget');
          }
          this._items.length = 0;
          $super.destroy.call(this);
        },

        /**
         * Mouse over handler used to highlight current item.
         * We can't use css :hover otherwise there will be duplicated highlights with keyboard navigation
         * @param event
         * @private
         */
        _onMouseover: function(event) {
          var element = event.target;
          if (element) {
            var widgetElement = element.hasClass("gbc_WidgetBase") ? element : element.parent("gbc_WidgetBase");
            this._highlightCurrentItem(widgetElement);
          }
        },

        /**
         * Highlight current item of the dropdown
         * @param widgetElement
         * @private
         */
        _highlightCurrentItem: function(widgetElement) {
          if (this._currentElement && this._currentElement !== widgetElement) {
            this._currentElement.removeClass("current");
          }
          this._currentElement = widgetElement;
          if (this._currentElement &&
            !this._currentElement.hasClass("current") &&
            !this._currentElement.hasClass("hidden") &&
            (!this._currentElement.hasClass("disabled") || this._currentElement.hasAttribute("interruptable-active"))) {
            this._currentElement.addClass("current");
          }
        },

        /**
         * set the items
         * @param {ListDropDownWidgetItem[]} list items
         */
        setItems: function(list) {
          var len = list.length;
          this._items = [];
          for (var i = 0; i < len; i++) {
            this._items.push({
              text: list[i].text,
              value: list[i].value,
              searchText: list[i].text.toLocaleLowerCase()
            });
          }
          this._updateUIList();
        },

        /**
         * Get the items
         * @return {ListDropDownWidgetItem[]} list items
         */
        getItems: function() {
          return this._items;
        },

        /**
         * refresh DOM list
         * @private
         */
        _updateUIList: function() {
          var len = this._items.length,
            hasNull = false,
            content = [];
          for (var i = 0; i < len; i++) {
            content.push(this._itemRenderer(this._items[i]));
            if (this._items[i].value === "") {
              hasNull = true;
            }
            if (this._items[i].value === this._currentValue) {
              this._currentIndex = i;
            }
          }
          if (!hasNull && !this._notNull) {
            this._nullableShift = 1;
            content.push(this._itemRenderer({
              text: "",
              value: "",
              searchText: ""
            }));
            if (this._currentValue === "") {
              this._currentIndex = len;
            }
          } else {
            this._nullableShift = 0;
          }
          this._containerElement.innerHTML = content.join("");

          if (this.isVisible()) {
            this.hide();
            this.show();
          }

          this._updateCurrentIndex();
          this._updateUIListAria();
          this._updateUIListSelects();
        },
        /**
         * udpate current index value from current value and current items
         * @private
         */
        _updateCurrentIndex: function() {
          this._currentIndex = -1;
          var len = this._items.length,
            hasNull = false;
          for (var i = 0; i < len; i++) {
            if (this._currentValue === this._items[i].value) {
              this._currentIndex = i;
            }
            if (this._items[i].value === "") {
              hasNull = true;
            }
          }
          if (!hasNull && !this._notNull) {
            if (this._currentValue === "") {
              this._currentIndex = len;
            }
          }
        },

        /**
         * update item checkboxes visibility
         * @private
         */
        _updateUIListSelects: function() {
          this.domAttributesMutator(function() {
            var checkboxes = this._containerElement.querySelectorAll(".gbc_ListDropDownWidget_item i.zmdi"),
              len = checkboxes.length;
            for (var i = 0; i < len; i++) {
              checkboxes[i].setAttribute("style", this._allowMultipleValues ? "" : "display:none !important");
            }
          }.bind(this));
        },

        /**
         * update items accessibility attributes
         * @private
         */
        _updateUIListAria: function() {
          this.domAttributesMutator(function() {
            var items = this._containerElement.querySelectorAll(".gbc_ListDropDownWidget_item"),
              len = items.length;
            for (var i = 0; i < len; ++i) {
              items[i].setAttribute("aria-role", 'option');
              items[i].setAttribute("aria-posinset", (i + 1).toString());
              items[i].setAttribute("aria-setsize", len.toString());
            }
          }.bind(this));
        },

        /**
         * Get item value by its index
         * @param {number} index index
         * @return {string} the value
         */
        valueByIndex: function(index) {
          var item = this._items[index];
          return item && item.value || "";
        },

        /**
         * Get item index by its value
         * @param {string} value value
         * @return {number} the index
         */
        indexByValue: function(value) {
          var i = 0,
            found = false,
            len = this._items.length;
          for (; i < len; i++) {
            if (this._items[i].value === value) {
              found = true;
              break;
            }
          }
          if (!found && !this._notNull) {
            return len;
          }
          return i < len ? i : -1;
        },

        /**
         * Get item by its value
         * @param {string} value value
         * @return {Object} the item
         */
        findByValue: function(value) {
          return this._items.find(function(item) {
            return item.value === value;
          });
        },
        /**
         * find item starting by searchPattern beginning at current index. will loop to cover all items.
         * @param {string} searchPattern first letters of searched item
         * @param {boolean} startAfterCurrentItem exclude current index item as first matching element
         * @return {Object} found item
         */
        findStartingByText: function(searchPattern, startAfterCurrentItem) {
          var current = this._currentIndex + (startAfterCurrentItem ? 1 : 0);
          return this._items.find(function(item, i) {
            return i >= current && item.searchText.indexOf(searchPattern) === 0;
          }) || this._items.find(function(item, i) {
            return i < current && item.searchText.indexOf(searchPattern) === 0;
          });
        },
        /**
         * set whether or not this list will allow null value
         * @param {boolean} notNull not null
         */
        setNotNull: function(notNull) {
          if (this._notNull !== notNull) {
            this._notNull = notNull;
            this._updateUIList();
          }
        },
        /**
         * @inheritDoc
         */
        managePriorityKeyDown: function(keyString, domKeyEvent, repeat) {
          var keyProcessed = true;

          switch (keyString) {
            case "space":
              if (!this.isVisible()) {
                if (this.getParentWidget().canInputText && this.getParentWidget().canInputText()) {
                  return false;
                }
                this.show();
              } else if (this._allowMultipleValues) {
                this._selectItem(this.getCurrentValue());
              } else {
                this.hide();
              }
              break;
            case "enter":
            case "return":
              if (!this._allowMultipleValues) {
                this._selectItem(this.getCurrentValue());
              }
              this.hide();
              break;
            case "up":
              this.navigateTo(-1);
              break;
            case "down":
              this.navigateTo(1);
              break;
            case "pageup":
              this.navigateTo(-10);
              break;
            case "pagedown":
              this.navigateTo(10);
              break;
            case "home":
              this.navigateTo(Number.NEGATIVE_INFINITY);
              break;
            case "end":
              this.navigateTo(Number.POSITIVE_INFINITY);
              break;
            case "tab":
            case "shift+tab":
              if (this.isVisible()) {
                this.hide();
              }
              keyProcessed = false;
              break;
            default:
              keyProcessed = false;
          }

          if (keyProcessed) {
            return true;
          } else {
            return $super.managePriorityKeyDown.call(this, keyString, domKeyEvent, repeat);
          }
        },

        /**
         * set current index on item
         * @param {Object} item item
         */
        navigateToItem: function(item) {
          this.setCurrentPosition(this.indexByValue(item.value));
        },

        /**
         * set current index relatively
         * @param {number} pos shifting value
         */
        navigateTo: function(pos) {
          if (pos === Number.NEGATIVE_INFINITY) {
            pos = 0;
          } else if (pos === Number.POSITIVE_INFINITY) {
            pos = this._items.length - 1 + this._nullableShift;
          } else {
            pos = Math.min(Math.max(0, this._currentIndex + pos), this._items.length - 1 + this._nullableShift);
          }
          this.setCurrentPosition(pos);
          if (!this.isVisible()) {
            this.emit(context.constants.widgetEvents.select, this.getCurrentValue());
          }
        },
        /**
         * get value of the current index
         * @return {string}
         */
        getCurrentValue: function() {
          return this.valueByIndex(this._currentIndex);
        },
        /**
         * set the current value
         * @param {string} value
         */
        setCurrentValue: function(value) {
          this._currentValue = value || "";
          if (this._allowMultipleValues) {
            this.setSelectedValues(value);
          }
          this.setCurrentPosition(this.indexByValue(value));
        },
        /**
         * set current index and potentially scroll to it
         * @param {number} pos index
         */
        setCurrentPosition: function(pos) {
          var currents = this._containerElement.querySelectorAll(".current"),
            len = currents.length;
          for (var i = 0; i < len; i++) {
            currents[i].removeClass("current");
          }
          var item = this._containerElement.children[pos];
          if (item) {
            this._currentElement = item;
            this._currentIndex = pos;
            item.addClass("current");
            if (this.isVisible()) {
              this.scrollItemIntoView(item);
            }
          }
        },

        /**
         * sorts input array in the same order as items array
         * @param {string[]} values input values
         * @return {string[]} sorted array
         */
        sortValues: function(values) {
          var result = [],
            len = this._items.length,
            hasNull = false;
          for (var i = 0; i < len; i++) {
            var value = this._items[i].value;
            if (values.indexOf(value) >= 0) {
              result.push(value);
              if (value === "") {
                hasNull = true;
              }
            }
          }
          if (!hasNull && values.indexOf("") >= 0) {
            result.push("");
          }
          return result;
        },

        /**
         * @inheritDoc
         */
        setFontFamily: function(fontFamily) {
          this.setStyle({
            selector: this._cssSelector
          }, {
            "font-family": fontFamily
          });
        },

        /**
         * @inheritDoc
         */
        setFontWeight: function(weight) {
          this.setStyle({
            selector: this._cssSelector
          }, {
            "font-weight": weight
          });
        },

        /**
         * @inheritDoc
         */
        setFontStyle: function(style) {
          this.setStyle({
            selector: this._cssSelector
          }, {
            "font-style": style
          });
        },

        /**
         * @inheritDoc
         */
        setTextAlign: function(align) {
          this.setStyle({
            selector: this._cssSelector
          }, {
            "text-align": align
          });
        },

        /**
         * check items accordingly to value
         * @param {string} value value
         */
        setSelectedValues: function(value) {
          this.clearSelectedValues();
          if (value !== null) {
            value.split("|").map(function(itemValue) {
              this.toggleValue(itemValue, true);
            }.bind(this));
          }
        },
        /**
         * toggle the checked state of the given value
         * @param {string} value value
         * @param {boolean} [forcedValue] forced value
         */
        toggleValue: function(value, forcedValue) {
          var items = this._containerElement.querySelectorAll('.gbc_ListDropDownWidget_item');
          var check = null;
          // need to loop over items and directly check 'combovalue' attribute in order to manage quoted/double-quoted chars in value
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.getAttribute("combovalue") === value) {
              check = item.querySelector("i");
              break;
            }
          }
          if (check) {
            if (forcedValue === true || check.hasClass("unchecked")) {
              check.removeClass("unchecked").addClass("checked");
            } else if (forcedValue === false || check.hasClass("checked")) {
              check.removeClass("checked").addClass("unchecked");
            }
          }
        },
        /**
         * clear the checked state of the items
         */
        clearSelectedValues: function() {
          var checked = this._containerElement.querySelectorAll(".checked"),
            len = checked.length;
          for (var i = 0; i < len; i++) {
            checked[i].removeClass("checked").addClass("unchecked");
          }
        },
        /**
         * Scroll to element if needed
         * @param {HTMLElement} element element
         * @publicdoc
         */
        scrollItemIntoView: function(element) {
          var elemTop = element.offsetTop;
          var elemHeight = element.offsetHeight;
          var parentContainer = this.getElement();
          var containerTop = parentContainer.scrollTop;
          var containerHeight = parentContainer.offsetHeight;
          if (containerTop > elemTop) {
            element.scrollIntoView();
          } else if (containerTop + containerHeight < elemTop + elemHeight) {
            element.scrollIntoView(false);
          }
        },

        /**
         * On click handler raised when selecting an item in the dropdown :
         * Parent widget get value of clicked item and dropdown is closed.
         * @param domEvent
         * @private
         */
        _onClick: function(domEvent) {
          var item = domEvent.target.closest("gbc_ListDropDownWidget_item"),
            value = item && item.getAttribute("combovalue");
          if (value !== null) {
            this._selectItem(value);
            if (domEvent) {
              domEvent.stopPropagation();
            }

            if (!this._allowMultipleValues) {
              this.hide();
            }
            this.getParentWidget().emit(context.constants.widgetEvents.focus, domEvent);
          }
        },
        /**
         * Set value as selected item
         * @param {string} value value
         * @private
         */
        _selectItem: function(value) {
          this.setCurrentValue(value);
          this.toggleValue(value);
          this.emit(context.constants.widgetEvents.select, value);
        },

        /**
         * @inheritDoc
         */
        addChildWidget: function(widget, options) {
          // nothing intentionally here
        },

        /**
         * @inheritDoc
         */
        removeChildWidget: function(widget) {
          // nothing intentionally here
        },

        /**
         * set whether or not this list will allow null value
         * @param {boolean} allow allow
         */
        allowMultipleChoices: function(allow) {
          this._allowMultipleValues = allow;
          this._updateCurrentIndex();
          this._updateUIListSelects();
        }
      };
    });
    cls.WidgetFactory.registerBuilder('ListDropDown', cls.ListDropDownWidget);
  });
