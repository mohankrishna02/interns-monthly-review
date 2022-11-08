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

/*
 ** The Math.sign() function returns the sign of a number, indicating whether the number is positive, negative or zero.
 */
if (!Math.sign) {
  Math.sign = function(x) {
    return ((x > 0) - (x < 0)) || +x;
  };
}
