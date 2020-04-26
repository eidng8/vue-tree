/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

/**
 * @param {string} selector
 * @param {string|RegExp} search
 * @param {string} [msg]
 */
module.exports.command = function (selector, search, msg) {
  return this.assert.containsOrMatches(selector, search, msg);
};
