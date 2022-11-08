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

modulum('LayoutInfoVMBehavior', ['BehaviorBase'],
  function(context, cls) {
    /**
     * @class LayoutInfoVMBehavior
     * @memberOf classes
     * @extends classes.BehaviorBase
     */
    cls.LayoutInfoVMBehavior = context.oo.Singleton(cls.BehaviorBase, function() {
      return /** @lends classes.LayoutInfoVMBehavior.prototype */ {
        __name: "LayoutInfoVMBehavior",

        widgetsIgnoringSizePolicy: ["ButtonEdit", "DateEdit", "DateTimeEdit", "Edit", "ProgressBar", "Slider", "SpinEdit",
          "TextEdit", "TimeEdit"
        ],

        watchedAttributes: {
          anchor: ['width', 'gridWidth', 'height', 'gridHeight', 'posX', 'posY', 'stretch', 'sizePolicy', 'gridChildrenInParent',
            'minWidth', 'minHeight', 'autoScale'
          ],
          container: ['gridChildrenInParent', 'stepX', 'stepY', 'columnCount'],
          decorator: ['width', 'gridWidth', 'height', 'gridHeight', 'posX', 'posY', 'stretch', 'sizePolicy', 'gridChildrenInParent',
            'minWidth', 'minHeight', 'autoScale'
          ]
        },

        /**
         * @inheritDoc
         */
        _apply: function(controller, data) {
          var nodeBindings = controller.getNodeBindings(),
            anchorNode = nodeBindings.anchor,
            layoutInfoNode = nodeBindings.decorator || anchorNode,
            containerNode = nodeBindings.container,
            widget = controller.getWidget(),
            layoutInformation = widget && widget.getLayoutInformation(),
            rawLayoutInformation = layoutInformation && layoutInformation.getRawInformation(),
            layoutEngine = widget && widget.getLayoutEngine();

          var doUpdate = false;

          if (rawLayoutInformation) {
            // we look if some raw info is updated
            var onChange = rawLayoutInformation.onRawLayoutInformationChanged(function() {
              doUpdate = true;
            }, true);
            if (layoutInfoNode) {
              rawLayoutInformation.setSizePolicy(layoutInfoNode.attribute('sizePolicy'));
              rawLayoutInformation.setWidth(layoutInfoNode.attribute('width'));
              rawLayoutInformation.setHeight(layoutInfoNode.attribute('height'));
              rawLayoutInformation.setGridWidth(layoutInfoNode.attribute('gridWidth'));
              rawLayoutInformation.setGridHeight(layoutInfoNode.attribute('gridHeight'));
              rawLayoutInformation.setPosX(layoutInfoNode.attribute('posX'));
              rawLayoutInformation.setPosY(layoutInfoNode.attribute('posY'));
              rawLayoutInformation.setMinWidth(layoutInfoNode.attribute('minWidth'));
              rawLayoutInformation.setMinHeight(layoutInfoNode.attribute('minHeight'));

              rawLayoutInformation.setStretch(layoutInfoNode.attribute('stretch'));
              rawLayoutInformation.setAutoScale(layoutInfoNode.attribute('autoScale'));

              rawLayoutInformation.setWantFixedPageSize(layoutInfoNode.attribute("wantFixedPageSize"));
              rawLayoutInformation.setGridChildrenInParent(layoutInfoNode.attribute('gridChildrenInParent'));
            }
            if (containerNode) {
              rawLayoutInformation.setChildOfGridChildrenInParent(containerNode.attribute('gridChildrenInParent'));
              rawLayoutInformation.setStepX(containerNode.attribute('stepX'));
              rawLayoutInformation.setStepY(containerNode.attribute('stepY'));
              rawLayoutInformation.setColumnCount(containerNode.attribute('columnCount'));
            }
            // if nothing changed, don't forget to free the event hook
            if (!doUpdate) {
              onChange();
            }
          }

          if (layoutInformation && doUpdate) {
            doUpdate = false;
            var sizePolicy = rawLayoutInformation.getSizePolicy();
            if (this.widgetsIgnoringSizePolicy.indexOf(layoutInfoNode.getTag()) !== -1) {
              sizePolicy = "initial";
            }
            if (layoutEngine && layoutEngine.setHint) {
              var widthHint = rawLayoutInformation.getWidth();
              var heightHint = rawLayoutInformation.getHeight();
              if (sizePolicy === 'fixed') {
                if (!widthHint) {
                  widthHint = rawLayoutInformation.getGridWidth();
                }
                if (!heightHint) {
                  heightHint = rawLayoutInformation.getGridHeight();
                }
              }
              layoutEngine.setHint(widthHint, heightHint);
            }

            if (layoutInformation.setMinSizeHint) {
              var minWidthHint = rawLayoutInformation.getMinWidth();
              var minHeightHint = rawLayoutInformation.getMinHeight();
              layoutInformation.setMinSizeHint(minWidthHint, minHeightHint);
            }

            var autoscale = rawLayoutInformation.getAutoScale();
            layoutInformation.setSizePolicyMode(controller.isInMatrix() || (sizePolicy === "dynamic" && autoscale) ? "fixed" :
              sizePolicy);

            doUpdate = layoutInformation.setGridWidth(rawLayoutInformation.getGridWidth(), true) || doUpdate;
            if (widget.setCols) {
              var rawWidth = rawLayoutInformation.getWidth();
              if (!rawLayoutInformation.getGridWidth() && cls.Size.isCols(rawWidth)) {
                widget.setCols(parseInt(rawWidth, 10));
              } else {
                widget.setCols(rawLayoutInformation.getGridWidth() || 1);
              }
            }
            doUpdate = layoutInformation.setGridHeight(rawLayoutInformation.getGridHeight(), true) || doUpdate;

            var position = {
              x: rawLayoutInformation.getPosX() || 0,
              y: rawLayoutInformation.getPosY() || 0
            };
            var isInNormalScrollGrid = false;
            if (containerNode && containerNode.getTag() === "Matrix") {
              var scrollGrid = containerNode.getAncestor("ScrollGrid");
              isInNormalScrollGrid = scrollGrid === null || scrollGrid.attribute("wantFixedPageSize") !== 0;
            }
            if (containerNode && (containerNode !== anchorNode) && isInNormalScrollGrid) {
              var index = anchorNode.getParentNode()._children.indexOf(anchorNode),
                columnCount = rawLayoutInformation.getColumnCount() || 1,
                stepX = (rawLayoutInformation.getStepX() || 0),
                stepY = (rawLayoutInformation.getStepY() || 0);
              var shiftX = index % columnCount;
              var shiftY = Math.floor(index / columnCount);

              position.x += (shiftX * stepX);
              position.y += (shiftY * stepY);
            }

            doUpdate = layoutInformation.setGridX(position.x, true) || doUpdate;
            doUpdate = layoutInformation.setGridY(position.y, true) || doUpdate;
            var stretch = rawLayoutInformation.getStretch();
            if (stretch) {
              var xStretching = layoutInfoNode.getTag() === "Image" ? layoutInformation.getSizePolicyConfig().mode !== "fixed" :
                true;
              layoutInformation.getStretched().setX((stretch === 'x' || stretch === 'both'));
              layoutInformation.getStretched().setY(stretch === 'y' || stretch === 'both');
            }
            if (layoutInfoNode.getTag() === "ScrollGrid" && rawLayoutInformation.getWantFixedPageSize() === 0) {
              layoutInformation.getStretched().setY(true);
            }
            var gridChildrenInParent = +(rawLayoutInformation.getGridChildrenInParent() || 0);
            if (widget.setGridChildrenInParent) {
              widget.setGridChildrenInParent(Boolean(gridChildrenInParent));
            }
            if (doUpdate) {
              layoutInformation.invalidateInfos();
            }
          }
        }
      };
    });
  });
