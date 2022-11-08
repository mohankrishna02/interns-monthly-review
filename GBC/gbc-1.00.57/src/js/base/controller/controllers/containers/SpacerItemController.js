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

modulum('SpacerItemController', ['ControllerBase', 'ControllerFactory'],
  function(context, cls) {
    /**
     * @class SpacerItemController
     * @memberOf classes
     * @extends classes.ControllerBase
     */
    cls.SpacerItemController = context.oo.Class(cls.ControllerBase, function($super) {
      return /** @lends classes.SpacerItemController.prototype */ {
        __name: "SpacerItemController",

      };
    });
    cls.ControllerFactory.register("SpacerItem", cls.SpacerItemController);

  });
