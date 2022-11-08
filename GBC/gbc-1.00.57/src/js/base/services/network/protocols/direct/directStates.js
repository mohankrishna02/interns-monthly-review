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

(
  /**
   * @param {gbc} context
   */
  function(context) {
    context.constants.network.directStates = [{
      name: "run",
      from: "none",
      to: "Start"
    }, {
      name: "start",
      from: "Start",
      to: "RecvInitialAUI"
    }, {
      name: "waitForMoreInitialAUI",
      from: "RecvInitialAUI",
      to: "SendEmpty"
    }, {
      name: "getMoreOrder",
      from: "SendEmpty",
      to: "RecvOrder"
    }, {
      name: "guiMode",
      from: ["RecvInitialAUI", "RecvOrder"],
      to: "GUI"
    }, {
      name: "sendOrder",
      from: "GUI",
      to: "SendOrder"
    }, {
      name: "getOrderAnswer",
      from: "SendOrder",
      to: "RecvOrder"
    }, {
      name: "waitForMoreOrder",
      from: "RecvOrder",
      to: "SendEmpty"
    }, {
      name: "waitForEnd",
      from: ["ApplicationEnding", "GUI", "SendHandShake"],
      to: "ApplicationEnding"
    }, {
      name: "endApp",
      from: ["SendStart", "SendStartTask", "SendHandShake", "GUI", "SendEmpty", "SendOrder", "ApplicationEnding"],
      to: "ApplicationEnd"
    }];
  })(gbc);
