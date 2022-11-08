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

modulum('WidgetBase', ['EventListener'],
  function(context, cls) {
    var SPACES_RE = /\s+/;

    /**
     * Base class for widgets.
     * @class WidgetBase
     * @memberOf classes
     * @tutorial widgets
     * @extends classes.EventListener
     * @publicdoc Widgets
     */
    cls.WidgetBase = context.oo.Class({
      base: cls.EventListener
    }, function($super) {

      var __charMeasurer = document.createElement('char-measurer');
      __charMeasurer.className = "g_layout_charMeasurer";
      var __charMeasurer1 = document.createElement('char-measurer-item');
      __charMeasurer1.className = "g_layout_charMeasurer1";
      __charMeasurer1.textContent = "MMMMMMMMMM\nM\nM\nM\nM\nM\nM\nM\nM\nM";
      var __charMeasurer2 = document.createElement('char-measurer-item');
      __charMeasurer2.className = "g_layout_charMeasurer2";
      __charMeasurer2.textContent = "0000000000";
      __charMeasurer.appendChild(__charMeasurer1);
      __charMeasurer.appendChild(__charMeasurer2);
      __charMeasurer.setAttribute("aria-hidden", "true");

      return /** @lends classes.WidgetBase.prototype */ {
        $static: /** @lends classes.WidgetBase */ {
          /** Generic click events handler */
          // TODO is it still necessary to have these methods static ?
          /** Generic focus events handler */
          _onFocus: function(event) {
            this.emit(context.constants.widgetEvents.focus, event);
          },
          /**
           * Need to listen mouseup event on body to be able to focus an input field if selection ends outside of the field.
           * If selection ends inside the field, click event will be raised
           * @protected
           */
          _onSelect: function() {
            document.body.on('mouseup.DetectTextSelection', function(event) {
              document.body.off('mouseup.DetectTextSelection');
              this._element.off('mouseleave.DetectTextSelection');
            }.bind(this));
            this._element.on('mouseleave.DetectTextSelection', function(event) {
              document.body.off('mouseup.DetectTextSelection');
              this._element.off('mouseleave.DetectTextSelection');
              this._onRequestFocus(event); // request focus
            }.bind(this));
          },
          selfDataContent: {}
        },
        __name: "WidgetBase",
        __templateName: null,
        __charMeasurer: null,
        __dataContentPlaceholderSelector: null,
        /**
         * Current widget's unique ID (GBC system wide)
         * @type {?string}
         */
        _uuid: null,

        /**
         * Incremental ID for widgets that are linked to the AUI, 0 otherwise
         * @type {number}
         */
        _nUuid: 0,

        /**
         * Widget root class name (based on widget's unique ID)
         * @type {?string}
         */
        _rootClassName: null,
        _auiTag: null,
        _auiName: null,
        /**
         * the parent widget
         * @type {HTMLElement}
         * @protected
         */
        _element: null,
        /**
         * the parent widget
         * @type {classes.WidgetGroupBase}
         * @protected
         */
        _parentWidget: null,
        /**
         * Current instance stylesheet
         * @type {Object}
         */
        _stylesheet: null,
        /**
         * stylesheet context ('global', 'window')
         * @type {string}
         */
        _stylingContext: "global",
        /**
         * the layout engine
         * @type {classes.LayoutEngineBase}
         * @protected
         */
        _layoutEngine: null,
        /**
         * the layout information
         * @type {classes.LayoutInformation}
         * @protected
         */
        _layoutInformation: null,
        /**
         * the user interface widget
         * @type {classes.UserInterfaceWidget}
         * @protected
         */
        _uiWidget: null,
        /**
         * Application widget
         * @type {classes.ApplicationWidget}
         * @protected
         */
        _appWidget: null,
        _appHash: null,
        _windowWidget: null,
        _formWidget: null,
        _tableWidgetBase: null,

        _i18NList: null,
        _i18nTranslateListener: null,

        /**
         * Dialog type of the widget (Input, Input Array, Display, Display Array, Construct)
         * @type {string}
         * @protected
         */
        _dialogType: false,
        _enabled: true,
        _noBorder: false,
        _hidden: false,
        _focusable: false,

        /**
         * If alwaysSend, any action will send an event to VM without without checking if the value has changed.
         * @public
         * @type {boolean}
         * @default false
         */
        //_alwaysSend: false,
        _startKey: null,
        _endKey: null,

        _inMatrix: false,
        _inTable: false,
        _inFirstTableRow: false,
        _ignoreLayout: false,

        // arabic mode
        _isReversed: false,

        /**
         * @type {?string}
         */
        _rawStyles: null,

        /**
         * @type {Array<string>}
         */
        _applicationStyles: null,

        /**
         * An interruptible widget is active when the VM is processing
         * @type {boolean}
         */
        _interruptable: false,
        _hasWebcomp: false,

        /**
         * @inheritDoc
         * @constructs
         * @param {Object} opts instantiation options
         * @param {number} opts.appHash internal app hash
         * @param {classes.ApplicationWidget} opts.appWidget early ApplicationWidget link
         * @param {number} opts.auiTag internal aui tag id
         * @param {boolean} opts.inTable internal is in table
         * @param {boolean} opts.inMatrix internal is in matrix
         * @param {boolean} opts.inFirstTableRow internal
         * @param {boolean} opts.inScrollGrid internal is in a scroll grid
         * @param {boolean} opts.ignoreLayout ignore layout char measurer
         */
        constructor: function(opts) {
          opts = opts || {};
          this._appHash = opts.appHash;
          this._appWidget = opts.appWidget;
          this._auiTag = opts.auiTag;
          this._inTable = opts.inTable === true;
          this._inFirstTableRow = opts.inFirstTableRow === true;
          this._inMatrix = opts.inMatrix === true;
          this._inScrollGrid = opts.inScrollGrid === true;
          this._ignoreLayout = this._inTable && !this._inFirstTableRow || opts.ignoreLayout;

          this._uuid = context.InitService.uniqueIdAsString();
          this._nUuid = this._auiTag ? context.InitService.uniqueId() : 0;
          $super.constructor.call(this, opts);
          this._rootClassName = "w_" + this._uuid;
          this._initElement();
          this._afterInitElement();
          this._initLayout();
          this._initTranslation();
          if (this._auiTag) {
            this._element.addClass("aui__" + this._auiTag);
            this._element.setAttribute("data-aui-id", this._auiTag);
          }
          context.WidgetService._emit(context.constants.widgetEvents.created, this);
          context.WidgetService.registerWidget(this);
        },

        /**
         * Returns build parameters
         * @returns {{appHash: (null|*), auiTag: (null|*), inTable: (boolean|*), inFirstTableRow: (boolean|*), inMatrix: (boolean|*), inScrollGrid: *, ignoreLayout: (boolean|*)}} build parameters
         * @publicdoc
         */
        getBuildParameters: function() {
          var opts = {
            appHash: this._appHash,
            appWidget: this._appWidget,
            auiTag: this._auiTag,
            inTable: this._inTable,
            inFirstTableRow: this._inFirstTableRow,
            inMatrix: this._inMatrix,
            inScrollGrid: this._inScrollGrid,
            ignoreLayout: this._ignoreLayout
          };
          return opts;
        },

        /**
         * Destroy style sheet related to widget
         * @private
         */
        _destroyStyle: function() {
          context.styler.removeStyleSheet(this.getUniqueIdentifier());
          if (this._stylingContext === "window") {
            var win = this.getWindowWidget();
            var sheetId = win && win.getUniqueIdentifier() || this._appHash || "_";
            context.styler.appendStyleSheet({}, this.getRootClassName(), true, sheetId);
          } else {
            context.styler.appendStyleSheet({}, this.getRootClassName(), true, this._appHash || "_");
          }
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._destroyStyle();

          this.emit(context.constants.widgetEvents.destroyed, this);
          context.WidgetService._emit(context.constants.widgetEvents.destroyed, this);
          if (this._layoutEngine) {
            this._layoutEngine.destroy();
            this._layoutEngine = null;
          }
          if (this._parentWidget && this._parentWidget.removeChildWidget) {
            this._parentWidget.removeChildWidget(this);
          }
          if (this._layoutInformation) {
            this._layoutInformation.destroy();
            this._layoutInformation = null;
          }
          document.body.off('mouseup.DetectTextSelection');
          if (this._element) {
            this._element.remove();
          }
          this.__charMeasurer1 = null;
          this.__charMeasurer2 = null;
          this.__charMeasurer = null;
          this._stylesheet = null;

          this._uiWidget = null;
          this._appWidget = null;
          this._windowWidget = null;
          this._formWidget = null;
          this._tableWidgetBase = null;
          this._element = null;

          if (this._i18nTranslateListener) {
            this._i18nTranslateListener();
            this._i18nTranslateListener = null;
          }
          this._i18NList = null;

          $super.destroy.call(this);

          // make sure widget isn't considered as focusedNode anymore
          var currentApp = context.SessionService.getCurrent() && context.SessionService.getCurrent().getCurrentApplication();
          if (currentApp && currentApp.focus) {
            var focusedNode = currentApp.focus.getFocusedNode();
            if (focusedNode) {
              var controller = focusedNode.getController();
              if (controller && controller.getWidget() === this) {
                currentApp.focus.setFocusedNode(null);
              }
            }
          }
          context.WidgetService.unregisterWidget(this);
        },

        /**
         * Method called after the element is initialized
         * Override in inherited widgets if necessary
         * @private
         */
        _afterInitElement: function() {},

        /**
         * Create all instances for layout management
         * @protected
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.NoLayoutEngine(this);
        },

        /**
         * function to be called by widget's layout engine when resetting the layout if needed
         */
        resetLayout: function() {},

        /**
         * Get the widget's layout information
         * @returns {classes.LayoutInformation} the widget's layout information
         * @publicdoc
         */
        getLayoutInformation: function() {
          return this._layoutInformation;
        },

        /**
         * Get the widget's layout engine
         * @returns {classes.LayoutEngineBase} the widget's layout engine
         * @publicdoc
         */
        getLayoutEngine: function() {
          return this._layoutEngine;
        },

        /**
         * Get the styling context of widget style sheet (global, window or widget);
         * @returns {string} widget styling context used in its style sheet
         */
        getStylingContext: function() {
          return this._stylingContext;
        },

        /**
         * Setups the DOM element
         * @protected
         */
        _initElement: function() {
          this._element = context.TemplateService.renderDOM(this.__templateName || this.__name, this.__ascendance);
          var id = this.getRootClassName();
          this._element.id = id;

          this._element.className += ["", this.__ascendanceClasses, id, "g_measureable"].join(" ");
          // TODO we add class g_measureable in all cases, we should probably just add this class if ignoreLayout=false
          if (!this._ignoreLayout) {
            this._initCharMeasurer();
          }
        },

        /**
         * Init the char Measurer for proper layout management
         * @private
         */
        _initCharMeasurer: function() {
          this.__charMeasurer = __charMeasurer.cloneNode(true);
          this.__charMeasurer1 = this.__charMeasurer.children[0];
          this.__charMeasurer2 = this.__charMeasurer.children[1];
          this._element.appendChild(this.__charMeasurer);
        },

        /**
         * Handle request Focus
         * @param {UIEvent} event - dom event
         */
        _onRequestFocus: function(event) {
          if (this.isInTable()) {
            this.getTableWidgetBase().requestFocusFromWidget(this, event);
            // TODO check if test isInMatrix is still necessary with bellow check Display Array
          } else if (this.isInMatrix() ||
            this._inScrollGrid ||
            (this.isFocusable() &&
              (this.isEnabled() || this.getDialogType() === "DisplayArray"))) {
            this.emit(context.constants.widgetEvents.requestFocus, event);
          }
        },

        /**
         * Returns id widget should show application contextmenu
         * @returns {boolean} true if application contextmenu should be displayed
         */
        shouldShowApplicationContextMenu: function() {
          return true;
        },

        /**
         * Build/add extra actions to app contextmenu
         * Must be redefine by widget which must add extra actions
         * @param {classes.ContextMenuWidget} contextMenu - widget
         */
        buildExtraContextMenuActions: function(contextMenu) {

          // prepare copy action
          var copyFunction = null;
          var clipboardValue = this.getClipboardValue();
          if (clipboardValue !== null) {
            copyFunction = function(contextMenu) {
              contextMenu.hide();
              cls.ClipboardHelper.copyTo(this.getClipboardValue(), this._element);
            };
          }

          // if copyfunction exists add it to contextmenu
          if (copyFunction) {
            // in table display "Copy cell" instead of "Copy"
            var copyTranslation = this.isInTable() ? i18next.t("gwc.contextMenu.copyCell") : i18next.t("gwc.clipboard.copy");
            contextMenu.addAction("copy", copyTranslation, null, null, {
              clickCallback: copyFunction.bind(this, contextMenu)
            }, true);
          }

          if (this.isInTable()) {
            // build table contextmenu
            this.getTableWidgetBase().buildExtraContextMenuActions(contextMenu);
          }
        },

        /**
         * Defines if the widget is focusable
         * @param {boolean} focusable - State of focusable
         * @publicdoc
         */
        setFocusable: function(focusable) {
          this._focusable = focusable;
          this._setElementAttribute('tabindex', focusable ? '0' : null);
        },

        /**
         * Returns if the widget is focusable
         * @return {boolean} State of focusable
         * @publicdoc
         */
        isFocusable: function() {
          return this._focusable;
        },

        /**
         * Tests if the widget has really the DOM focus (check document.activeElement)
         * @returns {boolean} true if the widget has the DOM focus
         */
        hasDOMFocus: function() {
          return this._element === document.activeElement;
        },

        /**
         * Initialization of internationalization engine
         * @private
         */
        _initTranslation: function() {
          // Will ask the translation once ready
          this._i18NList = this._element.querySelectorAll("[data-i18n]");
          this._i18nTranslateListener = context.I18NService.translate(this);
        },

        /**
         * Translate the widget
         * @publicdoc
         */
        translate: function() {
          var allSelectors = this._i18NList;
          for (var i = 0; i < allSelectors.length; i++) {
            allSelectors[i].innerHTML = i18next.t(allSelectors[i].getAttribute("data-i18n"));
          }
        },

        /**
         * Get the unique identifier of the widget
         * @returns {string} the unique identifier of the widget
         * @publicdoc
         */
        getUniqueIdentifier: function() {
          return this._uuid;
        },

        /**
         * Get the increment identifier of the widget if linked to AUI, 0 otherwise
         * @returns {number} the increment identifier of the widget if linked to AUI, 0 otherwise
         */
        getAuiLinkedUniqueIdentifier: function() {
          return this._nUuid;
        },

        /**
         * Get the unique identifier of the application
         * @returns {string} the unique identifier of the application
         * @publicdoc
         */
        getApplicationIdentifier: function() {
          return this._appHash !== undefined ? this._appHash : null;
        },

        /**
         * Get the root element of the widget
         * @returns {HTMLElement} the root element of the widget
         * @publicdoc
         */
        getElement: function() {
          return this._element;
        },

        /**
         * Get the main class name of the widget
         * @return {string} the main class name
         * @publicdoc
         */
        getClassName: function() {
          return "gbc_" + this.__name;
        },

        /**
         * Get the name of the widget class
         * @return {string} the widget class name
         * @publicdoc
         */
        getName: function() {
          return this.__name;
        },

        /**
         * Get the Aui Tree Tag
         * @return {string} html class ready name
         * @private
         */
        _getAuiTagClass: function() {
          return ".aui__" + this._auiTag;
        },

        /**
         * Get the unique class name identifying a widget instance
         * @returns {*|string} the unique class name identifying a widget instance
         */
        getRootClassName: function() {
          return this._rootClassName;
        },

        /**
         * Get the CSS id selector of the widget
         * @param {string=} [subSelector] selector targeting an element below the widget's root node
         * @param {boolean=} [appliesOnRoot] true if the returned selector should match the root too.
         * @param {string} [preSelector] pre selector rule, if any
         * @returns {string} the CSS selector corresponding to the requested DOM element
         * @public
         */
        _getCssSelector: function(subSelector, appliesOnRoot, preSelector) {
          return (preSelector || "") + "#" + this.getRootClassName() +
            (appliesOnRoot ? "" : " ") +
            (subSelector || "");
        },

        /**
         * Get widget style property value
         * @param {?string} [selector] additional sub selector
         * @param {string} property property name
         * @param {boolean=} appliesOnRoot - true if the returned selector should match the root too.
         * @returns {*} property value if set, undefined otherwise
         * @publicdoc
         */
        getStyle: function(selector, property, appliesOnRoot) {
          if (!property) {
            property = selector;
            selector = null;
          }
          var cssSelector = this._getCssSelector(selector, appliesOnRoot);
          return this._stylesheet && this._stylesheet[cssSelector] && this._stylesheet[cssSelector][property];
        },

        /**
         * Updates widget style with new rules
         * @param {?string|{selector:String, preSelector:String, appliesOnRoot:boolean=}} [selector] additional sub selector
         * @param {Object.<string, *>} style style properties to set
         * @publicdoc
         */
        setStyle: function(selector, style) {
          if (!style) {
            style = selector;
            selector = null;
          }
          var subSelector = selector,
            preSelector = null,
            appliesOnRoot = null;
          if (selector && (selector.selector || selector.preSelector)) {
            subSelector = selector.selector;
            preSelector = selector.preSelector;
            appliesOnRoot = selector.appliesOnRoot;
          }
          var cssSelector = this._getCssSelector(subSelector, appliesOnRoot, preSelector);
          if (!this._stylesheet) {
            this._stylesheet = {};
          }
          var localStyle = this._stylesheet[cssSelector];
          if (!localStyle) {
            localStyle = this._stylesheet[cssSelector] = {};
          }
          var keys = Object.keys(style);
          for (var k = 0; k < keys.length; k++) {
            if (style[keys[k]] === null) {
              delete localStyle[keys[k]];
            } else {
              localStyle[keys[k]] = style[keys[k]];
            }
          }
          var win = this.getWindowWidget(),
            contextChanged = (this._stylingContext === "global" && win) || (this._stylingContext === "window" && !win);

          context.styler.appendStyleSheet(this._stylesheet,
            this.getRootClassName(), true, this._stylingContext === "widget" ? this.getUniqueIdentifier() : this.getStyleSheetId()
          );

          if (contextChanged) {
            this._stylingContext = win ? "window" : "global";
            if (win) {
              context.styler.appendStyleSheet({}, this.getRootClassName(), true, this._appHash || "_");
            }
          }
        },

        getStyleSheetId: function() {
          var windowWidget = this.getWindowWidget(),
            windowWidgetId = windowWidget && windowWidget.getUniqueIdentifier();
          return windowWidgetId || this._appHash || "_";
        },

        /**
         * Get the raw styles from VM
         * @returns {?string} the raw styles from VM
         */
        getRawStyles: function() {
          return this._rawStyles;
        },
        setApplicationStyles: function(styles) {
          this._rawStyles = styles;
          var i, oldClasses = this._applicationStyles,
            oldlen = oldClasses ? oldClasses.length : 0,
            newClasses = styles && styles.split(SPACES_RE),
            newlen = newClasses ? newClasses.length : 0;
          for (i = 0; i < oldlen; i++) {
            if (!newClasses || newClasses.indexOf(oldClasses[i]) < 0) {
              this.removeClass("gbc_style_" + oldClasses[i]);
            }
          }
          for (i = 0; i < newlen; i++) {
            if (!oldClasses || oldClasses.indexOf(newClasses[i]) < 0) {
              this.addClass("gbc_style_" + newClasses[i]);
            }
          }
          this._applicationStyles = newClasses;
        },

        /**
         * Defines the parent widget
         * @param {classes.WidgetGroupBase} widget - the widget to use as parent
         * @param {Object=} options - possible options
         * @param {boolean=} options.noLayoutInvalidation - won't affect parent layout
         * @publicdoc
         */
        setParentWidget: function(widget, options) {
          options = options || {};
          this._parentWidget = widget;
          if (this._layoutEngine && !options.noLayoutInvalidation) {
            this._layoutEngine.invalidateMeasure();
          }
        },

        /**
         * Get the parent widget
         * @returns {classes.WidgetGroupBase} the parent widget
         * @publicdoc
         */
        getParentWidget: function() {
          return this._parentWidget;
        },

        /**
         * Get the UI widget related to the widget
         * @returns {classes.UserInterfaceWidget} UserInterfaceWidget
         * @publicdoc
         */
        getUserInterfaceWidget: function() {
          if (this._uiWidget === null) {
            var result = this;
            while (result && !result.isInstanceOf(gbc.classes.UserInterfaceWidget)) {
              result = result.getParentWidget();
            }
            this._uiWidget = result;
          }
          return this._uiWidget;
        },

        /**
         * Get Application Widget related to the widget
         * @returns {classes.ApplicationWidget} ApplicationWidget
         * @publicdoc
         */
        getApplicationWidget: function() {
          if (this._appWidget === null) {
            var result = this;
            while (result && !result.isInstanceOf(gbc.classes.ApplicationWidget)) {
              result = result.getParentWidget();
            }
            this._appWidget = result;
          }
          return this._appWidget;
        },

        /**
         * Get the Window Widget related to the widget
         * @returns {classes.WindowWidget} WindowWidget
         * @publicdoc
         */
        getWindowWidget: function() {
          if (this._windowWidget === null) {
            var result = this;
            while (result && !result.isInstanceOf(gbc.classes.WindowWidget)) {
              result = result.getParentWidget();
            }
            this._windowWidget = result;
          }
          return this._windowWidget;
        },

        /**
         * Get the Form Widget related to the widget
         * @returns {classes.FormWidget} FormWidget
         * @publicdoc
         */
        getFormWidget: function() {
          if (this._formWidget === null) {
            var result = this;
            while (result && !result.isInstanceOf(gbc.classes.FormWidget)) {
              result = result.getParentWidget();
            }
            this._formWidget = result;
          }
          return this._formWidget;
        },

        /**
         * Get the table Widget base class related to the widget
         * @returns {classes.TableWidgetBase} TableWidgetBase
         * @publicdoc
         */
        getTableWidgetBase: function() {
          if (this._tableWidgetBase === null) {
            var result = this;
            while (result && !result.isInstanceOf(gbc.classes.TableWidgetBase)) {
              result = result.getParentWidget();
            }
            this._tableWidgetBase = result;
          }
          return this._tableWidgetBase;
        },

        /**
         * Check if this widget is a child of a given one
         * @param {classes.WidgetBase} parent the reference parent widget
         * @return {boolean} true if is a child, false otherwise
         * @publicdoc
         */
        isChildOf: function(parent) {
          var result = this.getParentWidget();
          while (result && result !== parent) {
            result = result.getParentWidget();
          }
          return Boolean(result);
        },

        /**
         * Replace the current widget with a given one
         * @param {classes.WidgetBase} widget the new widget
         * @publicdoc
         */
        replaceWith: function(widget) {
          if (this._parentWidget) {
            this._parentWidget.replaceChildWidget(this, widget);
          }
        },

        /**
         * Detach the widget from the dom
         * @publicdoc
         */
        detach: function() {
          if (this._element && this._element.parentNode) {
            this._element.parentNode.removeChild(this._element);
          } else {
            context.LogService.warn("Trying to detach a widget which is already outside of DOM " + this.__name);
          }
        },

        /**
         * Set widget current dialog type.
         * Can be Input, Input Array, Display, Display Array or Construct
         * @param {string} dialogType Dialog type
         * @publicdoc
         */
        setDialogType: function(dialogType) {
          this._dialogType = dialogType;
        },

        /**
         * return widget current dialog type
         * @returns {string} values can be : Input, InputArray, Display, DisplayArray or Construct
         * @publicdoc
         */
        getDialogType: function() {
          return this._dialogType;
        },

        /**
         * Defines the enabled status of the widget
         * @param {boolean} enabled true if the widget allows user interaction, false otherwise.
         * @publicdoc
         */
        setEnabled: function(enabled) {
          if (this._enabled !== enabled) {
            this._enabled = Boolean(enabled);
            if (this._enabled) {
              this.removeClass("disabled");
            } else {
              this.addClass("disabled");
            }
          }
        },

        /**
         * Check if widget is enabled
         * @returns {boolean} true if the widget allows user interaction, false otherwise.
         * @publicdoc
         */
        isEnabled: function() {
          return this._enabled;
        },

        /**
         * Defines if the widget should be hidden or not
         * @param {boolean} hidden true if the widget is hidden, false otherwise
         * @publicdoc
         */
        setHidden: function(hidden) {
          if (this._hidden !== hidden) {
            this._hidden = Boolean(hidden);
            if (this._element) {
              if (this._hidden) {
                this.addClass("hidden");
              } else {
                this.removeClass("hidden");
              }
            }
            if (this._layoutEngine) {
              this._layoutEngine.changeHidden(hidden);
            }
            this.emit(context.constants.widgetEvents.visibilityChange);
          }
        },

        /**
         * Check if the widget is hidden
         * @returns {boolean} true if the widget is hidden, false otherwise
         * @publicdoc
         */
        isHidden: function() {
          return this._hidden;
        },

        /**
         * Check if the widget is part of layout computing
         * @param {boolean} [deep] true to test against parent widgets as well
         * @returns {boolean} true if the widget is part of layout computing
         */
        isLayoutMeasureable: function(deep) {
          if (!deep) {
            return !this.isHidden();
          }
          if (this.isHidden()) {
            return false;
          }
          var parent = this;
          while (parent) {
            if (!parent.isLayoutMeasureable()) {
              return false;
            }
            if (parent.isLayoutTerminator() && parent.isLayoutMeasureable()) {
              return true;
            }
            parent = parent.getParentWidget();
          }
          return true;
        },

        /**
         * Check if the widget is visible
         * @return {boolean} true if visible, false otherwise
         * @publicdoc
         */
        isVisible: function() {
          return !this.isHidden();
        },

        /**
         * Check if widget or one of its parent is hidden
         * @return {boolean} true if hidden, false otherwise
         */
        isHiddenRecursively: function() {
          var parent = this;
          while (parent) {
            if (parent.isHidden()) {
              return true;
            }
            parent = parent.getParentWidget();
          }
          return false;
        },

        /**
         * Check if widget and all of its parent are visible
         * @return {boolean} true if visible, false otherwise
         */
        isVisibleRecursively: function() {
          var parent = this;
          while (parent) {
            if (!parent.isVisible()) {
              return false;
            }
            parent = parent.getParentWidget();
          }
          return true;
        },

        isLayoutTerminator: function() {
          return false;
        },

        /**
         * Remove or add borders to the widget
         * @param {boolean} noBorder - true if the widget has no border class, false otherwise
         * @publicdoc
         */
        setNoBorder: function(noBorder) {
          if (this._noBorder !== noBorder) {
            this._noBorder = Boolean(noBorder);
            if (this._noBorder) {
              this.addClass("gbc_NoBorder");
            } else {
              this.removeClass("gbc_NoBorder");
            }
          }
        },

        /**
         * Check if the widget is displayed without border
         * @returns {boolean} true if the widget has no border class, false otherwise
         * @publicdoc
         */
        isNoBorder: function() {
          return this._noBorder;
        },

        /**
         * Set the title of the widget
         * @param {string} title - the tooltip text
         * @publicdoc
         */
        setTitle: function(title) {
          if (title === "") {
            this._setElementAttribute("title", null);
            this.setAriaAttribute("label", null);
          } else {
            this._setElementAttribute("title", title);
            this.setAriaAttribute("label", title);
          }
        },

        /**
         * Get the title of the widget
         * @returns {string} the tooltip text
         * @publicdoc
         */
        getTitle: function() {
          return this._element.getAttribute("title");
        },

        /**
         * Called when widget obtains the focus
         * @param {boolean} [fromMouse] - true if focus comes from mouse event
         * @publicdoc
         */
        setFocus: function(fromMouse) {
          var userInterfaceWidget = this.getUserInterfaceWidget();
          if (userInterfaceWidget) {
            userInterfaceWidget.setFocusedWidget(this);
            // emit current view change (used for hbox splitview)
            userInterfaceWidget.emit(context.constants.widgetEvents.splitViewChange);
            this.setAriaSelection();
          }

          // rare case when we are going to focus an hidden widget. To avoid fallback focus to body, we focus userinterface widget instead.
          if (this.isHidden()) {
            var uiWidget = this.getUserInterfaceWidget();
            if (uiWidget) {
              uiWidget.getElement().domFocus();
            }
          }
        },

        /**
         * Called before setting VM focus to notify previous VM focused widget
         * @publicdoc
         */
        loseVMFocus: function() {},

        /**
         * Called before setFocus to notify previous focused widget
         * @publicdoc
         */
        loseFocus: function() {},

        /**
         * Check if widget node has VM focus
         * @returns {boolean} true if widget node has VM focus
         * @publicdoc
         */
        hasVMFocus: function() {
          var ui = this.getUserInterfaceWidget();
          return !ui || this === ui.getVMFocusedWidget();
        },

        /**
         * Check if widget node has focus (class gbc_Focus)
         * @returns {boolean} true if widget node has focus
         * @publicdoc
         */
        hasFocus: function() {
          var ui = this.getUserInterfaceWidget();
          return !ui || this === ui.getFocusedWidget();
        },

        /**
         * Checks if the widget element has the given class
         * @param {string} className - class to check
         * @publicdoc
         */
        hasClass: function(className) {
          return this._element.hasClass(className);
        },

        /**
         * Add the given class to element
         * @param {string} className - class to add
         * @publicdoc
         */
        addClass: function(className) {
          this._element.addClass(className);
        },

        /**
         * Remove the given class from element
         * @param {string} className - class to delete
         * @publicdoc
         */
        removeClass: function(className) {
          this._element.removeClass(className);
        },

        /**
         * Toggle the given class to element
         * @param {string} className - class to toggle
         * @param {boolean=} switcher forced new state
         * @publicdoc
         */
        toggleClass: function(className, switcher) {
          this._element.toggleClass(className, switcher);
        },

        /**
         * Add QA informations to the widget
         * @param {string} name - AUI tree name
         * @param {string} value - AUI tree value
         */
        setQAInfo: function(name, value) {
          if (this._element) {
            this._setElementAttribute("data-gqa-" + name, value);
          }
        },

        /**
         * Defines the AUI tree name of the widget
         * @param {string} name the name
         */
        setAuiName: function(name) {
          if (this._element && (name !== this._auiName)) {
            this._auiName = name;
            this._setElementAttribute("data-aui-name", name);
          }
        },

        /**
         * Check if the widget is in a table
         * @returns {boolean} true if the widget is in a table, false otherwise.
         * @publicdoc
         */
        isInTable: function() {
          return this._inTable;
        },

        /**
         * Check if the widget is in a matrix
         * @returns {boolean} true if the widget is in a matrix, false otherwise.
         * @publicdoc
         */
        isInMatrix: function() {
          return this._inMatrix;
        },

        /**
         * Does the widget ignore layouting
         * @returns {boolean} true if the widget ignore all layout.
         * @publicdoc
         */
        ignoreLayout: function() {
          return this._ignoreLayout;
        },

        /**
         * Set Arabic mode
         * @param {boolean} rtl - true if widget is right to left
         * @publicdoc
         */
        setReverse: function(rtl) {
          if (this._isReversed !== rtl) {
            this._isReversed = rtl;
            if (rtl) {
              this.addClass("reverse");
            } else {
              this.removeClass("reverse");
            }
          }
        },

        /**
         * Check if arabic mode is enabled
         * @return {boolean} true if enabled
         * @publicdoc
         */
        isReversed: function() {
          return this._isReversed;
        },

        /**
         * Get start (for reversed mode)
         * @return {string} start keyword for rtl
         * @publicdoc
         */
        getStart: function() {
          return this.isReversed() ? "right" : "left";
        },

        /**
         * Get end (for reversed mode)
         * @return {string} end keyword for rtl
         * @publicdoc
         */
        getEnd: function() {
          return this.isReversed() ? "left" : "right";
        },

        /**
         * Method called when the widget is attached/detached from the DOM
         * Override this in inherited widget if necessary
         */
        _setDOMAttachedOrDetached: function() {

        },

        /**
         * Returns if element is in the DOM
         * @return {boolean} true if element in the DOM
         */
        isElementInDOM: function() {
          return Boolean(this._element) && this._element.isInDOM();
        },

        /**
         * Could the widget get interrupt?
         * @param {boolean} interruptable - true if interruptable, false otherwise
         */
        setInterruptable: function(interruptable) {
          this._interruptable = interruptable;
          if (this._element) {
            this._setElementAttribute("interruptable", interruptable ? "interruptable" : null);
          }
        },
        /**
         * returns true if widget acts as an interruptable
         * @return {boolean} true if widget acts as an interruptable
         */
        isInterruptable: function() {
          return this._interruptable;
        },

        /**
         * Updates widget interruptable active
         * @param isActive is interruptable active?
         */
        setInterruptableActive: function(isActive) {
          if (this._element) {
            this._setElementAttribute("interruptable-active", isActive ? "interruptable-active" : null);
          }
        },

        /**
         * Make the widget flash (basically when some action are forbidden)
         */
        flash: function() {
          if (this.isEnabled()) {
            this.addClass("disabled");
            this._registerTimeout(function() {
              this.removeClass("disabled");
            }.bind(this), 50);
          }
        },

        /**
         * Returns if widget has cursors
         * @return {boolean} true if widget has cursors
         */
        hasCursors: function() {
          // if widget has setCursors & getCursors functions defined -> it supports cursors
          return this.setCursors && this.getCursors;
        },

        /**
         * Manage key
         * @param {string} keyString - key string representation
         * @param {Object} domKeyEvent - key event from DOM
         * @param {boolean} repeat - true if key is being pressed
         * @returns {boolean} returns if the domKeyEvent has been processed by the widget
         */
        manageKeyDown: function(keyString, domKeyEvent, repeat) {
          if (this.isInTable()) {
            return this.getTableWidgetBase().manageKeyDown(keyString, domKeyEvent, repeat);
          }
          return false;
        },

        /**
         * Manage key before any action
         * @param {string} keyString - key string representation
         * @param {Object} domKeyEvent - key event from DOM
         * @param {boolean} repeat - true if key is being pressed
         * @returns {boolean} returns if the domKeyEvent has been processed by the widget
         */
        managePriorityKeyDown: function(keyString, domKeyEvent, repeat) {
          if (this.isInTable()) {
            return this.getTableWidgetBase().managePriorityKeyDown(keyString, domKeyEvent, repeat);
          }
          return false;
        },

        /**
         * Manage key once released (on key up).
         * @param {string} keyString - keys string representation (can be a combinaison eg: shift+a)
         * @param {Object} domKeyEvent - key event from DOM
         */
        manageKeyUp: function(keyString, domKeyEvent) {
          if (this.isInTable()) {
            this.getTableWidgetBase().manageKeyUp(keyString, domKeyEvent);
          }
        },

        /**
         * Manage mouse click
         * @param {*} domEvent - mouse click event from DOM
         * @returns {boolean} returns if event must be bubbled to parent DOM widget
         */
        manageMouseClick: function(domEvent) {
          return true;
        },

        /**
         * Manage mouse double click
         * @param {*} domEvent - mouse dblclick event from DOM
         * @returns {boolean} returns if event must be bubbled to parent DOM widget
         */
        manageMouseDblClick: function(domEvent) {
          return true;
        },

        /**
         * Manage mouse right click
         * @param {*} domEvent - mouse click event from DOM
         * @returns {boolean} returns if event must be bubbled to parent DOM widget
         */
        manageMouseRightClick: function(domEvent) {

          if (domEvent.shiftKey) {
            return false; // don't show context menu if shift key is pressed
          }

          if (context.DebugService.isActive() && domEvent.ctrlKey) {
            domEvent.preventCancelableDefault();
            return false; // right click + CTRL is used to show debugTree
          }

          this._onRequestFocus(domEvent); // request focus

          if (this.shouldShowApplicationContextMenu()) {
            var appWidget = this.getApplicationWidget();
            if (appWidget && context.ThemeService.getValue("theme-disable-context-menu") === false) {
              if (!domEvent.target.elementOrParent("gbc_ContextMenuWidget")) { // if right-click is not on a contextmenu
                appWidget.showContextMenu(domEvent.data ? domEvent.data[0] : domEvent, this);
              } else {
                // If right-click on context menu item: use a regular click instead
                domEvent.preventCancelableDefault();
                this.manageMouseClick(domEvent);
              }
              return false; // if contextmenu is managed by this widget don't bubble
            }
          }
          return false;
        },

        /**
         * Define the aria role of this widget,
         * Mostly already defined in template
         * @param {string} roleName - aria role name to set
         */
        setAriaRole: function(roleName) {
          if (roleName && this._element) {
            this._setElementAttribute("role", roleName);
          }
        },

        /**
         * Set the aria attribute of this widget,
         * @param {string} attrName - aria attribute Name to set
         * @param {*} attrVal - aria attribute value to set
         */
        setAriaAttribute: function(attrName, attrVal) {
          if (this._element && attrName) {
            this._setElementAttribute("aria-" + attrName, attrVal);
          }
        },

        /**
         * Get the aria attribute of this widget,
         * @param {string} attrName - aria attribute Name to get
         * @return {*} aria attribute value
         */
        getAriaAttribute: function(attrName) {
          if (this._element && attrName) {
            return this._element.getAttribute("aria-" + attrName);
          }
        },

        /**
         * Set the aria-selected attribute to help screen-reader to know wich widget is the current one
         */
        setAriaSelection: function() {
          this.domAttributesMutator(function() {
            var currentSelected = document.querySelector('[aria-selected="true"]');
            if (currentSelected) {
              currentSelected.removeAttribute('aria-selected');
            }
          });
          this.setAriaAttribute('selected', "true");
        },

        /**
         * Set the widget has "expanded" for better accessibility
         * @param {Boolean} expanded - true if widget is expanded, false otherwise
         */
        setAriaExpanded: function(expanded) {
          this.setAriaAttribute("expanded", expanded);
        },

        /**
         * Get the value to put in the clipboard when copying
         * @return {?string|number}
         */
        getClipboardValue: function() {
          return null;
        },

        /**
         * Helper method to update attirbutes in DOM using buffering system
         * @param {string} attr the attribute name
         * @param {*} val the attribute new value
         * @param {string|Function} [elementSelector] a string identifier of this class member or a method returning the element to set the attributes value
         * @protected
         */
        _setElementAttribute: function(attr, val, elementSelector) {
          this.domAttributesMutator(function(attr, val, elementSelector) {
            var target = null;
            if (elementSelector) {
              if (typeof elementSelector === "string") {
                target = this[elementSelector];
              } else if (typeof elementSelector === "function") {
                target = elementSelector(this);
              }
            } else {
              target = this._element;
            }
            if (target) {
              if (val === null || val === "" || typeof(val) === "undefined") {
                target.removeAttribute(attr);
              } else {
                target.setAttribute(attr, val.toString());
              }
            }
          }.bind(this, attr, val, elementSelector));
        },

        /**
         * Helper method to update textContent in DOM using buffering system
         * @param {string} text the new text
         * @param {string|function} [elementSelector] a string identifier of this class member or a method returning the element to set the textContent
         * @protected
         */
        _setTextContent: function(text, elementSelector) {
          this.domAttributesMutator(function(text, elementSelector) {
            var target = null;
            if (elementSelector) {
              if (typeof elementSelector === "string") {
                target = this[elementSelector];
              } else if (typeof elementSelector === "function") {
                target = elementSelector(this);
              }
            } else {
              target = this._element;
            }
            if (target) {
              target.textContent = text;
            }
          }.bind(this, text, elementSelector));
        },

        /**
         * Use this to update attributes of dom nodes using a buffering system
         * @param fn the function to bufferize - don't forget to bind to context
         */
        domAttributesMutator: function(fn) {
          var appWidget = this.getApplicationWidget();
          if (!appWidget || !appWidget.domAttributesMutationBuffer(fn, this)) {
            fn();
          }
        },

        /**
         * @param fn the function to bufferize - don't forget to bind to context
         */
        afterDomMutator: function(fn) {
          var appWidget = this.getApplicationWidget();
          if (!appWidget || !appWidget.afterDomMutationBuffer(fn, this)) {
            this._registerAnimationFrame(fn);
          }
        }
      };
    });
  });
