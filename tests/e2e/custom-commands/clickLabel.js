/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const Events = require('events');
const labelSelector = require('../helpers').entrySelector;

module.exports = class ClickLabel extends Events {
  /**
   * @param {string} selector
   * @param {Function} [callback]
   */
  command(selector, callback) {
    this.api.click(labelSelector(selector), result => {
      if ('function' == typeof callback) callback.call(this, result);
      this.emit('complete');
      return this;
    });
  }
};
