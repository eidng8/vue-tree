/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const checkerSelector = require('../helpers').checkerSelector;

/**
 * @param {string} search
 */
module.exports.command = function (search) {
  return this.assert.containsOrMatches('#itemClicked', search);
};
