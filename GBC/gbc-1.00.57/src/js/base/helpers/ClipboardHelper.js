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

modulum('ClipboardHelper',
  function(context, cls) {

    /**
     * Helper to use clipboard
     * @namespace classes.ClipboardHelper
     */
    cls.ClipboardHelper = context.oo.StaticClass(function() {
      return /** @lends classes.ClipboardHelper */ {
        __name: "ClipboardHelper",

        /**
         * Copy text to clipboard
         * Copies a string to the clipboard. Must be called from within an
         * event handler such as click. May return false if it failed, but
         * this is not always possible. Browser support for Chrome 43+,
         * Firefox 42+, Safari 10+, Edge and IE 10+.
         * IE: The clipboard feature may be disabled by an administrator. By
         * default a prompt is shown the first time the clipboard is
         * used (per session).
         * @param text text to copy
         * @param focusElement if !== null after copy the focus will be set on this element
         * @param callback function
         */
        copyTo: function(text, focusElement, callback) {
          var useModalWindow = false;
          if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            window.clipboardData.setData("Text", text);

          } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            if (text === "") {
              text = " "; // use space string to clean clipboard else it does nothing
            }
            textarea.textContent = text;
            textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
              var ret = document.execCommand("copy"); // Security exception may be thrown by some browsers
              useModalWindow = !ret;
            } catch (ex) {
              console.warn("Copy to clipboard failed.", ex);
            } finally {
              document.body.removeChild(textarea);
            }
          }

          // Fallback if copy failed
          if (useModalWindow) {
            this._copyToUsingModal(text, focusElement, callback);
          } else {
            if (focusElement) {
              focusElement.domFocus();
            }
            if (callback) {
              callback(true);
            }
          }
        },

        /** Use modal window with a textarea to copy to clipboard
         *
         * @param text text to copy
         * @param focusElement if !== null after copy the focus will be set on this element
         * @param callback function
         */
        _copyToUsingModal: function(text, focusElement, callback) {

          var modal = cls.WidgetFactory.createWidget("Modal", {
            appHash: gbc.systemAppId
          });

          modal._gbcSystemModal();
          modal.copyOk = false;

          modal.setClosable(true, true, true);

          var title = cls.WidgetFactory.createWidget("Label", {
            appHash: gbc.systemAppId
          });
          title.setValue(i18next.t("gwc.clipboard.title"));

          var textarea = document.createElement("textarea");
          textarea.textContent = text;
          textarea.readOnly = true;
          textarea.rows = 10;
          textarea.style.width = "100%";

          textarea.on('keydown.ClipboardHelper', function(event) {
            var char = String.fromCharCode(event.which || event.keyCode); // select all
            if (char.toLowerCase() === 'c' && (event.ctrlKey === true || event.metaKey === true)) {
              // destroy modal in a requestAnimationFrame to be sure browser has the time to do "copy"
              window.requestAnimationFrame(function() {
                modal.copyOk = true;
                modal.hide();
              }.bind(this));
            }
          }.bind(this));
          modal.getElement().querySelector(".mt-dialog-content").addClasses("mt-field", "gbc_textEditWidget");
          modal.setHeader(title.getElement());
          modal.setContent(textarea);

          document.body.appendChild(modal.getElement());

          textarea.domFocus();

          modal.onClose(function() { // on close focus element and call callback function
            title.destroy();
            modal.destroy();

            textarea.off('keydown.ClipboardHelper');
            if (focusElement) {
              focusElement.domFocus();
            }
            if (callback) {
              callback(modal.copyOk);
            }
          }.bind(this), true);

          modal.show();
          textarea.select();
        }
      };
    });
  });
