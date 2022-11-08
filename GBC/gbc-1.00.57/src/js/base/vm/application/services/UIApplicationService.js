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
modulum('UIApplicationService', ['ApplicationServiceBase', 'ApplicationServiceFactory'],
  function(context, cls) {
    /**
     * @class UIApplicationService
     * @memberOf classes
     * @extends classes.ApplicationServiceBase
     */
    cls.UIApplicationService = context.oo.Class(cls.ApplicationServiceBase, function($super) {
      return /** @lends classes.UIApplicationService.prototype */ {
        __name: "UIApplicationService",
        /**
         * @type {classes.ApplicationWidget}
         */
        _applicationWidget: null,
        constructor: function(app) {
          $super.constructor.call(this, app);
          this._applicationWidget = cls.WidgetFactory.createWidget("Application", {
            appHash: this._application.applicationHash
          });
          this._applicationWidget.setApplicationHash(app.applicationHash);
          this._applicationWidget.onActivate(this._onActivate.bind(this));
          this._application.getSession().addApplicationWidget(app, this._applicationWidget);
          this._applicationWidget.onLayoutRequest(this._onLayoutRequest.bind(this));
        },
        _onActivate: function() {
          this._application.getSession().setCurrentApplication(this._application);
        },
        _onLayoutRequest: function() {
          this._application.layout.refreshLayout();
        },
        destroy: function() {
          if (!this._destroyed) {
            this._applicationWidget.destroy();
            this._applicationWidget = null;
            $super.destroy.call(this);
          }
        },
        /**
         *
         * @returns {classes.ApplicationWidget}
         */
        getWidget: function() {
          return this._applicationWidget;
        },
        setRunning: function(running) {
          if (running) {
            this.getWidget().hideWaiter();
          }
        },
        isLayoutable: function() {
          return this.getWidget() && this.getWidget().getElement() && !this.getWidget().getElement().hasClass("gbc_out_of_view");
        }
      };
    });
    cls.ApplicationServiceFactory.register("UI", cls.UIApplicationService);
  });
