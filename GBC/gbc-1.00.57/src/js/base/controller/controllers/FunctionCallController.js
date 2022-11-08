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

modulum('FunctionCallController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * FunctionCallController
     * This handle any function call from the VM
     * @class FunctionCallController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.FunctionCallController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.FunctionCallController.prototype */ {
        __name: 'FunctionCallController',

        /**
         * @inheritDoc
         */
        constructor: function(bindings) {
          $super.constructor.call(this, bindings);
          context.FrontCallService.setFunctionCallProcessing(true);

          var functionCallNode = this.getAnchorNode(),
            app = functionCallNode.getApplication();

          var moduleName = functionCallNode.attribute('moduleName').toLowerCase();
          var functionName = functionCallNode.attribute('name').toLowerCase();

          if (app.applicationInfo.ignoreFrontcallModules && app.applicationInfo.ignoreFrontcallModules.indexOf(moduleName) >= 0) {
            this.setReturnValues([]);
          } else if (context.__wrapper.isNative() && !context.__wrapper.isFrontcallURForced(moduleName, functionName)) {
            context.__wrapper.frontcall(functionCallNode.getId(), function(nativeResult) {
              if (nativeResult.status === cls.VMFunctionCallEvent.success) {
                this.setReturnValues(nativeResult.result instanceof Array ? nativeResult.result : [nativeResult.result]);
              } else if (nativeResult.status === cls.VMFunctionCallEvent.unknownModule ||
                nativeResult.status === cls.VMFunctionCallEvent.unknownFunction) {
                this.browserFrontcall(moduleName, functionName, app);
              } else if (nativeResult.status === cls.VMFunctionCallEvent.stackError) {
                this.parametersError(nativeResult.errorMessage);
              } else {
                this.runtimeError(nativeResult.errorMessage);
              }
            }.bind(this));
          } else {
            this.browserFrontcall(moduleName, functionName, app);
          }
        },

        browserFrontcall: function(moduleName, functionName, app) {
          var module = context.FrontCallService.modules[moduleName];
          if (module) {
            var moduleFunction = module[functionName];
            if (moduleFunction) {
              var result = moduleFunction.apply(this, this._parseArgs());
              // If the return value of the front call isn't an array (undefined),
              // it is up to the front-call to invoke this.setReturnValues
              // This is to implement asynchonous front-calls
              if (Array.isArray(result)) {
                this.setReturnValues(result);
              }
            } else {
              app.dvm.afterManagingCurrentOrders(function() {
                app.typeahead.functionCallResult(cls.VMFunctionCallEvent.unknownFunction);
              }.bind(this));
            }
          } else {
            app.dvm.afterManagingCurrentOrders(function() {
              app.typeahead.functionCallResult(cls.VMFunctionCallEvent.unknownModule);
            }.bind(this));
          }
        },

        /**
         * This node doesn't need to create a widget
         * @return {null}
         * @private
         */
        _createWidget: function() {
          return null;
        },

        /**
         * Parse arguments of a functionCall
         * @return {Array} - List of the parsed parameters
         * @private
         */
        _parseArgs: function() {
          var functionCallNode = this.getAnchorNode();
          var paramNodes = functionCallNode.getChildren();
          var params = [];
          for (var i = 0; i < paramNodes.length; ++i) {
            var paramNode = paramNodes[i];
            if (paramNode.getTag() === 'FunctionCallParameter') {
              if (paramNode.attribute('isNull')) {
                params.push(null);
              } else {
                var dataType = paramNode.attribute('dataType');
                var value = paramNode.attribute('value');
                if (dataType === 'INTEGER' || dataType === 'SMALLINT') {
                  params.push(parseInt(value, 10));
                } else if (dataType === 'FLOAT' || dataType === 'DOUBLE') {
                  params.push(parseFloat(value));
                } else if (dataType === 'RECORD') {
                  params.push(JSON.parse(value));
                } else if (dataType.indexOf('ARRAY') >= 0) {
                  params.push(JSON.parse(value));
                } else {
                  params.push(value);
                }
              }
            }
          }
          return params;
        },

        /**
         * The front call may call this method if a wrong number of parameters is given
         * @param message error message
         */
        parametersError: function(message) {
          var functionCallNode = this.getAnchorNode(),
            app = functionCallNode.getApplication();
          var moduleName = functionCallNode.attribute("moduleName");
          var functionName = functionCallNode.attribute("name");
          var msg = "Wrong number of parameters when invoking '" + moduleName + "." + functionName + "'";
          if (message) {
            msg += ':\n' + message;
          }
          app.dvm.afterManagingCurrentOrders(function() {
            app.typeahead.functionCallResult(cls.VMFunctionCallEvent.stackError, msg);
          });
        },

        /**
         * The front call may call this method in case of runtime errors
         * @param message error message
         */
        runtimeError: function(message) {
          var functionCallNode = this.getAnchorNode(),
            app = functionCallNode.getApplication();
          var moduleName = functionCallNode.attribute('moduleName');
          var functionName = functionCallNode.attribute('name');
          var msg = "Runtime error when invoking '" + moduleName + "." + functionName + "'";
          if (message) {
            msg += ':\n' + message;
          }
          app.dvm.afterManagingCurrentOrders(function() {
            app.typeahead.functionCallResult(cls.VMFunctionCallEvent.functionError, msg);
          });
        },

        /**
         * The front call may call this method to set the return values in asynchronous mode
         * @param result list of result values
         */
        setReturnValues: function(result) {
          for (var i = 0; i < result.length; ++i) {
            if (typeof result[i] === 'object') {
              result[i] = JSON.stringify(result[i]);
            }
          }
          var functionCallNode = this.getAnchorNode(),
            app = functionCallNode.getApplication();

          app.dvm.afterManagingCurrentOrders(function() {
            app.typeahead.functionCallResult(cls.VMFunctionCallEvent.success, null, result);
          });

        }
      };
    });
    cls.ControllerFactory.register('FunctionCall', cls.FunctionCallController);
  });
