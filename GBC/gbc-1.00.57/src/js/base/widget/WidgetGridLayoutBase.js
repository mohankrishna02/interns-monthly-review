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

modulum('WidgetGridLayoutBase', ['WidgetGroupBase'],
  function(context, cls) {

    /**
     * Base class for widget group.
     * @class WidgetGridLayoutBase
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     */
    cls.WidgetGridLayoutBase = context.oo.Class(cls.WidgetGroupBase, function($super) {
      return /** @lends classes.WidgetGridLayoutBase.prototype */ {
        __name: "WidgetGridLayoutBase",
        /**
         * Whether or not is GridChildrenInParent
         * @type {!boolean}
         */
        _isGridChildrenInParent: null,
        _rerouteChildren: false,
        _owned: null,
        _scrolling: false,
        _wheelHandling: false,
        _wheelThrottleHandler: null,
        _wheelThrottleTimeout: null,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this._wheelThrottleTimeout = cls.ScrollUIBehavior._throttleTimeout * 4;
          this._owned = [];
          this._element.addClass("g_Grid");
          this._containerElement.addClass("g_GridLayoutEngine");
        },

        /**
         * @inheritDoc
         */
        _initLayout: function(noLayoutEngine) {
          $super._initLayout.call(this);
          if (!noLayoutEngine) {
            this._layoutEngine = new cls.GridLayoutEngine(this);
          }
        },

        /**
         * @inheritDoc
         */
        _addChildWidgetToDom: function(widget, position) {
          this.getLayoutEngine().registerChild(widget);
          var widgetGridHost = document.createElement('div');
          widgetGridHost.addClass('g_GridElement');
          var info = widget.getLayoutInformation();
          if (info) {
            info.setHostElement(widgetGridHost);
          }
          if (widget instanceof cls.ScrollAreaWidget) {
            if (!this._wheelHandling) {
              this._wheelHandling = true;
              this._element.addEventListener("wheel", this._handleWheel.bind(this));
            }
            widgetGridHost.addClass('g_GridElement_scrollzone');
          } else {
            widgetGridHost.addClass('g_GridElement_scrollignore');
          }
          widgetGridHost.appendChild(widget._element);
          widgetGridHost.insertAt(position, this._containerElement);
        },

        /**
         * Manage mousewheel event
         * @param {MouseEvent} event the event
         * @private
         */
        _handleWheel: function(event) {
          if (this._wheelHandling) {
            if (this._wheelThrottleHandler) {
              this._clearTimeout(this._wheelThrottleHandler);
            }
            if (!this._scrolling) {
              this._scrolling = true;
              this._element.addClass("g_scrolling");
            }
            this._wheelThrottleHandler = this._registerTimeout(function() {
              this._scrolling = false;
              this._wheelThrottleHandler = null;
              this._element.removeClass("g_scrolling");
            }.bind(this), this._wheelThrottleTimeout);
          }
        },

        /**
         * @inheritDoc
         */
        _removeChildWidgetFromDom: function(widget) {
          this.getLayoutEngine().unregisterChild(widget);
          var info = widget.getLayoutInformation(),
            host = info && info.getHostElement();
          if (host && host.parentNode === this._containerElement) {
            widget._element.remove();
            host.remove();
            host = null;
          }
        },
        /**
         * Is it GridChildrenInParent ?
         * @return {boolean} true if it is GridChildrenInParent
         */
        isGridChildrenInParent: function() {
          return this._isGridChildrenInParent;
        },
        /**
         * Set GridChildrenInParent state
         * @param {boolean} isGridChildrenInParent the wanted state
         */
        setGridChildrenInParent: function(isGridChildrenInParent) {
          if (this._isGridChildrenInParent !== isGridChildrenInParent) {
            this._isGridChildrenInParent = isGridChildrenInParent;
            if (this._isGridChildrenInParent) {
              this._moveOwnChildrenToParent();
            } else {
              this._moveOwnChildrenToSelf();
            }
          }
        },

        /**
         * @inheritDoc
         */
        addChildWidget: function(widget, options) {
          if (this._rerouteChildren) {
            this._owned.push(widget);
            var layoutInfo = widget.getLayoutInformation();
            if (layoutInfo) {
              layoutInfo.setOwningGrid(this);
            }
            this.getParentWidget().addChildWidget(widget, options);
          } else {
            $super.addChildWidget.call(this, widget, options);
          }
        },

        /**
         * @inheritDoc
         */
        removeChildWidget: function(widget, options) {
          if (this._rerouteChildren) {
            this.getParentWidget().removeChildWidget(widget, options);
            var layoutInfo = widget.getLayoutInformation();
            if (layoutInfo) {
              layoutInfo.setOwningGrid(null);
            }
          } else {
            $super.removeChildWidget.call(this, widget, options);
          }
        },

        /**
         * Get a copy of children list
         * @return {Array.<classes.WidgetBase>} a copy list of children
         * @private
         */
        _listChildrenToMoveWhenGridChildrenInParent: function() {
          return this._children.slice();
        },

        /**
         * Move self children to parent on GridChildrenInParent
         * @private
         */
        _moveOwnChildrenToParent: function() {
          var children = [];
          var childrenToMove = this._listChildrenToMoveWhenGridChildrenInParent();
          while (childrenToMove.length) {
            var child = childrenToMove.shift();
            this.removeChildWidget(child);
            children.push(child);
          }
          this._rerouteChildren = true;
          while (children.length) {
            this.addChildWidget(children.shift());
          }
        },
        /**
         * Move self children to itself on GridChildrenInParent
         * @private
         */
        _moveOwnChildrenToSelf: function() {
          var children = [];
          while (this._owned.length) {
            var child = this._owned[0];
            this.removeChildWidget(child);
            children.push(child);
          }
          this._rerouteChildren = false;
          while (children.length) {
            this.addChildWidget(children.shift());
          }
        }
      };
    });
  });
