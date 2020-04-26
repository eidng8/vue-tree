/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const checkerSelector = require('../helpers').checkerSelector;

/**
 * @param {string} selector
 */
module.exports.command = function (selector) {
  return this.assert.not.cssClassPresent(
    checkerSelector(selector),
    'g8-tree__node_entry_checker_checked',
  );
};
