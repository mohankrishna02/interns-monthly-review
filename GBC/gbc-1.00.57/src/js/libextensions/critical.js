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

/**
 * Display a message as a critical error in an old console style
 * @param {string} message the message to display
 */
window.critical = function(message) {
  this.message = message;
  this._decorated = window.location.search.toLowerCase().indexOf("debugmode=1") >= 0;
  this._prepareStyle();
  document.body.innerHTML = "<div id='critical-overlay'></div><div id='term'>\n" + this._prepareMessage() +
    "</div>";
};
/**
 * shortcut method
 * @param {string} message the message to display
 * @return {Window.critical}the critical instance
 */
window.critical.display = function(message) {
  return new window.critical(message);
};

window.critical.prototype = {

  /**
   * prepare css style of critical error
   * @private
   */
  _prepareStyle: function() {
    var link = document.createElement("style");
    if (this._decorated) {
      link.innerHTML =
        "* {margin: 0;padding: 0;outline: none;font-family:monospace;}" +
        "html,body{width:100%;height:100%;margin:0;padding:0;border:0;background:#000;color:lime;}" +
        "body{box-shadow: 0 0 1px 3px rgba(10, 10, 10, .7);overflow: hidden;user-select: none;}" +
        "body:before{width: 100%;height: 100%;position: absolute;" +
        "background-color: #000;background: linear-gradient(#fff 50%, #000 50%);background-size: 100% 4px;background-repeat: repeat-y;" +
        "opacity: .14;box-shadow: inset 0 0 10px 10px rgba(0, 0, 0, .8);z-index: 12;animation: pulse 5s linear infinite;content: '';}" +
        "body:after{content:'';width: 100%;height: 100%;background-color: #00ff77;background: radial-gradient(ellipse at center, rgba(0,0,0,1) 0%,rgba(0,0,0,0.62) 45%,rgba(0,9,4,0.6) 47%,rgba(0,255,119,1) 100%);opacity: .1;z-index: 11;}" +
        "#term{text-align:center;position: absolute;top: 0px;left: 0px;bottom: -1px;right: -10px;overflow: hidden;z-index: 1;font-size:1.4em;padding:2em;white-space:pre;background: radial-gradient(ellipse at center, rgba(0,255,119,0.45) 0%,rgba(255,255,255,0) 100%);transform-origin: 50% 50%;transform: perspective(200px) rotateX(.1deg) skewX(1deg) scale(1.02);opacity: .9;}" +
        "#critical-overlay {width: 100%;height: 100%;position: absolute;left: 0;top: 0;margin-left: 0;margin-top: 0;z-index: 100;}" +
        "#critical-overlay:before {content: '';position: absolute;top: 0;left: 0;width: 100%;height: 50px;background: #fff;background: linear-gradient(to bottom, rgba(255,0,0,0) 0%,rgba(255,250,250,1) 50%,rgba(255,255,255,0.98) 51%,rgba(255,0,0,0) 100%);opacity: .02;animation: vline 1.25s linear infinite;}" +
        "@keyframes pulse {0% {transform: scale(1.001);opacity: .14;}8% {transform: scale(1.000);opacity: .13;}" +
        "15% {transform: scale(1.004);opacity: .14;}30% {transform: scale(1.002);opacity: .11;}" +
        "100% {transform: scale(1.000);opacity: .14;}}" +
        "@keyframes vline {0% {top: 0px;}100% {top: 100%;}}";
    } else {
      link.innerHTML =
        "* {margin: 0;padding: 0;outline: none;font-family:monospace;}" +
        "html,body{width:100%;height:100%;margin:0;padding:0;border:0;text-align:center;}" +
        "#term{white-space:pre;}";
    }
    document.head.appendChild(link);
  },

  /**
   *  console style full line template
   */
  _line: "#".repeat(80) + "\n",

  /**
   *  console style empty line template
   */
  _empty: "#" + " ".repeat(78) + "#\n",

  /**
   * get a console styled formatted text
   * @param {string} text text to display in line
   * @param {number} size size of alignment text
   * @return {string} the console styled text
   * @private
   */
  _prepareLine: function(text, size) {
    var before = Math.floor((78 - size) / 2),
      after = 78 - text.length - before;
    return "#" + " ".repeat(before) + text + " ".repeat(after) + "#\n";
  },
  /**
   * get a full text message in a console style
   * @return {string} the text to display
   * @private
   */
  _prepareMessage: function() {
    var msg = this.message.match(/.{1,76}/g),
      size = Math.max.apply(null, msg.map(function(item) {
        return item.length;
      })),
      text = "\n",
      i = 0,
      before = Math.max(Math.floor((19 - msg.length) / 2), 1),
      after = Math.max(19 - msg.length - before, 1);
    text += this._line;
    for (; i < before; i++) {
      text += this._empty;
    }
    text += this._prepareLine("Genero Browser Client", 21);
    text += this._prepareLine("---------------------", 21);
    text += this._empty;
    for (i = 0; i < msg.length; i++) {
      text += this._prepareLine(msg[i], size);
    }

    for (i = 0; i < after; i++) {
      text += this._empty;
    }
    text += this._prepareLine("See browser's console for details.", 33);
    text += this._empty;
    text += this._line;
    return text;
  }
};
