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

modulum('TableController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class TableController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.TableController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.TableController.prototype */ {
        __name: "TableController",

        _storedSettingsKey: null,

        // specific variables used for multirow selection
        multiRowSelectionRoot: -1,
        updateMultiRowSelectionRoot: false,

        _isListView: false,

        forceDefaultSettings: false,
        nativeVerticalScroll: true,

        /**
         * @param {ControllerBindings} bindings
         */
        constructor: function(bindings) {
          this._isListView = bindings.anchor._initialStyleAttributes.tableType === "listView";
          $super.constructor.call(this, bindings);
          this._initStoredSettings();
        },

        /**
         * @inheritDoc
         */
        _createWidget: function(type) {
          var parentPageWidget = null;
          var uiWidget = this.getUINode().getController().getWidget();
          var parentPageNode = this.getAnchorNode().getAncestor("Page");
          if (parentPageNode) {
            parentPageWidget = parentPageNode.getController().getWidget();
          }

          return cls.WidgetFactory.createWidget('Table', {
            appHash: this.getAnchorNode().getApplication().applicationHash,
            appWidget: this.getAnchorNode().getApplication().getUI().getWidget(),
            auiTag: this.getAnchorNode().getId(),
            uiWidget: uiWidget,
            folderPageWidget: parentPageWidget
          }, this.getAnchorNode());
        },

        /**
         * Initialize Stored Setting
         * @private
         */
        _initStoredSettings: function() {
          var node = this.getNodeBindings().anchor;

          // Build stored settings key
          var formName = node.getAncestor("Form").attribute("name");
          var tabName = node.attribute("tabName");

          this._storedSettingsKey = "gwc.forms." + formName + ".tables." + tabName;
        },

        /**
         * @inheritDoc
         */
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          this._addBehavior(cls.StyleVMBehavior);
          // END WARNING

          // pseudo-selector behaviors
          this._addBehavior(cls.FocusCurrentCellPseudoSelectorBehavior);
          this._addBehavior(cls.OffsetPseudoSelectorBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.TableDialogTypeVMBehavior);
          if (this._isListView) { // This behavior creates widgets it's better to call it before other behaviors
            this._addBehavior(cls.ListViewPageSizeVMBehavior);
          }
          this._addBehavior(cls.EnabledVMBehavior);
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.ColorVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.FocusOnFieldVMBehavior);
          this._addBehavior(cls.TableCurrentVMBehavior);
          this._addBehavior(cls.VisibleRowsVMBehavior);
          this._addBehavior(cls.MultiRowSelectionVMBehavior);
          this._addBehavior(cls.TableSortVMBehavior);
          this._addBehavior(cls.NativeScrollVMBehavior);
          this._addBehavior(cls.WantFixedPageSizeVMBehavior);
          this._addBehavior(cls.PageSizeVMBehavior);

          // ui behaviors
          this._addBehavior(cls.ScrollUIBehavior);
          this._addBehavior(cls.OnLayoutUIBehavior);
          this._addBehavior(cls.RowAndSelectionUIBehavior);
          this._addBehavior(cls.TableFrozenUIBehavior);
          this._addBehavior(cls.TableResetToDefaultUIBehavior);
          this._addBehavior(cls.TableCopyCurrentUIBehavior);
          this._addBehavior(cls.RequestFocusUIBehavior);
          if (this._isListView) {
            this._addBehavior(cls.RowActionUIBehavior); // for normal table rowaction behavior is on tablecolumncontroller
          }

          // 4st behaviors
          this._addBehavior(cls.TableType4STBehavior);
          this._addBehavior(cls.FrozenColumns4STBehavior);
          this._addBehavior(cls.TableHeader4STBehavior);
          this._addBehavior(cls.ShowGrid4STBehavior);
          this._addBehavior(cls.AllowWebSelection4STBehavior);
          this._addBehavior(cls.Highlight4STBehavior);
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.ForceDefaultSettings4STBehavior);
          this._addBehavior(cls.ResizeFillsEmptySpace4STBehavior);
          this._addBehavior(cls.RowActionTrigger4STBehavior);
          this._addBehavior(cls.ReduceFilter4STBehavior);
        },

        /**
         * Build row selection event
         * @param {number} row - row selected
         * @param {boolean} ctrlKey - true if ctrl key is pressed
         * @param {boolean} shiftKey - true if shift key is pressed
         * @returns {object} row selection event
         */
        buildRowSelectionEvent: function(row, ctrlKey, shiftKey) {

          var node = this.getNodeBindings().anchor;
          var startIndex = row;
          var endIndex = row;
          var mode = "set";

          if (shiftKey) {
            if (this.multiRowSelectionRoot === -1) {
              this.multiRowSelectionRoot = node.attribute('currentRow');
            }

            startIndex = this.multiRowSelectionRoot;
            endIndex = row;
            mode = ctrlKey ? "exset" : "set";

            this.updateMultiRowSelectionRoot = false;
          } else if (ctrlKey) {
            var children = node.getChildren();
            var rowInfoListNode = children[children.length - 1];
            var rowInfoNode = rowInfoListNode.getChildren()[row - node.attribute('offset')];
            mode = rowInfoNode.attribute('selected') === 1 ? "unset" : "exset";
          }

          return new cls.VMRowSelectionEvent(node.getId(), {
            startIndex: startIndex,
            endIndex: endIndex,
            selectionMode: mode
          });
        },

        /**
         * @inheritDoc
         */
        setFocus: function() {
          var widget = this.getWidget();
          if (widget.isInputMode()) {
            widget = this.getCurrentInternalWidget();
          } else {
            var showFilter = (widget.hasReduceFilter() && !widget.isTreeView());
            // show filter menu item from chrome bar
            var filterAttribute = this.getAnchorNode().attribute("filter");
            this.getUINode().getController().getWidget().showChromeBarFilterMenuItem(showFilter, filterAttribute);
          }

          if (widget) {
            widget.setFocus();
          }
        },

        /**
         * @inheritDoc
         */
        sendWidgetValue: function(dirty) {
          var valueNode = this.getAnchorNode().getCurrentValueNode(true);
          if (valueNode) {
            valueNode.getController().sendWidgetValue(dirty);
          }
        },

        /**
         * Build and return validationKey for stored settings
         * @returns {string} validationKey
         */
        getStoredSettingsValidationKey: function() {
          var anchor = this.getNodeBindings().anchor;
          var validationKey = "";

          validationKey += anchor.attribute("pageSize") + ";";
          validationKey += anchor.attribute("sortColumn") + ";";
          validationKey += anchor.attribute("sortType") + ";";

          var columns = anchor.getChildren("TableColumn");
          for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            validationKey += column.getFirstChild().attribute("width") + ";";
          }

          if (anchor.getStyleAttribute("tableType") === "frozenTable") {
            validationKey += anchor.getStyleAttribute("leftFrozenColumns") + ";";
            validationKey += anchor.getStyleAttribute("rightFrozenColumns") + ";";
          }

          return validationKey;
        },

        /**
         * @inheritDoc
         */
        setStoredSetting: function(key, value) {
          if (this.forceDefaultSettings) {
            return null;
          } else {
            gbc.StoredSettingsService.setSettings(this._storedSettingsKey + "." + key, value);
          }
        },

        /**
         * @inheritDoc
         */
        getStoredSetting: function(key) {
          if (this.forceDefaultSettings) {
            return null;
          } else {
            return gbc.StoredSettingsService.getSettings(this._storedSettingsKey + "." + key);
          }
        },

        /**
         * Reset Stored Setting
         */
        resetStoredSetting: function() {
          if (!this.forceDefaultSettings) {
            gbc.StoredSettingsService.setSettings(this._storedSettingsKey, {}, true);
          }
        },

        /**
         * Returns if table should be rendered as a listview
         * @returns {boolean}
         */
        isListView: function() {
          return this._isListView;
        },

        /**
         * @inheritDoc
         */
        ensureVisible: function(executeAction) {
          var widget = this.getAnchorNode().getWidget();
          widget.emit(context.constants.widgetEvents.splitViewChange, widget);
          return $super.ensureVisible.call(this, executeAction);
        }
      };
    });
    cls.ControllerFactory.register("Table", cls.TableController);

  });
