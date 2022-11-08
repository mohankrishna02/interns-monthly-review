/// FOURJS_START_COPYRIGHT(D,2019)
/// Property of Four Js*
/// (c) Copyright Four Js 2019, 2020. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('FlowItemLayoutEngine', ['LayoutEngineBase'],
  function(context, cls) {

    /**
     * Layout engine for items in flowing container
     * This is empty, just to use measurement mechanism of items
     * @class FlowItemLayoutEngine
     * @memberOf classes
     * @extends classes.LayoutEngineBase
     */
    cls.FlowItemLayoutEngine = context.oo.Class(cls.LayoutEngineBase, function($super) {
      return /** @lends classes.FlowItemLayoutEngine.prototype */ {
        __name: "FlowItemLayoutEngine",

      };
    });
  });
