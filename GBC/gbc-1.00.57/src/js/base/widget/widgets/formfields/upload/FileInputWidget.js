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

modulum('FileInputWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Upload widget.
     * @class FileInputWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     * @publicdoc Widgets
     */
    cls.FileInputWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.FileInputWidget.prototype */ {
        __name: "FileInputWidget",

        $static: /** @lends classes.FileInputWidget */ {
          statusChangedEvent: "statusChanged",
          fileSelectionChangedEvent: "fileSelectionChanged",
          progressChangedEvent: "progressChanged"
        },

        _allowMultipleFiles: false,
        /** @type {?string} */
        _rawCaption: null,

        _files: null,

        /**
         * @type {HTMLElement}
         */
        _hiddenInput: null,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._hiddenInput = this._element.querySelector("input");
          this._element.on("click.FileInputWidget", this._onClick.bind(this));
          this._element.on("drop.FileInputWidget", this._onDrop.bind(this));
          this._element.on("dragenter.FileInputWidget", this._onDragEnter.bind(this));
          this._element.on("dragleave.FileInputWidget", this._onDragLeave.bind(this));
          this._element.on("dragover.FileInputWidget", this._onDragOver.bind(this));
          this._element.on("mouseover.FileInputWidget", this._onMouseOver.bind(this));
          this._element.on("mouseout.FileInputWidget", this._onMouseOut.bind(this));
          this._hiddenInput.on("change.FileInputWidget", this._onFileChanged.bind(this));
          this.setCaption();
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._hiddenInput = null;
          this._element.off("click.FileInputWidget");
          this._element.off("drop.FileInputWidget");
          this._element.off("dragenter.FileInputWidget");
          this._element.off("dragleave.FileInputWidget");
          this._element.off("dragover.FileInputWidget");
          this._element.off("mouseover.FileInputWidget");
          this._element.off("mouseout.FileInputWidget");
          $super.destroy.call(this);
        },

        /**
         * Internal click handler to trigger the input file
         * @private
         */
        _onClick: function() {
          this._hiddenInput.click();
        },

        /**
         * Handler when a file is dropped on the zone
         * @param {MouseEvent} event
         * @private
         */
        _onDrop: function(event) {
          this._element.removeClass("dropping");
          event.stopPropagation();
          event.stopImmediatePropagation();
          event.preventCancelableDefault();
          this._files = event.dataTransfer.files;
          this._onFileChanged();
        },

        /**
         * Handler on drag enter the zone
         * @param {Object} event - DOM event
         * @private
         */
        _onDragEnter: function(event) {
          this._element.addClass("dropping");
        },

        /**
         * Handler on drag leave the zone
         * @param {Object} event - DOM event
         * @private
         */
        _onDragLeave: function(event) {
          this._element.removeClass("dropping");
        },

        /**
         * Handler while dragging over the zone
         * @param {MouseEvent} event
         * @private
         */
        _onDragOver: function(event) {
          this._element.addClass("dropping");
          event.stopPropagation();
          event.stopImmediatePropagation();
          event.preventCancelableDefault();
          try {
            var effects = event && event.dataTransfer && !window.browserInfo.isIE && event.dataTransfer.effectAllowed;
            event.dataTransfer.dropEffect = 'move' === effects || 'linkMove' === effects ? 'move' : 'copy';
          } catch (e) {}
        },

        /**
         * Handler when mouse is over the drop zone
         * @param {Object} event - DOM event
         * @private
         */
        _onMouseOver: function(event) {
          this._element.addClass("dropping");
        },

        /**
         * Handler when mouse leaves the drop zone
         * @param {Object} event - DOM event
         * @private
         */
        _onMouseOut: function(event) {
          this._element.removeClass("dropping");
        },

        /**
         * Handler when the file has changed
         * @private
         */
        _onFileChanged: function() {
          var result, i;
          if (this._allowMultipleFiles) {
            result = [];
            if (this._files) {
              for (i = 0; i < this._files.length; i++) {
                if (this._files[i]) {
                  result.push(this._files[i].name);
                }
              }
            }
            if (this._hiddenInput.files) {
              for (i = 0; i < this._hiddenInput.files.length; i++) {
                if (this._hiddenInput.files[i]) {
                  result.push(this._hiddenInput.files[i].name);
                }
              }
            }
          } else {
            if (this._files && this._files[0] && this._files[0].name) {
              result = this._files[0].name;
            }
            if (this._hiddenInput.files && this._hiddenInput.files[0] && this._hiddenInput.files[0].name) {
              result = this._hiddenInput.files[0].name;
            }
          }
          if (result) {
            this.emit(cls.FileInputWidget.fileSelectionChangedEvent, result);
          }
        },

        /**
         * Set file extension to filter allowed files
         * @param {string} extension - allowed extension
         * @publicdoc
         */
        setExtension: function(extension) {
          if (extension !== ".*") {
            this._hiddenInput.setAttribute("accept", extension);
          }
        },

        /**
         * Set the caption for file upload
         * @param {string} caption - Caption to display
         * @publicdoc
         */
        setCaption: function(caption) {
          this._rawCaption = caption;
          this._updateCaption();
        },

        /**
         * Internal method to set the caption, or fallback on i18n one
         * @private
         */
        _updateCaption: function() {
          if (this._rawCaption) {
            this._element.querySelector("span").textContent = this._rawCaption;
          } else {
            this._element.querySelector("span").textContent = (this._allowMultipleFiles ? i18next.t(
              "gwc.file.upload.droporclick-multiple") : i18next.t("gwc.file.upload.droporclick"));
          }
        },

        /**
         * Allows multiple files to be uploaded at once
         * @param {boolean} allow - true to allow multiple files, false otherwise
         * @publicdoc
         */
        allowMultipleFiles: function(allow) {
          this._allowMultipleFiles = Boolean(allow);
          if (allow) {
            this._hiddenInput.setAttribute("multiple", "multiple");
          } else {
            this._hiddenInput.removeAttribute("multiple");
          }
          this._updateCaption();
        },

        /**
         * Check if multiple files can be uploaded at once
         * @returns {boolean} true if allow multi-upload, false otherwise
         * @publicdoc
         */
        isAllowMultipleFiles: function() {
          return this._allowMultipleFiles;
        },

        /**
         * Event handler called when the files selection has changed
         * @param {function} hook - callback once event is triggered
         * @return {*|HandleRegistration}
         */
        whenFileSelectionChanged: function(hook) {
          return this.when(cls.FileInputWidget.fileSelectionChangedEvent, hook);
        },

        /**
         * Send files to the VM.
         * If you don't understand this method, please don't change it
         * @param {String} filename
         * @param {String} url
         * @param {function} callback - function called when done
         * @param {function} errorCallback - function called when error occurs
         */
        send: function(filename, url, callback, errorCallback) {
          var formData = null,
            i, file;
          if (this._files) {
            formData = new FormData();
            for (i = 0; i < this._files.length; ++i) {
              file = this._files[i];
              if (file.name === filename) {
                formData.append(file.name, file);
                break;
              }
              //TODO : manage multifile support
            }
          } else {
            formData = new FormData();
            var files = this._element.querySelector("form").file.files;
            for (i = 0; i < files.length; ++i) {
              file = files[i];
              if (file.name === filename) {
                formData.append(file.name, file);
                break;
              }
              //TODO : manage multifile support
            }
          }
          var request = new XMLHttpRequest();
          if (context.ThemeService.getValue("theme-network-use-credentials-headers")) {
            request.withCredentials = true;
          }
          request.onload = function() {
            callback();
          }.bind(this);
          request.onerror = function() {
            errorCallback();
          };
          request.open("POST", url);
          request.send(formData);
        }
      };
    });
    cls.WidgetFactory.registerBuilder('FileInput', cls.FileInputWidget);
  });
