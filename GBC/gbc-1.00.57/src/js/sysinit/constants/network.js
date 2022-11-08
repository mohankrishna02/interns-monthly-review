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
/**
 * @namespace gbc.constants.network
 */
gbc.constants.network = {
  /**
   * The different headers used by the protocol
   */
  headers: {
    error: "X-FourJs-Error",
    prompt: "X-FourJs-Prompt",
    session: "X-FourJs-Id",
    server: "X-FourJs-Server",
    serverFeatures: "X-FourJs-Server-Features",
    application: "X-FourJs-AppId",
    timeout: "X-FourJs-Timeout",
    webComponent: "X-FourJs-WebComponent",
    newTask: "X-FourJs-NewTask",
    vmReady: "X-FourJs-VmReady",
    closed: "X-FourJs-Closed",
    endUrl: "X-FourJs-End-Url",
    sessionClosed: "X-FourJs-Session-Closed",
    devmode: "X-FourJs-Development",
    contentType: "Content-Type"
  },

  /**
   * Enum RequestType
   * The type of request used in the VM protocol's header
   */
  requestType: {
    AUI: 1,
    Ping: 2,
    Interrupt: 3,
    Close: 4,
    FT: 5
  },
  /**
   * The needed stater response headers
   */
  startHeaders: {
    session: {
      error: "Missing Session ID"
    },
    timeout: {
      error: "Missing Timeout"
    },
    webComponent: {
      prop: "webComponent",
      error: "Missing WebComponent Path"
    }
  },
  sentHeaders: {
    "X-FourJs-Client": "GBC/" + encodeURIComponent(gbc.version) + "-" + gbc.build,
    "X-FourJs-Client-Features": "prompt"
  }
};

/**
 * Array RequestTypeStrings
 * Associate a string to each RequestType. For logging purpose.
 */
gbc.constants.network.requestTypeStrings = Object.swap(gbc.constants.network.requestType);
