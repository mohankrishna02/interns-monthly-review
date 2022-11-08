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

modulum('FileTransferApplicationService', ['ApplicationServiceBase', 'ApplicationServiceFactory'],
  function(context, cls) {
    /**
     * Base class of application scoped services
     * @class FileTransferApplicationService
     * @memberOf classes
     * @extends classes.ApplicationServiceBase
     */
    cls.FileTransferApplicationService = context.oo.Class(cls.ApplicationServiceBase, function($super) {
      return /** @lends classes.FileTransferApplicationService.prototype */ {
        __name: "FileTransferApplicationService",
        /**
         * @type {Object<string, Array<FilePickerWidget>>}
         */
        _fileChoosers: null,
        /**
         * @inheritDoc
         */
        constructor: function(app) {
          $super.constructor.call(this, app);
          this._fileChoosers = {};
        },
        /**
         * Handler raised on file pick
         * @param callback
         * @param errorCallback
         * @param event
         * @param src
         * @param data
         * @private
         */
        _whenFileSelectionChanged: function(callback, errorCallback, event, src, data) {
          var hasData = false;
          var normalizedFileName = "";
          if (data) {
            if (Array.isArray(data)) {
              if (data.length) {
                hasData = true;
                for (var i = 0; i < data.length; i++) {
                  // normalize() converts 2 combined diacritical marks into 1 (ex: é encoded as e')
                  // For exemple under Safari a file with name 'Qualité.pdf' has a length of 12 while under
                  // chrome length will be 11 because of the special accent char : é
                  // for this reason we need to normalize our file name.
                  // ! IE11 doesn't support normalize.
                  var fileName = data[i];
                  normalizedFileName = fileName.normalize ? fileName.normalize() : fileName;
                  this._fileChoosers[normalizedFileName] = this._fileChoosers[normalizedFileName] || [];
                  this._fileChoosers[normalizedFileName].push(src);
                  src._processing = true;
                }
              } else {
                src.destroy();
              }
            } else {
              hasData = true;
              // cf previous comment of normalize()
              normalizedFileName = data.normalize ? data.normalize() : data;
              this._fileChoosers[normalizedFileName] = this._fileChoosers[normalizedFileName] || [];
              this._fileChoosers[normalizedFileName].push(src);
              src._processing = true;
            }
            if (hasData) {
              src.when(context.constants.widgetEvents.destroyed, this._onFilePickerDestroyed.bind(this, src), true);
            }
            callback(data);
          } else {
            src.destroy();
            callback("");
          }
        },
        /**
         * manage openFile frontcall
         * @param options
         * @param callback
         * @param errorCallback
         */
        openFile: function(options, callback, errorCallback) {
          var filePicker = cls.WidgetFactory.createWidget("FilePicker", {
            appHash: this._application.applicationHash
          });
          this._application.layout.afterLayout(function() {
            filePicker.resizeHandler();
          });
          this._application.getUI().getWidget().getElement().appendChild(filePicker.getElement());
          filePicker.setExtension(this._extractExtensions(options && options.wildcards || ""));
          filePicker.setCaption(options && options.caption || "");
          filePicker.show();
          filePicker.whenFileSelectionChanged(this._whenFileSelectionChanged.bind(this, callback, errorCallback));
        },
        /**
         * manage openFiles frontcall
         * @param options
         * @param callback
         * @param errorCallback
         */
        openFiles: function(options, callback, errorCallback) {
          var filePicker = cls.WidgetFactory.createWidget("FilePicker", {
            appHash: this._application.applicationHash
          });
          this._application.layout.afterLayout(function() {
            filePicker.resizeHandler();
          });
          this._application.getUI().getWidget().getElement().appendChild(filePicker.getElement());
          filePicker.setExtension(this._extractExtensions(options && options.wildcards || ""));
          filePicker.setCaption(options && options.caption || "");
          filePicker.allowMultipleFiles(true);
          filePicker.show();
          filePicker.whenFileSelectionChanged(this._whenFileSelectionChanged.bind(this, callback, errorCallback));
        },
        /**
         * getFile method executed on getfile frontcall call
         * @param options
         * @param callback
         * @param errorCallback
         */
        getFile: function(options, callback, errorCallback) {
          var filePicker;
          // cf previous comment of normalize() in _whenFileSelectionChanged function definition
          var normalizedFileName = options.filename.normalize ? options.filename.normalize() : options.filename;
          var onSuccess = function() {
              if (filePicker._processing) {
                this._application.getMenu("uploadStatus").setIdle();
              }
              callback();
              filePicker.freeFile(normalizedFileName, true);
              if (this._fileChoosers[normalizedFileName]) {
                this._fileChoosers[normalizedFileName].remove(filePicker);
              }
            }.bind(this),
            onError = function() {
              if (filePicker._processing) {
                this._application.getMenu("uploadStatus").setIdle();
              }
              errorCallback();
              filePicker.freeFile(normalizedFileName, true);
              if (this._fileChoosers[normalizedFileName]) {
                this._fileChoosers[normalizedFileName].remove(filePicker);
              }
            }.bind(this),
            onFile = function(file) {
              if (!file) {
                onError();
              } else {
                this._application.getMenu("uploadStatus").setProcessing();
                var url = options.fileTransferUrl;
                filePicker.send(file, url, onSuccess, onError);
              }
            }.bind(this);
          if (this._fileChoosers[normalizedFileName] && this._fileChoosers[normalizedFileName].length) {
            filePicker = this._fileChoosers[normalizedFileName].shift();
            onFile(normalizedFileName);
          } else {
            filePicker = cls.WidgetFactory.createWidget("FilePicker", {
              appHash: this._application.applicationHash
            });
            this._application.layout.afterLayout(function() {
              filePicker.resizeHandler();
            });
            this._application.getUI().getWidget().getElement().appendChild(filePicker.getElement());
            filePicker.setExtension("." + normalizedFileName.split('.').pop());
            filePicker.show();
            filePicker.whenFileSelectionChanged(this._whenFileSelectionChanged.bind(this, onFile, onError));
          }
        },
        /**
         * @inheritDoc
         */
        destroy: function() {
          var destroyable = [],
            keys = Object.keys(this._fileChoosers),
            len = keys.length,
            k = 0,
            i = 0;
          for (; k < len; k++) {
            while (this._fileChoosers[k] && this._fileChoosers[k][i]) {
              if (!destroyable.contains(this._fileChoosers[k][i])) {
                destroyable.push(this._fileChoosers[k][i]);
              }
              i++;
            }
          }
          len = destroyable.length;
          for (k = 0; k < len; k++) {
            destroyable[k].destroy();
          }
          $super.destroy.call(this);
        },

        /**
         * free resources when a file picker is destroyed
         * @param {classes.FilePickerWidget} picker
         * @private
         */
        _onFilePickerDestroyed: function(picker) {
          var files = picker && picker.getAvailableFiles();
          if (files) {
            for (var i = 0; i < files.length; i++) {
              if (this._fileChoosers[files[i]]) {
                this._fileChoosers[files[i]].remove(picker);
              }
            }
          }
        },

        /**
         * format extensions
         * @param {string} raw
         * @return {string}
         * @private
         */
        _extractExtensions: function(raw) {
          var regex = /[^\s]*(\.[^.\s]+)/g,
            m, res = [];
          while ((m = regex.exec(raw)) !== null) {
            var ext = m[1];
            if (ext === ".*") {
              res.length = 0;
              break;
            }
            res.push(ext);
          }
          return res.join(",") || "";
        }
      };
    });
    cls.ApplicationServiceFactory.register("FileTransfer", cls.FileTransferApplicationService);
  });
