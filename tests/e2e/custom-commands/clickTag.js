/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const Events = require('events');

module.exports = class ClickLabel extends Events {
  /**
   * @param {string} selector
   * @param {Function} [callback]
   */
  command(selector, callback) {
    this.api.click(selector, result => {
      if ('function' == typeof callback) callback.call(this, result);
      this.emit('complete');
      return this;
    });
  }
};
