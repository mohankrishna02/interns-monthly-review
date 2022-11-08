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
 * Size values' type. Should be a {number}
 * @typedef {?number} classes.SizeValue
 */

/**
 * Two dimension grid slot
 * @typedef {Object} classes.XYDimensionSlot
 * @property {classes.GridDimensionSlot} x X-dimension slot
 * @property {classes.GridDimensionSlot} y Y-dimension slot
 */

/**
 * Grid info
 * @typedef {Object} classes.GridInfo
 * @property {?number} x x coordinate
 * @property {?number} y y coordinate
 * @property {?number} width width in grid
 * @property {?number} height height in grid
 */

/**
 * Layout Statuses
 * @typedef {Object} classes.LayoutStatus
 * @property {boolean} measured has been measured
 * @property {boolean} adjusted has been adjusted
 * @property {boolean} layouted has been layouted
 */
