/// FOURJS_START_COPYRIGHT(D,2014)
/// Property of Four Js*
/// (c) Copyright Four Js 2014, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('FormLayoutEngine', ['LayoutEngineBase'],
  function(context, cls) {
    /**
     * @class FormLayoutEngine
     * @memberOf classes
     * @extends classes.LayoutEngineBase
     */
    cls.FormLayoutEngine = context.oo.Class(cls.LayoutEngineBase, function($super) {
      return /** @lends classes.FormLayoutEngine.prototype */ {
        __name: "FormLayoutEngine",
        _initialRenderSize: null,
        /**
         * Auto overflow mode. Active when the form is taller than the browser viewport
         * @type {boolean}
         */
        _autoOverflowMode: false,
        /**
         * stylesheet id
         */
        _styleSheetId: null,
        /**
         * @inheritDoc
         * @constructs
         */
        constructor: function(widget) {
          $super.constructor.call(this, widget);
          this._styleSheetId = "formLayout_" + widget.getUniqueIdentifier();
        },
        /**
         * @inheritDoc
         */
        reset: function(recursive) {
          $super.reset.call(this, recursive);
          this._initialRenderSize = null;
          this._autoOverflowMode = false;
          var modal = this._widget && this._widget.getParentWidget() && this._widget.getParentWidget().getModal();
          if (modal) {
            modal.resetLayout();
            modal._hasBeenSized = false;
            context.styler.removeStyleSheet(this.getLayoutSheetId());
          }
        },
        _getMinHintWidth: function() {
          var layoutInfo = this._getLayoutInfo();
          return cls.CharSize.translate(layoutInfo.getMinSizeHint().getWidth(), layoutInfo.getCharSize().getWidthM(),
            layoutInfo.getCharSize().getWidth0());
        },
        _getMinHintHeight: function() {
          var layoutInfo = this._getLayoutInfo();
          return cls.Size.translate(layoutInfo.getMinSizeHint().getHeight(), layoutInfo.getCharSize().getHeight());
        },

        /**
         * @inheritDoc
         */
        prepareMeasure: function() {
          var modal = this._widget && this._widget.getParentWidget() && this._widget.getParentWidget().getModal();
          if (modal) {
            var element = this._widget.getElement();
            if (!this._initialRenderSize) {
              this._initialRenderSize = {
                x: element.offsetWidth,
                y: element.offsetHeight
              };
            } else {
              if ((this._initialRenderSize.x !== element.offsetWidth) || (this._initialRenderSize.y !== element.offsetHeight)) {
                modal.getElement().toggleClass("left-realign", false);
                modal.getElement().toggleClass("top-realign", false);

                modal._removeInitialContainment();
              }
            }
          }
        },

        /**
         * @inheritDoc
         */
        measure: function() {
          if (this._widget.getParentWidget().isModal) {
            this._measureModal();
          } else {
            this._measure();
          }
        },
        _measure: function() {
          var layoutInfo = this._getLayoutInfo();
          layoutInfo.setMeasured(
            layoutInfo.getRawMeasure().getWidth(true),
            layoutInfo.getRawMeasure().getHeight(true)
          );
          var childInfo = this._getLayoutInfo(this._widget.getChildren()[0]);
          if (childInfo) {
            var measured = layoutInfo.getMeasured();
            childInfo.wouldOverflowContainerIfNeeded(true);
            childInfo.setAvailable(measured.getWidth(), measured.getHeight());
          }
        },
        _measureModal: function() {
          var layoutInfo = this._getLayoutInfo(),
            width = this._getMinHintWidth(),
            height = this._getMinHintHeight();

          layoutInfo.setMinimal(width, height);
          layoutInfo.setMeasured(width, height);
        },

        /**
         * @inheritDoc
         */
        adjustMeasure: function(lastInvalidated, layoutApplicationService) {
          var windowWidget = this._widget.getWindowWidget(),
            isInModal = windowWidget && windowWidget.isModal;
          if (isInModal) {
            this._adjustMeasureModal();
          } else {
            this._adjustMeasure();
          }
        },
        _adjustMeasure: function() {
          var windowWidget = this._widget.getWindowWidget(),
            parentLayoutInformation = windowWidget.getLayoutInformation(),
            childInfo = this._getLayoutInfo(this._widget.getChildren()[0]);

          if (childInfo) {
            childInfo.wouldOverflowContainerIfNeeded(true);
            var measure = parentLayoutInformation.isSizable() ? this._getLayoutInfo().getMeasured() : childInfo.getMeasured(),
              willXScroll = childInfo.getMeasured().getWidth() > measure.getWidth(),
              willYScroll = childInfo.getMeasured().getHeight() > measure.getHeight();

            childInfo.setAvailable(
              measure.getWidth() - (willYScroll ? window.scrollBarSize : 0),
              measure.getHeight() - (willXScroll ? window.scrollBarSize : 0)
            );

            if (parentLayoutInformation.isSizable()) {
              var minimal = childInfo.getMinimal();
              if (minimal.getHeight(true) > measure.getHeight(true)) {
                if (!this._statuses.adjusted) {
                  this._autoOverflowMode = true;
                }
              }
            }
          }
        },
        _adjustMeasureModal: function() {
          var childInfo = this._getLayoutInfo(this._widget.getChildren()[0]);
          if (childInfo) {
            var windowWidget = this._widget.getWindowWidget(),
              childMeasure = childInfo.getMeasured();
            childInfo.wouldOverflowContainerIfNeeded(true);
            if (windowWidget.getLayoutInformation().isSizable()) {
              var modal = windowWidget.getModal(),
                childPreferred = childInfo.getPreferred(),
                formMeasured = this._getLayoutInfo().getMeasured(),
                sizedX = 0,
                sizedY = 0;

              if (modal._hasBeenSized) {
                var childMinimal = childInfo.getMinimal(),
                  sizingInfo = modal._sizingPositions;
                sizedX = sizingInfo.size.x - sizingInfo.decoration.x;
                sizedY = sizingInfo.size.y - sizingInfo.decoration.y;

                formMeasured.setWidth(Math.max(childPreferred.getWidth(true), sizedX - window.scrollBarSize, childMinimal.getWidth(
                  true)));
                formMeasured.setHeight(Math.max(childPreferred.getHeight(true), sizedY - window.scrollBarSize, childMinimal
                  .getHeight(
                    true)));
              }
              var availableX = Math.max(childMeasure.getWidth(true), formMeasured.getWidth(true)),
                availableY = Math.max(childMeasure.getHeight(true), formMeasured.getHeight(true));
              childInfo.setAvailable(
                sizedX || Math.max(modal._hasBeenSized ? 0 : childPreferred.getWidth(true), availableX),
                sizedY || Math.max(modal._hasBeenSized ? 0 : childPreferred.getHeight(true), availableY)
              );
            } else {
              childInfo.setAvailable(childMeasure.getWidth(), childMeasure.getHeight());
            }
          }
        },

        /**
         * @inheritDoc
         */
        applyLayout: function() {
          var parentWidget = this._widget.getParentWidget(),
            isInModal = parentWidget && parentWidget.isModal,
            modal = parentWidget && parentWidget.getModal();

          if (isInModal) {
            var childInfo = this._getLayoutInfo(this._widget.getChildren()[0]);
            if (modal) {
              modal._sizingPositions.contentMin = {
                x: Math.max(childInfo.getMinimal().getWidth(true), this._getMinHintWidth()),
                y: Math.max(childInfo.getMinimal().getHeight(true), this._getMinHintHeight())
              };
            }
          }
        },

        /**
         * @inheritDoc
         */
        notifyLayoutApplied: function() {
          $super.notifyLayoutApplied.call(this);
          this._registerAnimationFrame(this._onNotified.bind(this));
        },

        _onNotified: function() {
          var widget = this._widget,
            windowWidget = widget && widget.getWindowWidget();
          if (windowWidget) {
            if (windowWidget.isModal) {
              this._notifyModal();
            } else {
              this._notify();
            }
          }
        },

        _notify: function() {
          var style = {},
            overflownX = false,
            overflownY = false,
            widget = this._widget,
            windowWidget = widget && widget.getWindowWidget(),
            element = widget.getElement();
          if (widget) {
            // need to check : if disabled: don't do that, but if visible behind modal, do that!
            if (windowWidget && !windowWidget._disabled) {
              var measured = widget.getLayoutInformation().getMeasured(),
                childWidget = widget.getChildren() && widget.getChildren()[0],
                childAllocated = childWidget && childWidget.getLayoutInformation().getAllocated(),
                childAllocatedWidth = childAllocated ? childAllocated.getWidth() : 0,
                childAllocatedHeight = childAllocated ? childAllocated.getHeight() : 0,
                dWidth = measured.getWidth() - childAllocatedWidth,
                dHeight = measured.getHeight() - childAllocatedHeight;
              style["#w_" + this._widget.getUniqueIdentifier() + ".g_measureable>.containerElement>.gbc_FormWidget_scrollkeeper"] = {
                height: (childAllocated && childAllocated.hasHeight(true)) ? cls.Size.cachedPxImportant(childAllocated.getHeight()) : null
              };
              context.styler.appendStyleSheet(style, this._styleSheetId, true, this.getLayoutSheetId());

              overflownX = dWidth < -0.9;
              overflownY = dHeight < -0.9;
            }
            element
              .toggleClass("notOverflownX", !overflownX)
              .toggleClass("notOverflownY", !overflownY)
              .toggleClass("overflownX", overflownX)
              .toggleClass("overflownY", overflownY);
          }
        },
        _notifyModal: function() {
          var widget = this._widget,
            element = widget.getElement(),
            layoutInformation = widget.getLayoutInformation(),
            windowWidget = widget.getWindowWidget(),
            modal = windowWidget.getModal(),
            modalElement = modal.getElement(),
            modalpane = modalElement && modalElement.child("mt-dialog-pane"),
            modalcontent = modalpane && modalpane.child("mt-dialog-content");
          if (modalcontent) {
            var deltaWidth = modalpane.offsetWidth - modalElement.offsetWidth,
              deltaHeight = modalpane.offsetHeight - modalElement.offsetHeight,
              menuContainers = windowWidget.getMenuContainers();
            if (window.browserInfo.isSafari) {
              element.addClass("safariMeasure");
            }
            var measure = layoutInformation.getMeasured(),
              firstChild = widget.getChildren()[0],
              childInfo = firstChild && firstChild.getLayoutInformation(),
              childMeasure = childInfo && childInfo.getMeasured(),

              referenceWidth = modal._hasBeenSized ? 0 : childInfo.getPreferred().getWidth(true),
              referenceHeight = modal._hasBeenSized ? 0 : childInfo.getPreferred().getHeight(true);

            measure.setWidth(Math.max(referenceWidth,
              childMeasure && childMeasure.getWidth() || (element.clientWidth - (deltaWidth > 0 ? deltaWidth : 0)),
              this._getMinHintWidth()
            ));
            measure.setHeight(Math.max(referenceHeight,
              childMeasure && childMeasure.getHeight() || (element.clientHeight - (deltaHeight > 0 ? deltaHeight : 0)),
              this._getMinHintHeight()
            ));
            if (window.browserInfo.isSafari) {
              this._widget.getElement().removeClass("safariMeasure");
            }

            var menusXWidth = Math.max(0, menuContainers.left.offsetWidth + menuContainers.right.offsetWidth - 1),
              menusYHeight = Math.max(0, menuContainers.top.offsetHeight + menuContainers.bottom.offsetHeight - 1),
              minWidth = Math.max(referenceWidth, childInfo.getMinimal().getWidth() + menusXWidth + window.scrollBarSize,
                this._getMinHintWidth()),
              minHeight = Math.max(referenceHeight, childInfo.getMinimal().getHeight() + menusYHeight + window.scrollBarSize,
                this._getMinHintHeight());
            modalElement.toggleClass("left-realign", minWidth > modalElement.offsetWidth);
            modalElement.toggleClass("top-realign", minHeight > modalElement.offsetHeight);
            var minStyle = {},
              style = {};
            minStyle[".g_measured #w_" + modal.getUniqueIdentifier() + ".g_measureable .mt-dialog-pane"] = {
              "min-width": cls.Size.cachedPxImportant(minWidth),
              "min-height": cls.Size.cachedPxImportant(minHeight)
            };
            context.styler.appendStyleSheet(minStyle, "formLayout_" + modal.getUniqueIdentifier(), true, this.getLayoutSheetId());

            var modalContentWidth = modalcontent.offsetWidth - menusXWidth,
              modalContentHeight = modalcontent.offsetHeight - menusYHeight;
            style[".g_measured .gbc_ModalWidget #w_" + this._widget.getUniqueIdentifier() + ".g_measureable"] = {
              width: cls.Size.cachedPxImportant(modal._hasBeenSized ? modalContentWidth : (measure.getWidth() + window
                .scrollBarSize)),
              height: cls.Size.cachedPxImportant(modal._hasBeenSized ? modalContentHeight : (measure.getHeight() + window
                .scrollBarSize))
            };

            var contentMaxWidth = Math.max(measure.getWidth() + window.scrollBarSize + menusXWidth, this._getMinHintWidth());
            var calculatedWidth = (modal._hasBeenSized ? modalContentWidth : contentMaxWidth);
            this._widget.getLayoutInformation().setToolbarAllocatedWidth(calculatedWidth);

            if (windowWidget._toolBarWidget) {
              windowWidget._toolBarWidget.setStyle({
                "width": calculatedWidth + "px"
              });
            }
            if (modal.setHeaderMaxWidth) {
              modal.setHeaderMaxWidth(modal._hasBeenSized ? modalcontent.offsetWidth : contentMaxWidth);
            }
            context.styler.appendStyleSheet(style, this._styleSheetId, true, this.getLayoutSheetId());
            if (!modal._hasBeenMoved) {
              this._registerAnimationFrame(function() {
                if (modal) {
                  modal._initMoved();
                }
              });
            }
            modalElement.removeClass('g_needLayout');
          }
        },

        /**
         * @inheritDoc
         */
        invalidateMeasure: function(invalidation) {
          var invalidated = !invalidation || this._invalidatedMeasure < invalidation;
          $super.invalidateMeasure.call(this, invalidation);
          if (invalidated) {
            this.invalidateAllocatedSpace(this._invalidatedMeasure);
          }
        },

        /**
         * @inheritDoc
         */
        invalidateAllocatedSpace: function(invalidation) {
          var invalidated = !invalidation || this._invalidatedAllocatedSpace < invalidation;
          $super.invalidateAllocatedSpace.call(this, invalidation);
          if (invalidated) {
            this.invalidateMeasure(this._invalidatedAllocatedSpace);
          }
        },

        /**
         * @return {boolean} true when the form is taller than the browser viewport
         */
        isAutoOverflowActivated: function() {
          return this._autoOverflowMode;
        },

        /**
         * @inheritDoc
         */
        needMeasureSwitching: function() {
          return false;
        },

        /**
         * @inheritDoc
         */
        needMeasure: function() {
          return true;
        }
      };
    });
  });
