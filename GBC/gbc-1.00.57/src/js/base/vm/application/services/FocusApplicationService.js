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

modulum('FocusApplicationService', ['ApplicationServiceBase', 'ApplicationServiceFactory'],
  function(context, cls) {
    /**
     * @class FocusApplicationService
     * @memberOf classes
     * @extends classes.ApplicationServiceBase
     */
    cls.FocusApplicationService = context.oo.Class(cls.ApplicationServiceBase, function($super) {
      return /** @lends classes.FocusApplicationService.prototype */ {
        __name: "FocusApplicationService",

        $static: /** @lends classes.FocusApplicationService */ {
          /**
           * Get next ordered field
           * TODO missing parameter types
           * @param form
           * @param node
           * @param offset
           * @param inputWrap
           * @returns {*}
           */
          getPrevOrNextContainer: function(form, node, offset, inputWrap) {
            var fields = [];
            cls.FocusApplicationService.orderFields(form, fields);
            var index = fields.indexOf(node) + offset;
            if (index < 0) {
              if (inputWrap) {
                return fields[fields.length - 1];
              } else {
                return null;
              }
            } else if (index >= fields.length) {
              if (inputWrap) {
                return fields[0];
              } else {
                return null;
              }
            } else {
              return fields[index];
            }
          },

          /**
           * Order fields and update fields parameter in consequence
           * TODO missing parameter types
           * @param node
           * @param fields
           * @param nodeTypes
           * @param attributesFilter
           */
          orderFields: function(node, fields, nodeTypes, attributesFilter) {
            var i = 0;
            if (!nodeTypes) {
              nodeTypes = ['FormField', 'Matrix', 'Table', 'Button'];
            }
            var ok = nodeTypes.contains(node.getTag()) && node.attribute('active') !== 0 && node.attribute('tabIndexRt') !== 0 &&
              node.attribute('hidden') === 0 && node.attribute('actionActive') !== 0;
            if (node.getTag() === 'Table') {
              var columns = cls.FocusApplicationService.getActiveTableColumns(node);
              ok = ok && columns.length > 0;
            }
            if (attributesFilter) {
              var attrs = Object.keys(attributesFilter);
              if (ok) {
                for (i = 0; ok && i < attrs.length; ++i) {
                  var key = attrs[i];
                  ok = ok && node.attribute(key) === attributesFilter[key];
                }
              }
            }
            if (ok) {
              if (fields.length === 0) {
                fields.push(node);
              } else {
                var nodeTabIndexRt = node.attribute('tabIndexRt');
                var inserted = false;
                for (i = 0; i < fields.length; ++i) {
                  var field = fields[i];

                  var fieldTabIndexRt = 0;
                  if (field.getTag() === "Table") {
                    fieldTabIndexRt = field.getFirstChild('TableColumn').attribute('tabIndexRt');
                  } else {
                    fieldTabIndexRt = field.attribute('tabIndexRt');
                  }
                  if (fieldTabIndexRt > nodeTabIndexRt) {
                    fields.splice(i, 0, node);
                    inserted = true;
                    break;
                  }
                }
                if (!inserted) {
                  fields.push(node);
                }
              }
            } else {
              var children = node.getChildren();
              for (i = 0; i < children.length; ++i) {
                cls.FocusApplicationService.orderFields(children[i], fields, nodeTypes, attributesFilter);
              }
            }
          },

          /**
           * Get list of active table columns
           * @param {classes.TableNode} tableNode
           * @returns {classes.TableColumnNode[]} list of active table columns
           */
          getActiveTableColumns: function(tableNode) {
            return tableNode.getChildren('TableColumn').filter(function(column) {
              return column.attribute('active') !== 0 && column.attribute('tabIndexRt') !== 0 &&
                column.attribute('hidden') === 0;
            });
          },

          /**
           * Get ordered table columns list
           * @param {classes.TableNode} tableNode
           * @returns {classes.TableColumnNode[]} list of ordered columns
           */
          getOrderedTableColumns: function(tableNode) {
            var columns = cls.FocusApplicationService.getActiveTableColumns(tableNode);
            columns.sort(function(col1, col2) {
              return col1.attribute('tabIndexRt') - col2.attribute('tabIndexRt');
            });
            return columns;
          }

        },

        /**
         * The currently visually focused node. Due to the typeahead mechanism,
         * this may be different from the VM focused node
         * @type {classes.NodeBase}
         */
        _focusedNode: null,

        /**
         * true if we are currently restoring the VM focus, false otherwise
         * @type {boolean}
         */
        _restoringVMFocus: false,

        /**
         * @inheritDoc
         */
        constructor: function(app) {
          $super.constructor.call(this, app);
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          $super.destroy.call(this);

          this._focusedNode = null;
        },

        /**
         * The currently visually focused node. Due to the typeahead mechanism,
         * this may be different from the VM focused node
         * @returns {classes.NodeBase}
         */
        getFocusedNode: function() {
          return this._focusedNode;
        },

        /**
         * @param {classes.NodeBase} focusedNode - the currently visually focused node
         */
        setFocusedNode: function(focusedNode) {
          this._focusedNode = focusedNode;
        },

        /**
         * Restores the focus according to the VM focus
         * @param {boolean=} [restoreDOMFocus] ensure to restore the DOM focus
         */
        restoreVMFocus: function(restoreDOMFocus) {
          var node = this._application.getFocusedVMNodeAndValue(true);
          if (node) {
            // set current focused node for typeahead
            context.LogService.focus.log("restoreVMFocus for node : ", node);
            this.setFocusedNode(node);
            var ctrl = node.getController();
            if (ctrl) {
              // ensure visible for folder pages
              var parentForm = node.getAncestor("Form");
              var visibleId = null;
              if (parentForm) {
                visibleId = parentForm.attribute("visibleId");
              }
              var uiWidget = null;
              var appWidget = this._application.getUI().getWidget();
              if (appWidget) {
                uiWidget = appWidget._uiWidget;
              }
              var focusedWidget = ctrl.getWidget() || ctrl.getCurrentInternalWidget();
              if (focusedWidget) {
                if (!uiWidget) {
                  uiWidget = focusedWidget.getUserInterfaceWidget();
                }
                if (uiWidget) { // set ui current focused widget
                  uiWidget.setVMFocusedWidget(focusedWidget);
                  uiWidget.setFocusedWidget(focusedWidget);
                }
              }
              this._restoringVMFocus = true;
              if (uiWidget && (restoreDOMFocus || uiWidget.hasVMFocusedWidgetChanged()) || uiWidget.hasFocusedWidgetChanged()) {
                // if no visibleId is set we make sure to display potential current page
                if (!visibleId || visibleId === -1) {
                  if (ctrl.ensureVisible()) {
                    this._application.layout.refreshLayout();
                  }
                }
                ctrl.setFocus(); // set ui focus on widget element

                // hide previously displayed dropdowns
                if (cls.DropDownWidget.hasAnyVisible() && !cls.DropDownWidget.isChildOrParentOfDropDown(focusedWidget
                    .getElement())) {
                  cls.DropDownWidget.hideAll();
                }

              }
              this.emit(context.constants.widgetEvents.focusRestored);
              this._restoringVMFocus = false;
            }
          }
        },

        /**
         * @returns {boolean} true if we are currently restoring the VM focus, false otherwise
         */
        isRestoringVMFocus: function() {
          return this._restoringVMFocus;
        },

        /**
         * Set the focusedDropdown widget
         * @param {classes.WidgetBase} activeWidget
         */
        setFocusedDropDownWidget: function(activeWidget) {
          this._dropDownWidget = activeWidget;
        },

        /**
         * Get the focusedDropdown widget
         * @return {classes.WidgetBase|*}
         */
        getFocusedDropDownWidget: function() {
          return this._dropDownWidget;
        },

        /**
         * Transfer focus to corresponding node
         * @param {string} actionName
         * @param {classes.NodeBase} node
         * @param {number} [currentRow]
         * @param {number} [currentColumn]
         * @returns {boolean}
         * @private
         */
        _transferFocusToNode: function(actionName, node, currentRow, currentColumn) {
          var valueList = null;
          var valueNode = null;
          var widget = null;
          var newFocusedNode = node;
          var cursors = null;
          var focusAsked = false;

          var dialogType = node.attribute('dialogType');
          var displayDialog = dialogType === "Display" || dialogType === "DisplayArray";

          context.LogService.focus.log("Transfer focus to node : ", node, actionName, currentRow, currentColumn);

          switch (node.getTag()) {
            case "FormField":
            case "Button":
              widget = node.getController().getWidget();
              cursors = {
                start: 0,
                end: 0
              };
              if (widget.hasCursors()) {
                widget.setCursors(0, -1);
                cursors = widget.getCursors();
              }
              this._application.typeahead.focus(node, cursors.start, cursors.end, actionName);
              focusAsked = true;
              break;
            case "Matrix":
              if (currentRow === undefined) {
                currentRow = node.attribute('currentRow') - node.attribute('offset');
              }

              if (!displayDialog) { // INPUT ARRAY
                valueList = node.getFirstChild('ValueList');
                valueNode = valueList.getChildren()[Math.max(currentRow, 0)];
                widget = valueNode.getController().getWidget();
                cursors = {
                  start: 0,
                  end: 0
                };
                if (widget.hasCursors()) {
                  widget.setCursors(0, -1);
                  cursors = widget.getCursors();
                }
                this._application.typeahead.focus(valueNode, cursors.start, cursors.end, actionName);
                newFocusedNode = valueNode;
              } else { // DISPLAY ARRAY
                // if typeahead is frozen, we don't update visual focus, focus will be restored by VM answer
                if (!this._application.typeahead.isFrozen()) {
                  context.LogService.focus.log("Update visual matrix currentRow: ", node, currentRow);
                  node.getController().updateCurrentRow(node, currentRow);
                }
                this._application.typeahead.currentRow(node, actionName);
              }
              focusAsked = true;
              break;
            case "Table":
              if (currentRow === undefined) {
                currentRow = node.attribute('currentRow') - node.attribute('offset');
              }
              var columnIndexToFocus = null;
              var tableWidget = node.getController().getWidget();

              if (!displayDialog) { // INPUT ARRAY
                if (currentColumn === undefined) {
                  // If no current column is provided, simply focus the first visible column
                  currentColumn = 0;
                }

                // search column which must be focused
                var allColumns = node.getChildren('TableColumn');
                var orderedFocusableColumns = cls.FocusApplicationService.getOrderedTableColumns(node);
                var columnToFocus = orderedFocusableColumns[currentColumn];
                if (!columnToFocus) {
                  return false; // if column cannot be found, don't focus anything
                }

                columnIndexToFocus = allColumns.indexOf(columnToFocus);
                valueList = columnToFocus.getFirstChild('ValueList');
                valueNode = valueList.getChildren()[Math.max(currentRow, 0)];
                widget = valueNode.getController().getWidget();

                cursors = {
                  start: 0,
                  end: 0
                };

                if (widget.hasCursors()) {
                  widget.setCursors(0, -1);
                  cursors = widget.getCursors();
                }
                this._application.typeahead.focus(valueNode, cursors.start, cursors.end, actionName);
                newFocusedNode = valueNode;
              } else { // DISPLAY ARRAY
                if (cls.ActionNode.isTableNavigationAction(actionName)) {
                  this._application.typeahead.currentRow(node, actionName);
                } else {
                  this._application.typeahead.focus(node);
                }
              }

              // if typeahead is frozen, we don't update visual focus, focus will be restored by VM answer
              if (!this._application.typeahead.isFrozen()) {
                context.LogService.focus.log("Update visual table currentRow,currentCol: ", node, currentRow, columnIndexToFocus);
                tableWidget.setCurrentRow(currentRow);
                if (columnIndexToFocus !== null) {
                  tableWidget.setCurrentColumn(columnIndexToFocus);
                }
              }

              focusAsked = true;
              break;
          }

          if (focusAsked) {
            // if typeahead is frozen, we don't update visual focus, focus will be restored by VM answer
            if (!this._application.typeahead.isFrozen()) {
              context.LogService.focus.log("Change focused widget: ", newFocusedNode);
              newFocusedNode.getController().ensureVisible();
              newFocusedNode.getController().setFocus();

              this.setFocusedNode(newFocusedNode);
            }
          }
          return focusAsked;
        },

      };
    });
    cls.ApplicationServiceFactory.register("Focus", cls.FocusApplicationService);
  });
