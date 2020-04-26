/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const labelSelector = require('../helpers').entrySelector;

/**
 * @param {string} selector
 * @param {string|RegExp} search
 * @param {string} [msg]
 */
module.exports.command = function (selector, search, msg) {
  return this.assert.containsOrMatches(labelSelector(selector), search, msg);
};
