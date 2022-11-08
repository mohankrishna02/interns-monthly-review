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

modulum('FrontCallService.modules.webcomponent', ['FrontCallService'],
  function(context, cls) {
    /**
     * Service to handle Webcomponent's FrontCalls
     * @instance webcomponent
     * @memberOf gbc.FrontCallService.modules
     */
    context.FrontCallService.modules.webcomponent = /** @lends gbc.FrontCallService.modules.webcomponent */ {

      /**
       * Call a method inside the webcomponent
       */
      call: function() {
        if (arguments.length > 1) {
          var webComponentTarget = arguments[0];
          var functionName = arguments[1];

          var parameters = new Array(arguments.length - 2);
          for (var i = 2; i < arguments.length; ++i) {
            parameters[i - 2] = arguments[i];
          }

          // Once we've managed Orders
          var orderManagedHandle = this.getAnchorNode().getApplication().dvm.onOrdersManaged(function() {
            orderManagedHandle();
            var app = this.getAnchorNode().getApplication();

            //search for the target Node
            var currentWindow = app.getNode(app.uiNode().attribute('currentWindow'));
            var forms = currentWindow.getChildren('Form');
            var currentForm;
            for (i = forms.length - 1; i >= 0; --i) {
              var form = forms[i];
              if (!form.attribute('hidden')) {
                currentForm = form;
                break;
              }
            }
            var targetNode = currentForm.findNodeWithAttribute('FormField', 'name', webComponentTarget);

            var widget = targetNode.getController().getWidget();

            var process = function(widget, functionName, parameters) {
              var ret = '';
              try {
                var fct = widget._iframeElement.contentWindow[functionName];
                if (typeof(fct) === 'function') {
                  ret = fct.apply(null, parameters);
                } else {
                  this.runtimeError('No function [' + functionName + '] defined in this webcomponent.');
                }
              } catch (e) {
                this.runtimeError(e.message);
              }
              this.setReturnValues([ret]);
            }.bind(this);

            // If the webcomponent is ready
            if (widget._isReady) {
              process(widget, functionName, parameters);
            } else {
              // Otherwise, we wait that it becomes ready
              var readyHandle = widget.when(context.constants.widgetEvents.ready, function() {
                readyHandle();
                process(widget, functionName, parameters);
              }.bind(this));
            }
          }.bind(this));
        } else {
          this.runtimeError('No webcomponent or function name provided');
        }
      },

      /**
       * Get the frontcall Api version
       * @returns {string[]}
       */
      frontCallAPIVersion: function() {
        return [cls.WebComponentWidget.gICAPIVersion];
      },

      /**
       * Get the window title of the webcomponent
       * @param webComponentTarget
       * @returns {string[]}
       */
      getTitle: function(webComponentTarget) {
        if (webComponentTarget) {
          var targetNode = this.getAnchorNode().getApplication().model.getNodeByAttribute('name', webComponentTarget);
          var domElement = targetNode.getController().getWidget()._iframeElement;
          try {
            return [domElement.contentWindow.document.title];
          } catch (e) {
            this.runtimeError(e.message);
          }
        } else {
          this.runtimeError('No webcomponent name provided');
        }
      }
    };
  }
);
