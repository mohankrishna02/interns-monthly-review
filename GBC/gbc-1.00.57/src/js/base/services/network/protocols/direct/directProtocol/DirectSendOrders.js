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
  function(context, cls) {
    /**
     * @class DirectSendOrders
     * @memberOf classes
     */
    cls.DirectSendOrders = context.oo.StaticClass(
      /** @lends classes.DirectSendOrders */
      {
        run: function(orders, application, directInterface) {
          var data = cls.AuiProtocolWriter.translate({
              type: "om",
              order: application.info().auiOrder++,
              orders: orders
            }, application),
            options = {};
          if (orders.find(function(item) {
              return item.noUserActivity;
            })) {
            options = {
              userActivity: "no"
            };
          }
          application.model.logFireEvent(data);
          directInterface.write(data, options);
        }
      });
  })(gbc, gbc.classes);
