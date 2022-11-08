/// FOURJS_START_COPYRIGHT(D,2018)
/// Property of Four Js*
/// (c) Copyright Four Js 2018, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('OverlayService', ['InitService'],
  function(context, cls) {

    /**
     * Service to display or hide an overlay which intercepts all mouse events. Overlay can be invisible or visible (grey)
     * @namespace gbc.OverlayService
     * @gbcService
     * @publicdoc
     */
    context.OverlayService = context.oo.StaticClass( /** @lends gbc.OverlayService */ {
      __name: "OverlayService",

      /**
       * Map which contains all overlay defined during application life
       * @type {Map}
       */
      _overlayList: null,

      /**
       * Initialize the overlay management service
       */
      init: function() {
        this._overlayList = new Map();
      },

      /**
       * Create a new overlay object composed of element and custom flags
       * @returns {{timer: Function, visible: boolean, active: boolean, element: HTMLElement}}
       * @private
       */
      _create: function() {
        var overlayElement = document.createElement("div");
        overlayElement.addClasses("overlay", "hidden");
        return {
          element: overlayElement,
          active: false,
          visible: false,
          timer: null
        };
      },

      /**
       * Get the overlay associated with provided name
       * @param {string} name - overlay identifier
       * @returns {{timer: Function, visible: boolean, active: boolean, element: HTMLElement}} return overlay object
       * @publicdoc
       */
      get: function(name) {
        var overlay = this._overlayList.get(name);
        if (!overlay) { // create new overlay
          overlay = this._create();
          this._overlayList.set(name, overlay);
        }
        return overlay;
      },

      /**
       * Enable global overlay
       * @param {string} name - overlay identifier used to create and manage an associated overlay element
       * @param {HTMLElement} parentContainer - DOM element which contains overlay div. If none we add overlay directly under body
       * @publicdoc
       */
      enable: function(name, parentContainer) {
        var overlay = this.get(name);
        overlay.active = true;
        var containerElement = parentContainer || document.body;
        if (overlay.element.parentNode !== containerElement) {
          containerElement.appendChild(overlay.element);
        }
        overlay.element.removeClass("hidden");
      },

      /**
       * Disable global overlay
       * @param {string} name - overlay identifier
       * @publicdoc
       */
      disable: function(name) {
        var overlay = this.get(name);
        if (overlay.timer) {
          window.clearTimeout(overlay.timer);
          overlay.timer = null;
        }
        overlay.active = false;
        overlay.visible = false;
        overlay.element.addClass("hidden");
        overlay.element.removeClass("greybg");
      },

      /**
       * Define a cursor to put over the given overlay
       * @param {String} name - name of the overlay
       * @param {String} cursor - cursor to put over
       */
      setCursor: function(name, cursor) {
        var overlay = this.get(name);
        overlay.element.style.cursor = cursor;
      },

      /**
       * Makes overlay non transparent by setting its opacity
       * @param {string} name - overlay identifier
       * @param {boolean} visible - show/hide overlay by updating its transparency
       * @publicdoc
       */
      setOpacity: function(name, visible) {
        var overlay = this.get(name);
        if (overlay.visible !== visible) {
          overlay.visible = visible;
          if (overlay.timer) {
            window.clearTimeout(overlay.timer);
            overlay.timer = null;
          }
          if (overlay.visible) {
            overlay.timer = window.setTimeout(
              function() { // to be sure that class is added after "hidden" class is removed, else css transition doesn't work
                overlay.timer = null;
                overlay.element.addClass("greybg");
              }.bind(this), 300);
          } else {
            overlay.element.removeClass("greybg");
          }
        }
      }
    });
    context.InitService.register(context.OverlayService);
  });
