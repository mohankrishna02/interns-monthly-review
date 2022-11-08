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

modulum('NoLayoutEngine', ['LayoutEngineBase'],
  function(context, cls) {
    /**
     * @class NoLayoutEngine
     * @memberOf classes
     * @extends classes.LayoutEngineBase
     */
    cls.NoLayoutEngine = context.oo.Class(cls.LayoutEngineBase, function($super) {
      return /** @lends classes.NoLayoutEngine.prototype */ {
        __name: "NoLayoutEngine"
      };
    });
  });
