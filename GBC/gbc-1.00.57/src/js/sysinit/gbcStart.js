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

/*
 starter for gbc environment
 script has to be the last to load to run the environment
 */

(function(context) {
  context.gbcWrapper.__prepare();
  context.gbcWrapper.on(context.gbcWrapper.events.READY, function() {
    context.gbc.run(function() {
      context.gbcWrapper.__gbcReady();
    });
  });
})(window);
