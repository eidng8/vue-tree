/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

/**
 * @param {string} selector
 */
module.exports.command = function (selector) {
  return this.assert.cssClassPresent(selector, 'g8-tree__node_expended');
};
