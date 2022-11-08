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

modulum('TableColumnRowBoundWidget', ['TableColumnWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Table column rowbound.
     * @class TableColumnRowBoundWidget
     * @memberOf classes
     * @extends classes.TableColumnWidget
     * @publicdoc
     */
    cls.TableColumnRowBoundWidget = context.oo.Class(cls.TableColumnWidget, function($super) {
      return /** @lends classes.TableColumnRowBoundWidget.prototype */ {
        __name: "TableColumnRowBoundWidget",
        __templateName: "TableColumnWidget",

        $static: /** @lends classes.TableColumnRowBoundWidget */ {
          minWidth: 24
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);

          this.getTitleWidget().onReorderingDrop = Function.noop; // disable drop on this column
          this.getTitleWidget().onReorderingDragOver = Function.noop; // disable drag over on this column
          this.getTitleWidget()._buildContextMenu = Function.noop; // disable contextmenu
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          var children = this.getChildren();
          if (children) {
            for (var i = children.length - 1; i > -1; i--) {
              var currentChildren = children[i];
              currentChildren.destroyChildren(); // manually destroy RowBoundDecorator
              currentChildren.destroy();
              currentChildren = null;
            }
          }
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        updateRowsVisibility: function() {
          var visibleRows = this.getParentWidget().getVisibleRows();
          var children = this.getChildren();

          // create RowBoundDecorators for each visible row
          while (children.length < visibleRows) {
            var rowBoundDecorator = cls.WidgetFactory.createWidget("RowBoundDecorator", this.getBuildParameters());
            this.addChildWidget(rowBoundDecorator);
          }

          $super.updateRowsVisibility.call(this);
        },

        /**
         * @inheritDoc
         */
        measureSize: function() {},

        /**
         * @inheritDoc
         */
        setWidth: function(width) {
          width = Math.max(width, cls.TableColumnRowBoundWidget.minWidth);
          $super.setWidth.call(this, width);
        },

        /**
         * @inheritDoc
         */
        isMovable: function() {
          return false;
        },

        /**
         * @inheritDoc
         */
        isSizable: function() {
          return false;
        },

        /**
         * @inheritDoc
         */
        isAlwaysVisible: function() {
          return true;
        }

      };
    });
    cls.WidgetFactory.registerBuilder('TableColumnRowBound', cls.TableColumnRowBoundWidget);
  });
