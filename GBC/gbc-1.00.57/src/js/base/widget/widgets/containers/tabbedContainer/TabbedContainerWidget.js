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

modulum('TabbedContainerWidget', ['FolderWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Tabbed container widget.
     * @class TabbedContainerWidget
     * @memberOf classes
     * @extends classes.FolderWidget
     */
    cls.TabbedContainerWidget = context.oo.Class(cls.FolderWidget, function($super) {
      return /** @lends classes.TabbedContainerWidget.prototype */ {
        __name: "TabbedContainerWidget",
        __templateName: "FolderWidget",

        /**
         * @type {HandleRegistration}
         */
        _browserResizeHandler: null,
        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);

          this._browserResizeHandler = context.HostService.onScreenResize(this.updateScrollersVisibility.bind(this));
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          if (this._browserResizeHandler) {
            this._browserResizeHandler();
            this._browserResizeHandler = null;
          }
          this.destroyChildren();
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this.setTabPosition("top");
          this._layoutInformation = new cls.FolderLayoutInformation(this);
          this._layoutEngine = new cls.TabbedContainerLayoutEngine(this);
        },

        /**
         * @inheritDoc
         */
        onTitleClick: function(page) {
          this.setCurrentPage(page);
        },

        /**
         * @inheritDoc
         */
        _getAllocatedSize: function(isHorizontal) {
          if (this.getParentWidget()) {
            var info = this.getParentWidget().getWindowContentContainer().getBoundingClientRect();
            return info[isHorizontal ? "width" : "height"];
          }
          return 0;
        }
      };
    });
    cls.WidgetFactory.registerBuilder('TabbedContainer', cls.TabbedContainerWidget);
  });
